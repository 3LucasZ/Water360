import { AspectRatio, Image } from "@mantine/core";

export default function PlaceholderImage() {
  return (
    <AspectRatio ratio={1080 / 720}>
      <Image alt="" bg={"dark.0"} />
    </AspectRatio>
  );
}
