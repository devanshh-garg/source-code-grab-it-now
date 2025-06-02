
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import CustomerSignupPage from './pages/auth/CustomerSignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import CustomerDashboardPage from './pages/customer/CustomerDashboardPage';
import CardsPage from './pages/cards/CardsPage';
import CreateCardPage from './pages/cards/CreateCardPage';
import PublicCardPage from './pages/cards/PublicCardPage';
import CustomersPage from './pages/customers/CustomersPage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import ScannerPage from './pages/scanner/ScannerPage';
import NotFoundPage from './pages/NotFoundPage';
import CompleteProfilePage from './pages/CompleteProfilePage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/customer-signup" element={<CustomerSignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/card/:cardId" element={<PublicCardPage />} />
          <Route path="/customer-dashboard" element={
            <ProtectedRoute>
              <CustomerDashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/cards" element={
            <ProtectedRoute>
              <Layout>
                <CardsPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/cards/create" element={
            <ProtectedRoute>
              <Layout>
                <CreateCardPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/customers" element={
            <ProtectedRoute>
              <Layout>
                <CustomersPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute>
              <Layout>
                <AnalyticsPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/complete-profile" element={
            <ProtectedRoute>
              <Layout>
                <CompleteProfilePage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/scanner" element={
            <ProtectedRoute>
              <Layout>
                <ScannerPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
