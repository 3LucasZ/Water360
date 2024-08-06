"use client";

import {
  Button,
  Center,
  Flex,
  PasswordInput,
  Stack,
  TextInput,
  Notification,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { downloadDir } from "@tauri-apps/api/path";
import { isValidIP } from "@/services/mini_helper";
import {
  IconCancel,
  IconDeviceFloppy,
  IconEdit,
  IconX,
} from "@tabler/icons-react";
import { responsiveBodyWidth } from "@/services/constants";
import { api } from "@/services/api_helper";
import { useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";

export default function Home() {
  const [IP, setIP] = useState("");
  const [MAC, setMAC] = useState("");
  const [downloadsDir, setDownloadsDir] = useState("");
  const [RTMP, setRTMP] = useState("");

  const load = async () => {
    const settings = await (await api("/station/getSettings")).json();
    setIP(settings["IP"]);
    setMAC(settings["MAC"]);
    setDownloadsDir(settings["downloadsDir"] || (await downloadDir()));
    setRTMP(settings["RTMP"]);
  };
  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <Flex justify={"center"}>
        <Stack w={responsiveBodyWidth}>
          <TextInput
            label={"Khadas IP Address"}
            value={IP}
            onChange={(event) => {
              const newIP = event.currentTarget.value;
              setIP(newIP);
            }}
            error={isValidIP(IP) ? "" : "Invalid IP address"} //remember to add [ ] around IP when necessary!
          />
          <TextInput label={"Khadas Mac Address"} value={MAC} disabled />
          <TextInput label={"Downloads folder"} value={downloadsDir} disabled />
          <PasswordInput
            label={"RTMP key"}
            value={RTMP}
            onChange={(event) => {
              const newRtmpKey = event.currentTarget.value;
              setRTMP(newRtmpKey);
            }}
          />
          <Button.Group>
            <Button
              size="sm"
              onClick={() => {
                load();
              }}
              color="red"
              leftSection={<IconX stroke={1.5} />}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={async () => {
                if (isValidIP(IP)) {
                  const res = await api("/station/updSettings", {
                    IP,
                    MAC,
                    downloadsDir,
                    RTMP,
                  });
                  if (res.status == 200) {
                    notifications.show({
                      title: "Success",
                      message: "Settings saved",
                      color: "green",
                    });
                  } else {
                    notifications.show({
                      title: "Error",
                      message: "An unknown error occured",
                      color: "red",
                    });
                  }
                } else {
                  notifications.show({
                    title: "Error",
                    message: "IP is invalid",
                    color: "red",
                  });
                }
                // router.refresh();
              }}
              color="blue"
              leftSection={<IconDeviceFloppy stroke={1.5} />}
            >
              Save
            </Button>
          </Button.Group>
        </Stack>
      </Flex>
    </>
  );
}
