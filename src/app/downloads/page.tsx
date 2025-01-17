"use client";

import FileCard from "@/components/FileCard";
import Image360 from "@/components/Image360";
import PlaceholderImage from "@/components/PlaceholderImage";
import Video360 from "@/components/Video360";
import { api, under360 } from "@/services/api_helper";
import { responsiveBodyWidth } from "@/services/constants";
import { getFileStamp } from "@/services/file_helper";
import { FileType } from "@/services/FileType";
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
import SimpleFileCard from "./SimpleFileCard";

export default function Home() {
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [tarUrl, setTarUrl] = useState("");
  const tarUrlSuffix = tarUrl.split(".").pop();
  useEffect(() => {
    getServerSideProps();
  }, []);
  function getServerSideProps() {
    api("/station/ls").then((res) =>
      res.json().then((json) => {
        console.log(json["fileNames"]);
        setFileNames(
          json["fileNames"]
            // @ts-ignore
            .filter((url) => url.includes(".jpg") || url.includes(".mp4"))
            // @ts-ignore
            .sort((a, b) => {
              return -getFileStamp(a).localeCompare(getFileStamp(b));
            })
        );
      })
    );
  }
  // console.log(filePaths);
  const cards = fileNames.map((fileName) => {
    const fileSuffix = fileName.split(".").pop();
    const fileType = fileSuffix == "jpg" ? FileType.IMAGE : FileType.VIDEO;
    return (
      <SimpleFileCard
        key={fileName}
        fileName={fileName}
        fileType={fileType}
        setTar={setTarUrl}
        refresh={getServerSideProps}
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
