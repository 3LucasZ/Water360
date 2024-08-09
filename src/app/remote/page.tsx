"use client";

import FileCard from "@/components/FileCard";
import { api, under360 } from "@/services/api_helper";
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
        if (res.status != 200) {
          notifications.show({
            title: "Error",
            message: json["err"],
            color: "red",
          });
        } else {
          setCameraUrls(json["data"]);
        }
        setCameraUrlsLoading(false);
      })
    );
    api("/khadas/ls").then((res) =>
      res.json().then((json) => {
        if (res.status != 200) {
          notifications.show({
            title: "Error",
            message: json["err"],
            color: "red",
          });
        } else {
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
    .filter(
      (url) =>
        url.toLowerCase().match(search.toLowerCase()) && !url.match("LRV")
    )
    .map((url) => {
      console.log(url);
      const fileName = url.substring(url.lastIndexOf("/") + 1);
      const onCamera = url.includes("http");
      const filePrefix = fileName.substring(0, 3);
      const fileSuffix = url.split(".").pop();
      const fileType =
        fileSuffix == "insp" || fileSuffix == "jpg"
          ? 1
          : filePrefix == "LRV"
          ? 3
          : 2;
      var date;
      try {
        const dateStr = url.split("_")[1];
        const yr = Number(dateStr.substring(0, 4));
        const m = Number(dateStr.substring(4, 6));
        const d = Number(dateStr.substring(6, 8));
        const timeStr = url.split("_")[2];
        const hr = Number(timeStr.substring(0, 2));
        const min = Number(timeStr.substring(2, 4));
        const sec = Number(timeStr.substring(4, 6));
        date = (new Date(Date.UTC(yr, m, d, hr, min, sec))).toLocaleDateString();
      } catch (e) {
        //in the case that the filename glitches and doesn't have the prescribed format
        date = "N/A"
      }
      return (
        <FileCard
          key={url}
          filePath={url}
          fileName={fileName}
          onCamera={onCamera}
          fileType={fileType}
          date={date.toLocaleString()}
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
