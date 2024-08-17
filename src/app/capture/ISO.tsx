import { under360 } from "@/services/api_helper";
import { InstaCameraManager } from "@/services/InstaCameraManager";
import {
  Box,
  LoadingOverlay,
  Select,
  Slider,
  Stack,
  Text,
} from "@mantine/core";
import { getServerSideProps } from "next/dist/build/templates/pages";
import { useEffect, useState } from "react";

export default function ISO() {
  const [ISO, setISO] = useState(100);
  const [isDebounced, setIsDebounced] = useState(false);

  useEffect(() => {
    getServerSideProps();
  }, []);
  async function getServerSideProps() {
    setISO((await (await under360("/get/ISO")).json())["ISO"]);
  }
  function sliderToReal(slider: number) {
    return Math.round(100 * 2 ** slider);
  }
  function realToSlider(real: number) {
    return Math.log2(real / 100);
  }
  const marks = [
    { value: 0, label: "100" },
    { value: 1, label: "200" },
    { value: 2, label: "400" },
    { value: 3, label: "800" },
    { value: 4, label: "1600" },
    { value: 5, label: "3200" },
  ];

  return (
    <Stack gap={0}>
      <Text size="sm" fw={600}>
        ISO
      </Text>
      <Slider
        min={0}
        max={5}
        step={0.1}
        marks={marks}
        value={realToSlider(ISO)}
        label={null}
        disabled={isDebounced}
        onChangeEnd={async (v) => {
          await under360("/set/ISO", { ISO: sliderToReal(v) });
          await getServerSideProps();
        }}
      />
    </Stack>
  );
}
