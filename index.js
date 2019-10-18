import menubar from "menubar";
import AutoLaunch from "auto-launch";
import { Menu } from "electron";

export const mb = menubar({
    dir: __dirname,
    preloadWindow: true,
    height: 330,
	width: 440,
	alwaysOnTop: false,
	icon: __dirname + "/../assets/gif-icon.png"
});

let appLauncher = new AutoLaunch({ name: "GifBar", isHidden: true });

const contextMenu = Menu.buildFromTemplate([
    {
        label: "Launch on Login",
        type: "checkbox",
        checked: false,
        click: (item) => {
            appLauncher.isEnabled().then((enabled) => {
                if (enabled) {
                    return appLauncher.disable().then(() => {
                        item.checked = false;
                    });
                } else {
                    return appLauncher.enable().then(() => {
                        item.checked = true;
                    });
                }
            });
        },
    },
    {
        label: "Quit GifBar",
        click: () => mb.app.quit(),
	},
	{
        label: "Toggle DevTools",
        accelerator: "Alt+CommandOrControl+I",
        click: function () { mb.window.toggleDevTools(); }
      }
]);

mb.on("ready", () => {
	console.log("GifBar is Ready!!");
    mb.tray.on("right-click", () => {
        mb.tray.popUpContextMenu(contextMenu);
    });
});
