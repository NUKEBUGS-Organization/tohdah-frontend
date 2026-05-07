import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Center, Loader, Stack, Text } from '@mantine/core';
import { useAuth } from '../context/AuthContext';
import { notify } from '../utils/notify';

export default function GoogleCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { applyTokensFromGoogle } = useAuth();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const isNewUser = searchParams.get('isNewUser') === 'true';

    if (!accessToken || !refreshToken) {
      notify.error('Google sign-in failed. Please try again.');
      navigate('/login', { replace: true });
      return;
    }

    void applyTokensFromGoogle(accessToken, refreshToken, isNewUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once from URL params on mount
  }, []);

  return (
    <Center h="100vh">
      <Stack align="center" gap="md">
        <Loader color="teal" size="lg" />
        <Text c="dimmed">Completing sign in…</Text>
      </Stack>
    </Center>
  );
}
