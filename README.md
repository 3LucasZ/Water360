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

Water360 is a desktop application available for Mac and Windows computers to connect to the Under360 server. It allows you to easily remote control an Insta360 camera.

## Getting Started

1. Install the app on your computer.
2. Update the IP address of your controller on the user settings page.
3. Install the adb tool on your computer.
4. Enjoy!

## Build

1. Build app from source for your platform: npm run build
2. Build app for other platforms (TBD)

- Check Rosetta installation: if /usr/bin/pgrep -q oahd; then echo 'rosetta installed'; fi
- Find container PID: docker exec <id|name> ps

## Develop

1. Run: npm run dev

- This starts a NextJS server and an Electron webview in parallel
- Provides hot reload and debugging tools

2. Explore tooling

- npm run -- env electron-builder --help
- npm run -- env electron-builder --win --x64

## Debugging

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

## Error codes

- 200: All good!
- 500: Internal server error (generic)
  - Notification pop-ups
- 504: Gateway Timeout (server acting as a proxy to Khadas did not receive a timely response)
  - No notification pop-ups
