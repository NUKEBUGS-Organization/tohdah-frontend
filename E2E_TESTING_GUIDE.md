# Tohdah — End-to-End Testing Guide

## Prerequisites

- Backend running at `http://localhost:3000` (REST under `/api/v1`; set `VITE_API_BASE_URL=http://localhost:3000/api/v1`)
- MongoDB running and connected
- Admin seeded: from `tohdah-backend/`, run  
  `npx ts-node -r tsconfig-paths/register src/scripts/seed-admin.ts`  
  (or `npx ts-node src/scripts/seed-admin.ts` if paths resolve without `tsconfig-paths`)
- Frontend running at `http://localhost:5173`
- Two browser sessions recommended (one per role)

## Test Accounts to Create

Set up these accounts before running journeys (password suggestions; adjust if your policy differs):

- `traveler@test.com` / `Test1234!` — account type: **traveler**
- `requester@test.com` / `Test1234!` — account type: **requester**
- `admin@tohdah.com` / `AdminTohdah2025!` — role: **admin** (pre-seeded via script above)

## Journey 1 — Registration + Onboarding

1. Open the app → **Sign up** with email, password, name, phone, and account type.
2. Complete **OTP** step using the code from email when Resend is configured (forgot-password no longer returns OTP in JSON).
3. Walk through **onboarding steps 1–4** (profile basics, account type if applicable, preferences).
4. Finish **profile setup** until the app routes to the traveler or requester home.

**Expected:** User document has `onboardingCompleted: true`, `accountType` set, and optional fields saved.

**MongoDB:** `db.users.findOne({ email: "<your-email>" })` — verify `onboardingCompleted`, `accountType`, `isEmailVerified` as applicable.

## Journey 2 — Traveler Posts a Trip

1. Log in as traveler → **Create trip** flow: dates, route, luggage, categories, pricing.
2. Complete **social impact** opt-in if shown.
3. **Preview** → **Publish**.

**Expected:** Trip appears under **My Trips** with status `active`.

**MongoDB:** `db.trips.find({ travelerId: ObjectId("...") }).pretty()` — confirm `status: "active"`.

## Journey 3 — Requester Posts a Request

1. Log in as requester → **Post request** (standard or support).
2. Fill item, route, deadline, budget → submit.

**Expected:** Request listed under **My Requests** with expected `type` and `status: "pending"` (or workflow-specific status).

**MongoDB:** `db.requests.find({ requesterId: ObjectId("...") })` — compare `type: "standard"` vs `type: "support"` and `adminApprovalStatus` for support.

## Journey 4 — Matching

1. As **requester**, **Browse trips** → pick a trip → open match modal → set item/fee → **Send request** (`POST /bookings/match`).
2. As **traveler**, open **dashboard** → **Incoming requests** → **Accept**.
3. Both sides: check **notifications** for booking updates.

**Expected:** Booking moves toward **confirmed** (per your business rules after acceptance).

**MongoDB:** `db.bookings.find({ bookingRef: "..." })` or by `requestId` / `tripId`.

## Journey 5 — Counter Offer Flow

1. Traveler responds with **Counter** instead of accept.
2. Requester opens booking detail → **Accept counter**.

**Expected:** Status **confirmed** (or next state in your state machine) with `agreedFee` / `counterFee` consistent.

## Journey 6 — Payment (Stripe test mode)

1. Set `VITE_STRIPE_PUBLISHABLE_KEY` and backend `STRIPE_*` secrets; run `stripe listen --forward-to localhost:3000/api/v1/payments/webhook` (or configure a dashboard webhook) so `payment_intent.succeeded` reaches the API.
2. Requester opens **Checkout** for a **confirmed** booking → card form → pay with Stripe test card `4242 4242 4242 4242`.
3. Wait until `GET /bookings/:id` shows `status: paid` (webhook may take a few seconds).

**Expected:** `POST /payments/intent/:bookingId` returns `clientSecret`; after confirmation, booking **paid** and traveler may see **payment_received** notification. `POST /bookings/:id/pay` is deprecated (**410**).

## Journey 7 — Delivery Flow

1. Traveler: **Mark in transit** → requester notified.
2. Requester shares **POD confirmation code** with traveler (out of band for this test).
3. Traveler: **Proof of delivery** — upload (stub) + code → submit.
4. Requester: confirm completion path until booking **completed**.

**Expected:** Both receive **review_request** (or equivalent) notifications.

## Journey 8 — Reviews

1. Each party opens **Leave a review** from completed flow.
2. Submit rating + optional categories + comment.

**Expected:** `User.rating` and `reviewCount` update; `reviews` collection has two documents for the booking (one per role).

**MongoDB:** `db.reviews.find({ bookingId: ObjectId("...") })` and `db.users.findOne({ _id: ObjectId("...") })` for rating fields.

## Journey 9 — Chat

1. Requester opens **Chat** for a confirmed booking → send text.
2. Traveler: **Inbox** shows unread; open thread → **Reply**.
3. Optional: **Image** — upload via chat upload endpoint, then send message with `imageUrl`.

**Expected:** Messages append; read/unread state updates.

## Journey 10 — Dispute Flow

1. On a **paid** or **in_transit** booking, one party raises a **dispute** (app action that sets booking to `disputed`).
2. Admin logs in → **Admin → Disputes** → row visible → **Resolve** (e.g. refund requester).
3. Confirm booking ends in **cancelled** (or resolved state) with `refundAmount` if applicable.

**MongoDB:** `db.bookings.find({ status: "disputed" })` before resolve; after resolve check `refundAmount`, `disputeResolution`, `status`.

## Journey 11 — Support Request Moderation

1. Requester creates **support** request (`type: "support"`) requiring admin approval.
2. Admin → **Support moderation** → **Pending review** → **Review** → **Approve** (optional notes).
3. Requester receives **support_request_approved** notification.

**Expected:** `adminApprovalStatus: "approved"`; request becomes matchable per product rules.

## Journey 12 — Admin User Management

1. Admin → **Users** → **Suspend** a test user with a reason.
2. Attempt login as that user → expect **401** / blocked auth.
3. Admin **Reinstate** → user can log in again.
4. Admin **Ban** → refresh tokens cleared → sessions invalidated.

**MongoDB:** `accountStatus`, `refreshTokenHash` on user document after ban.

## Journey 13 — Trust Score + Verification

1. New user baseline score from **Trust** screen.
2. `PATCH /trust/verify` with `{ field: "email" }` then `{ field: "phone" }` (+15 style increments per backend rules).
3. Complete multiple bookings and leave reviews averaging **4.0+** → score components update.
4. Inspect **badges** (e.g. top_rated, experienced, community_champion) per backend thresholds.

## Journey 14 — Password Reset Flow

1. **Forgot password** → enter email.
2. In **dev**, read OTP / tokens from API response or logs.
3. Submit OTP → obtain **passwordResetToken** (per API contract).
4. Set **new password** → redirect to login.
5. Confirm old refresh tokens invalid → prior sessions cannot refresh.

## Journey 15 — Session Management

1. **Login** → copy `accessToken` from storage or network.
2. Wait until access token expires (shorten JWT access TTL in backend `.env` for testing, e.g. 10s).
3. Trigger a **protected** API call → expect **401** then client **silent refresh** → request succeeds.
4. **Logout** → refresh cleared → next refresh attempt fails → app redirects to **login**.

## Common Failure Scenarios

Test at least these **10** error paths:

1. Wrong password on login → **401**
2. Duplicate email on register → **409**
3. Non-participant opens another user’s booking → **403**
4. Non-owner edits someone else’s trip → **403**
5. Review on non-completed booking → **400**
6. Wrong POD confirmation code → **400**
7. Messaging on cancelled booking → **400**
8. Skipping required onboarding step → **400**
9. Suspended user login → **401**
10. Non-admin hits `/admin/*` → **403**

## MongoDB Verification Queries

Replace `ObjectId('...')` with real IDs from your UI or prior queries.

```javascript
db.users.findOne({ email: 'traveler@test.com' })
db.trips.find({ status: 'active' })
db.requests.find({ type: 'support' })
db.bookings.find({ status: 'disputed' })
db.messages.find({ bookingId: ObjectId('...') }).sort({ createdAt: 1 })
db.notifications.find({ userId: ObjectId('...'), isRead: false })
db.reviews.find({ revieweeId: ObjectId('...') })
```

## Performance Notes

Polling is used in several screens. Verify in **Chrome DevTools → Network**:

- **Chat thread:** `/chat/:bookingId/messages` about every **5s** while the thread is open.
- **Notifications center:** `/notifications` about every **30s** (and the nav bell badge uses a similar interval).
- **Delivery tracking:** booking fetch about every **10s** on the tracking screen.

Filter by fetch/XHR and watch the timeline; timestamps should match the intervals above.
