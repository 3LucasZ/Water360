import { under360 } from "@/services/api_helper";
import { InstaCameraManager } from "@/services/InstaCameraManager";
import { formatRes } from "@/services/mini_helper";
import { Select } from "@mantine/core";
import { getServerSideProps } from "next/dist/build/templates/pages";
import { useEffect, useState } from "react";

export default function CaptureResolution() {
  const [supported, setSupported] = useState<string[]>([]);
  const [resoluion, setResolution] = useState("");
  useEffect(() => {
    getServerSideProps();
  }, []);
  async function getServerSideProps() {
    setSupported(
      (await (await under360("/get/record/resolution/supported")).json())[
        "supported"
      ]
    );
    setResolution(
      (await (await under360("/get/record/resolution")).json())["resolution"]
    );
  }
  return (
    <Select
      label="Photo Resolution"
      value={resoluion}
      onChange={async (value) => {
        await under360("/set/record/resolution", { resolution: value });
        getServerSideProps();
      }}
      data={supported.map((res) => {
        return { label: formatRes(res), value: res };
      })}
    />
  );
}
