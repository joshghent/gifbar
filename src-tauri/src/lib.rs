use tauri::{
    menu::{MenuBuilder, MenuItemBuilder},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Manager,
};
use tauri_plugin_autostart::MacosLauncher;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec![]),
        ))
        .setup(|app| {
            // Build the right-click context menu
            let quit = MenuItemBuilder::new("Quit GifBar")
                .id("quit")
                .build(app)?;

            let menu = MenuBuilder::new(app).item(&quit).build()?;

            // Build the tray icon
            let _tray = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .menu_on_left_click(false)
                .on_menu_event(|app, event| match event.id().as_ref() {
                    "quit" => {
                        app.exit(0);
                    }
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window("main") {
                            if window.is_visible().unwrap_or(false) {
                                let _ = window.hide();
                            } else {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                    }
                })
                .build(app)?;

            // Hide the window initially — user clicks tray to open
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.hide();
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running GifBar");
}
