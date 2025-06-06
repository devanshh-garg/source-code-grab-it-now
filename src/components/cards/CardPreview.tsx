
import React from 'react';
import { CreditCard, Check, Smartphone } from 'lucide-react';

interface CardPreviewProps {
  cardData: {
    name: string;
    type: string;
    businessName: string;
    reward: string;
    stampGoal: number;
    pointsGoal: number;
    logo: string;
    customColors: {
      primary: string;
      secondary: string;
      text: string;
    };
  };
}

const CardPreview: React.FC<CardPreviewProps> = ({ cardData }) => {
  const { customColors, type, name, businessName, reward, stampGoal, pointsGoal } = cardData;
  
  return (
    <div className="w-full max-w-sm mx-auto">
      <div 
        className="rounded-xl p-6 shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${customColors.primary}, ${customColors.secondary})`,
          color: customColors.text,
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <CreditCard className="text-current" style={{ color: customColors.primary }} size={20} />
            </div>
            <div>
              <h3 className="font-bold">{name || 'Card Name'}</h3>
              <p className="text-sm opacity-80">{businessName || 'Business Name'}</p>
            </div>
          </div>
          {cardData.logo && (
            <img src={cardData.logo} alt="Logo" className="w-10 h-10 rounded-full object-cover" />
          )}
        </div>

        {type === 'stamp' && (
          <div className="space-y-3 mb-4">
            <div className="grid grid-cols-5 gap-2">
              {[...Array(Math.min(5, Number.isFinite(stampGoal) && stampGoal > 0 ? stampGoal : 0))].map((_, i) => (
                <div 
                  key={i}
                  className="aspect-square rounded-md flex items-center justify-center"
                  style={{ backgroundColor: `${customColors.text}20` }}
                >
                  <CreditCard size={16} className="opacity-60" />
                </div>
              ))}
            </div>
            {stampGoal > 5 && Number.isFinite(stampGoal) && (
              <div className="grid grid-cols-5 gap-2">
                {[...Array(Math.min(5, stampGoal - 5 > 0 ? stampGoal - 5 : 0))].map((_, i) => (
                  <div 
                    key={i}
                    className="aspect-square rounded-md flex items-center justify-center"
                    style={{ backgroundColor: `${customColors.text}20` }}
                  >
                    <CreditCard size={16} className="opacity-60" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {type === 'points' && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-80">Progress to next reward</span>
              <span className="text-sm font-medium">0/{pointsGoal} pts</span>
            </div>
            <div 
              className="h-2 rounded-full mb-2"
              style={{ backgroundColor: `${customColors.text}20` }}
            >
              <div 
                className="h-2 rounded-full w-0"
                style={{ backgroundColor: customColors.text }}
              ></div>
            </div>
          </div>
        )}

        {(type === 'tiered' || type === 'tier') && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div 
              className="text-center py-2 rounded-md"
              style={{ backgroundColor: `${customColors.text}20` }}
            >
              <div className="text-xs mb-1">Silver</div>
              <Check size={14} className="mx-auto" />
            </div>
            <div 
              className="text-center py-2 rounded-md"
              style={{ backgroundColor: `${customColors.text}10` }}
            >
              <div className="text-xs mb-1">Gold</div>
              <div className="text-xs">$500</div>
            </div>
            <div 
              className="text-center py-2 rounded-md"
              style={{ backgroundColor: `${customColors.text}10` }}
            >
              <div className="text-xs mb-1">Platinum</div>
              <div className="text-xs">$1000</div>
            </div>
          </div>
        )}

        {type === 'discount' && (
          <div className="mb-4">
            <div 
              className="text-center py-3 rounded-md"
              style={{ backgroundColor: `${customColors.text}20` }}
            >
              <div className="text-lg font-bold">10% OFF</div>
              <div className="text-xs opacity-80">Next Purchase</div>
            </div>
          </div>
        )}

        <div 
          className="text-center py-2 rounded-md font-medium"
          style={{ backgroundColor: `${customColors.text}20` }}
        >
          {reward || 'Reward Description'}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <button className="px-4 py-2 bg-gray-100 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
            <Smartphone size={16} className="inline mr-2" />
            Apple Wallet
          </button>
          <button className="px-4 py-2 bg-gray-100 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
            <Smartphone size={16} className="inline mr-2" />
            Google Pay
          </button>
        </div>
        <p className="text-xs text-center text-gray-500">
          Preview updates as you make changes. Final card may appear slightly different on actual devices.
        </p>
      </div>
    </div>
  );
};

export default CardPreview;
