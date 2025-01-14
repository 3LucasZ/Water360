#!/bin/bash
echo "Script executed from: ${PWD}"
BASEDIR=$(dirname $0)
echo "Script location: ${BASEDIR}"
echo "Flag: $1"

if [[ "$1" == "-m" ]]; then
  LINK="https://dl.google.com/android/repository/platform-tools-latest-darwin.zip"
elif [[ "$1" == "-w" ]]; then
  LINK="https://dl.google.com/android/repository/platform-tools-latest-windows.zip"
fi
echo "Link: $LINK"
curl -SL "$LINK" -o "$BASEDIR/platform-tools.zip"
unzip -o "$BASEDIR/platform-tools.zip" -d "$BASEDIR"

if [[ "$1" == "-m" ]]; then
  LINK="https://github.com/Genymobile/scrcpy/releases/download/v3.1/scrcpy-macos-aarch64-v3.1.tar.gz"
elif [[ "$1" == "-m86" ]]; then
  LINK="https://github.com/Genymobile/scrcpy/releases/download/v3.1/scrcpy-macos-x86_64-v3.1.tar.gz"
elif [[ "$1" == "-w" ]]; then
  LINK="https://github.com/Genymobile/scrcpy/releases/download/v3.1/scrcpy-win64-v3.1.zip"
elif [[ "$1" == "-w32" ]]; then
  LINK="https://github.com/Genymobile/scrcpy/releases/download/v3.1/scrcpy-win32-v3.1.zip"
fi
echo "Link: $LINK"
curl -SL "$LINK" -o "$BASEDIR/scrcpy.zip"
EXT="${LINK##*.}"
if [[ "$EXT" == "zip" ]]; then
  unzip -o "$BASEDIR/scrcpy.zip" -d
else
  mkdir "$BASEDIR/scrcpy"
  tar -xvzf "$BASEDIR/scrcpy.zip" -C "$BASEDIR/scrcpy"
  mv $BASEDIR/scrcpy/*/* $BASEDIR/scrcpy
fi