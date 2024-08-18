import { under360 } from "@/services/api_helper";
import { InstaCameraManager } from "@/services/InstaCameraManager";
import { Center, Button, Loader, Group } from "@mantine/core";
import { IconCapture } from "@tabler/icons-react";
import { ReactNode, useEffect, useState } from "react";

export default function PhotoFooter({
  previewButton,
}: {
  previewButton: ReactNode;
}) {
  const [isCapturing, setIsCapturing] = useState(false);
  useEffect(() => {
    getServerSideProps();
  }, []);
  async function getServerSideProps() {
    var status = await (await under360("/status/operation")).json();
    setIsCapturing(
      status["captureStatus"] == InstaCameraManager.CAPTURE_TYPE_NORMAL_CAPTURE
    );
  }

  return (
    <Center>
      <Group>
        {previewButton}
        <Button
          radius={"xl"}
          size="lg"
          w={300}
          color="blue"
          onClick={async () => {
            await under360("/command/capture");
            setIsCapturing(true);
            setTimeout(() => {
              setIsCapturing(false);
            }, 4000);
          }}
          leftSection={!isCapturing && <IconCapture />}
        >
          {isCapturing ? <Loader color="white" /> : "Capture"}
        </Button>
      </Group>
    </Center>
  );
}
