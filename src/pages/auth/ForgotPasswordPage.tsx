
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Mail, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/use-toast';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email.trim());
      setSent(true);
      toast({
        title: "Reset Link Sent",
        description: `Password reset instructions sent to ${email}`,
      });
    } catch (err: any) {
      console.error('Password reset error:', err);
      const errorMessage = err?.message || 'Unable to send reset email. Please try again.';
      setError(errorMessage);
      toast({
        title: "Reset Failed",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleTryAgain = () => {
    setSent(false);
    setEmail('');
    setError('');
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <Link to="/" className="inline-flex items-center space-x-2 group" aria-label="Go to homepage">
              <div className="p-2 bg-blue-600 rounded-xl group-hover:bg-blue-700 transition-colors duration-200">
                <CreditCard className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-900">LoyaltyCard</span>
            </Link>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-10 px-8 shadow-xl rounded-2xl border border-gray-100">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-3">Check your email</h1>
                <p className="text-gray-600 mb-6">
                  We've sent a password reset link to{' '}
                  <span className="font-semibold text-gray-900">{email}</span>
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>Didn't receive the email?</strong>
                    <br />
                    Check your spam folder or{' '}
                    <button
                      onClick={handleTryAgain}
                      className="font-medium text-blue-600 hover:text-blue-500 underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                    >
                      try again
                    </button>
                  </p>
                </div>
                <Link
                  to="/login"
                  className="inline-flex items-center text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 group" aria-label="Go to homepage">
            <div className="p-2 bg-blue-600 rounded-xl group-hover:bg-blue-700 transition-colors duration-200">
              <CreditCard className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold text-gray-900">LoyaltyCard</span>
          </Link>
          <h1 className="mt-8 text-3xl font-bold text-gray-900">
            Reset your password
          </h1>
          <p className="mt-3 text-base text-gray-600">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-10 px-8 shadow-xl rounded-2xl border border-gray-100">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 p-4 rounded-xl" role="alert">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={handleEmailChange}
                    disabled={loading}
                    aria-invalid={!!error}
                    aria-describedby={error ? "email-error" : "email-help"}
                    className={`block w-full pl-12 pr-4 py-3 border rounded-lg transition-all duration-200 ease-in-out text-sm focus:outline-none focus:ring-2 placeholder-gray-400 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed ${
                      error 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                <div id="email-help" className="mt-1 text-xs text-gray-500">
                  We'll send reset instructions to this email address
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-semibold text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    loading || !email.trim()
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin rounded-full h-5 w-5 mr-2" />
                      Sending reset link...
                    </>
                  ) : (
                    <>
                      <Mail className="h-5 w-5 mr-2" />
                      Send reset link
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <Link
                to="/login"
                className="inline-flex items-center text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
