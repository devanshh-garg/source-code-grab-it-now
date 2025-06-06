
import React from 'react';
import { Instagram, Twitter, Facebook } from 'lucide-react';

interface CardBusinessInfoStepProps {
  cardData: {
    businessAddress: string;
    businessWebsite: string;
    socialLinks: {
      instagram: string;
      facebook: string;
      twitter: string;
    };
  };
  handleChange: (field: string, value: any) => void;
}

const CardBusinessInfoStep: React.FC<CardBusinessInfoStepProps> = ({ cardData, handleChange }) => {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Business Address
        </label>
        <input
          type="text"
          value={cardData.businessAddress}
          onChange={(e) => handleChange('businessAddress', e.target.value)}
          placeholder="Enter business address"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Business Website
        </label>
        <input
          type="url"
          value={cardData.businessWebsite}
          onChange={(e) => handleChange('businessWebsite', e.target.value)}
          placeholder="https://example.com"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Social Media
        </label>
        <div className="space-y-3">
          <div className="flex items-center">
            <Instagram size={20} className="text-gray-400 mr-2" />
            <input
              type="text"
              value={cardData.socialLinks.instagram}
              onChange={(e) => handleChange('socialLinks', {
                ...cardData.socialLinks,
                instagram: e.target.value
              })}
              placeholder="Instagram username"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center">
            <Facebook size={20} className="text-gray-400 mr-2" />
            <input
              type="text"
              value={cardData.socialLinks.facebook}
              onChange={(e) => handleChange('socialLinks', {
                ...cardData.socialLinks,
                facebook: e.target.value
              })}
              placeholder="Facebook page"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center">
            <Twitter size={20} className="text-gray-400 mr-2" />
            <input
              type="text"
              value={cardData.socialLinks.twitter}
              onChange={(e) => handleChange('socialLinks', {
                ...cardData.socialLinks,
                twitter: e.target.value
              })}
              placeholder="Twitter handle"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CardBusinessInfoStep;
