import React from 'react';
import { Link } from 'react-router-dom';

const VerifyEmailPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6">Verify Your Email</h2>
        <p className="mb-6">We have sent a verification link to your email address.<br />
        Please check your inbox and click the link to verify your account.</p>
        <Link to="/login" className="text-blue-600 hover:underline">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
