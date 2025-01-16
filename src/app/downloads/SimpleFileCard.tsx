import { api } from "@/services/api_helper";
import { FileType } from "@/services/FileType";
import { formatSize } from "@/services/mini_helper";
import { Card, Stack, Badge, ActionIcon, Text, Group } from "@mantine/core";
import { IconTrash, IconEye } from "@tabler/icons-react";
import path from "path";
import { useState, useEffect } from "react";

export default function SimpleFileCard({
  filePath,
  fileType,
  setTar,
  refresh,
}: {
  filePath: string;
  fileType: FileType;
  setTar: Function;
  refresh: Function;
}) {
  const [fileSize, setFileSize] = useState(0);
  const fileName = path.basename(filePath);
  function getServerSideProps() {
    api("/station/inspect", { url: filePath }).then((res) =>
      res.json().then((json) => setFileSize(json["fileSize"]))
    );
  }
  useEffect(() => {
    getServerSideProps();
  });
  return (
    <Card radius="md" withBorder>
      <Stack>
        <Text fw={500} style={{ wordBreak: "break-all" }}>
          {filePath}
        </Text>
        <Group>
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
              : "UNKNOWN"}
          </Badge>
          <Text>Size: {formatSize(fileSize)}</Text>
        </Group>
        <Group justify="space-between">
          {/* <ActionIcon
            color={"red"}
            variant="filled"
            size="md"
            onClick={async () => {
              await api("/station/rm", { filePath });
              refresh();
            }}
          >
            <IconTrash stroke={1.5} />
          </ActionIcon> */}
          <ActionIcon
            variant="default"
            size="md"
            onClick={() => {
              setTar("/api/station/asset/" + fileName);
            }}
          >
            <IconEye stroke={1.5} />
          </ActionIcon>
        </Group>
      </Stack>
    </Card>
  );
}
