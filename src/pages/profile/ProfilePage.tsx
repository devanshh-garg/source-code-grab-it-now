
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useBusinessData } from '../../hooks/useBusinessData';
import { User, Mail, Building2, Save } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const { business } = useBusinessData();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: currentUser?.user_metadata?.full_name || currentUser?.user_metadata?.name || '',
    email: currentUser?.email || '',
    businessName: business?.name || '',
  });

  const handleSave = () => {
    // TODO: Implement profile update functionality
    setIsEditing(false);
  };

  const getUserDisplayName = () => {
    return currentUser?.user_metadata?.full_name || 
           currentUser?.user_metadata?.name || 
           currentUser?.email?.split('@')[0] || 
           'User';
  };

  const getUserInitial = () => {
    const displayName = getUserDisplayName();
    return displayName.charAt(0).toUpperCase();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{getUserInitial()}</span>
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold">{getUserDisplayName()}</h1>
              <p className="text-blue-100">{currentUser?.email}</p>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User size={16} className="inline mr-2" />
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-md ${
                  isEditing 
                    ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
                    : 'border-gray-200 bg-gray-50'
                } focus:outline-none`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail size={16} className="inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building2 size={16} className="inline mr-2" />
                Business Name
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-md ${
                  isEditing 
                    ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
                    : 'border-gray-200 bg-gray-50'
                } focus:outline-none`}
              />
            </div>

            {isEditing && (
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleSave}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <Save size={16} className="mr-2" />
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Account Info */}
        <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Account Information</h3>
          <div className="text-sm text-gray-500 space-y-1">
            <p>Account created: {new Date(currentUser?.created_at || '').toLocaleDateString()}</p>
            <p>Email verified: {currentUser?.email_confirmed_at ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
