#!/bin/bash
echo "Script executed from: ${PWD}"
if [[ "$1" == "-w" ]]; then
  export MSYS_NO_PATHCONV=1
fi
BASEDIR=$(dirname $0)
echo "Script location: ${BASEDIR}"
echo "Flag: $1"



if [[ "$1" == "-m" ]]; then
  LINK="https://dl.google.com/android/repository/platform-tools-latest-darwin.zip"
  curl -SL $LINK -o $BASEDIR/platform-tools.zip
  unzip -o $BASEDIR/platform-tools.zip -d $BASEDIR
elif [[ "$1" == "-w" ]]; then
  LINK="https://dl.google.com/android/repository/platform-tools-latest-windows.zip"
  curl -SL $LINK -o $BASEDIR\\platform-tools.zip
  unzip -o $BASEDIR\\platform-tools.zip -d $BASEDIR
fi



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
if [[ "$EXT" == "gz" ]]; then
  curl -SL $LINK -o $BASEDIR/scrcpy.zip
  mkdir $BASEDIR/scrcpy
  tar -xvzf $BASEDIR/scrcpy.zip -C $BASEDIR/scrcpy
  mv $BASEDIR/scrcpy/*/* $BASEDIR/scrcpy
else
  curl -SL $LINK -o $BASEDIR\\scrcpy.zip
  mkdir $BASEDIR\\scrcpy
  unzip -o $BASEDIR\\scrcpy.zip -d $BASEDIR\\scrcpy
  mv $BASEDIR\\scrcpy\\*\\* $BASEDIR\\scrcpy
fi