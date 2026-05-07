import { Box, SimpleGrid, Stack, Text, ThemeIcon, UnstyledButton } from '@mantine/core';
import {
  IconPackage,
  IconPlaneTilt,
  IconRoute,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { api, ApiRequestError } from '../../api/client';
import type { OnboardingStepResponse } from '../../api/types';
import { useAuth } from '../../context/AuthContext';
import { notify } from '../../utils/notify';
import { colors } from '../../theme';
import { OnboardingChrome } from './OnboardingChrome';

const cards = [
  {
    title: 'Post a Request',
    body: 'Describe what you need delivered and when.',
    icon: IconPackage,
  },
  {
    title: 'Find a Traveler',
    body: 'Match with verified travelers already flying your route.',
    icon: IconRoute,
  },
  {
    title: 'Get it Delivered',
    body: 'Track handoffs and release payment when it arrives safely.',
    icon: IconPlaneTilt,
  },
] as const;

export function OnboardingStep1Page() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const completeStep1 = async () => {
    try {
      const res = await api.post<OnboardingStepResponse>('/onboarding/step', { step: 1 });
      if (!res) return;
      await refreshUser();
      navigate('/onboarding/step-2');
    } catch (e) {
      const msg =
        e instanceof ApiRequestError ? e.message : e instanceof Error ? e.message : 'Could not save progress';
      notify.error(msg);
    }
  };

  return (
    <OnboardingChrome
      step={1}
      title="Here's how Tohdah works."
      subtitle="Three simple steps connect senders and travelers worldwide."
      onNext={completeStep1}
      nextLabel="Next"
    >
      <Stack gap="xl">
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <Box
                key={c.title}
                p="xl"
                style={{
                  borderRadius: 12,
                  border: `1px solid ${colors.border}`,
                  background: 'white',
                  textAlign: 'center',
                  boxShadow: '0 4px 20px rgba(8,21,52,0.06)',
                }}
              >
                <ThemeIcon
                  size={56}
                  radius="md"
                  variant="gradient"
                  gradient={{ from: colors.gradientFrom, to: colors.gradientTo, deg: 135 }}
                  mx="auto"
                  mb="md"
                >
                  <Icon size={28} stroke={1.5} />
                </ThemeIcon>
                <Text fw={700} fz={17} c={colors.navyDeep} mb="xs">
                  {c.title}
                </Text>
                <Text fz={14} c={colors.mutedText} lh={1.55}>
                  {c.body}
                </Text>
              </Box>
            );
          })}
        </SimpleGrid>

        <UnstyledButton w="100%">
          <Box
            h={{ base: 160, sm: 220 }}
            style={{
              borderRadius: 16,
              overflow: 'hidden',
              background:
                'linear-gradient(180deg, rgba(8,21,52,0.06) 0%, rgba(0,201,167,0.08) 100%), url(https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: `1px solid ${colors.border}`,
            }}
          />
        </UnstyledButton>
      </Stack>
    </OnboardingChrome>
  );
}
