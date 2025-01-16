#!/bin/bash
echo "Script executed from: ${PWD}"
echo "Flag: $1"



if [[ "$1" == "-m" ]]; then
  LINK="https://dl.google.com/android/repository/platform-tools-latest-darwin.zip"
elif [[ "$1" == "-w" ]]; then
  LINK="https://dl.google.com/android/repository/platform-tools-latest-windows.zip"
fi
curl -SL $LINK -o extra/platform-tools.zip
unzip -o extra/platform-tools.zip -d extra



if [[ "$1" == "-m" ]]; then
  LINK="https://github.com/Genymobile/scrcpy/releases/download/v3.1/scrcpy-macos-aarch64-v3.1.tar.gz"
elif [[ "$1" == "-m86_64" ]]; then
  LINK="https://github.com/Genymobile/scrcpy/releases/download/v3.1/scrcpy-macos-x86_64-v3.1.tar.gz"
elif [[ "$1" == "-w" ]]; then
  LINK="https://github.com/Genymobile/scrcpy/releases/download/v3.1/scrcpy-win64-v3.1.zip"
elif [[ "$1" == "-w32" ]]; then
  LINK="https://github.com/Genymobile/scrcpy/releases/download/v3.1/scrcpy-win32-v3.1.zip"
fi
EXT="${LINK##*.}"
echo $EXT
mkdir extra/scrcpy
curl -SL $LINK -o extra/scrcpy.zip
if [[ "$EXT" == "gz" ]]; then
  tar -xvzf extra/scrcpy.zip -C extra/scrcpy
else
  unzip -o extra/scrcpy.zip -d extra/scrcpy
fi
mv extra/scrcpy/*/* extra/scrcpy