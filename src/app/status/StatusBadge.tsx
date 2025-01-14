"use client";
import { Badge } from "@mantine/core";

export function StatusBadge({
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
