"use client";

import { Button, Stack } from "@mantine/core";
import { under360 } from "../../services/api_helper";

export default function Home() {
  return (
    <Stack>
      <Button
        variant="filled"
        onClick={async () => {
          const res = await fetch("/api/wol", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
          });
        }}
      >
        /wol
      </Button>
      <Button
        onClick={async () => {
          under360("/status/khadas", { freeSpace: "y", totalSpace: "y" });
        }}
      >
        /under360/status/khadas
      </Button>
      <Button
        onClick={async () => {
          under360("/ls");
        }}
      >
        /under360/ls
      </Button>
      <Button
        onClick={async () => {
          under360("/command/connect");
        }}
      >
        /under360/command/connect
      </Button>
      <Button
        onClick={async () => {
          under360("/inspect", {
            url: "http://127.0.0.1:9099/DCIM/Camera01/IMG_20230621_051555_00_002.insp",
          });
        }}
      >
        /under360/inspect
      </Button>
      <Button
        onClick={async () => {
          under360("/export/image", {
            url: "http://127.0.0.1:9099/DCIM/Camera01/IMG_20230621_051555_00_002.insp",
          });
        }}
      >
        /under360/export/image
      </Button>
      <Button
        onClick={async () => {
          const res = await fetch("/api/adb/devices", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });
        }}
      >
        /adb/devices
      </Button>
      <Button
        onClick={async () => {
          const res = await fetch("/api/adb/ls", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });
        }}
      >
        /adb/ls
      </Button>
      <Button
        onClick={async () => {
          const res = await fetch("/api/adb/pull", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });
        }}
      >
        /adb/pull
      </Button>
      <Button
        onClick={async () => {
          const res = await fetch("/api/adb/test", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });
        }}
      >
        /adb/test
      </Button>
      <Button
        onClick={async () => {
          const res = await fetch("/api/adb/startActivity", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });
        }}
      >
        /adb/startActivity
      </Button>
      <Button
        onClick={async () => {
          const res = await fetch("/api/adb/checkActivity", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });
        }}
      >
        /adb/checkActivity
      </Button>
      <Button
        onClick={async () => {
          const res = await fetch("/api/adb/connect", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });
        }}
      >
        /adb/connect
      </Button>
    </Stack>
  );
}
