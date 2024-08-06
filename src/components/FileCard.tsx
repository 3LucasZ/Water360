import { under360, api } from "@/services/api_helper";
import { formatSize, formatTime } from "@/services/mini_helper";
import {
  Box,
  LoadingOverlay,
  Card,
  Stack,
  Badge,
  Button,
  Modal,
  List,
  Text,
  Skeleton,
  Group,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconFileInfo, IconDownload, IconTrash } from "@tabler/icons-react";
import { useState, useEffect } from "react";

export default function FileCard({
  onCamera,
  refresh,
  filePath,
  fileName,
  fileType,
  date,
}: {
  onCamera: boolean;
  refresh: Function;
  filePath: string;
  fileName: string;
  fileType: number;
  date: string;
}) {
  const [opened, { open, close }] = useDisclosure(false);
  const [data, setData] = useState({
    height: 0,
    width: 0,
    fileSize: 0,
    fps: 0,
    durationInMs: 0,
    bitrate: 0,
    creationTime: 0,
  });
  useEffect(() => {
    under360("/inspect", { url: filePath }).then((res) =>
      res.json().then((json) => setData(json))
    );
  }, []);
  const [isDeleting, setIsDeleting] = useState(false);
  return (
    <Box pos="relative">
      <LoadingOverlay
        visible={isDeleting}
        zIndex={1000}
        overlayProps={{
          radius: "sm",
          blur: 2,
        }}
      />
      <Card radius="md" withBorder>
        <Stack>
          <Text fw={500} truncate="end">
            {fileName}
          </Text>
          <Group>
            <Badge color={onCamera ? "blue" : "cyan"}>
              {onCamera ? "Camera" : "Khadas"}
            </Badge>
            <Badge
              color={
                fileType == 1 ? "indigo" : fileType == 2 ? "grape" : "violet"
              }
            >
              {fileType == 1 ? "IMAGE" : fileType == 2 ? "VIDEO" : "TMP"}
            </Badge>
          </Group>
          <Text>{date}</Text>
          <Skeleton visible={data.creationTime == 0}>
            <Text>Filesize: {formatSize(data.fileSize)}</Text>
          </Skeleton>
          <Skeleton visible={data.creationTime == 0}>
            <Text>
              {fileType == 2
                ? "Duration: " + formatTime(data.durationInMs / 1000)
                : "Resolution: " + data.height + "x" + data.width}
            </Text>
          </Skeleton>
          <Button.Group miw={"100%"}>
            <Button
              color="yellow"
              variant="light"
              miw="40"
              px="0"
              disabled={data.creationTime == 0}
              onClick={async () => {
                open();
              }}
            >
              <IconFileInfo stroke={1.5} />
            </Button>
            <Button
              color="blue"
              variant="light"
              fullWidth
              leftSection={<IconDownload stroke={1.5} />}
              onClick={() => {
                api("/khadas/pull", { url: filePath });
              }}
            >
              Export
            </Button>
            <Button
              color="red"
              variant="light"
              miw="40"
              px="0"
              onClick={async () => {
                await under360("/rm", { url: filePath });
                setIsDeleting(true);
                setTimeout(() => {
                  setIsDeleting(false);
                  refresh();
                }, 5000);
              }}
            >
              <IconTrash stroke={1.5} />
            </Button>
          </Button.Group>
        </Stack>
      </Card>
      <Box pos="relative">
        <LoadingOverlay
          visible={data.height == 0}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Modal
          opened={opened}
          onClose={close}
          title="File Information"
          centered
        >
          <List>
            <List.Item>Filesize: {formatSize(data.fileSize)}</List.Item>
            <List.Item>
              Resolution: {data.height}x{data.width}
            </List.Item>
            <List.Item hidden={fileType == 1}>FPS: {data.fps}</List.Item>
            <List.Item hidden={fileType == 1}>
              Duration: {formatTime(data.durationInMs / 1000)}
            </List.Item>
            <List.Item hidden={fileType == 1}>
              Bitrate: {formatSize(data.bitrate)}
            </List.Item>
            {/* <List.Item>
              Timestamp: {new Date(data.creationTime).toLocaleString()}
            </List.Item> */}
            <List.Item>ID: {data.creationTime}</List.Item>
          </List>
        </Modal>
      </Box>
    </Box>
  );
}
