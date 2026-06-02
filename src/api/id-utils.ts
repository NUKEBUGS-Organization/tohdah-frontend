/** Normalize MongoDB / API ids from strings, ObjectIds, or populated documents. */
export function toId(value: unknown): string {
  if (!value) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    if (obj._id != null) return String(obj._id);
    if (obj.id != null) return String(obj.id);
    if (typeof obj.toString === 'function') {
      const s = obj.toString();
      if (s !== '[object Object]') return s;
    }
  }
  return String(value);
}

export function isSameId(a: unknown, b: unknown): boolean {
  if (!a || !b) return false;
  return toId(a) === toId(b);
}

export function extractField(
  value: unknown,
  field: string,
  fallback = '',
): string {
  if (!value) return fallback;
  if (typeof value === 'string') return fallback;
  const obj = value as Record<string, unknown>;
  const raw = obj[field];
  if (raw == null || raw === '') return fallback;
  return String(raw);
}

export const extractName = (v: unknown) =>
  extractField(v, 'fullName', 'Unknown');

export const extractPhoto = (v: unknown) =>
  extractField(v, 'profilePhoto', '');

export const extractItemName = (v: unknown) =>
  extractField(v, 'itemName', 'Delivery');

export const extractOrigin = (v: unknown) =>
  extractField(v, 'origin', '');

export const extractDestination = (v: unknown) =>
  extractField(v, 'destination', '');
