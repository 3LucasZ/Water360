import { under360 } from "@/services/api_helper";
import { InstaCameraManager } from "@/services/InstaCameraManager";
import { Center, Stack, Button, Switch, Group, Loader } from "@mantine/core";
import { IconPlayerStop, IconVideo } from "@tabler/icons-react";
import { ReactNode, useEffect, useState } from "react";

export default function PhotoFooter({
  previewButton,
}: {
  previewButton: ReactNode;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTimelapse, setIsTimelapse] = useState(false);
  const [timelapseInterval, setTimelapseInterval] = useState(5000);
  useEffect(() => {
    getServerSideProps();
  }, []);
  async function getServerSideProps() {
    var status = await (await under360("/status/operation")).json();
    setIsRecording(
      status["captureStatus"] == InstaCameraManager.CAPTURE_TYPE_NORMAL_RECORD
    );
  }
  return (
    <Center>
      <Stack>
        <Group>
          {previewButton}
          <Button
            radius={"xl"}
            size="lg"
            w={300}
            onClick={async () => {
              if (isRecording) {
                setIsLoading(true);
                await under360("/command/stopRecord");
                setTimeout(() => {
                  setIsLoading(false);
                  getServerSideProps();
                }, 4000);
              } else {
                await under360("/command/startRecord");
                getServerSideProps();
              }
            }}
            color={isRecording ? "red" : "blue"}
            leftSection={
              isLoading ? "" : isRecording ? <IconPlayerStop /> : <IconVideo />
            }
          >
            {isLoading ? (
              <Loader color="white" />
            ) : isRecording ? (
              "Stop"
            ) : (
              "Record"
            )}
          </Button>
        </Group>
        {/* <Group>
          <Switch disabled={isRecording} label="Timelapse" />
        </Group> */}
      </Stack>
    </Center>
  );
}
