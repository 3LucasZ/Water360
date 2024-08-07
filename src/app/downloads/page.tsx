"use client";

import FileCard from "@/components/FileCard";
import Image360 from "@/components/Image360";
import PlaceholderImage from "@/components/PlaceholderImage";
import Video360 from "@/components/Video360";
import { api, under360 } from "@/services/api_helper";
import { responsiveBodyWidth } from "@/services/constants";
import { formatSize, formatTime } from "@/services/mini_helper";
import {
  Badge,
  Button,
  Card,
  Flex,
  Group,
  SimpleGrid,
  Skeleton,
  Stack,
  Title,
  Text,
  ActionIcon,
  Box,
  AspectRatio,
  Image,
  Center,
} from "@mantine/core";
import {
  IconDownload,
  IconEye,
  IconFileInfo,
  IconTrash,
} from "@tabler/icons-react";
import { lstat } from "fs";
import { useEffect, useState } from "react";

export default function Home() {
  const [filePaths, setFilePaths] = useState<string[]>([]);
  const [tarUrl, setTarUrl] = useState("");
  const tarUrlSuffix = tarUrl.split(".").pop();
  useEffect(() => {
    getServerSideProps();
  }, []);
  function getServerSideProps() {
    api("/station/urls").then((res) =>
      res.json().then((json) => {
        setFilePaths(
          json["urls"]
            // @ts-ignore
            .filter((url) => url.includes(".jpg") || url.includes(".mp4"))
        );
      })
    );
  }
  // console.log(filePaths);
  const cards = filePaths.map((url) => {
    const fileName = url.substring(url.lastIndexOf("/") + 1);
    const fileSuffix = url.split(".").pop();
    const fileType = fileSuffix == "jpg" ? 1 : 2;
    return (
      <SimpleFileCard
        key={url}
        filePath={url}
        fileName={fileName}
        fileType={fileType}
        setTar={setTarUrl}
      />
    );
  });
  return (
    <Stack>
      <Center>
        <Box w={responsiveBodyWidth}>
          {tarUrl == "" ? (
            <PlaceholderImage />
          ) : tarUrlSuffix == "jpg" ? (
            <Image360 url={tarUrl} />
          ) : tarUrlSuffix == "mp4" ? (
            <Video360 url={tarUrl} />
          ) : (
            <PlaceholderImage />
          )}
        </Box>
      </Center>
      <SimpleGrid cols={{ base: 1, xs: 2, sm: 2, md: 3, lg: 4 }}>
        {cards}
      </SimpleGrid>
    </Stack>
  );
}

function SimpleFileCard({
  filePath,
  fileName,
  fileType,
  setTar,
}: {
  filePath: string;
  fileName: string;
  fileType: number;
  setTar: Function;
}) {
  const [fileSize, setFileSize] = useState(0);
  function getServerSideProps() {
    api("/station/lstat", { url: filePath }).then((res) =>
      res.json().then((json) => setFileSize(json["fileSize"]))
    );
  }
  useEffect(() => {
    getServerSideProps();
  });
  return (
    <Card radius="md" withBorder>
      <Stack>
        <Text fw={500} truncate="end">
          {fileName}
        </Text>
        <Group>
          <Badge
            color={
              fileType == 1 ? "indigo" : fileType == 2 ? "grape" : "violet"
            }
          >
            {fileType == 1 ? "IMAGE" : fileType == 2 ? "VIDEO" : "TMP"}
          </Badge>
          <Text>Size: {formatSize(fileSize)}</Text>
          <Flex justify={"flex-end"} direction="row" style={{ flexGrow: 1 }}>
            <ActionIcon
              variant="default"
              size="md"
              onClick={() => {
                // api("/station/pathToFileURL", { path: filePath }).then((res) =>
                //   res.json().then((json) => setTar(json["fileURL"]))
                // );
                setTar("/api/station/asset" + filePath);
              }}
            >
              <IconEye stroke={1.5} />
            </ActionIcon>
          </Flex>
        </Group>
      </Stack>
    </Card>
  );
}
