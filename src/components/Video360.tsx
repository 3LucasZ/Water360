"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { BackSide } from "three";
import { Suspense, useEffect, useState } from "react";
import {
  ActionIcon,
  AspectRatio,
  Container,
  Group,
  Slider,
  Stack,
  Text,
} from "@mantine/core";
import { IconPlayerPause, IconPlayerPlay } from "@tabler/icons-react";
import { formatTime } from "@/services/mini_helper";

type Props = {
  url: string;
};
export default function Video360(props: Props) {
  const [videoRef, setRef] = useState<HTMLVideoElement>();
  const [paused, setPaused] = useState(true);
  const [videoTime, setVideoTime] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef) {
        setVideoTime(videoRef?.currentTime);
      }
    });
    return () => {
      clearInterval(interval);
    };
  });

  return (
    <Stack>
      <video height={0} width={0} ref={(newRef) => setRef(newRef!)}>
        <source src={props.url} type="video/mp4" />
      </video>

      <AspectRatio ratio={1080 / 720}>
        <Canvas camera={{ position: [0, 0, 0.1] }}>
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableDamping
            dampingFactor={0.2}
          />

          <mesh>
            <sphereGeometry attach="geometry" args={[500, 60, 40]} />
            <meshBasicMaterial side={BackSide}>
              <videoTexture
                attach={"map"}
                args={videoRef ? [videoRef] : undefined}
              />
            </meshBasicMaterial>
          </mesh>
        </Canvas>
      </AspectRatio>

      <Slider
        label={null}
        w="100%"
        min={0}
        max={videoRef ? videoRef.duration : 1}
        value={videoTime}
        onChange={(value) => {
          if (videoRef) {
            videoRef.currentTime = value;
            setVideoTime(value);
          }
        }}
      />
      <Group>
        <ActionIcon
          onClick={() => {
            if (paused) {
              videoRef?.play();
            } else {
              videoRef?.pause();
            }
            setPaused(!paused);
          }}
        >
          {paused ? <IconPlayerPlay /> : <IconPlayerPause />}
        </ActionIcon>
        <Text>
          {videoRef && videoRef.duration > 0
            ? formatTime(videoTime) + " / " + formatTime(videoRef.duration)
            : "..."}
        </Text>
      </Group>
    </Stack>
  );
}
