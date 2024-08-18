import { under360 } from "@/services/api_helper";
import { InstaCameraManager } from "@/services/InstaCameraManager";
import { Select, Text } from "@mantine/core";
import { useEffect, useState } from "react";

export default function ShutterMode() {
  const [shutterMode, setShutterMode] = useState(-10);
  useEffect(() => {
    getServerSideProps();
  }, []);
  async function getServerSideProps() {
    setShutterMode(
      (await (await under360("/get/shutterMode")).json())["shutterMode"]
    );
  }
  return (
    <Select
      label={"Shutter Mode"}
      value={"" + shutterMode}
      onChange={async (value) => {
        await under360("/set/shutterMode", { shutterMode: value });
        getServerSideProps();
      }}
      data={[
        {
          label: "Off",
          value: "" + InstaCameraManager.SHUTTER_MODE_OFF,
        },
        {
          label: "Sport",
          value: "" + InstaCameraManager.SHUTTER_MODE_SPORT,
        },
        {
          label: "Faster",
          value: "" + InstaCameraManager.SHUTTER_MODE_FASTER,
        },
      ]}
    />
  );
}
