"use client";

import MemoryDisplay from "@/components/MemoryDisplay";
import { api, under360 } from "@/services/api_helper";
import { formatSizePair } from "@/services/mini_helper";
import {
  Stack,
  Title,
  Text,
  Paper,
  Progress,
  Box,
  Overlay,
} from "@mantine/core";
import { RingProgress, SimpleGrid, Center, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconBolt } from "@tabler/icons-react";
import { electron } from "process";
import { MouseEventHandler, useEffect, useState } from "react";
import { CommandButton } from "./CommandButton";
import { StatusBadge } from "./StatusBadge";

export default function Home() {
  //station status
  const [adbInstalled, setAdbInstalled] = useState<boolean | undefined>(
    undefined
  );
  // logs
  const [stdout, setStdout] = useState("");
  const [stderr, setStderr] = useState("");
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
    api("/station/logs").then((res) =>
      res.json().then((json) => {
        setStdout(json["stdout"]);
        setStderr(json["stderr"]);
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
          <Center>
            <Group>
              <StatusBadge
                isOn={adbInstalled}
                onLabel="ADB installed"
                offLabel="ADB not found"
              />
            </Group>
          </Center>
          <SimpleGrid cols={3}>
            <Stack>
              {/* <CommandButton
            onClick={getServerSideProps}
            label="Refresh page"
            refresh={() => console.log()}
          /> */}
              <CommandButton
                onClick={async () => {
                  api("/station/info");
                }}
                label="Info"
                refresh={getServerSideProps}
              />
              <CommandButton
                onClick={async () => {
                  api("/khadas/adb/kill-server");
                }}
                label="ADB Kill Server"
                refresh={getServerSideProps}
              />
              <CommandButton
                onClick={async () => {
                  await api("/khadas/adb/devices");
                }}
                label="ADB Devices"
                refresh={getServerSideProps}
              />
              <CommandButton
                onClick={async () => {
                  await api("/khadas/adb/connect");
                }}
                label="ADB Connect"
                refresh={getServerSideProps}
              />
              <CommandButton
                onClick={async () => {
                  await api("/khadas/adb/disconnect");
                }}
                label="ADB Disconnect"
                refresh={getServerSideProps}
              />
            </Stack>
            <Box>
              <Stack gap={0}>
                <Text>Stdout:</Text>
                <Text style={{ wordWrap: "break-word" }}>{stdout}</Text>
              </Stack>
            </Box>
            <Box>
              <Stack gap={0}>
                <Text>Stderr:</Text>
                <Text style={{ wordWrap: "break-word" }}>{stderr}</Text>
              </Stack>
            </Box>
          </SimpleGrid>
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
              onLabel="ADB Connected"
              offLabel="ADB Disconnected"
            />
            <StatusBadge
              isOn={isAppRun}
              onLabel="app running"
              offLabel="app stopped"
            />
          </Group>
        </Center>
        <SimpleGrid cols={2}>
          <Stack>
            <CommandButton
              onClick={async () => {
                await api("/khadas/wol");
              }}
              label="Wake On Lan"
              refresh={getServerSideProps}
            />
            <CommandButton
              onClick={async () => {
                await api("/khadas/runApp");
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
              onClick={async () => {
                await under360("/command/connect");
              }}
              label="Connect"
              refresh={getServerSideProps}
            />
            <CommandButton
              onClick={async () => {
                await under360("/command/disconnect");
              }}
              label="Disconnect"
              refresh={getServerSideProps}
            />
            <CommandButton
              onClick={async () => {
                await under360("/command/init");
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
