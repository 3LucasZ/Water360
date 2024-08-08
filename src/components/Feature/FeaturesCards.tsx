import {
  Badge,
  Group,
  Title,
  Text,
  Card,
  SimpleGrid,
  Container,
  rem,
  useMantineTheme,
} from '@mantine/core';
import { IconGauge, IconUser, IconCookie, Icon360, IconView360, IconBolt } from '@tabler/icons-react';
import classes from './FeaturesCards.module.css';

const mockdata = [
  {
    title: 'Stunning quality',
    description:
      'Stitched images at up to 6K resolution and videos at 50 fps.',
    icon: IconView360,
  },
  {
    title: 'Streamlined',
    description:
      'Connect from across the world, capture moments, and export media. All at your fingertips.',
    icon: IconBolt,
  },
  {
    title: 'Feature rich',
    description:
      'Did we mention built-in media viewing, media previewing, and livestreaming to Youtube?',
    icon: IconCookie,
  },
];

export function FeaturesCards() {
  const theme = useMantineTheme();
  const features = mockdata.map((feature) => (
    <Card key={feature.title} shadow="md" radius="md" className={classes.card} padding="xl">
      <feature.icon
        style={{ width: rem(50), height: rem(50) }}
        stroke={2}
        color={theme.colors.blue[6]}
      />
      <Text fz="lg" fw={500} className={classes.cardTitle} mt="md">
        {feature.title}
      </Text>
      <Text fz="sm" c="dimmed" mt="sm">
        {feature.description}
      </Text>
    </Card>
  ));

  return (
    <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
      {features}
    </SimpleGrid>
  );
}