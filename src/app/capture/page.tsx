"use client";

import { useEffect, useState } from "react";
import {
  Center,
  rem,
  SegmentedControl,
  Stack,
  Image,
  AspectRatio,
  Button,
  Container,
  Loader,
  Paper,
  Box,
} from "@mantine/core";
import {
  IconBrandYoutube,
  IconCapture,
  IconPlayerStop,
  IconVideo,
} from "@tabler/icons-react";
import { api, under360 } from "@/services/api_helper";
import Image360 from "@/components/Image360";
import { responsiveBodyWidth } from "@/services/constants";
import { isValidIP } from "@/services/mini_helper";
import PlaceholderImage from "@/components/PlaceholderImage";
// import WebSocket from "ws";

export default function Home() {
  const [mode, setMode] = useState("Photo");
  const [isCapturing, setIsCapturing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isLivestreaming, setIsLivestreaming] = useState(false);

  const [previewData, setPreviewData] = useState("");
  const [ws, setWs] = useState<WebSocket | undefined>(undefined);

  useEffect(() => {
    init();
  });
  async function init() {
    //prevent from binding ws twice
    if (ws == undefined) {
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
        };
      }
    }
  }

  const photoFooter = (
    <Center>
      <Button
        radius={"xl"}
        size="lg"
        w={300}
        color="blue"
        onClick={async () => {
          const res = await under360("/command/capture");
          setIsCapturing(true);
          setTimeout(() => {
            setIsCapturing(false);
          }, 4000);
        }}
        leftSection={!isCapturing && <IconCapture />}
      >
        {isCapturing ? <Loader color="white" /> : "Capture"}
      </Button>
    </Center>
  );
  const recordFooter = (
    <Center>
      <Button
        radius={"xl"}
        size="lg"
        w={300}
        onClick={async () => {
          if (isRecording) {
            const res = await under360("/command/stopRecord");
          } else {
            const res = await under360("/command/startRecord");
          }
          setIsRecording(!isRecording);
        }}
        color={isRecording ? "red" : "blue"}
        leftSection={isRecording ? <IconPlayerStop /> : <IconVideo />}
      >
        {isRecording ? "Stop" : "Record"}
      </Button>
    </Center>
  );
  const livestreamFooter = (
    <Center>
      <Button
        radius={"xl"}
        size="lg"
        w={300}
        onClick={async () => {
          if (isLivestreaming) {
            const res = await under360("/command/stopLive");
          } else {
            ws?.close();
            const res = await under360("/command/startLive");
          }
          setIsLivestreaming(!isLivestreaming);
        }}
        color={isLivestreaming ? "red" : "blue"}
        leftSection={
          isLivestreaming ? <IconPlayerStop /> : <IconBrandYoutube />
        }
      >
        {isLivestreaming ? "Stop" : "Stream"}
      </Button>
    </Center>
  );

  const buttonDatas = [
    { mode: "Photo", icon: IconCapture, body: photoFooter },
    { mode: "Record", icon: IconVideo, body: recordFooter },
    { mode: "Livestream", icon: IconBrandYoutube, body: livestreamFooter },
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
        <Box
          style={(theme) => ({
            borderRadius: theme.radius.lg,
            overflow: "hidden",
          })}
        >
          {previewData.length > 1 ? (
            <Image360 url={"data:image/png;base64," + previewData} />
          ) : (
            <PlaceholderImage />
          )}
        </Box>
        {footer}
      </Stack>
    </Center>
  );
}

const uri = "data:image/png;base64,";
