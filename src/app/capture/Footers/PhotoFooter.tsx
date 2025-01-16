import { under360 } from "@/services/api_helper";
import { InstaCameraManager } from "@/services/InstaCameraManager";
import { Center, Button, Loader, Group, Stack } from "@mantine/core";
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
      status["captureStatus"] ==
        InstaCameraManager.CAPTURE_TYPE_NORMAL_CAPTURE ||
        status["captureStatus"] == InstaCameraManager.CAPTURE_TYPE_HDR_CAPTURE
    );
  }

  return (
    <Center>
      <Group>
        {previewButton}
        {isCapturing ? (
          <Button
            w={"300"}
            radius={"xl"}
            size="lg"
            color="blue"
            leftSection={<Loader color="white" />}
          />
        ) : (
          <Button.Group>
            <Button
              w={250}
              radius={"xl"}
              size="lg"
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
              Capture
            </Button>
            <Button
              w={100}
              radius={"xl"}
              size="lg"
              color="cyan"
              onClick={async () => {
                await under360("/command/capture_HDR");
                setIsCapturing(true);
                setTimeout(() => {
                  setIsCapturing(false);
                }, 4000);
              }}
            >
              HDR
            </Button>
          </Button.Group>
        )}
      </Group>
    </Center>
  );
}
