<p align="center"> 
  <img src="public/logo.png" height="128">
  <h1 align="center">Water360</h1>
  <div align="center">
  <img src="https://img.shields.io/badge/mac%20os-000000?style=for-the-badge&logo=apple&logoColor=white" />
  <img src="https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white" />
  <!-- <img src="https://img.shields.io/badge/Electron-2B2E3A?style=for-the-badge&logo=electron&logoColor=9FEAF9"/>
  <img src="https://img.shields.io/badge/next%20js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Mantine-ffffff?style=for-the-badge&logo=Mantine&logoColor=339af0"/>
  <img src="https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white"/>
  <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/threejs-black?style=for-the-badge&logo=three.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB"
  /> -->
  </div>
</p>

## Welcome!

Water360 is a desktop application available for Mac and Windows to connect to the Under360 server. It enables the remote control of the Insta360 camera.

## Usage

1. Find the latest release [here](https://github.com/3LucasZ/Water360/releases). Install the app on your computer.
2. Update the IP address of your controller on the user settings page.
3. Install adb.
4. Enjoy!

### Installing ADB

1. [Windows](https://medium.com/@yadav-ajay/a-step-by-step-guide-to-setting-up-adb-path-on-windows-0b833faebf18)
2. [Mac](https://stackoverflow.com/questions/31374085/installing-adb-on-macos)

### Khadas unreachable

1. Check what devices are reachable on your network. Then,
1. Unplug and plug back in Ethernet OR
1. Power cycle

## Developing

### Build

1. Build app from source for your platform: npm run build
2. Build app for other platforms (TBD)

- Check Rosetta installation: if /usr/bin/pgrep -q oahd; then echo 'rosetta installed'; fi
- Find container PID: docker exec <id|name> ps

### Dev environment

1. Run: npm run dev

- This starts a NextJS server and an Electron webview in parallel
- Provides hot reload and debugging tools

2. Explore tooling

- npm run -- env electron-builder --help
- npm run -- env electron-builder --win --x64

### Debugging

1. Check that the server is running.

- Run: lsof -nP -i6TCP | grep LISTEN | grep water
- You should see: water360 ... 30011 (LISTEN)
- This means a server at port 30011 is running

2. Run inspect element on the app.
3. Check that adb is running on port 5037.

- Run: adb devices
- If adb is running you should see an output
- Run: lsof -nP -i4TCP | grep LISTEN | grep adb
- You should see: adb ... 5037 (LISTEN)
- adb MUST be running on port 5037

4. Directories

- /Applications
- /Users/lucaszheng/Library/Application Support/water360

5. Try catch

- Since there is no console.log on main process, wrap everything with try catch, and return it w/ the error code.

6. Do not try (or at least try to avoid) features marked experimental

- Experimental features (like instrumentation hook) are bound to not work / crash

### Error codes

- 200: All good!
- 500: Internal server error (generic)
  - Notification pop-ups
- 504: Gateway Timeout (server acting as a proxy to Khadas did not receive a timely response)
  - No notification pop-ups

### Default

- "exposureEV": 0.0,
- "ISO": 0,
- "whiteBalance": 0,
- "shutterMode": 1,
- "whiteBalanceValue": 0,
- "exposureMode": 0,
- "shutterSpeed": 0.0

### Enums

- CONNECT_TYPE_NONE = -1;
- CONNECT_TYPE_USB = 1;
- CONNECT_TYPE_WIFI = 2;
- CONNECT_TYPE_BLE = 3;
- PREVIEW_TYPE_NORMAL = 0;
- PREVIEW_TYPE_RECORD = 1;
- PREVIEW_TYPE_LIVE = 2;
- CAPTURE_TYPE_IDLE = -1;
- CAPTURE_TYPE_UNKNOWN = 0;
- CAPTURE_TYPE_NORMAL_CAPTURE = 1000;
- CAPTURE_TYPE_HDR_CAPTURE = 1001;
- CAPTURE_TYPE_INTERVAL_SHOOTING = 1002;
- CAPTURE_TYPE_NORMAL_RECORD = 1003;
- CAPTURE_TYPE_HDR_RECORD = 1004;
- CAPTURE_TYPE_TIMELAPSE = 1005;
- CAPTURE_TYPE_NIGHT_SCENE_CAPTURE = 1006;
- CAPTURE_TYPE_BURST_CAPTURE = 1007;
- CAPTURE_TYPE_BULLET_TIME_RECORD = 1008;
- CAPTURE_TYPE_TIME_SHIFT_RECORD = 1009;
- CAPTURE_TYPE_INTERVAL_RECORD = 1010;
- CAPTURE_TYPE_STATIC_TIMELAPSE = 1011;
- CAPTURE_TYPE_NORMAL_PANO_CAPTURE = 1012;
- CAPTURE_TYPE_HDR_PANO_CAPTURE = 1013;
- CAPTURE_TYPE_STARLAPSE_SHOOTING = 1014;
- CAPTURE_TYPE_SUPER_RECORD = 1015;
- CAPTURE_TYPE_LOOPER_RECORD = 1016;
- CAPTURE_TYPE_FPV_RECORD = 1017;
- CAPTURE_TYPE_MOVIE_RECORD = 1018;
- CAPTURE_TYPE_SLOW_MOTION_RECORD = 1019;
- CAPTURE_TYPE_SELFIE_RECORD = 1020;
- CAMERA_MODE_SINGLE_FRONT = 1;
- CAMERA_MODE_SINGLE_REAR = 2;
- CAMERA_MODE_PANORAMA = 3;
- FOCUS_SENSOR_FRONT = 1;
- FOCUS_SENSOR_REAR = 2;
- FOCUS_SENSOR_ALL = 3;
- FOV_TYPE_WIDE = 0;
- FOV_TYPE_NARROW = 3;
- FOV_TYPE_LINEAR = 1;
- FOV_TYPE_ULTRA_WIDE = 2;
- GAMMA_MODE_STAND = 0;
- GAMMA_MODE_LOG = 1;
- GAMMA_MODE_VIVID = 2;
- FUNCTION_MODE_PREVIEW_STREAM = 1;
- FUNCTION_MODE_CAPTURE_NORMAL = 6;
- FUNCTION_MODE_CAPTURE_NORMAL_PANO = 14;
- FUNCTION_MODE_HDR_CAPTURE = 8;
- FUNCTION_MODE_HDR_PANO_CAPTURE = 15;
- FUNCTION_MODE_NIGHT_SCENE = 13;
- FUNCTION_MODE_BURST = 5;
- FUNCTION_MODE_INTERVAL_SHOOTING = 3;
- FUNCTION_MODE_STARLAPSE_SHOOTING = 18;
- FUNCTION_MODE_RECORD_NORMAL = 7;
- FUNCTION_MODE_SUPER_RECORD = 16;
- FUNCTION_MODE_HDR_RECORD = 9;
- FUNCTION_MODE_BULLETTIME = 4;
- FUNCTION_MODE_TIMELAPSE = 2;
- FUNCTION_MODE_TIME_SHIFT = 12;
- FUNCTION_MODE_LOOPER_RECORD = 17;
- FUNCTION_MODE_FPV_RECORD = 19;
- FUNCTION_MODE_MOVIE_RECORD = 20;
- FUNCTION_MODE_SLOW_MOTION_RECORD = 21;
- FUNCTION_MODE_SELFIE_RECORD = 22;
- EXPOSURE_MODE_AUTO = 0;
- EXPOSURE_MODE_ISO_FIRST = 1;
- EXPOSURE_MODE_SHUTTER_FIRST = 2;
- EXPOSURE_MODE_MANUAL = 3;
- EXPOSURE_MODE_ADAPTIVE = 4;
- SHUTTER_MODE_OFF = 0;
- SHUTTER_MODE_SPORT = 1;
- SHUTTER_MODE_FASTER = 2;
- WHITE_BALANCE_AUTO = 0;
- WHITE_BALANCE_2700K = 1;
- WHITE_BALANCE_4000K = 2;
- WHITE_BALANCE_5000K = 3;
- WHITE_BALANCE_6500K = 4;
- WHITE_BALANCE_7500K = 5;
