
import React from 'react';
import { Plus, Minus, X } from 'lucide-react';

interface Tier {
  name: string;
  goal: number;
  reward: string;
}

interface CardRulesStepProps {
  cardData: {
    type: string;
    stampGoal: number;
    pointsGoal: number;
    reward: string;
    termsAndConditions: string;
    tiers?: Tier[];
    expiryDays?: number;
    customRewardType?: string;
  };
  handleChange: (field: string, value: any) => void;
}

const CardRulesStep: React.FC<CardRulesStepProps> = ({ cardData, handleChange }) => {
  const addTier = () => {
    const currentTiers = cardData.tiers || [];
    const newTier = { name: '', goal: 0, reward: '' };
    handleChange('tiers', [...currentTiers, newTier]);
  };

  const removeTier = (index: number) => {
    const currentTiers = cardData.tiers || [];
    const updatedTiers = currentTiers.filter((_, i) => i !== index);
    handleChange('tiers', updatedTiers);
  };

  const updateTier = (index: number, field: keyof Tier, value: string | number) => {
    const currentTiers = cardData.tiers || [];
    const updatedTiers = [...currentTiers];
    updatedTiers[index] = { ...updatedTiers[index], [field]: value };
    handleChange('tiers', updatedTiers);
  };

  return (
    <>
      {/* Basic Rules based on card type */}
      {cardData.type === 'stamp' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stamps Needed
          </label>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleChange('stampGoal', Math.max(1, cardData.stampGoal - 1))}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <Minus size={20} />
            </button>
            <span className="text-2xl font-bold w-12 text-center">
              {Number.isFinite(cardData.stampGoal) ? cardData.stampGoal : 10}
            </span>
            <button
              onClick={() => handleChange('stampGoal', Math.min(20, cardData.stampGoal + 1))}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      )}

      {cardData.type === 'points' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Points Goal
          </label>
          <input
            type="number"
            value={Number.isFinite(cardData.pointsGoal) ? cardData.pointsGoal : 1000}
            onChange={(e) => handleChange('pointsGoal', parseInt(e.target.value))}
            min="100"
            step="100"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      )}

      {(cardData.type === 'tiered' || cardData.type === 'tier') && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Tier Configuration
            </label>
            <button
              onClick={addTier}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-1"
            >
              <Plus size={16} />
              <span>Add Tier</span>
            </button>
          </div>
          
          <div className="space-y-3">
            {(cardData.tiers || []).map((tier, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-700">Tier {index + 1}</h4>
                  <button
                    onClick={() => removeTier(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Tier Name</label>
                    <input
                      type="text"
                      value={tier.name}
                      onChange={(e) => updateTier(index, 'name', e.target.value)}
                      placeholder="e.g. Silver, Gold"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Points Required</label>
                    <input
                      type="number"
                      value={tier.goal}
                      onChange={(e) => updateTier(index, 'goal', parseInt(e.target.value) || 0)}
                      min="0"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Reward</label>
                    <input
                      type="text"
                      value={tier.reward}
                      onChange={(e) => updateTier(index, 'reward', e.target.value)}
                      placeholder="e.g. 10% discount"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            {(!cardData.tiers || cardData.tiers.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No tiers configured yet.</p>
                <p className="text-xs">Click "Add Tier" to create your first tier.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Custom Reward Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Reward Type
        </label>
        <select
          value={cardData.customRewardType || 'free_item'}
          onChange={(e) => handleChange('customRewardType', e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="free_item">Free Item</option>
          <option value="percentage_discount">Percentage Discount</option>
          <option value="fixed_discount">Fixed Amount Discount</option>
          <option value="cashback">Cashback</option>
          <option value="custom">Custom Reward</option>
        </select>
      </div>

      {/* Reward Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Reward Description
        </label>
        <input
          type="text"
          value={cardData.reward}
          onChange={(e) => handleChange('reward', e.target.value)}
          placeholder="e.g. Free coffee after 10 stamps"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      {/* Expiry Settings */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Reward Expiry (Optional)
        </label>
        <div className="flex items-center space-x-3">
          <input
            type="number"
            value={cardData.expiryDays || ''}
            onChange={(e) => handleChange('expiryDays', e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="30"
            min="1"
            max="365"
            className="block w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <span className="text-sm text-gray-600">days after earning</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Leave empty if rewards don't expire
        </p>
      </div>

      {/* Terms & Conditions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Terms & Conditions
        </label>
        <textarea
          value={cardData.termsAndConditions}
          onChange={(e) => handleChange('termsAndConditions', e.target.value)}
          rows={4}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Enter terms and conditions for this loyalty card..."
        ></textarea>
      </div>
    </>
  );
};

export default CardRulesStep;
