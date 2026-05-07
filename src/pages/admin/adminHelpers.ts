import type { User } from '../../api/types';

export function populatedName(u: string | Partial<User> | null | undefined): string {
  if (u == null) return '—';
  if (typeof u === 'string') return u;
  return u.fullName ?? '—';
}

export function formatMoney(n: number | null | undefined, currency = 'USD'): string {
  if (n == null || Number.isNaN(n)) return '—';
  return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(n);
}

export function formatDate(iso: string | Date | undefined | null): string {
  if (!iso) return '—';
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString();
}

export function formatDateTime(iso: string | Date | undefined | null): string {
  if (!iso) return '—';
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString();
}
