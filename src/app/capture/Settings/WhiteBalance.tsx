import { under360 } from "@/services/api_helper";
import { InstaCameraManager } from "@/services/InstaCameraManager";
import { Select } from "@mantine/core";
import { getServerSideProps } from "next/dist/build/templates/pages";
import { useEffect, useState } from "react";

export default function WhiteBalance() {
  const [whiteBalance, setWhiteBalance] = useState(-10);
  useEffect(() => {
    getServerSideProps();
  }, []);
  async function getServerSideProps() {
    setWhiteBalance(
      (await (await under360("/get/whiteBalance")).json())["whiteBalance"]
    );
  }
  return (
    <Select
      label="White Balance"
      value={"" + whiteBalance}
      onChange={async (e) => {
        await under360("/set/whiteBalance", { whiteBalance: e });
        getServerSideProps();
      }}
      data={[
        {
          label: "Auto",
          value: "" + InstaCameraManager.WHITE_BALANCE_AUTO,
        },
        {
          label: "2700K",
          value: "" + InstaCameraManager.WHITE_BALANCE_2700K,
        },
        {
          label: "4000K",
          value: "" + InstaCameraManager.WHITE_BALANCE_4000K,
        },
        {
          label: "5000K",
          value: "" + InstaCameraManager.WHITE_BALANCE_5000K,
        },
        {
          label: "6500K",
          value: "" + InstaCameraManager.WHITE_BALANCE_6500K,
        },
        {
          label: "7500K",
          value: "" + InstaCameraManager.WHITE_BALANCE_7500K,
        },
      ]}
    />
  );
}
