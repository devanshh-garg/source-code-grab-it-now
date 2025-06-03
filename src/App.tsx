import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import CardsPage from './pages/cards/CardsPage';
import CreateCardPage from './pages/cards/CreateCardPage';
import CustomersPage from './pages/customers/CustomersPage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import BusinessSettingsPage from './pages/settings/BusinessSettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import CompleteProfilePage from './pages/CompleteProfilePage';
import CustomerSignupPage from './pages/auth/CustomerSignupPage';
import PublicCardPage from './pages/cards/PublicCardPage';
import ScannerPage from './pages/scanner/ScannerPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';

function App() {
  return (
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

        {/* Protected routes */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/cards" element={<CardsPage />} />
          <Route path="/cards/create" element={<CreateCardPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<BusinessSettingsPage />} />
          <Route path="/scanner" element={<ScannerPage />} />
        </Route>

        {/* 404 route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;