/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

const xmpp = require('simple-xmpp');
let connected = false;
let login_role = '';
let login_email = '';

import {
    create_key,
    remove_key,
    get_public_key,
    sign,
    get_password,
} from './key_manager';
import { toBase36, toBase64 } from './utility';
import { check_message, get_messages, store_message } from './message_manager';

class AppUpdater {
    constructor() {
        log.transports.file.level = 'info';
        autoUpdater.logger = log;
        autoUpdater.checkForUpdatesAndNotify();
    }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
    const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
    console.log(msgTemplate(arg));
    event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.handle('create_key', async (event, arg) => {
    return create_key(...arg);
});
ipcMain.handle('remove_key', async (event, arg) => {
    return remove_key(...arg);
});
ipcMain.handle('get_public_key', async (event, arg) => {
    return get_public_key(...arg);
});
ipcMain.handle('sign', async (event, arg) => {
    return sign(...arg);
});
ipcMain.handle('get_password', async (event, arg) => {
    return get_password(...arg);
});

ipcMain.handle('connect', async (event, arg) => {
    if (connected) {
        await xmpp.disconnect();
        connected = false;
    }

    const password = await get_password(arg[0], arg[1]);
    let username = arg[0] + '_' + arg[1];
    username = username.replace('@', '_at_');
    console.log(username, password);

    xmpp.on('online', (data: any) => {
        connected = true;
        console.log('Hey you are online! ');
        console.log(`Connected as ${data.jid.user}`);
    });
    xmpp.on('error', (error: string) =>
        console.log(`something went wrong!${error} `),
    );
    xmpp.on('chat', async (from: string, message: String) => {
        if (!mainWindow) return;
        // eventEmitter.fire('message', { from, message });
        if (
            !(await store_message(arg[0], arg[1], {
                from: from,
                message: message,
            }))
        )
            return;
        mainWindow.webContents.send('chat_msg', {
            message: {
                from,
                message,
            },
        });
        console.log(`Got a message! ${message} from ${from}`);
    });
    xmpp.connect({
        jid: `${username}@localhost`,
        password: password,
        host: '172.210.68.64',
        port: 5222,
    });

    login_role = arg[0];
    login_email = arg[1];
});

ipcMain.handle('send', async (event, arg) => {
    const [role, email, message] = arg;
    let username = role + '_' + email;
    username = username.replace('@', '_at_');
    console.log(`send to ${username}`);

    xmpp.send(`${username}@localhost`, message);

    const payload = JSON.stringify({
        ...JSON.parse(message),
        send: 1,
    });

    await store_message(login_role, login_email, {
        from: username,
        message: payload,
    });
});

ipcMain.handle('load_msg', async (event, arg) => {
    const [role, email] = arg;

    const result = await get_messages(role, email);

    return result;
});

if (process.env.NODE_ENV === 'production') {
    const sourceMapSupport = require('source-map-support');
    sourceMapSupport.install();
}

const isDebug =
    process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
    require('electron-debug')();
}

const installExtensions = async () => {
    const installer = require('electron-devtools-installer');
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = ['REACT_DEVELOPER_TOOLS'];

    return installer
        .default(
            extensions.map((name) => installer[name]),
            forceDownload,
        )
        .catch(console.log);
};

const createWindow = async () => {
    if (isDebug) {
        await installExtensions();
    }

    const RESOURCES_PATH = app.isPackaged
        ? path.join(process.resourcesPath, 'assets')
        : path.join(__dirname, '../../assets');

    const getAssetPath = (...paths: string[]): string => {
        return path.join(RESOURCES_PATH, ...paths);
    };

    mainWindow = new BrowserWindow({
        show: false,
        width: 1024,
        height: 728,
        icon: getAssetPath('icon.png'),
        webPreferences: {
            preload: app.isPackaged
                ? path.join(__dirname, 'preload.js')
                : path.join(__dirname, '../../.erb/dll/preload.js'),
        },
    });

    mainWindow.maximize();

    mainWindow.loadURL(resolveHtmlPath('index.html'));

    mainWindow.on('ready-to-show', () => {
        if (!mainWindow) {
            throw new Error('"mainWindow" is not defined');
        }
        if (process.env.START_MINIMIZED) {
            mainWindow.minimize();
        } else {
            mainWindow.show();
        }
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    const menuBuilder = new MenuBuilder(mainWindow);
    menuBuilder.buildMenu();

    // Open urls in the user's browser
    mainWindow.webContents.setWindowOpenHandler((edata) => {
        shell.openExternal(edata.url);
        return { action: 'deny' };
    });

    // Remove this if your app does not use auto updates
    // eslint-disable-next-line
    new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.whenReady()
    .then(() => {
        createWindow();
        app.on('activate', () => {
            // On macOS it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (mainWindow === null) createWindow();
        });
    })
    .catch(console.log);
