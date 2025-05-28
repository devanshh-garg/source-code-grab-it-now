import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Home } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <CreditCard className="text-blue-600" size={48} />
        </div>
        <h1 className="text-6xl font-extrabold text-gray-900 mb-4">404</h1>
        <p className="text-xl font-medium text-gray-600 mb-8">
          Oops! The page you're looking for can't be found.
        </p>
        <Link 
          to="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Home size={20} className="mr-2" />
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;