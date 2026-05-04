const base = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export async function registerUser(payload: {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
}) {
  const res = await fetch(`${base}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      typeof data?.message === 'string'
        ? data.message
        : Array.isArray(data?.message)
          ? data.message.join(', ')
          : `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data as {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
  };
}
