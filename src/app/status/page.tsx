"use client";

import { api, under360 } from "@/services/api_helper";
import { formatSize, formatSizePair } from "@/services/mini_helper";
import {
  Alert,
  Badge,
  Container,
  Stack,
  Title,
  Text,
  Paper,
  Card,
  Progress,
  Button,
  ActionIcon,
  Flex,
} from "@mantine/core";
import { RingProgress, SimpleGrid, Center, Group, rem } from "@mantine/core";
import {
  IconArrowUpRight,
  IconArrowDownRight,
  IconSpace,
  IconCheck,
  IconSdk,
  IconDeviceSdCard,
} from "@tabler/icons-react";
import { IconAlertCircle } from "@tabler/icons-react";
import commandExists from "command-exists";
import { warn } from "console";
import { useEffect, useState } from "react";

export default function Home() {
  //station status
  const [adbInstalled, setAdbInstalled] = useState(undefined);
  //khadas status
  const [pingable, setPingable] = useState(undefined);
  const [adbConnected, setAdbConnected] = useState(undefined);
  const [isAppRun, setIsAppRun] = useState(undefined);
  const [df, setDf] = useState({ freeSpace: 0, totalSpace: 0 });
  //cam status
  const [camStatus, setCamStatus] = useState({
    connected: undefined,
    freeSpace: 0,
    totalSpace: 0,
  });
  //initial data fetch
  useEffect(() => {
    //station status
    api("/station/adbInstalled").then((res) =>
      res.json().then((json) => setAdbInstalled(json["adbInstalled"]))
    );
    //khadas status
    api("/khadas/pingable").then((res) =>
      res.json().then((json) => setPingable(json["pingable"]))
    );
    api("/khadas/adbConnected").then((res) =>
      res.json().then((json) => setAdbConnected(json["adbConnected"]))
    );
    api("/khadas/isAppRun").then((res) =>
      res.json().then((json) => setIsAppRun(json["isAppRun"]))
    );
    api("/khadas/df").then((res) => res.json().then((json) => setDf(json)));
    //cam status
    under360("/status").then((res) =>
      res.json().then((json) => setCamStatus(json))
    );
    // Experimental infinite data fetching
    // const interval = setInterval(fetchData, 5000); // Infinite interval fetching
    // return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <Stack>
      <DeviceCard name="Ground Station">
        <Center>
          <Group>
            <Badge
              color={adbInstalled ? "green" : "red"}
              hidden={adbInstalled == undefined}
            >
              ADB {adbInstalled ? "installed" : "not found"}
            </Badge>
          </Group>
        </Center>
      </DeviceCard>
      <DeviceCard name="Khadas">
        <Center>
          <Group>
            <Badge color={pingable ? "green" : "red"}>
              {pingable ? "detected" : "unpingable"}
            </Badge>
            <Badge color={adbConnected ? "green" : "red"}>
              {adbConnected ? "connected" : "disconnected"}
            </Badge>
            <Badge color={isAppRun ? "green" : "red"}>
              {isAppRun ? "app on" : "app off"}
            </Badge>
          </Group>
        </Center>
        <SimpleGrid cols={2}>
          <Stack>
            <Button
              radius={"xl"}
              onClick={() => {
                api("/khadas/wol");
              }}
              maw={300}
            >
              Wake
            </Button>
            <Button
              radius={"xl"}
              onClick={() => {
                api("/khadas/adbConnect");
              }}
              maw={300}
            >
              Connect
            </Button>
            <Button
              radius={"xl"}
              onClick={() => {
                api("/khadas/runApp");
              }}
              maw={300}
            >
              Run App
            </Button>
          </Stack>
          <MemoryDisplay freeSpace={df.freeSpace} totalSpace={df.totalSpace} />
        </SimpleGrid>
      </DeviceCard>
      <DeviceCard name="Camera">
        <Center>
          <Group>
            <Badge
              color={camStatus.connected ? "green" : "red"}
              hidden={camStatus.connected == undefined}
            >
              {camStatus.connected ? "Connected" : "Disconnected"}
            </Badge>
          </Group>
        </Center>
        <SimpleGrid cols={2}>
          <Stack>
            <Button
              radius={"xl"}
              onClick={() => {
                under360("/command/connect");
              }}
              maw={300}
            >
              Connect
            </Button>
          </Stack>
          <MemoryDisplay
            freeSpace={camStatus.freeSpace}
            totalSpace={camStatus.totalSpace}
          />
        </SimpleGrid>
      </DeviceCard>
    </Stack>
  );
}

function DeviceCard({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  return (
    <Paper withBorder p="md">
      <Stack>
        <Center>
          <Title order={3}>{name}</Title>
        </Center>
        {children}
      </Stack>
    </Paper>
  );
}
function MemoryDisplay({
  freeSpace,
  totalSpace,
}: {
  freeSpace: number;
  totalSpace: number;
}) {
  const usedSpace = totalSpace - freeSpace;
  const usedPercent =
    totalSpace > 0 ? Math.round((100 * usedSpace) / totalSpace) : 0;
  const warningLevel = usedPercent < 33 ? 0 : usedPercent < 66 ? 1 : 2;

  return (
    <Group align="top">
      <RingProgress
        size={80}
        roundCaps
        thickness={8}
        sections={[
          {
            value: usedPercent,
            color:
              warningLevel == 0 ? "blue" : warningLevel == 1 ? "yellow" : "red",
          },
        ]}
        // label={
        //   <Center>
        //     <IconDeviceSdCard style={{ width: rem(22), height: rem(22) }} />
        //   </Center>
        // }
        // visibleFrom="sm"
      />
      <div>
        <Group>
          {/* <IconDeviceSdCard style={{ width: 18, height: 18 }} /> */}
          <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
            {"storage used"}
          </Text>
        </Group>
        <Text fw={700} size="xl">
          {totalSpace > 0 ? formatSizePair(usedSpace, totalSpace) : "0 / 0 GiB"}
        </Text>
      </div>
    </Group>
  );
}
