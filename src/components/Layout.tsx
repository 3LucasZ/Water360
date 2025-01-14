"use client";

import { api, under360 } from "@/services/api_helper";
import {
  NavLink,
  AppShell,
  Burger,
  Title,
  Group,
  useMantineColorScheme,
  ActionIcon,
  useComputedColorScheme,
  Flex,
  Text,
  Stack,
  Space,
  Indicator,
  Divider,
  Container,
  Box,
  Tooltip,
  Kbd,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconDashboard,
  IconEye,
  IconSubmarine,
  IconBug,
  IconSettings,
  IconHome,
  IconCamera,
  IconSun,
  IconMoon,
  IconRefresh,
  IconReload,
} from "@tabler/icons-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  //--ROUTER--
  const router = useRouter();

  //--COLOR MODE--
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light");

  //--POLL STATE--
  const [connected, setConnected] = useState(false);
  function getServerSideProps() {
    api("/station/initSettings").then((res) => {
      under360("/status/poll").then((res) => {
        res.json().then((json) => {
          setConnected(json["connected"]);
        });
      });
    });
  }
  useEffect(() => {
    getServerSideProps();
    // const interval = setInterval(getServerSideProps, 1000); // Infinite interval fetching
    // return () => clearInterval(interval); // Cleanup on unmount
  });

  //--NAVLINK--
  const [opened, { toggle }] = useDisclosure();
  const navLinkDatas = [
    { link: "/", label: "Home", icon: IconHome },
    { link: "/status", label: "Status", icon: IconDashboard },
    { link: "/capture", label: "Capture", icon: IconCamera },
    { link: "/remote", label: "Remote Media", icon: IconSubmarine },
    { link: "/downloads", label: "Downloads", icon: IconEye },
    // { link: "/debug", label: "Debug", icon: IconBug },
    { link: "/settings", label: "Settings", icon: IconSettings },
  ];
  const pathname = usePathname();
  console.log(pathname);
  const navLinks = navLinkDatas.map((Item) => (
    <NavLink
      key={Item.label}
      href={Item.link}
      label={<Text size="lg">{Item.label}</Text>}
      leftSection={<Item.icon />}
      variant="filled"
      active={Item.link == pathname}
    />
  ));
  //TODO: in production, uncomment contextmenu so that users can't right click the screen and inspect element
  // document.addEventListener("contextmenu", (event) => event.preventDefault());
  //--RET--
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
      zIndex={1000000}
    >
      <AppShell.Header c={"blue"}>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Image src={"logo.png"} width={30} height={30} alt={""} priority />
          <Flex align="center" gap={8}>
            <Title order={2} c="blue">
              Water360
              {/* v{process.env.version} */}
            </Title>
            <Text>v{process.env.version}</Text>
          </Flex>
          <Group justify="end" flex={1}>
            <Tooltip
              pb={11}
              label={
                <div>
                  <Kbd>⌘</Kbd> + <Kbd>R</Kbd>
                </div>
              }
            >
              <ActionIcon
                onClick={() => {
                  router.refresh();
                }}
                variant="default"
                size="lg"
                aria-label="Refresh page"
              >
                <IconReload stroke={1.5} />
              </ActionIcon>
            </Tooltip>
            <ActionIcon
              onClick={() => {
                // updBodyColor();
                setColorScheme(
                  computedColorScheme === "light" ? "dark" : "light"
                );
              }}
              variant="default"
              size="lg"
              aria-label="Toggle color scheme"
            >
              {computedColorScheme === "dark" ? (
                <IconSun stroke={1.5} />
              ) : (
                <IconMoon stroke={1.5} />
              )}
            </ActionIcon>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>
        {/* <AppShell.Section grow>{navLinks.slice(0, -1)}</AppShell.Section>
        <AppShell.Section>{navLinks.at(-1)}</AppShell.Section> */}
        <Space h={"md"} />
        <AppShell.Section grow>
          <Stack>{navLinks}</Stack>
        </AppShell.Section>
        <Divider />
        <AppShell.Section>
          <NavLink
            label={
              <Text size="lg">{connected ? "Connected" : "Not Connected"}</Text>
            }
            // bg={connected ? "green" : "red"}
            leftSection={
              <Indicator
                inline
                processing
                color={connected ? "green" : "red"}
                size={12}
                position="middle-center"
              >
                <Box w={21} />
              </Indicator>
            }
          />
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
