import menubar from 'menubar';
import AutoLaunch from 'auto-launch';
import { Menu } from 'electron';
import dotenv from 'dotenv';

dotenv.config();

export const mb = menubar({
    dir: __dirname + '/../',
    preloadWindow: true,
    height: 330,
	width: 440,
	alwaysOnTop: true,
	icon: __dirname + '/../assets/gif-icon.png'
});

let appLauncher = new AutoLaunch({ name: process.env.APP_SLUG });

const contextMenu = Menu.buildFromTemplate([
    {
        label: 'Launch on Login',
        type: 'checkbox',
        checked: false,
        click: item => {
            appLauncher.isEnabled().then(enabled => {
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
        label: `Quit ${process.env.APP_NAME}`,
        click: () => mb.app.quit(),
    },
]);

mb.on('ready', () => {
	console.log(`${process.env.APP_NAME} is Ready!!`);
    mb.tray.on('right-click', () => {
        mb.tray.popUpContextMenu(contextMenu);
    });
});
