import { under360 } from "@/services/api_helper";
import { InstaCameraManager } from "@/services/InstaCameraManager";
import { Select } from "@mantine/core";
import { getServerSideProps } from "next/dist/build/templates/pages";
import { useEffect, useState } from "react";

export default function GammaMode() {
  const [gammaMode, setGammaMode] = useState(-10);
  useEffect(() => {
    getServerSideProps();
  }, []);
  async function getServerSideProps() {
    setGammaMode(
      (await (await under360("/get/gammaMode")).json())["gammaMode"]
    );
  }
  return (
    <Select
      label="Gamma Mode"
      value={"" + gammaMode}
      onChange={async (value) => {
        await under360("/set/gammaMode", { gammaMode: value });
        getServerSideProps();
      }}
      data={[
        {
          label: "Standard",
          value: "" + InstaCameraManager.GAMMA_MODE_STAND,
        },
        {
          label: "Logarithmic",
          value: "" + InstaCameraManager.GAMMA_MODE_LOG,
        },
        {
          label: "Vivid",
          value: "" + InstaCameraManager.GAMMA_MODE_VIVID,
        },
      ]}
    />
  );
}
