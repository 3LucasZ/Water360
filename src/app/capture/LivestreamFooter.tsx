import { under360 } from "@/services/api_helper";
import { Center, Button } from "@mantine/core";
import { IconPlayerStop, IconBrandYoutube } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export default function LivestreamFooter({
  ws,
}: {
  ws: WebSocket | undefined;
}) {
  const [isLivestreaming, setIsLivestreaming] = useState(false);
  useEffect(() => {
    getServerSideProps();
  }, []);
  async function getServerSideProps() {
    var status = await (await under360("/status/operation")).json();
    setIsLivestreaming(status["previewStatus"] == "LIVE");
  }
  return (
    <Center>
      <Button
        radius={"xl"}
        size="lg"
        w={300}
        onClick={async () => {
          if (isLivestreaming) {
            await under360("/command/stopLive");
          } else {
            ws?.close();
            await under360("/command/startLive");
          }
          getServerSideProps();
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
}
