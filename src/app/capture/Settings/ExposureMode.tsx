import { under360 } from "@/services/api_helper";
import { InstaCameraManager } from "@/services/InstaCameraManager";
import { Select } from "@mantine/core";
import { getServerSideProps } from "next/dist/build/templates/pages";
import { useEffect, useState } from "react";

export default function ExposureMode() {
  const [ExposureMode, setExposureMode] = useState(-10);
  useEffect(() => {
    getServerSideProps();
  }, []);
  async function getServerSideProps() {
    setExposureMode(
      (await (await under360("/get/exposureMode")).json())["exposureMode"]
    );
  }
  return (
    <Select
      label="Exposure Mode"
      value={"" + ExposureMode}
      onChange={async (e) => {
        await under360("/set/exposureMode", { exposureMode: e });
        getServerSideProps();
      }}
      data={[
        {
          label: "Auto (EV, WB)",
          value: "" + InstaCameraManager.EXPOSURE_MODE_AUTO,
        },
        {
          label: "ISO first (EV, WB, ISO)",
          value: "" + InstaCameraManager.EXPOSURE_MODE_ISO_FIRST,
        },
        {
          label: "Shutter first (EV, WB, Shutter)",
          value: "" + InstaCameraManager.EXPOSURE_MODE_SHUTTER_FIRST,
        },
        {
          label: "Manual (Shutter, WB, ISO)",
          value: "" + InstaCameraManager.EXPOSURE_MODE_MANUAL,
        },
        {
          label: "Adaptive",
          value: "" + InstaCameraManager.EXPOSURE_MODE_ADAPTIVE,
        },
      ]}
    />
  );
}
