
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Mail, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const VerifyEmailPage: React.FC = () => {
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const { resendVerification } = useAuth();

  const handleResendVerification = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setResending(true);
      setError('');
      await resendVerification(email);
      setResent(true);
    } catch (err: any) {
      console.error('Resend verification error:', err);
      setError('Unable to resend verification email. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 group">
            <div className="p-2 bg-blue-600 rounded-xl group-hover:bg-blue-700 transition-colors duration-200">
              <CreditCard className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold text-gray-900">LoyaltyCard</span>
          </Link>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-10 px-8 shadow-xl rounded-2xl border border-gray-100">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Verify Your Email
              </h2>
              <p className="text-gray-600 mb-6">
                We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
              </p>

              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 p-4 rounded-xl">
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

              {resent && (
                <div className="mb-6 bg-green-50 border border-green-200 p-4 rounded-xl">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700">Verification email sent successfully!</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your email"
                  />
                </div>

                <button
                  onClick={handleResendVerification}
                  disabled={resending}
                  className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg text-sm font-medium transition-all duration-200 ${
                    resending
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {resending ? (
                    <>
                      <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Resend verification email
                    </>
                  )}
                </button>
              </div>

              <div className="mt-8 text-sm text-gray-500">
                <p>Didn't receive the email? Check your spam folder.</p>
                <p className="mt-2">
                  <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                    Back to Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
