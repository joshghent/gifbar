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

/// How many GIFs to keep on disk. Copying is cheap to repeat, so the cache
/// exists to avoid re-downloading the same GIF, not to be durable.
const MAX_CACHED_GIFS: usize = 200;

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
    #[error("refusing to download from {0}")]
    UntrustedUrl(String),
}

/// Hosts the GIF providers actually serve media from. The URL arrives from the
/// webview, so without this the command would fetch anything a compromised
/// page asked it to — including loopback and LAN addresses the app can reach
/// but the network cannot.
const ALLOWED_HOST_SUFFIXES: [&str; 4] = ["giphy.com", "tenor.com", "googleapis.com", "gstatic.com"];

fn check_url(url: &str) -> Result<(), ClipboardError> {
    let parsed =
        url::Url::parse(url).map_err(|_| ClipboardError::UntrustedUrl(url.to_string()))?;
    if parsed.scheme() != "https" {
        return Err(ClipboardError::UntrustedUrl(url.to_string()));
    }
    let host = parsed
        .host_str()
        .ok_or_else(|| ClipboardError::UntrustedUrl(url.to_string()))?
        .to_ascii_lowercase();
    let allowed = ALLOWED_HOST_SUFFIXES
        .iter()
        .any(|suffix| host == *suffix || host.ends_with(&format!(".{suffix}")));
    if !allowed {
        return Err(ClipboardError::UntrustedUrl(url.to_string()));
    }
    Ok(())
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
    check_url(url)?;

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

    prune_cache(&dir);

    Ok(path)
}

/// Drops the oldest GIFs once the cache exceeds MAX_CACHED_GIFS. Best effort:
/// a cache that cannot be tidied is not a reason to fail the copy the user
/// asked for, so errors here are deliberately ignored.
fn prune_cache(dir: &Path) {
    let Ok(entries) = std::fs::read_dir(dir) else {
        return;
    };
    let mut files: Vec<(std::time::SystemTime, PathBuf)> = entries
        .flatten()
        .filter_map(|e| {
            let meta = e.metadata().ok()?;
            if !meta.is_file() {
                return None;
            }
            Some((meta.modified().ok()?, e.path()))
        })
        .collect();

    if files.len() <= MAX_CACHED_GIFS {
        return;
    }

    files.sort_by_key(|(modified, _)| *modified);
    for (_, path) in files.iter().take(files.len() - MAX_CACHED_GIFS) {
        let _ = std::fs::remove_file(path);
    }
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
    use objc2_app_kit::{
        NSPasteboard, NSPasteboardTypeFileURL, NSPasteboardTypeHTML, NSPasteboardTypeString,
    };
    use objc2_foundation::{NSArray, NSData, NSString, NSURL};

    pub fn write_gif_to_clipboard(path: &Path, url: &str) -> Result<(), ClipboardError> {
        let bytes = std::fs::read(path)?;

        autoreleasepool(|_| {
            let pb = unsafe { NSPasteboard::generalPasteboard() };

            // declareTypes + setData/setString throughout, rather than mixing
            // in writeObjects: the two address different item models, and
            // Apple documents that combining them on one pasteboard is
            // undefined. Order matters — the first declared type is what a
            // receiving app prefers.
            let file_url_ty = unsafe { NSPasteboardTypeFileURL };
            let gif_ty = NSString::from_str("com.compuserve.gif");
            let html_ty = unsafe { NSPasteboardTypeHTML };
            let string_ty = unsafe { NSPasteboardTypeString };

            let types = NSArray::from_slice(&[file_url_ty, &*gif_ty, html_ty, string_ty]);
            pb.clearContents();
            unsafe { pb.declareTypes_owner(&types, None) };

            // File URL. Teams and Slack look for a file on the pasteboard and
            // attach it, which is the path that keeps the GIF animated.
            let path_str = NSString::from_str(&path.to_string_lossy());
            let file_url = unsafe { NSURL::fileURLWithPath(&path_str) };
            let abs = unsafe { file_url.absoluteString() }
                .ok_or_else(|| ClipboardError::Clipboard("file URL had no string form".into()))?;
            unsafe { pb.setString_forType(&abs, file_url_ty) };

            // Raw GIF bytes, for apps that read image data directly and can
            // cope with an animated one.
            let data = NSData::with_bytes(&bytes);
            unsafe { pb.setData_forType(Some(&data), &gif_ty) };

            // HTML for rich-text targets (mail, docs) — they fetch the remote
            // GIF and render it animated.
            let html = NSString::from_str(&super::html_snippet(url));
            unsafe { pb.setString_forType(&html, html_ty) };

            // Plain text last: the universal fallback, and what a code editor
            // or terminal will take.
            let text = NSString::from_str(url);
            unsafe { pb.setString_forType(&text, string_ty) };

            Ok(())
        })
    }
}

#[cfg(target_os = "windows")]
mod platform {
    use super::{ClipboardError, Path};
    use clipboard_win::{formats, options, raw, Clipboard};

    fn win_err(e: impl std::fmt::Display) -> ClipboardError {
        ClipboardError::Clipboard(e.to_string())
    }

    pub fn write_gif_to_clipboard(path: &Path, url: &str) -> Result<(), ClipboardError> {
        // Hold the clipboard open across all four writes. The convenience
        // setters empty the clipboard before each write, so calling them in
        // sequence would leave only the last format — hence empty() once, then
        // the NoClear variants.
        let _clip = Clipboard::new_attempts(10).map_err(win_err)?;
        raw::empty().map_err(win_err)?;

        // CF_HDROP — Teams and Explorer treat this as a pasted file.
        let files = [path.to_string_lossy().to_string()];
        raw::set_file_list_with(&files, options::NoClear).map_err(win_err)?;

        if let Some(html) = formats::Html::new() {
            raw::set_html_with(html.code(), &super::html_snippet(url), options::NoClear)
                .map_err(win_err)?;
        }

        raw::set_string_with(url, options::NoClear).map_err(win_err)?;

        Ok(())
    }
}

#[cfg(target_os = "linux")]
mod platform {
    use super::{ClipboardError, Path};

    pub fn write_gif_to_clipboard(path: &Path, url: &str) -> Result<(), ClipboardError> {
        // X11 and Wayland selections are served on demand by the owning
        // process rather than pushed to a shared buffer, so arboard can only
        // offer what it holds. HTML plus the URL is what it supports; the
        // downloaded file still exists on disk for the user to attach.
        let _ = path;
        let mut cb = arboard::Clipboard::new().map_err(|e| ClipboardError::Clipboard(e.to_string()))?;
        cb.set_html(super::html_snippet(url), Some(url.to_string()))
            .map_err(|e| ClipboardError::Clipboard(e.to_string()))?;
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
    use super::{check_url, html_snippet};

    #[test]
    fn accepts_provider_media_hosts() {
        assert!(check_url("https://media.giphy.com/media/abc/giphy.gif").is_ok());
        assert!(check_url("https://media1.tenor.com/x/y.gif").is_ok());
    }

    #[test]
    fn rejects_plaintext_and_non_provider_hosts() {
        assert!(check_url("http://media.giphy.com/a.gif").is_err());
        assert!(check_url("https://evil.test/a.gif").is_err());
        assert!(check_url("file:///etc/passwd").is_err());
        assert!(check_url("https://127.0.0.1/a.gif").is_err());
    }

    #[test]
    fn rejects_a_host_that_only_suffix_matches_a_provider() {
        // notgiphy.com ends with "giphy.com" as a substring but is a different
        // domain, so the check must compare on a label boundary.
        assert!(check_url("https://notgiphy.com/a.gif").is_err());
    }

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
