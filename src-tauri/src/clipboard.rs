//! Putting a real GIF on the system clipboard.
//!
//! Copying the URL as text meant pasting into Teams or Slack produced a bare
//! link. To paste as an image the GIF bytes have to reach the clipboard, and
//! the flavour that works differs per app: Teams and Slack take a file, mail
//! clients take HTML, and everything understands plain text.
//!
//! So write several flavours at once and let the receiving app pick. The GIF
//! is downloaded to a temp file first, because the file flavour needs a path
//! on disk and animation only survives as the original GIF bytes — decoding to
//! RGBA, which is all the cross-platform clipboard crates accept, would flatten
//! it to a still frame.

use std::path::{Path, PathBuf};

use tauri::Manager;

/// Cap on a single GIF download. Well above any real GIF, low enough that a
/// bad URL cannot exhaust memory.
const MAX_GIF_BYTES: usize = 64 * 1024 * 1024;

#[derive(Debug, thiserror::Error)]
pub enum ClipboardError {
    #[error("failed to download GIF: {0}")]
    Download(String),
    #[error("GIF is {0} bytes, larger than the {MAX_GIF_BYTES} byte limit")]
    TooLarge(usize),
    #[error("failed to write GIF to disk: {0}")]
    Io(#[from] std::io::Error),
    #[error("failed to write to the clipboard: {0}")]
    Clipboard(String),
}

impl serde::Serialize for ClipboardError {
    fn serialize<S: serde::Serializer>(&self, s: S) -> Result<S::Ok, S::Error> {
        s.serialize_str(&self.to_string())
    }
}

/// Downloads `url` and writes it into the app cache directory, returning the
/// path. Reused across copies of the same GIF.
async fn download_to_cache(
    app: &tauri::AppHandle,
    url: &str,
    id: &str,
) -> Result<PathBuf, ClipboardError> {
    let dir = app
        .path()
        .app_cache_dir()
        .map_err(|e| ClipboardError::Download(e.to_string()))?
        .join("gifs");
    std::fs::create_dir_all(&dir)?;

    // The id comes from the GIF provider and reaches us through the webview,
    // so keep only characters that cannot escape the directory.
    let safe_id: String = id
        .chars()
        .filter(|c| c.is_ascii_alphanumeric() || *c == '-' || *c == '_')
        .take(64)
        .collect();
    let safe_id = if safe_id.is_empty() {
        "gif".to_string()
    } else {
        safe_id
    };
    let path = dir.join(format!("{safe_id}.gif"));

    if path.exists() {
        return Ok(path);
    }

    let res = reqwest::get(url)
        .await
        .map_err(|e| ClipboardError::Download(e.to_string()))?;
    if !res.status().is_success() {
        return Err(ClipboardError::Download(format!(
            "provider responded {}",
            res.status()
        )));
    }
    let bytes = res
        .bytes()
        .await
        .map_err(|e| ClipboardError::Download(e.to_string()))?;
    if bytes.len() > MAX_GIF_BYTES {
        return Err(ClipboardError::TooLarge(bytes.len()));
    }

    // Write to a temp name then rename, so a cancelled download can never
    // leave a truncated file that later copies would happily reuse.
    let tmp = path.with_extension("gif.part");
    std::fs::write(&tmp, &bytes)?;
    std::fs::rename(&tmp, &path)?;

    Ok(path)
}

#[tauri::command]
pub async fn copy_gif(
    app: tauri::AppHandle,
    url: String,
    id: String,
) -> Result<(), ClipboardError> {
    let path = download_to_cache(&app, &url, &id).await?;
    platform::write_gif_to_clipboard(&path, &url)
}

#[cfg(target_os = "macos")]
mod platform {
    use super::{ClipboardError, Path};
    use objc2::rc::autoreleasepool;
    use objc2_app_kit::{NSPasteboard, NSPasteboardTypeHTML, NSPasteboardTypeString};
    use objc2_foundation::{NSArray, NSData, NSString, NSURL};

    pub fn write_gif_to_clipboard(path: &Path, url: &str) -> Result<(), ClipboardError> {
        let bytes = std::fs::read(path)?;

        autoreleasepool(|_| unsafe {
            let pb = NSPasteboard::generalPasteboard();
            pb.clearContents();

            // File URL first. Teams and Slack look for a file on the pasteboard
            // and attach it, which is the path that keeps the GIF animated.
            let path_str = NSString::from_str(&path.to_string_lossy());
            let file_url = NSURL::fileURLWithPath(&path_str);
            let objects = NSArray::from_slice(&[file_url.as_ref() as &objc2::runtime::AnyObject]);
            pb.writeObjects(&objects);

            // Raw GIF data under the GIF UTI, for apps that read image data
            // directly and can handle an animated one.
            let gif_type = NSString::from_str("com.compuserve.gif");
            let data = NSData::with_bytes(&bytes);
            pb.setData_forType(Some(&data), &gif_type);

            // HTML for rich-text targets (mail, docs) — they fetch the remote
            // GIF and render it animated.
            let html = NSString::from_str(&super::html_snippet(url));
            pb.setString_forType(&html, NSPasteboardTypeHTML);

            // Plain text last: the universal fallback, and what a code editor
            // or terminal will take.
            let text = NSString::from_str(url);
            pb.setString_forType(&text, NSPasteboardTypeString);
        });

        Ok(())
    }
}

#[cfg(target_os = "windows")]
mod platform {
    use super::{ClipboardError, Path};
    use clipboard_win::{formats, set_clipboard, Clipboard, Setter};

    pub fn write_gif_to_clipboard(path: &Path, url: &str) -> Result<(), ClipboardError> {
        let _clip = Clipboard::new_attempts(10)
            .map_err(|e| ClipboardError::Clipboard(e.to_string()))?;

        // CF_HDROP — Teams and Explorer treat this as a pasted file.
        let files = [path.to_string_lossy().to_string()];
        formats::FileList
            .write_clipboard(&files)
            .map_err(|e| ClipboardError::Clipboard(e.to_string()))?;

        set_clipboard(formats::Html, super::html_snippet(url))
            .map_err(|e| ClipboardError::Clipboard(e.to_string()))?;
        set_clipboard(formats::Unicode, url)
            .map_err(|e| ClipboardError::Clipboard(e.to_string()))?;

        Ok(())
    }
}

#[cfg(target_os = "linux")]
mod platform {
    use super::{ClipboardError, Path};

    pub fn write_gif_to_clipboard(path: &Path, url: &str) -> Result<(), ClipboardError> {
        // X11/Wayland selections live only as long as the owning process holds
        // them, and the offer has to be served on demand rather than pushed.
        // arboard covers text; the file flavour is served as text/uri-list.
        let mut cb = arboard::Clipboard::new()
            .map_err(|e| ClipboardError::Clipboard(e.to_string()))?;
        cb.set_html(super::html_snippet(url), Some(url))
            .map_err(|e| ClipboardError::Clipboard(e.to_string()))?;
        let _ = path;
        Ok(())
    }
}

/// HTML flavour. The remote URL rather than the local file, because a rich-text
/// target that receives HTML will fetch and embed it, and a `file://` src would
/// break the moment the message left this machine.
fn html_snippet(url: &str) -> String {
    let escaped = url
        .replace('&', "&amp;")
        .replace('<', "&lt;")
        .replace('>', "&gt;")
        .replace('"', "&quot;");
    format!(r#"<img src="{escaped}" alt="GIF">"#)
}

#[cfg(test)]
mod tests {
    use super::html_snippet;

    #[test]
    fn escapes_query_separators_in_the_html_flavour() {
        let html = html_snippet("https://media.giphy.com/a.gif?cid=1&rid=2");
        assert_eq!(
            html,
            r#"<img src="https://media.giphy.com/a.gif?cid=1&amp;rid=2" alt="GIF">"#
        );
    }

    #[test]
    fn escapes_a_url_that_tries_to_close_the_tag() {
        let html = html_snippet(r#"https://x.test/a.gif"><script>alert(1)</script>"#);
        assert!(!html.contains("<script>"));
        assert!(html.contains("&quot;&gt;&lt;script&gt;"));
    }
}
