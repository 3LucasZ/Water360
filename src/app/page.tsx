"use client";

import { FeaturesCards } from "@/components/Feature/FeaturesCards";
import { HeroText } from "@/components/Hero/HeroText";
import { api } from "@/services/api_helper";
import { Stack, Title } from "@mantine/core";
import { useEffect } from "react";

export default function Home() {
  // useEffect(() => {
  //   api("/station/initSettings");
  // }, []);
  return (
    <Stack>
      <HeroText />
      <FeaturesCards />
    </Stack>
  );
}
