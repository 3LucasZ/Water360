import { under360 } from "@/services/api_helper";
import { Slider, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";

export default function ExposureEV() {
  const [exposureEV, setExposureEV] = useState(0);
  const marks = [
    { value: -4, label: "-4" },
    { value: -3, label: "-3" },
    { value: -2, label: "-2" },
    { value: -1, label: "-1" },
    { value: 0, label: "0" },
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
  ];
  useEffect(() => {
    getServerSideProps();
  }, []);
  async function getServerSideProps() {
    setExposureEV(
      (await (await under360("/get/exposureEV")).json())["exposureEV"]
    );
  }

  return (
    <Stack gap={0}>
      <Text size="sm" fw={600}>
        Exposure EV
      </Text>
      <Slider
        value={exposureEV}
        onChangeEnd={async (v) => {
          console.log(v.toPrecision(2));
          await under360("/set/exposureEV", { exposureEV: v.toPrecision(2) });
          await getServerSideProps();
        }}
        min={-4}
        max={4}
        step={0.1}
        marks={marks}
        label={null}
      />
    </Stack>
  );
}
