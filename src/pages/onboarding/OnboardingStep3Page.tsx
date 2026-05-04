import { Box, SimpleGrid, Stack, Text, UnstyledButton } from '@mantine/core';
import {
  IconArrowsExchange,
  IconPlaneDeparture,
  IconShoppingBag,
} from '@tabler/icons-react';
import { useState } from 'react';
import { colors } from '../../theme';
import { OnboardingChrome } from './OnboardingChrome';

const roles = [
  {
    key: 'traveler',
    title: 'Traveler',
    body: 'I want to earn money while traveling.',
    icon: IconPlaneDeparture,
  },
  {
    key: 'sender',
    title: 'Sender',
    body: 'I want to get items delivered.',
    icon: IconShoppingBag,
  },
  {
    key: 'both',
    title: 'Both',
    body: 'I want to do both.',
    icon: IconArrowsExchange,
  },
] as const;

export function OnboardingStep3Page() {
  const [selected, setSelected] = useState<string | null>('traveler');

  return (
    <OnboardingChrome
      step={3}
      title="How will you use Tohdah?"
      subtitle="Choose what fits today—you can switch anytime in settings."
      prevTo="/onboarding/step-2"
      nextTo="/onboarding/profile"
      nextLabel="Next"
    >
      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
        {roles.map((r) => {
          const active = selected === r.key;
          const Icon = r.icon;
          return (
            <UnstyledButton key={r.key} onClick={() => setSelected(r.key)}>
              <Box
                p="xl"
                style={{
                  borderRadius: 12,
                  border: `2px solid ${active ? colors.gradientFrom : colors.border}`,
                  background: active ? 'rgba(0,201,167,0.06)' : 'white',
                  minHeight: 200,
                  textAlign: 'center',
                  boxShadow: active
                    ? '0 8px 24px rgba(0,201,167,0.15)'
                    : '0 2px 12px rgba(8,21,52,0.06)',
                }}
              >
                <Stack align="center" gap="md">
                  <Box
                    w={64}
                    h={64}
                    style={{
                      borderRadius: 999,
                      background: active
                        ? `linear-gradient(135deg, ${colors.gradientFrom}, ${colors.gradientTo})`
                        : '#eef0f7',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <Icon size={28} color={active ? 'white' : colors.navyDeep} stroke={1.5} />
                  </Box>
                  <Text fw={700} fz={18} c={colors.navyDeep}>
                    {r.title}
                  </Text>
                  <Text fz={14} c={colors.mutedText} lh={1.5}>
                    {r.body}
                  </Text>
                </Stack>
              </Box>
            </UnstyledButton>
          );
        })}
      </SimpleGrid>
    </OnboardingChrome>
  );
}
