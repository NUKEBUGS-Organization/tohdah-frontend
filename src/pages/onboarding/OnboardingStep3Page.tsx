import { Box, SimpleGrid, Stack, Text, UnstyledButton } from '@mantine/core';
import {
  IconArrowsExchange,
  IconPlaneDeparture,
  IconShoppingBag,
} from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, ApiRequestError } from '../../api/client';
import type { OnboardingStepResponse } from '../../api/types';
import { useAuth } from '../../context/AuthContext';
import { notify } from '../../utils/notify';
import { colors } from '../../theme';
import { OnboardingChrome } from './OnboardingChrome';

const roles = [
  {
    key: 'traveler',
    apiType: 'traveler' as const,
    title: 'Traveler',
    body: 'I want to earn money while traveling.',
    icon: IconPlaneDeparture,
  },
  {
    key: 'sender',
    apiType: 'requester' as const,
    title: 'Sender',
    body: 'I want to get items delivered.',
    icon: IconShoppingBag,
  },
  {
    key: 'both',
    apiType: 'both' as const,
    title: 'Both',
    body: 'I want to do both.',
    icon: IconArrowsExchange,
  },
] as const;

export function OnboardingStep3Page() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [selected, setSelected] = useState<string | null>('traveler');

  const completeStep3 = async () => {
    const role = roles.find((r) => r.key === selected);
    if (!role) {
      notify.error('Choose how you will use Tohdah');
      return;
    }
    try {
      const res = await api.post<OnboardingStepResponse>('/onboarding/step', {
        step: 3,
        accountType: role.apiType,
      });
      if (!res) return;
      await refreshUser();
      navigate('/onboarding/profile');
    } catch (e) {
      const msg =
        e instanceof ApiRequestError ? e.message : e instanceof Error ? e.message : 'Could not save progress';
      notify.error(msg);
    }
  };

  return (
    <OnboardingChrome
      step={3}
      title="How will you use Tohdah?"
      subtitle="Choose what fits today—you can switch anytime in settings."
      prevTo="/onboarding/step-2"
      onNext={completeStep3}
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
