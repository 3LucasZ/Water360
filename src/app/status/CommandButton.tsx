"use client";
import { Button } from "@mantine/core";
import { useState } from "react";

export function CommandButton({
  label,
  onClick,
  refresh,
}: {
  label: string;
  // onClick: MouseEventHandler<HTMLButtonElement>;
  onClick: () => Promise<void>;
  refresh: Function;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      radius={"xl"}
      onClick={async (e) => {
        setLoading(true);
        await onClick();
        setTimeout(() => {
          refresh();
          setLoading(false);
        }, 1000);
      }}
      maw={300}
      loading={loading}
    >
      {/* <Text size="lg">{label}</Text> */}
      {label}
    </Button>
  );
}
