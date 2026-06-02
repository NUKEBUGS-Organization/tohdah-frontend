import { Center, Loader } from '@mantine/core';
import type { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/** Public marketing/auth pages — redirect to app if already signed in. */
export function GuestRoute() {
  const { isLoading, isRestoring, isAuthenticated } = useAuth();

  if (isLoading || isRestoring) {
    return (
      <Center mih="60vh">
        <Loader color="teal" size="md" />
      </Center>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/app/traveler" replace />;
  }

  return <Outlet />;
}

export function ProtectedRoute() {
  const { isLoading, isRestoring, isAuthenticated } = useAuth();

  if (isLoading || isRestoring) {
    return (
      <Center h="100vh">
        <Loader color="teal" size="md" />
      </Center>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export function AdminRoute() {
  const { isLoading, isRestoring, isAuthenticated, user } = useAuth();

  if (isLoading || isRestoring) {
    return (
      <Center h="100vh">
        <Loader color="teal" size="md" />
      </Center>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const role = user?.role ?? 'user';
  if (role !== 'admin' && role !== 'superadmin') {
    return <Navigate to="/app/traveler" replace />;
  }

  return <Outlet />;
}

/** Wrap a single element when you cannot use `<Outlet />` */
export function ProtectedShell({ children }: { children: ReactNode }) {
  const { isLoading, isRestoring, isAuthenticated } = useAuth();
  if (isLoading || isRestoring) {
    return (
      <Center h="100vh">
        <Loader color="teal" size="md" />
      </Center>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
