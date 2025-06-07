
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/auth/LoginPage';
import ContactPage from './pages/ContactPage';
import SignupPage from './pages/auth/SignupPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import CardsPage from './pages/cards/CardsPage';
import CreateCardPage from './pages/cards/CreateCardPage';
import EditCardPage from './pages/cards/EditCardPage';
import CustomersPage from './pages/customers/CustomersPage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import BusinessSettingsPage from './pages/settings/BusinessSettingsPage';
import ScannerPage from './pages/scanner/ScannerPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import CustomerSignupPage from './pages/auth/CustomerSignupPage';
import CompleteProfilePage from './pages/CompleteProfilePage';
import ProfilePage from './pages/profile/ProfilePage';
import PublicCardPage from './pages/cards/PublicCardPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import OnboardingWalkthrough from './components/onboarding/OnboardingWalkthrough';
import { AuthProvider } from './contexts/AuthContext';
import { OnboardingProvider } from './contexts/OnboardingContext';

function App() {
  return (
    <AuthProvider>
      <OnboardingProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/customer/signup" element={<CustomerSignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/complete-profile" element={<CompleteProfilePage />} />
            <Route path="/cards/:id" element={<PublicCardPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute><Layout><Outlet /></Layout></ProtectedRoute>}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/cards" element={<CardsPage />} />
              <Route path="/cards/create" element={<CreateCardPage />} />
              <Route path="/cards/edit/:cardId" element={<EditCardPage />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/settings" element={<BusinessSettingsPage />} />
              <Route path="/scanner" element={<ScannerPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* 404 route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          
          <OnboardingWalkthrough />
        </Router>
      </OnboardingProvider>
    </AuthProvider>
  );
}

export default App;
