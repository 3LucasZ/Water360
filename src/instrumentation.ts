export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const os = await import("node:os");
    const fs = await import("node:fs");
    // const electron = await import("electron");

    console.log("initializing global variables...");

    const appDir = os.homedir() + "/Water360";
    // const appDir = electron.app.getPath("appData");
    const downloadsDir = appDir;
    const settingsDir = appDir + "/user_settings";

    // //get settings
    // await persist.init({
    //   dir: settingsDir,
    // });
    // //set globals
    // global.IP = (await getItem("IP")) || "0.0.0.0";
    // global.MAC = (await getItem("MAC")) || "c8:63:14:74:1f:96";
    // global.downloadsDir = downloadsDir;
    // global.settingsDir = settingsDir;
    // global.RTMP = (await getItem("RTMP")) || "Fake-RTMP-KeyT-oRep-lace";
    // console.log("global variables initialized!");
    if (!fs.existsSync(settingsDir)) {
      fs.mkdirSync(settingsDir, { recursive: true });
    }
    try {
      global.IP = fs.readFileSync(settingsDir + "/IP.txt").toString();
    } catch {
      global.IP = "0.0.0.0";
      fs.writeFileSync(settingsDir + "/IP.txt", global.IP);
    }
    try {
      global.MAC = fs.readFileSync(settingsDir + "/MAC.txt").toString();
    } catch {
      global.MAC = "c8:63:14:74:1f:96";
      fs.writeFileSync(settingsDir + "/MAC.txt", global.MAC);
    }
    global.downloadsDir = downloadsDir;
    global.settingsDir = settingsDir;
    try {
      global.RTMP = fs.readFileSync(settingsDir + "/RTMP.txt").toString();
    } catch {
      global.RTMP = "Fake-RTMP-KeyT-oRep-lace";
      fs.writeFileSync(settingsDir + "/RTMP.txt", global.RTMP);
    }
  }
}
