/** Matches `GET /auth/me` plus optional fields present on the User model but not always serialized. */
export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  accountType: 'traveler' | 'requester' | 'both' | null;
  profilePhoto: string | null;
  bio: string | null;
  location: string | null;
  languages: string[];
  travelPreferences: string[];
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isIdVerified: boolean;
  isSelfieVerified: boolean;
  rating: number;
  reviewCount: number;
  onboardingCompleted: boolean;
  onboardingStep: number;
  role?: 'user' | 'admin' | 'superadmin';
  accountStatus?: 'active' | 'suspended' | 'banned';
  loyaltyPoints?: number;
  loyaltyTier?: 'bronze' | 'silver' | 'gold';
  referralCode?: string | null;
  authProvider?: 'local' | 'google';
  /** Blocked user ids when serialized from API (e.g. admin profile). */
  blockedUsers?: string[];
  createdAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: Pick<User, 'id' | 'fullName' | 'email' | 'accountType'>;
}

export interface RegisterResponse {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  accountType: 'traveler' | 'requester' | 'both' | null;
}

export interface Trip {
  _id: string;
  travelerId: string | Partial<User>;
  origin: string;
  destination: string;
  departureDate: string;
  arrivalDate: string;
  luggageSpace: 'small' | 'medium' | 'large';
  acceptedCategories: string[];
  pricingType: 'fixed' | 'negotiable';
  pricePerKg: number | null;
  deliveryPreferences: string | null;
  notes: string | null;
  status: 'active' | 'completed' | 'cancelled';
  openToCommunitySupport: boolean;
  willingToAssistElderly: boolean;
  acceptReducedFee: boolean;
  acceptVolunteer: boolean;
  matchedRequestsCount: number;
  createdAt: string;
}

export interface DeliveryRequest {
  _id: string;
  requesterId: string | Partial<User>;
  type: 'standard' | 'support';
  itemName: string;
  itemDescription: string;
  itemCategory: string;
  itemSize: 'small' | 'medium' | 'large';
  estimatedValue: number | null;
  origin: string;
  destination: string;
  deliveryDeadline: string;
  budget: number | null;
  currency: string;
  paymentType: 'full' | 'reduced' | 'sponsored' | 'volunteer' | null;
  beneficiaryName: string | null;
  beneficiaryType: string | null;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  supportingNotes: string | null;
  status:
    | 'pending'
    | 'matched'
    | 'confirmed'
    | 'in_transit'
    | 'delivered'
    | 'completed'
    | 'cancelled';
  matchedTravelerId: string | Partial<User> | null;
  matchedTripId: string | null;
  adminApprovalStatus: 'pending_review' | 'approved' | 'rejected' | null;
  adminApprovalNotes?: string | null;
  adminReviewedAt?: string | null;
  createdAt: string;
}

export interface Booking {
  _id: string;
  bookingRef: string;
  requestId: string | Partial<DeliveryRequest>;
  tripId: string | Partial<Trip>;
  requesterId: string | Partial<User>;
  travelerId: string | Partial<User>;
  offeredFee: number;
  counterFee: number | null;
  agreedFee: number | null;
  platformCommissionPct: number;
  platformCommission: number | null;
  travelerPayout: number | null;
  currency: string;
  status:
    | 'pending_acceptance'
    | 'countered'
    | 'confirmed'
    | 'paid'
    | 'in_transit'
    | 'delivered'
    | 'completed'
    | 'cancelled'
    | 'disputed';
  podConfirmationCode: string | null;
  podPhotoUrl: string | null;
  podSubmittedAt: string | null;
  disputeReason: string | null;
  disputeRaisedAt: string | null;
  disputeResolution?: string | null;
  refundAmount?: number | null;
  disputeResolvedAt?: string | null;
  completedAt?: string | null;
  paymentMethodId?: string | null;
  paymentIntentId?: string | null;
  cancellationReason: string | null;
  createdAt: string;
}

export interface Message {
  _id: string;
  bookingId: string;
  senderId: string | Partial<User>;
  receiverId: string;
  content: string;
  imageUrl: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface Notification {
  _id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  readAt: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface Review {
  _id: string;
  bookingId: string;
  reviewerId: string | Partial<User>;
  revieweeId: string | Partial<User>;
  overallRating: number;
  categoryRatings: {
    communication?: number;
    reliability?: number;
    itemCare?: number;
    punctuality?: number;
  } | null;
  comment: string | null;
  createdAt: string;
}

export interface TrustScore {
  score: number;
  breakdown: Record<
    string,
    { earned?: boolean; points: number; count?: number }
  >;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface OnboardingStepResponse {
  message: string;
  user: User;
  onboardingCompleted: boolean;
}
