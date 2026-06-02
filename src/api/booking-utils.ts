import type { Booking, PaginatedResponse } from './types';
import {
  extractDestination,
  extractItemName,
  extractName,
  extractOrigin,
  isSameId,
  toId,
} from './id-utils';

/** @deprecated Use `toId` from `./id-utils` */
export function normalizeMongoId(value: unknown): string {
  return toId(value);
}

/** Resolve request id on a booking (string or populated request). */
export function bookingRequestId(booking: Booking): string {
  return toId(booking.requestId);
}

export function findBookingForRequest(
  bookings: Booking[],
  requestId: string,
): Booking | null {
  const target = toId(requestId);
  if (!target) return null;
  return bookings.find((b) => bookingRequestId(b) === target) ?? null;
}

/** Resolve Mongo/user id from a booking party field (string or populated user). */
export function bookingPartyId(
  party: string | { id?: string; _id?: string } | null | undefined,
): string {
  return toId(party);
}

export function isTravelerBooking(booking: Booking, travelerUserId: string): boolean {
  return isSameId(booking.travelerId, travelerUserId);
}

export const INCOMING_BOOKING_STATUSES = new Set<Booking['status']>([
  'pending_acceptance',
  'countered',
]);

export const ACTIVE_DELIVERY_STATUSES = new Set<Booking['status']>([
  'confirmed',
  'paid',
  'in_transit',
  'delivered',
]);

export function filterTravelerBookings(
  bookings: Booking[],
  travelerUserId: string,
): Booking[] {
  return bookings.filter((b) => isTravelerBooking(b, travelerUserId));
}

export function paginateBookings(
  bookings: Booking[],
  limit = 50,
): PaginatedResponse<Booking> {
  return {
    data: bookings.slice(0, limit),
    total: bookings.length,
    page: 1,
    limit,
  };
}

/** Rows from paginated API or legacy array responses. */
export function paginatedRows<T>(
  page: PaginatedResponse<T> | T[] | null | undefined,
): T[] {
  if (!page) return [];
  if (Array.isArray(page)) return page;
  return page.data ?? [];
}

export function paginatedTotal<T>(
  page: PaginatedResponse<T> | T[] | null | undefined,
): number {
  if (!page) return 0;
  if (Array.isArray(page)) return page.length;
  return page.total ?? page.data?.length ?? 0;
}

export function bookingItemName(booking: Booking): string {
  return extractItemName(booking.requestId);
}

export function bookingRouteLabel(booking: Booking): string {
  const reqOrigin = extractOrigin(booking.requestId);
  const reqDest = extractDestination(booking.requestId);
  if (reqOrigin && reqDest) return `${reqOrigin} → ${reqDest}`;
  const tripOrigin = extractOrigin(booking.tripId);
  const tripDest = extractDestination(booking.tripId);
  if (tripOrigin && tripDest) return `${tripOrigin} → ${tripDest}`;
  return '';
}

export function bookingPartyName(
  party: Booking['requesterId'] | Booking['travelerId'],
  fallback: string,
): string {
  if (!party || typeof party === 'string') return fallback;
  return extractName(party) === 'Unknown' ? fallback : extractName(party);
}

export function bookingDocId(booking: Booking): string {
  return toId(booking._id);
}

/** Seven-step delivery timeline from booking status. */
export function bookingTimelineSteps(booking: Booking): { label: string; done: boolean }[] {
  const s = booking.status;
  const paid = ['paid', 'in_transit', 'delivered', 'completed'].includes(s);
  return [
    { label: 'Requested', done: true },
    {
      label: 'Accepted',
      done: !['pending_acceptance', 'countered', 'cancelled'].includes(s),
    },
    {
      label: 'Confirmed',
      done: ['confirmed', 'paid', 'in_transit', 'delivered', 'completed'].includes(s),
    },
    { label: 'Paid', done: paid },
    {
      label: 'In transit',
      done: ['in_transit', 'delivered', 'completed'].includes(s),
    },
    { label: 'Delivered', done: ['delivered', 'completed'].includes(s) },
    { label: 'Completed', done: s === 'completed' },
  ];
}
