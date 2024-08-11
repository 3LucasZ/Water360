import { is } from "@electron-toolkit/utils";
import { app, BrowserWindow, ipcMain } from "electron";
import { getPort } from "get-port-please";
import { startServer } from "next/dist/server/lib/start-server";
import { existsSync } from "node:fs";
import { join } from "path";

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
    title: "Water360",
  });

  mainWindow.on("ready-to-show", async () => {
    mainWindow.show();
    // mainWindow.webContents.openDevTools();
    const os = await import("node:os");
    const fs = await import("node:fs");

    console.log("initializing global variables...");

    const appDir = os.homedir() + "/Water360";
    const settingsDir = appDir + "/user_settings";

    if (!existsSync(settingsDir)) {
      fs.mkdirSync(settingsDir, { recursive: true });
    }
    try {
      fs.readFileSync(settingsDir + "/IP.txt").toString();
    } catch {
      fs.writeFileSync(settingsDir + "/IP.txt", "0.0.0.0");
    }
    try {
      fs.readFileSync(settingsDir + "/MAC.txt").toString();
    } catch {
      fs.writeFileSync(settingsDir + "/MAC.txt", "c8:63:14:74:1f:96");
    }
    try {
      fs.readFileSync(settingsDir + "/RTMP.txt").toString();
    } catch {
      fs.writeFileSync(settingsDir + "/RTMP.txt", "Fake-RTMP-KeyT-oRep-lace");
    }
  });

  const loadURL = async () => {
    if (is.dev) {
      mainWindow.loadURL("http://localhost:3000");
    } else {
      try {
        const port = await startNextJSServer();
        console.log("Next.js server started on port:", port);
        mainWindow.loadURL(`http://localhost:${port}`);
      } catch (error) {
        console.error("Error starting Next.js server:", error);
      }
    }
  };

  loadURL();
  return mainWindow;
};

const startNextJSServer = async () => {
  try {
    const nextJSPort = await getPort({ portRange: [30_011, 50_000] });
    const webDir = join(app.getAppPath(), "app");

    await startServer({
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
  } catch (error) {
    console.error("Error starting Next.js server:", error);
    throw error;
  }
};

app.whenReady().then(() => {
  createWindow();

  ipcMain.on("ping", () => console.log("pong"));
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
