
import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface CardRulesStepProps {
  cardData: {
    type: string;
    stampGoal: number;
    pointsGoal: number;
    reward: string;
    termsAndConditions: string;
  };
  handleChange: (field: string, value: any) => void;
}

const CardRulesStep: React.FC<CardRulesStepProps> = ({ cardData, handleChange }) => {
  return (
    <>
      {cardData.type === 'stamp' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stamps Needed
          </label>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleChange('stampGoal', Math.max(1, cardData.stampGoal - 1))}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
            >
              <Minus size={20} />
            </button>
            <span className="text-2xl font-bold w-12 text-center">
              {cardData.stampGoal}
            </span>
            <button
              onClick={() => handleChange('stampGoal', Math.min(20, cardData.stampGoal + 1))}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
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
            value={cardData.pointsGoal}
            onChange={(e) => handleChange('pointsGoal', parseInt(e.target.value))}
            min="100"
            step="100"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      )}

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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Terms & Conditions
        </label>
        <textarea
          value={cardData.termsAndConditions}
          onChange={(e) => handleChange('termsAndConditions', e.target.value)}
          rows={3}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Enter terms and conditions"
        ></textarea>
      </div>
    </>
  );
};

export default CardRulesStep;
