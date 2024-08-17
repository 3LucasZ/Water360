"use client";

import { useEffect, useState } from "react";
import {
  Center,
  rem,
  SegmentedControl,
  Stack,
  ActionIcon,
  Tooltip,
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
import PhotoFooter from "./PhotoFooter";
import RecordFooter from "./RecordFooter";
import LivestreamFooter from "./LivestreamFooter";

export default function Home() {
  const [mode, setMode] = useState("Photo");
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewData, setPreviewData] = useState("");
  const [previewStamp, setPreviewStamp] = useState(0);
  const [ws, setWs] = useState<WebSocket | undefined>(undefined);

  useEffect(() => {
    getServerSideProps();
  }, []);
  async function getServerSideProps() {
    var IP = (await (await api("/station/getSettings")).json())["IP"];
    var status = await (await under360("/status/operation")).json();
    setIsPreviewing(status["previewStatus"] == "NORMAL");
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

  const previewButton = (
    <Tooltip label={previewStamp % 10000}>
      <ActionIcon
        color="blue"
        onClick={async () => {
          if (isPreviewing) {
            const res = await under360("/command/stopPreviewNormal");
            setIsPreviewing(false);
          } else {
            const res = await under360("/command/startPreviewNormal");
            if (res.status == 200) setIsPreviewing(true);
          }
        }}
        radius={"xl"}
        size={50}
      >
        {isPreviewing ? <IconPlayerStop /> : <IconPlayerPlay />}
      </ActionIcon>
    </Tooltip>
  );
  const settingsButton = (
    <ActionIcon color="gray" radius={"xl"} size={50}>
      {<IconSettings />}
    </ActionIcon>
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
      </Stack>
    </Center>
  );
}
