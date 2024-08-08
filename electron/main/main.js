"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@electron-toolkit/utils");
const electron_1 = require("electron");
const get_port_please_1 = require("get-port-please");
const start_server_1 = require("next/dist/server/lib/start-server");
const path_1 = require("path");
const createWindow = () => {
    const mainWindow = new electron_1.BrowserWindow({
        width: 900,
        height: 670,
        webPreferences: {
            preload: (0, path_1.join)(__dirname, "preload.js"),
            nodeIntegration: true,
        },
        title: "Water360"
    });
    mainWindow.on("ready-to-show", () => mainWindow.show());
    const loadURL = async () => {
        if (utils_1.is.dev) {
            mainWindow.loadURL("http://localhost:3000");
        }
        else {
            try {
                const port = await startNextJSServer();
                console.log("Next.js server started on port:", port);
                mainWindow.loadURL(`http://localhost:${port}`);
            }
            catch (error) {
                console.error("Error starting Next.js server:", error);
            }
        }
    };
    loadURL();
    return mainWindow;
};
const startNextJSServer = async () => {
    try {
        const nextJSPort = await (0, get_port_please_1.getPort)({ portRange: [30_011, 50_000] });
        const webDir = (0, path_1.join)(electron_1.app.getAppPath(), "app");
        await (0, start_server_1.startServer)({
            dir: webDir,
            isDev: false,
            hostname: "localhost",
            port: nextJSPort,
            customServer: true,
            allowRetry: false,
            keepAliveTimeout: 5000,
            minimalMode: true,
        });
        return nextJSPort;
    }
    catch (error) {
        console.error("Error starting Next.js server:", error);
        throw error;
    }
};
electron_1.app.whenReady().then(() => {
    createWindow();
    electron_1.ipcMain.on("ping", () => console.log("pong"));
    electron_1.app.on("activate", () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        electron_1.app.quit();
});
