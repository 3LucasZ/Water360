import { Title, Text, Button, Container } from '@mantine/core';
import { Dots } from './Dots';
import classes from './HeroText.module.css';

export function HeroText() {
  return (
    <Container className={classes.wrapper} size={1400}>
      <Dots className={classes.dots} style={{ left: 0, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 60, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 0, top: 140 }} />
      <Dots className={classes.dots} style={{ right: 0, top: 60 }} />

      <div className={classes.inner}>
        <Title className={classes.title}>
          Seamless {' '}
          <Text component="span" className={classes.highlight} inherit>
            360 Camera
          </Text>{' '}
          Remote Control
        </Title>

        <Container p={0} size={600}>
          <Text size="lg" c="dimmed" className={classes.description}>
            Take beautiful, high quality 360 images and video whether its under the ocean or across the world.
          </Text>
        </Container>

        <div className={classes.controls}>
          <Button className={classes.control} size="lg" variant="default" color="gray" >
            Setup
          </Button>
          <Button className={classes.control} size="lg">
            Get started
          </Button>
        </div>
      </div>
    </Container>
  );
}