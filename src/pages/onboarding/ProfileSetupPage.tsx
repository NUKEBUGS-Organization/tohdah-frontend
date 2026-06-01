import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Group,
  Stack,
  Stepper,
  TagsInput,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconMapPin, IconPlus, IconUser } from '@tabler/icons-react';
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, ApiRequestError } from '../../api/client';
import type { OnboardingStepResponse, User } from '../../api/types';
import { useAuth } from '../../context/AuthContext';
import { notify } from '../../utils/notify';
import { colors } from '../../theme';

function appHomeForUser(u: Pick<User, 'accountType'>): string {
  if (u.accountType === 'requester') return '/app/requester';
  return '/app/traveler';
}

export function ProfileSetupPage() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(user?.profilePhoto ?? null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm({
    initialValues: {
      fullName: user?.fullName ?? '',
      bio: user?.bio ?? '',
      location: user?.location ?? '',
      languages: user?.languages?.length ? user.languages : ([] as string[]),
      travelPreferences: user?.travelPreferences?.length ? user.travelPreferences : ([] as string[]),
    },
    validate: {
      fullName: (v) => (v.trim().length < 2 ? 'Enter your full name' : null),
    },
  });

  const onPickPhoto = (file: File | null) => {
    setPhotoFile(file);
    if (!file) {
      setPhotoPreview(user?.profilePhoto ?? null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
  };

  const handleSubmit = form.onSubmit(async (values) => {
    setSubmitting(true);
    try {
      let profilePhotoUrl: string | null = user?.profilePhoto ?? null;
      if (photoFile) {
        const fd = new FormData();
        fd.append('file', photoFile);
        const up = await api.upload<{ url: string }>('/upload/avatar', fd);
        if (!up?.url) {
          notify.error('Photo upload failed');
          return;
        }
        profilePhotoUrl = up.url;
      }

      const res = await api.post<OnboardingStepResponse>('/onboarding/step', {
        step: 4,
        fullName: values.fullName.trim(),
        bio: values.bio.trim() || undefined,
        location: values.location.trim() || undefined,
        profilePhoto: profilePhotoUrl ?? undefined,
        languages: values.languages.length ? values.languages : undefined,
        travelPreferences: values.travelPreferences.length ? values.travelPreferences : undefined,
      });
      if (!res) return;
      await refreshUser();
      notify.success('Profile saved. Welcome to Tohdah!');
      navigate(appHomeForUser(res.user), { replace: true });
    } catch (e) {
      const msg =
        e instanceof ApiRequestError ? e.message : e instanceof Error ? e.message : 'Could not save profile';
      notify.error(msg);
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Box component="form" onSubmit={handleSubmit} mih="100vh" bg="#f8fafc" py={40} px={24}>
      <Stack maw={900} mx="auto" gap="xl">
        <Stepper active={3} size="sm" color="brandTeal">
          <Stepper.Step label="Intro" description="How it works" />
          <Stepper.Step label="Safety" description="Trust & pay" />
          <Stepper.Step label="Role" description="Travel or send" />
          <Stepper.Step label="Profile" description="About you" />
        </Stepper>

        <Text fw={800} fz={{ base: 24, sm: 28 }} c={colors.navyDeep}>
          Complete Your Profile.
        </Text>
        <Text c={colors.mutedText} mt={-8}>
          This helps us verify your account and personalize matches.
        </Text>

        <Group align="flex-start" wrap="wrap" gap="xl">
          <Stack align="center" miw={200}>
            <Box pos="relative" style={{ width: 'fit-content' }}>
              <Avatar size={140} radius={999} src={photoPreview ?? undefined} color="gray.3">
                {!photoPreview ? (
                  <Text c="dimmed" fz={12}>
                    Photo
                  </Text>
                ) : null}
              </Avatar>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                style={{ display: 'none' }}
                onChange={(ev) => onPickPhoto(ev.target.files?.[0] ?? null)}
              />
              <ActionIcon
                pos="absolute"
                bottom={4}
                right={4}
                radius="xl"
                size="lg"
                variant="filled"
                color="brandTeal"
                aria-label="Upload photo"
                type="button"
                onClick={() => fileRef.current?.click()}
              >
                <IconPlus size={18} />
              </ActionIcon>
            </Box>
            <Text fz={13} c={colors.subtleText} ta="center">
              JPG, PNG, or Webp (server limit applies)
            </Text>
          </Stack>

          <Stack gap="md" style={{ flex: 1, minWidth: 280 }}>
            <TextInput
              label="Full name"
              leftSection={<IconUser size={16} stroke={1.5} />}
              leftSectionPointerEvents="none"
              styles={{ input: { borderColor: colors.border } }}
              {...form.getInputProps('fullName')}
            />
            <Textarea
              label="Bio"
              placeholder="A short intro"
              minRows={3}
              styles={{ input: { borderColor: colors.border } }}
              {...form.getInputProps('bio')}
            />
            <TextInput
              label="Location"
              placeholder="City, country"
              leftSection={<IconMapPin size={16} stroke={1.5} />}
              leftSectionPointerEvents="none"
              styles={{ input: { borderColor: colors.border } }}
              {...form.getInputProps('location')}
            />
            <TagsInput
              label="Languages"
              placeholder="Type and press Enter"
              styles={{ input: { borderColor: colors.border } }}
              {...form.getInputProps('languages')}
            />
            <TagsInput
              label="Travel preferences"
              placeholder="e.g. carry-on only, flexible dates"
              styles={{ input: { borderColor: colors.border } }}
              {...form.getInputProps('travelPreferences')}
            />
          </Stack>
        </Group>

        <Group justify="space-between" mt="md" wrap="wrap">
          <Button component={Link} to="/onboarding/step-3" variant="default">
            Back
          </Button>
          <Button
            type="submit"
            size="md"
            px={32}
            loading={submitting}
            styles={{
              root: {
                background: `linear-gradient(134deg, ${colors.gradientFrom}, ${colors.gradientTo})`,
                border: 'none',
              },
            }}
          >
            Save and Continue
          </Button>
        </Group>
      </Stack>
    </Box>
  );
}
