"use client";

import { useEffect, useState } from "react";
import {
  Center,
  rem,
  SegmentedControl,
  Stack,
  ActionIcon,
  Tooltip,
  Select,
  Space,
  SimpleGrid,
  Text,
} from "@mantine/core";
import {
  IconBrandYoutube,
  IconCapture,
  IconPlayerPlay,
  IconPlayerStop,
  IconSettings,
  IconVideo,
} from "@tabler/icons-react";
import { api, under360 } from "@/services/api_helper";
import Image360 from "@/components/Image360";
import { responsiveBodyWidth } from "@/services/constants";
import { isValidIP } from "@/services/mini_helper";
import PlaceholderImage from "@/components/PlaceholderImage";
import PhotoFooter from "./Footers/PhotoFooter";
import RecordFooter from "./Footers/RecordFooter";
import LivestreamFooter from "./Footers/LivestreamFooter";
import { InstaCameraManager } from "@/services/InstaCameraManager";
import WhiteBalance from "./Settings/WhiteBalance";
import ISO from "./Settings/ISO";
import dynamic from "next/dynamic";
import CaptureResolution from "./Settings/CaptureResolution";
import ExposureMode from "./Settings/ExposureMode";
import ExposureEV from "./Settings/ExposureEV";
import ShutterMode from "./Settings/ShutterMode";
import GammaMode from "./Settings/GammaMode";
import { CommandButton } from "../status/CommandButton";
import { update } from "three/examples/jsm/libs/tween.module.js";

export default function Home() {
  // logging
  const [stdout, setStdout] = useState("");
  const [stderr, setStderr] = useState("");
  function updateLogs() {
    api("/station/logs").then((res) =>
      res.json().then((json) => {
        setStdout(json["stdout"]);
        setStderr(json["stderr"]);
      })
    );
  }
  const logUI = (
    <SimpleGrid cols={2}>
      <Stack>
        <CommandButton
          label={"Operation Status"}
          onClick={async () => {
            await under360("/status/operation", undefined, undefined, true);
          }}
          refresh={() => updateLogs()}
        />
      </Stack>
      <Stack>
        {/* <Text>Stdout</Text> */}
        {/* <Text>Logs</Text> */}
        <Text style={{ wordBreak: "break-all", whiteSpace: "pre" }}>
          {stdout}
        </Text>
      </Stack>
      {/* <Stack>
    <Text>Stderr</Text>
    <Text style={{ wordBreak: "break-all" }}>{stderr}</Text>
  </Stack> */}
    </SimpleGrid>
  );
  // state
  const [mode, setMode] = useState("Photo");
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [previewData, setPreviewData] = useState("");
  const [previewStamp, setPreviewStamp] = useState(0);
  const [ws, setWs] = useState<WebSocket | undefined>(undefined);
  //websocket
  useEffect(() => {
    staticInit();
    function beforeUnload(e: BeforeUnloadEvent) {
      // e.preventDefault();
      console.log("unmounting component...");
      ws?.close();
      under360("/command/stopPreviewNormal");
    }
    window.addEventListener("beforeunload", beforeUnload);
    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
      // if (ws?.readyState !== 3) ws?.close();
    };
  }, []);
  async function staticInit() {
    await dynamicInit();
    var IP = (await (await api("/station/getSettings")).json())["IP"];
    if (isValidIP(IP)) {
      if (isValidIP(IP, true)) {
        IP = "[" + IP + "]";
      }
      console.log("IP", IP);
      const url = `ws://${IP}:8081/stream`;
      console.log("URL", url);
      const ws = new WebSocket(url);
      setWs(ws);
      ws.onmessage = async (e) => {
        const msg = e.data;
        // console.log(msg);
        setPreviewData(msg);
        setPreviewStamp(Date.now());
      };
    }
  }
  async function dynamicInit() {
    var status = await (await under360("/status/operation")).json();
    setIsPreviewing(status["previewStatus"] == "NORMAL");
    setIsActive(
      status["captureStatus"] != InstaCameraManager.CAPTURE_TYPE_IDLE ||
        status["previewStatus"] != "IDLE"
    );
  }

  const previewButton = (
    <Tooltip label={ws?.url + " " + (previewStamp % 10000)}>
      <ActionIcon
        color="blue"
        onClick={async () => {
          if (isPreviewing) {
            await under360("/command/stopPreviewNormal");
            dynamicInit();
          } else {
            await under360("/command/startPreviewNormal");
            dynamicInit();
          }
        }}
        radius={"xl"}
        size={50}
      >
        {isPreviewing ? <IconPlayerStop /> : <IconPlayerPlay />}
      </ActionIcon>
    </Tooltip>
  );

  const buttonDatas = [
    {
      mode: "Photo",
      icon: IconCapture,
      body: <PhotoFooter previewButton={previewButton} />,
    },
    {
      mode: "Record",
      icon: IconVideo,
      body: <RecordFooter previewButton={previewButton} />,
    },
    {
      mode: "Livestream",
      icon: IconBrandYoutube,
      body: <LivestreamFooter ws={ws} />,
    },
  ];

  const footer = buttonDatas.filter((data) => {
    return data.mode == mode;
  })[0].body;

  return (
    <Center>
      <Stack w={responsiveBodyWidth}>
        <SegmentedControl
          value={mode}
          onChange={(value) => {
            setMode(value);
          }}
          data={buttonDatas.map((ButtonData) => {
            return {
              value: ButtonData.mode,
              label: (
                <Center style={{ gap: 10 }}>
                  <ButtonData.icon
                    style={{ width: rem(16), height: rem(16) }}
                  />
                  <span>{ButtonData.mode}</span>
                </Center>
              ),
            };
          })}
        />
        {previewData.length > 1 ? (
          <Image360 url={"data:image/png;base64," + previewData} />
        ) : (
          <PlaceholderImage />
        )}
        {footer}
        {/* <CaptureResolution /> */}
        <ExposureMode />
        <ExposureEV />
        <WhiteBalance />
        <ISO />
        <ShutterMode />
        <GammaMode />
        <Space />
        {logUI}
      </Stack>
    </Center>
  );
}
