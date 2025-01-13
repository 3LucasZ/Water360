#!/bin/bash
echo "Flag: $1"
if [[ "$1" == "-m" ]]; then
  LINK="https://dl.google.com/android/repository/platform-tools-latest-darwin.zip"
elif [[ "$1" == "-w" ]]; then
  LINK="https://dl.google.com/android/repository/platform-tools-latest-windows.zip"
fi

echo "Link: $LINK"
curl -SL "$LINK" -o platform-tools.zip
unzip -o platform-tools.zip -d .