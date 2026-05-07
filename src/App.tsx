import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminRoute, GuestRoute, ProtectedRoute } from './components/ProtectedRoute';
import { AppLayout } from './layouts/AppLayout';
import { CatalogRoute } from './pages/app/CatalogRoute';
import { RequesterDashboardPage } from './pages/app/RequesterDashboardPage';
import { TravelerDashboardPage } from './pages/app/TravelerDashboardPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { LoginPage } from './pages/LoginPage';
import { OtpPage } from './pages/OtpPage';
import { OnboardingStep1Page } from './pages/onboarding/OnboardingStep1Page';
import { OnboardingStep2Page } from './pages/onboarding/OnboardingStep2Page';
import { OnboardingStep3Page } from './pages/onboarding/OnboardingStep3Page';
import { ProfileSetupPage } from './pages/onboarding/ProfileSetupPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { SignUpPage } from './pages/SignUpPage';
import GoogleCallbackPage from './pages/GoogleCallbackPage';
import { SplashPage } from './pages/SplashPage';
import { AdminLayout } from './layouts/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminMonitorPage } from './pages/admin/AdminMonitorPage';
import { AdminPaymentsPage } from './pages/admin/AdminPaymentsPage';
import { AdminSettingsPlaceholderPage } from './pages/admin/AdminSettingsPlaceholderPage';
import { AdminCommunityImpactPage } from './pages/admin/AdminCommunityImpactPage';
import { AdminDisputesPage } from './pages/admin/AdminDisputesPage';
import { AdminReferralLoyaltyPage } from './pages/admin/AdminReferralLoyaltyPage';
import { AdminSponsorshipPartnersPage } from './pages/admin/AdminSponsorshipPartnersPage';
import { AdminSupportModerationPage } from './pages/admin/AdminSupportModerationPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';

export default function App() {
  return (
    <Routes>
      <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />

      <Route element={<GuestRoute />}>
        <Route path="/" element={<SplashPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<OtpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      <Route path="/admin/login" element={<AdminLoginPage />} />

      <Route element={<AdminRoute />}>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="payments" element={<AdminPaymentsPage />} />
          <Route path="monitor" element={<AdminMonitorPage />} />
          <Route path="disputes" element={<AdminDisputesPage />} />
          <Route path="support" element={<AdminSupportModerationPage />} />
          <Route path="community-impact" element={<AdminCommunityImpactPage />} />
          <Route path="referrals" element={<AdminReferralLoyaltyPage />} />
          <Route path="partners" element={<AdminSponsorshipPartnersPage />} />
          <Route path="settings" element={<AdminSettingsPlaceholderPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="onboarding/step-1" element={<OnboardingStep1Page />} />
        <Route path="onboarding/step-2" element={<OnboardingStep2Page />} />
        <Route path="onboarding/step-3" element={<OnboardingStep3Page />} />
        <Route path="onboarding/profile" element={<ProfileSetupPage />} />
        <Route path="app" element={<AppLayout />}>
          <Route index element={<Navigate to="traveler" replace />} />
          <Route path="traveler" element={<TravelerDashboardPage />} />
          <Route path="requester" element={<RequesterDashboardPage />} />
          <Route path="*" element={<CatalogRoute />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
