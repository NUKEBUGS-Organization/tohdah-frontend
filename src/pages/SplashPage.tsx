import { Box, Button, Center, Group, Image, Stack, Text, Title, UnstyledButton } from '@mantine/core';
import { IconArrowRight, IconBrandFacebook, IconBrandInstagram, IconBrandX } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { splashAssets } from '../figma/splashAssets';
import { colors } from '../theme';

export function SplashPage() {
  return (
    <Box
      pos="relative"
      mih="100vh"
      py={{ base: 100, sm: 140 }}
      px={24}
      style={{
        backgroundColor: colors.navyDeep,
        backgroundImage: `
          radial-gradient(circle at 0% 0%, rgba(0,201,167,0.12) 0%, transparent 50%),
          radial-gradient(circle at 100% 100%, rgba(45,134,255,0.12) 0%, transparent 50%)
        `,
      }}
    >
      <Box
        pos="absolute"
        inset={0}
        opacity={0.2}
        style={{
          pointerEvents: 'none',
          mixBlendMode: 'soft-light',
          backgroundImage: `url(${splashAssets.mapTexture})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <Stack align="center" gap={0} pos="relative" maw={672} mx="auto">
        <Box mb={40}>
          <Image
            src={splashAssets.logo}
            alt="Tohdah"
            w={96}
            h={96}
            radius="md"
            style={{
              boxShadow: '0 25px 25px rgba(0,0,0,0.15)',
            }}
          />
        </Box>

        <Stack align="center" gap={20} mb={40}>
          <Title
            order={1}
            ta="center"
            c="white"
            fz={{ base: 30, sm: 40 }}
            fw={700}
            lts={-0.5}
            lh={1.15}
          >
            Turn travel into opportunity
          </Title>
          <Text
            ta="center"
            c={colors.slate}
            fz={{ base: 15, sm: 17 }}
            lh={1.65}
            maw={480}
          >
            Earn money while you travel or get your items delivered quickly and safely.
          </Text>
        </Stack>

        <Group gap={16} justify="center" wrap="wrap">
          <Button
            component={Link}
            to="/signup"
            size="lg"
            radius="xl"
            w={{ base: '100%', xs: 200 }}
            rightSection={<IconArrowRight size={18} />}
            styles={{
              root: {
                background: `linear-gradient(90deg, ${colors.gradientFrom}, ${colors.gradientTo})`,
                border: 'none',
                boxShadow:
                  '0 10px 15px -3px rgba(20,184,166,0.25), 0 4px 6px -4px rgba(20,184,166,0.2)',
              },
            }}
          >
            Get Started
          </Button>
          <Button
            component={Link}
            to="/login"
            variant="default"
            size="lg"
            radius="xl"
            w={{ base: '100%', xs: 200 }}
            styles={{
              root: {
                background: 'rgba(255,255,255,0.05)',
                border: '2px solid rgba(255,255,255,0.35)',
                color: 'white',
                backdropFilter: 'blur(2px)',
              },
            }}
          >
            Login
          </Button>
        </Group>

        <Center mt={{ base: 72, sm: 96 }}>
          <Group gap={20}>
            <UnstyledButton aria-label="Instagram">
              <IconBrandInstagram size={22} color="rgba(255,255,255,0.55)" />
            </UnstyledButton>
            <UnstyledButton aria-label="Facebook">
              <IconBrandFacebook size={22} color="rgba(255,255,255,0.55)" />
            </UnstyledButton>
            <UnstyledButton aria-label="X">
              <IconBrandX size={20} color="rgba(255,255,255,0.55)" />
            </UnstyledButton>
          </Group>
        </Center>
      </Stack>
    </Box>
  );
}
