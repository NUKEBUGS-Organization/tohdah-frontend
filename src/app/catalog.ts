/** All in-app screens mapped from Figma frames (paths relative to `/app`). */
export type AppScreenMeta = {
  path: string;
  title: string;
  description?: string;
};

export const APP_SCREEN_CATALOG: AppScreenMeta[] = [
  { path: 'traveler/trips/new', title: 'Post a New Trip' },
  { path: 'traveler/social-impact', title: 'Social Impact Opt-in' },
  { path: 'traveler/trips/review', title: 'Review Your Trip' },
  { path: 'traveler/trips', title: 'My Trips' },
  { path: 'traveler/trips/detail', title: 'Trip Details' },
  { path: 'traveler/trips/edit', title: 'Edit Trip & Cancellation' },
  { path: 'traveler/matches/detail', title: 'Trip Match Details' },
  { path: 'traveler/browse/requests', title: 'Browse Requests' },
  { path: 'traveler/payouts', title: 'Traveler Payouts' },
  { path: 'requester/select-type', title: 'Select Request Type' },
  { path: 'requester/support/new', title: 'Post Support Request' },
  { path: 'requester/delivery/new', title: 'Post Delivery Request' },
  { path: 'requester/requests/review', title: 'Review Request' },
  { path: 'requester/requests', title: 'My Requests' },
  { path: 'requester/requests/detail', title: 'Request Details' },
  { path: 'requester/requests/edit', title: 'Edit Request' },
  { path: 'requester/browse/trips', title: 'Browse Trips' },
  { path: 'requester/matches/detail', title: 'Request Match Details' },
  { path: 'booking/confirm', title: 'Booking Confirmation' },
  { path: 'booking/receipt', title: 'Booking Summary & Receipt' },
  { path: 'bookings', title: 'My Bookings' },
  { path: 'checkout', title: 'Secure Checkout' },
  { path: 'wallet/history', title: 'Transaction History' },
  { path: 'wallet/payment-methods', title: 'Payment Methods' },
  { path: 'wallet/community', title: 'Community Support Wallet' },
  { path: 'tracking/live', title: 'Live Delivery Tracking' },
  { path: 'tracking/completed', title: 'Delivery Completed' },
  { path: 'tracking', title: 'Delivery Tracking' },
  { path: 'tracking/pod', title: 'Proof of Delivery' },
  { path: 'chat', title: 'Chat Inbox' },
  { path: 'chat/thread', title: 'Active Chat Thread' },
  { path: 'settings/notifications', title: 'Notification Preferences' },
  { path: 'settings/my-profile', title: 'My Profile (Account)' },
  { path: 'settings/security', title: 'Account Security' },
  { path: 'settings/privacy', title: 'Safety & Privacy Settings' },
  { path: 'settings/help-center', title: 'Help & Support Center' },
  { path: 'settings/help-tickets', title: 'My Support Tickets' },
  { path: 'settings/help-community', title: 'Help — Community' },
  { path: 'settings/help-contact', title: 'Help — Contact Us' },
  { path: 'notifications', title: 'Notifications Center' },
  { path: 'profile/badge', title: 'Community Champion Badge' },
  { path: 'reviews/new', title: 'Review Submission' },
  { path: 'profile/public', title: 'Public Profile' },
  { path: 'trust-score', title: 'Build Your Trust Score' },
];

export function groupCatalogBySection(items: AppScreenMeta[]) {
  const map = new Map<string, AppScreenMeta[]>();
  for (const item of items) {
    const section = item.path.split('/')[0] ?? 'other';
    const arr = map.get(section) ?? [];
    arr.push(item);
    map.set(section, arr);
  }
  return map;
}
