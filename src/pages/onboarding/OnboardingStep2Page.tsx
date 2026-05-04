import { Box, Group, SimpleGrid, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { colors } from '../../theme';
import { OnboardingChrome } from './OnboardingChrome';

const leftBullets = [
  'Government ID and phone verification',
  'Community ratings on every trip',
  'Report safety issues in one tap',
];

const rightBullets = [
  'Escrow holds funds until delivery proof',
  'Optional shipment insurance',
  'Dispute flow with platform support',
];

export function OnboardingStep2Page() {
  return (
    <OnboardingChrome
      step={2}
      title="Safety comes first."
      subtitle="We combine verified identities with secure payments so both sides can trust the journey."
      prevTo="/onboarding/step-1"
      nextTo="/onboarding/step-3"
      nextLabel="Next"
      actionsJustify="flex-end"
    >
      <Stack gap="xl">
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
          <Stack gap="md">
            <Text fw={700} fz={18} c={colors.navyDeep}>
              Trusted Travelers
            </Text>
            <Stack gap="sm">
              {leftBullets.map((t) => (
                <Group key={t} gap="sm" align="flex-start" wrap="nowrap">
                  <ThemeIcon size={28} radius="xl" color="teal" variant="light">
                    <IconCheck size={16} stroke={2.5} />
                  </ThemeIcon>
                  <Text fz={14} c={colors.mutedText} lh={1.6}>
                    {t}
                  </Text>
                </Group>
              ))}
            </Stack>
          </Stack>
          <Stack gap="md">
            <Text fw={700} fz={18} c={colors.navyDeep}>
              Secure Payments
            </Text>
            <Stack gap="sm">
              {rightBullets.map((t) => (
                <Group key={t} gap="sm" align="flex-start" wrap="nowrap">
                  <ThemeIcon size={28} radius="xl" color="blue" variant="light">
                    <IconCheck size={16} stroke={2.5} />
                  </ThemeIcon>
                  <Text fz={14} c={colors.mutedText} lh={1.6}>
                    {t}
                  </Text>
                </Group>
              ))}
            </Stack>
          </Stack>
        </SimpleGrid>

        <Box
          h={{ base: 160, sm: 200 }}
          style={{
            borderRadius: 16,
            overflow: 'hidden',
            background:
              'linear-gradient(180deg, rgba(8,21,52,0.05) 0%, transparent 50%), url(https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: `1px solid ${colors.border}`,
          }}
        />
      </Stack>
    </OnboardingChrome>
  );
}
