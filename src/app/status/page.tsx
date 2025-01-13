"use client";

import MemoryDisplay from "@/components/MemoryDisplay";
import { api, under360 } from "@/services/api_helper";
import { formatSizePair } from "@/services/mini_helper";
import {
  Badge,
  Stack,
  Title,
  Text,
  Paper,
  Button,
  Progress,
  Box,
  Overlay,
} from "@mantine/core";
import { RingProgress, SimpleGrid, Center, Group } from "@mantine/core";
import { IconBolt } from "@tabler/icons-react";
import { electron } from "process";
import { MouseEventHandler, useEffect, useState } from "react";

export default function Home() {
  //station status
  const [adbInstalled, setAdbInstalled] = useState<boolean | undefined>(
    undefined
  );
  const [info, setInfo] = useState<string>("");
  //khadas status
  const [pingable, setPingable] = useState<boolean | undefined>(undefined);
  const [adbConnected, setAdbConnected] = useState<boolean | undefined>(
    undefined
  );
  const [isAppRun, setIsAppRun] = useState<boolean | undefined>(undefined);
  const [df, setDf] = useState({ freeSpace: 0, totalSpace: 0 });
  //cam status
  const [camStatus, setCamStatus] = useState({
    connected: undefined,
    freeSpace: 0,
    totalSpace: 0,
    isCharging: false,
    batteryLevel: 0,
  });
  const [camMetadata, setCamMetadata] = useState({
    cameraType: "",
    cameraVersion: "",
    cameraSerial: "",
  });
  //initial data fetch
  function getServerSideProps() {
    //station status
    api("/station/adbInstalled").then((res) =>
      res.json().then((json) => setAdbInstalled(json["adbInstalled"]))
    );
    api("/station/info").then((res) =>
      res.json().then((json) => {
        setInfo(JSON.stringify(json, null, 2));
      })
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
    under360("/get/metadata").then((res) =>
      res.json().then((json) => setCamMetadata(json))
    );
  }
  useEffect(() => {
    getServerSideProps();
    // Experimental infinite data fetching
    // const interval = setInterval(getServerSideProps, 1000); // Infinite interval fetching
    // return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <Stack>
      <DeviceCard name="Ground Station">
        <Stack>
          <Text>Info: {info}</Text>
          <Center>
            <Group>
              <StatusBadge
                isOn={adbInstalled}
                onLabel="ADB installed"
                offLabel="ADB not found"
              />
            </Group>
          </Center>
          {/* <CommandButton
            onClick={getServerSideProps}
            label="Refresh page"
            refresh={() => console.log()}
          /> */}
        </Stack>
      </DeviceCard>
      <DeviceCard name="Khadas">
        <Center>
          <Group>
            <StatusBadge
              isOn={pingable}
              onLabel="detected"
              offLabel="unpingable"
            />
            <StatusBadge
              isOn={adbConnected}
              onLabel="connected"
              offLabel="disconnected"
            />
            <StatusBadge isOn={isAppRun} onLabel="app on" offLabel="app off" />
          </Group>
        </Center>
        <SimpleGrid cols={2}>
          <Stack>
            <CommandButton
              onClick={() => {
                api("/khadas/wol");
              }}
              label="Wake"
              refresh={getServerSideProps}
            />
            <CommandButton
              onClick={() => {
                api("/khadas/adbConnect");
              }}
              label="ADB Connect"
              refresh={getServerSideProps}
            />
            <CommandButton
              onClick={() => {
                api("/khadas/adbDisconnect");
              }}
              label="ADB Disconnect"
              refresh={getServerSideProps}
            />
            <CommandButton
              onClick={() => {
                api("/khadas/runApp");
              }}
              label="Run App"
              refresh={getServerSideProps}
            />
          </Stack>
          <MemoryDisplay freeSpace={df.freeSpace} totalSpace={df.totalSpace} />
        </SimpleGrid>
      </DeviceCard>
      <DeviceCard name="Camera">
        <Center>
          <Group>
            <Text>{camMetadata.cameraType}</Text>
            <Text>{camMetadata.cameraVersion}</Text>
            <Text>{camMetadata.cameraSerial}</Text>
          </Group>
        </Center>
        <Center>
          <Group>
            <StatusBadge
              isOn={camStatus.connected}
              onLabel="Connected"
              offLabel="Disconnected"
            />
            <Box pos={"relative"}>
              <Progress
                radius="xl"
                h="25"
                value={camStatus.batteryLevel * 0.9}
                w={100}
                animated={camStatus.isCharging}
                color={
                  camStatus.batteryLevel < 33
                    ? "red"
                    : camStatus.batteryLevel < 66
                    ? "yellow"
                    : "green"
                }
              />
              <Overlay backgroundOpacity={0}>
                <Center>
                  {camStatus.isCharging && <IconBolt color="white" />}
                  <Text c="white" fw={600}>
                    {camStatus.batteryLevel}%
                  </Text>
                </Center>
              </Overlay>
            </Box>
          </Group>
        </Center>
        <SimpleGrid cols={2}>
          <Stack>
            <CommandButton
              onClick={() => {
                under360("/command/connect");
              }}
              label="Connect"
              refresh={getServerSideProps}
            />
            <CommandButton
              onClick={() => {
                under360("/command/disconnect");
              }}
              label="Disconnect"
              refresh={getServerSideProps}
            />
            <CommandButton
              onClick={() => {
                under360("/command/init");
              }}
              label="First-time setup"
              refresh={() => null}
            />
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
function CommandButton({
  label,
  onClick,
  refresh,
}: {
  label: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  refresh: Function;
}) {
  return (
    <Button
      radius={"xl"}
      onClick={(e) => {
        onClick(e);
        setTimeout(refresh, 1000);
      }}
      maw={300}
    >
      {/* <Text size="lg">{label}</Text> */}
      {label}
    </Button>
  );
}
function StatusBadge({
  isOn,
  onLabel,
  offLabel,
}: {
  isOn: boolean | undefined;
  onLabel: string;
  offLabel: string;
}) {
  return (
    <Badge color={isOn ? "green" : "red"} hidden={isOn === undefined} size="lg">
      {isOn ? onLabel : offLabel}
    </Badge>
  );
}
