import { under360, api } from "@/services/api_helper";
import { FileType } from "@/services/FileType";
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
  Progress,
  Overlay,
  Center,
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
  fileType: FileType;
  date: string;
}) {
  //exporting
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  //data
  const [opened, { open, close }] = useDisclosure(false);
  const [data, setData] = useState({
    height: 0,
    width: 0,
    fileSize: 0,
    fps: 0,
    durationInMs: 0,
    bitrate: 0,
    creationTime: 0,
    //mini
    isHDR: false,
    supportPureshot: false,
    urlsForDelete: ["N/A"],
    urls: ["N/A"],
    urlsRaw: ["N/A"],
  });
  useEffect(() => {
    getServerSideProps();
  }, []);
  function getServerSideProps() {
    under360("/inspect", { url: filePath }).then((res) =>
      res.json().then((json) => setData(json))
    );
  }
  const [isDeleting, setIsDeleting] = useState(false);
  return (
    <Box pos="relative">
      <Overlay hidden={!exporting}>
        <Center h="100%">
          <Stack w={"80%"}>
            <Center>
              <Text c={"white"}>{exportProgress}%</Text>
            </Center>
            <Progress h={20} radius={"xl"} value={exportProgress} />
          </Stack>
        </Center>
      </Overlay>
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
          <Text
            fw={500}
            // truncate="end"
          >
            {fileName.replaceAll("_", " ")}
          </Text>
          <Group>
            <Badge color={onCamera ? "blue" : "cyan"}>
              {onCamera ? "Camera" : "Khadas"}
            </Badge>
            <Badge
              color={
                fileType == FileType.IMAGE
                  ? "indigo"
                  : fileType == FileType.VIDEO
                  ? "grape"
                  : "violet"
              }
            >
              {fileType == FileType.IMAGE
                ? "IMAGE"
                : fileType == FileType.VIDEO
                ? "VIDEO"
                : "TMP"}
            </Badge>
          </Group>
          <Text>{date}</Text>
          <Skeleton visible={data.creationTime == 0}>
            <Text>Filesize: {formatSize(data.fileSize)}</Text>
          </Skeleton>
          <Skeleton visible={data.creationTime == 0}>
            <Text>
              {fileType == FileType.VIDEO
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
                getServerSideProps();
              }}
            >
              <IconFileInfo stroke={1.5} />
            </Button>
            <Button
              color="blue"
              variant="light"
              fullWidth
              leftSection={<IconDownload stroke={1.5} />}
              onClick={async () => {
                if (onCamera) {
                  await under360(
                    "/export" +
                      (fileType == FileType.IMAGE ? "/image" : "/video"),
                    {
                      url: filePath,
                    }
                  );
                } else {
                  await api("/khadas/export", { url: filePath });
                }
                setExporting(true);
                function checker() {
                  (onCamera
                    ? under360("/export/status")
                    : api("/khadas/export/status")
                  ).then((res) =>
                    res.json().then((json) => {
                      setExportProgress(
                        Math.round(json["exportProgress"] * 100)
                      );
                      setExporting(json["exporting"]);
                      if (json["exporting"]) {
                        checker();
                      } else {
                        refresh();
                      }
                    })
                  );
                }
                checker();
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
                if (onCamera) {
                  under360("/rm", { url: filePath });
                } else {
                  api("/khadas/rm", { url: filePath });
                }
                setIsDeleting(true);
                setTimeout(() => {
                  setIsDeleting(false);
                  refresh();
                }, 1000);
              }}
              aria-label={"trash"}
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
            <List.Item hidden={fileType == FileType.IMAGE}>
              FPS: {data.fps}
            </List.Item>
            <List.Item hidden={fileType == FileType.IMAGE}>
              Duration: {formatTime(data.durationInMs / 1000)}
            </List.Item>
            <List.Item hidden={fileType == FileType.IMAGE}>
              Bitrate: {formatSize(data.bitrate)}
            </List.Item>
            {/* <List.Item>
              Timestamp: {new Date(data.creationTime).toLocaleString()}
            </List.Item> */}
            <List.Item>ID: {data.creationTime}</List.Item>
            <List.Item>Pre-HDR fragment: {data.isHDR.toString()}</List.Item>
            <List.Item>Pureshot: {data.supportPureshot.toString()}</List.Item>
            <List.Item>
              URLs for delete:{" "}
              {data.urlsForDelete
                .map((url) => url.replaceAll("_", " "))
                .toString()}
            </List.Item>
            <List.Item>
              URLs:{" "}
              {data.urls.map((url) => url.replaceAll("_", " ")).toString()}
            </List.Item>
            <List.Item>
              URLs raw:{" "}
              {data.urlsRaw.map((url) => url.replaceAll("_", " ")).toString()}
            </List.Item>
          </List>
        </Modal>
      </Box>
    </Box>
  );
}
