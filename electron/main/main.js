"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@electron-toolkit/utils");
const electron_1 = require("electron");
const get_port_please_1 = require("get-port-please");
const start_server_1 = require("next/dist/server/lib/start-server");
const node_fs_1 = require("node:fs");
const path_1 = require("path");
const createWindow = () => {
    const mainWindow = new electron_1.BrowserWindow({
        width: 900,
        height: 670,
        webPreferences: {
            preload: (0, path_1.join)(__dirname, "preload.js"),
            nodeIntegration: true,
        },
        title: "Water360",
    });
    mainWindow.on("ready-to-show", async () => {
        mainWindow.show();
        // mainWindow.webContents.openDevTools();
        const os = await Promise.resolve().then(() => __importStar(require("node:os")));
        const fs = await Promise.resolve().then(() => __importStar(require("node:fs")));
        console.log("initializing global variables...");
        const appDir = os.homedir() + "/Water360";
        const settingsDir = appDir + "/user_settings";
        if (!(0, node_fs_1.existsSync)(settingsDir)) {
            fs.mkdirSync(settingsDir, { recursive: true });
        }
        try {
            fs.readFileSync(settingsDir + "/IP.txt").toString();
        }
        catch {
            fs.writeFileSync(settingsDir + "/IP.txt", "0.0.0.0");
        }
        try {
            fs.readFileSync(settingsDir + "/MAC.txt").toString();
        }
        catch {
            fs.writeFileSync(settingsDir + "/MAC.txt", "c8:63:14:74:1f:96");
        }
        try {
            fs.readFileSync(settingsDir + "/RTMP.txt").toString();
        }
        catch {
            fs.writeFileSync(settingsDir + "/RTMP.txt", "Fake-RTMP-KeyT-oRep-lace");
        }
    });
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
