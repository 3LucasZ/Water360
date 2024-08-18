"use client";

import FileCard from "@/components/FileCard";
import { api, under360 } from "@/services/api_helper";
import {
  getFileName,
  getFilePrefix,
  getFileStamp,
  getFileSuffix,
} from "@/services/file_helper";
import { FileType } from "@/services/FileType";
import { SimpleGrid, Stack, TextInput, Center, Loader } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [search, setSearch] = useState("");
  // TODO: optional feature if requested
  // const [onCameraFilter, setOnCameraFilter] = useState(undefined);
  // const [fileTypeFilter, setFileTypeFilter] = useState(undefined);

  const [cameraUrls, setCameraUrls] = useState<string[]>([]);
  const [cameraUrlsLoading, setCameraUrlsLoading] = useState(true);
  const [khadasUrls, setKhadasUrls] = useState<string[]>([]);
  const [khadasUrlsLoading, setKhadasUrlsLoading] = useState(true);

  async function getServerSideProps() {
    under360("/ls").then((res) =>
      res.json().then((json) => {
        if (res.status == 200) {
          setCameraUrls(json["data"]);
        }
        setCameraUrlsLoading(false);
      })
    );
    api("/khadas/ls").then((res) =>
      res.json().then((json) => {
        if (res.status == 200) {
          setKhadasUrls(json["data"]);
        }
        setKhadasUrlsLoading(false);
      })
    );
  }
  useEffect(() => {
    getServerSideProps();
  }, []);
  const cards = cameraUrls
    .concat(khadasUrls)
    .sort((a, b) => {
      return -getFileStamp(a).localeCompare(getFileStamp(b));
    })
    .filter(
      (url) =>
        url.toLowerCase().match(search.toLowerCase()) && !url.match("LRV")
    )
    .map((url) => {
      const fileType =
        getFileSuffix(url) == "insp" || getFileSuffix(url) == "jpg"
          ? FileType.IMAGE
          : getFilePrefix(url) == "insv" || getFileSuffix(url) == "mp4"
          ? FileType.VIDEO
          : FileType.UNKNOWN;
      const onCamera = url.includes("http");
      var date;
      try {
        const dateStr = getFileName(url).split("_")[1];
        const yr = Number(dateStr.substring(0, 4));
        const m = Number(dateStr.substring(4, 6));
        const d = Number(dateStr.substring(6, 8));
        const timeStr = getFileName(url).split("_")[2];
        const hr = Number(timeStr.substring(0, 2));
        const min = Number(timeStr.substring(2, 4));
        const sec = Number(timeStr.substring(4, 6));
        date = new Date(Date.UTC(yr, m, d, hr, min, sec)).toLocaleString();
      } catch (e) {
        //in the case that the filename glitches and doesn't have the prescribed format
        date = "N/A";
      }
      return (
        <FileCard
          key={url}
          filePath={url}
          fileName={getFileName(url)}
          onCamera={onCamera}
          fileType={fileType}
          date={date}
          refresh={getServerSideProps}
        />
      );
    });
  return (
    <>
      <Stack>
        <TextInput
          leftSectionPointerEvents="none"
          leftSection={<IconSearch />}
          placeholder="File name"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
          }}
        />
        {cameraUrlsLoading && khadasUrlsLoading && (
          <Center h="300" mah={"50vh"}>
            <Loader size={"xl"} type="bars" color="pink" />
          </Center>
        )}
        <SimpleGrid cols={{ base: 1, xs: 2, sm: 2, md: 3, lg: 4 }}>
          {cards}
        </SimpleGrid>
      </Stack>
    </>
  );
}
