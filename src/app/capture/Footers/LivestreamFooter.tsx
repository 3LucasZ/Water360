import { under360 } from "@/services/api_helper";
import { Center, Button, Loader } from "@mantine/core";
import { IconPlayerStop, IconBrandYoutube } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export default function LivestreamFooter({
  ws,
}: {
  ws: WebSocket | undefined;
}) {
  const [isLivestreaming, setIsLivestreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
            setIsLoading(true);
            await under360("/command/stopLive", undefined, true);
            setTimeout(() => {
              setIsLoading(false);
              getServerSideProps();
            }, 4000);
          } else {
            ws?.close();
            await under360("/command/startLive");
            getServerSideProps();
          }
        }}
        color={isLivestreaming ? "red" : "blue"}
        leftSection={
          isLoading ? (
            ""
          ) : isLivestreaming ? (
            <IconPlayerStop />
          ) : (
            <IconBrandYoutube />
          )
        }
      >
        {isLoading ? (
          <Loader color="white" />
        ) : isLivestreaming ? (
          "Stop"
        ) : (
          "Stream"
        )}
      </Button>
    </Center>
  );
}
