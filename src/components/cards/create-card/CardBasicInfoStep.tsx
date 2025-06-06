
import React from 'react';
import { cardTypes } from '../../../constants/loyalty';

interface CardBasicInfoStepProps {
  cardData: {
    name: string;
    businessName: string;
    type: string;
  };
  handleChange: (field: string, value: any) => void;
  business?: { name: string } | null;
}

const CardBasicInfoStep: React.FC<CardBasicInfoStepProps> = ({ 
  cardData, 
  handleChange, 
  business 
}) => {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Name *
        </label>
        <input
          type="text"
          value={cardData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="e.g. Coffee Rewards, VIP Member"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Business Name
        </label>
        <input
          type="text"
          value={cardData.businessName || business?.name || ''}
          onChange={(e) => handleChange('businessName', e.target.value)}
          placeholder={business?.name || 'Your business name'}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Type *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {cardTypes.map((type) => (
            <div
              key={type.id}
              onClick={() => handleChange('type', type.id)}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                cardData.type === type.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-200'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  cardData.type === type.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                }`}>
                  <type.icon size={20} />
                </div>
                <div>
                  <h3 className="font-medium">{type.name}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CardBasicInfoStep;
