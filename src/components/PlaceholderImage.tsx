import { AspectRatio, Box, Image } from "@mantine/core";

export default function PlaceholderImage() {
  return (
    <Box
      style={(theme) => ({
        borderRadius: theme.radius.lg,
        overflow: "hidden",
      })}
    >
      <AspectRatio ratio={1080 / 720}>
        <Image alt="" bg={"dark.0"} />
      </AspectRatio>
    </Box>
  );
}
