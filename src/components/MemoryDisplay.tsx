import { formatSizePair } from "@/services/mini_helper";
import { Group, RingProgress, Text } from "@mantine/core";

export default function MemoryDisplay({
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
