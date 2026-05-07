import {
  Accordion,
  Alert,
  Avatar,
  Button,
  Group,
  Modal,
  Paper,
  Select,
  Stack,
  TagsInput,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useRef, useState } from 'react';
import { api } from '../../../api/client';
import type { ReportData } from '../../../api/services/users.service';
import { usersService } from '../../../api/services/users.service';
import { useAuth } from '../../../context/AuthContext';
import { useApi } from '../../../hooks/useApi';
import { notify } from '../../../utils/notify';

export function SettingsMyProfilePage() {
  const { user, refreshUser } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    initialValues: {
      fullName: '',
      bio: '',
      location: '',
      languages: [] as string[],
      travelPreferences: [] as string[],
    },
  });

  useEffect(() => {
    if (!user) return;
    form.setValues({
      fullName: user.fullName,
      bio: user.bio ?? '',
      location: user.location ?? '',
      languages: user.languages ?? [],
      travelPreferences: user.travelPreferences ?? [],
    });
  }, [user]);

  const uploadAvatar = async (f: File | null) => {
    if (!f) return;
    try {
      const fd = new FormData();
      fd.append('file', f);
      const up = await api.upload<{ url: string }>('/upload/avatar', fd);
      if (!up?.url) throw new Error('Upload failed');
      await usersService.updateProfile({ profilePhoto: up.url });
      await refreshUser();
      notify.success('Photo updated');
    } catch (e) {
      notify.error(e instanceof Error ? e.message : 'Upload failed');
    }
  };

  const save = async () => {
    try {
      await usersService.updateProfile({
        fullName: form.values.fullName.trim(),
        bio: form.values.bio.trim() || undefined,
        location: form.values.location.trim() || undefined,
        languages: form.values.languages.length ? form.values.languages : undefined,
        travelPreferences: form.values.travelPreferences.length ? form.values.travelPreferences : undefined,
      });
      await refreshUser();
      notify.success('Profile saved');
    } catch (e) {
      notify.error(e instanceof Error ? e.message : 'Save failed');
    }
  };

  return (
    <Stack maw={640}>
      <Title order={2}>My profile</Title>
      <Group>
        <Avatar src={user?.profilePhoto ?? undefined} size={72} radius={999}>
          {user?.fullName?.charAt(0)}
        </Avatar>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => void uploadAvatar(e.target.files?.[0] ?? null)}
        />
        <Button variant="light" onClick={() => fileRef.current?.click()}>
          Change photo
        </Button>
      </Group>
      <TextInput label="Full name" {...form.getInputProps('fullName')} />
      <Textarea label="Bio" {...form.getInputProps('bio')} />
      <TextInput label="Location" {...form.getInputProps('location')} />
      <TagsInput label="Languages" {...form.getInputProps('languages')} />
      <TagsInput label="Travel preferences" {...form.getInputProps('travelPreferences')} />
      <Button onClick={() => void save()}>Save profile</Button>
    </Stack>
  );
}

export function SettingsSecurityPage() {
  const { logout } = useAuth();
  const [activeSessions, setActiveSessions] = useState<number | null>(null);
  const form = useForm({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  useEffect(() => {
    void usersService
      .getActiveSessions()
      .then((r) => setActiveSessions(r.activeSessions))
      .catch(() => setActiveSessions(0));
  }, []);

  const revokeAllDevices = async () => {
    try {
      await usersService.revokeAllSessions();
      notify.success('Signed out on all devices');
      await logout();
    } catch (e) {
      notify.error(e instanceof Error ? e.message : 'Could not revoke sessions');
    }
  };

  const submit = async () => {
    try {
      await usersService.changePassword({
        currentPassword: form.values.currentPassword,
        newPassword: form.values.newPassword,
        confirmNewPassword: form.values.confirmNewPassword,
      });
      notify.success('Password updated — signing you out');
      await logout();
    } catch (e) {
      notify.error(e instanceof Error ? e.message : 'Could not update password');
    }
  };

  return (
    <Stack maw={480}>
      <Title order={2}>Security</Title>
      <PasswordFields form={form} />
      <Button onClick={() => void submit()}>Change password</Button>
      <Paper withBorder p="md" mt="lg">
        <Text fw={700} mb="xs">
          Active sessions
        </Text>
        <Text fz="sm" c="dimmed" mb="md">
          {activeSessions === null
            ? 'Loading…'
            : `You have ${activeSessions} active session${activeSessions === 1 ? '' : 's'} across devices.`}
        </Text>
        <Button color="red" variant="light" onClick={() => void revokeAllDevices()}>
          Sign out of all devices
        </Button>
      </Paper>
    </Stack>
  );
}

function PasswordFields({
  form,
}: {
  form: ReturnType<
    typeof useForm<{ currentPassword: string; newPassword: string; confirmNewPassword: string }>
  >;
}) {
  return (
    <>
      <TextInput type="password" label="Current password" {...form.getInputProps('currentPassword')} />
      <TextInput type="password" label="New password" {...form.getInputProps('newPassword')} />
      <TextInput type="password" label="Confirm new password" {...form.getInputProps('confirmNewPassword')} />
    </>
  );
}

export function SettingsPrivacyPage() {
  const { data: blocked, refetch } = useApi(() => usersService.getBlocked(), []);
  const [opened, { open, close }] = useDisclosure(false);
  const reportForm = useForm<ReportData>({
    initialValues: {
      targetUserId: '',
      reason: 'spam',
      description: '',
    },
  });

  const unblock = async (userId: string) => {
    try {
      await usersService.unblock(userId);
      notify.success('Unblocked');
      void refetch();
    } catch (e) {
      notify.error(e instanceof Error ? e.message : 'Failed');
    }
  };

  const submitReport = async () => {
    if (!reportForm.values.targetUserId.trim()) {
      notify.error('Enter target user id');
      return;
    }
    try {
      await usersService.report({
        targetUserId: reportForm.values.targetUserId.trim(),
        reason: reportForm.values.reason as ReportData['reason'],
        description: (reportForm.values.description ?? '').trim() || undefined,
      });
      notify.success('Report submitted');
      close();
    } catch (e) {
      notify.error(e instanceof Error ? e.message : 'Failed');
    }
  };

  return (
    <Stack maw={720}>
      <Title order={2}>Safety & privacy</Title>
      <Paper withBorder p="md">
        <Text fw={700} mb="sm">
          Blocked users
        </Text>
        {(blocked ?? []).length === 0 ? (
          <Text fz={14} c="dimmed">
            Nobody blocked.
          </Text>
        ) : (
          <Stack gap="xs">
            {(blocked ?? []).map((u) => (
              <Group key={u.id} justify="space-between">
                <Text>{u.fullName}</Text>
                <Button size="xs" variant="light" onClick={() => void unblock(u.id)}>
                  Unblock
                </Button>
              </Group>
            ))}
          </Stack>
        )}
      </Paper>
      <Button variant="outline" onClick={open}>
        Report a user
      </Button>
      <Modal opened={opened} onClose={close} title="Report user">
        <Stack gap="sm">
          <TextInput label="Target user ID" {...reportForm.getInputProps('targetUserId')} />
          <Select
            label="Reason"
            data={[
              { value: 'spam', label: 'Spam' },
              { value: 'fraud', label: 'Fraud' },
              { value: 'harassment', label: 'Harassment' },
              { value: 'fake_profile', label: 'Fake profile' },
              { value: 'other', label: 'Other' },
            ]}
            {...reportForm.getInputProps('reason')}
          />
          <Textarea label="Details" {...reportForm.getInputProps('description')} />
          <Button onClick={() => void submitReport()}>Submit report</Button>
        </Stack>
      </Modal>
    </Stack>
  );
}

export function SettingsHelpCenterPage() {
  return (
    <Stack maw={720}>
      <Title order={2}>Help center</Title>
      <Accordion variant="separated">
        <Accordion.Item value="start">
          <Accordion.Control>Getting started</Accordion.Control>
          <Accordion.Panel>
            Post a trip or a request, match, pay in escrow, then track delivery in real time.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="pay">
          <Accordion.Control>Payments</Accordion.Control>
          <Accordion.Panel>
            Payments are processed through a secure stub in development. Production will use a licensed provider.
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
}

export function SettingsHelpTicketsPage() {
  return (
    <Stack>
      <Title order={2}>Support tickets</Title>
      <Text c="dimmed">Ticketing integration is not connected yet.</Text>
    </Stack>
  );
}

export function SettingsHelpCommunityPage() {
  return (
    <Stack>
      <Title order={2}>Community</Title>
      <Text c="dimmed">Community highlights will appear here.</Text>
    </Stack>
  );
}

export function SettingsHelpContactPage() {
  const send = () => {
    notify.info('Message recorded locally — email integration is Phase 3.', 'Contact');
  };

  return (
    <Stack maw={560}>
      <Title order={2}>Contact us</Title>
      <Textarea label="How can we help?" minRows={4} />
      <Button onClick={send}>Send</Button>
      <Alert color="gray">This form confirms receipt in-app only until SMTP is configured.</Alert>
    </Stack>
  );
}
