
import React from 'react';
import { CreditCard, Check, Smartphone, Star } from 'lucide-react';

interface Tier {
  name: string;
  goal: number;
  reward: string;
}

interface CardPreviewProps {
  cardData: {
    name: string;
    type: string;
    businessName: string;
    reward: string;
    stampGoal: number;
    pointsGoal: number;
    logo: string;
    backgroundImage?: string;
    customColors: {
      primary: string;
      secondary: string;
      text: string;
    };
    tiers?: Tier[];
    expiryDays?: number;
  };
}

const CardPreview: React.FC<CardPreviewProps> = ({ cardData }) => {
  const { customColors, type, name, businessName, reward, stampGoal, pointsGoal, tiers, expiryDays, backgroundImage } = cardData;
  
  const cardStyle = {
    background: backgroundImage 
      ? `linear-gradient(135deg, ${customColors.primary}AA, ${customColors.secondary}AA), url(${backgroundImage})`
      : `linear-gradient(135deg, ${customColors.primary}, ${customColors.secondary})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: customColors.text,
  };
  
  return (
    <div className="w-full max-w-sm mx-auto">
      <div 
        className="rounded-xl p-6 shadow-lg relative overflow-hidden"
        style={cardStyle}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <CreditCard className="text-current" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg">{name || 'Card Name'}</h3>
              <p className="text-sm opacity-80">{businessName || 'Business Name'}</p>
            </div>
          </div>
          {cardData.logo && (
            <img src={cardData.logo} alt="Logo" className="w-12 h-12 rounded-full object-cover border-2 border-white border-opacity-30" />
          )}
        </div>

        {/* Content based on type */}
        {type === 'stamp' && (
          <div className="space-y-3 mb-4">
            <div className="grid grid-cols-5 gap-2">
              {[...Array(Math.min(10, Number.isFinite(stampGoal) && stampGoal > 0 ? stampGoal : 10))].map((_, i) => (
                <div 
                  key={i}
                  className="aspect-square rounded-md flex items-center justify-center border border-white border-opacity-30"
                  style={{ backgroundColor: `${customColors.text}20` }}
                >
                  <CreditCard size={14} className="opacity-60" />
                </div>
              ))}
            </div>
            <p className="text-xs opacity-70 text-center">
              Collect {stampGoal} stamps to earn your reward
            </p>
          </div>
        )}

        {type === 'points' && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-80">Progress to next reward</span>
              <span className="text-sm font-medium">0/{pointsGoal} pts</span>
            </div>
            <div 
              className="h-3 rounded-full mb-2 border border-white border-opacity-30"
              style={{ backgroundColor: `${customColors.text}20` }}
            >
              <div 
                className="h-full rounded-full w-0 transition-all duration-300"
                style={{ backgroundColor: customColors.text }}
              ></div>
            </div>
          </div>
        )}

        {(type === 'tiered' || type === 'tier') && (
          <div className="space-y-3 mb-4">
            {tiers && tiers.length > 0 ? (
              <div className="space-y-2">
                {tiers.map((tier, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-2 rounded-md border border-white border-opacity-30"
                    style={{ backgroundColor: `${customColors.text}15` }}
                  >
                    <div className="flex items-center space-x-2">
                      <Star size={14} className="opacity-70" />
                      <span className="text-sm font-medium">{tier.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs opacity-70">{tier.goal} pts</div>
                      <div className="text-xs">{tier.reward}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                <div 
                  className="text-center py-3 rounded-md border border-white border-opacity-30"
                  style={{ backgroundColor: `${customColors.text}20` }}
                >
                  <Star size={16} className="mx-auto mb-1" />
                  <div className="text-xs font-medium">Silver</div>
                  <div className="text-xs opacity-70">100 pts</div>
                </div>
                <div 
                  className="text-center py-3 rounded-md border border-white border-opacity-30"
                  style={{ backgroundColor: `${customColors.text}15` }}
                >
                  <Star size={16} className="mx-auto mb-1 opacity-60" />
                  <div className="text-xs font-medium">Gold</div>
                  <div className="text-xs opacity-70">500 pts</div>
                </div>
                <div 
                  className="text-center py-3 rounded-md border border-white border-opacity-30"
                  style={{ backgroundColor: `${customColors.text}10` }}
                >
                  <Star size={16} className="mx-auto mb-1 opacity-40" />
                  <div className="text-xs font-medium">Platinum</div>
                  <div className="text-xs opacity-70">1000 pts</div>
                </div>
              </div>
            )}
          </div>
        )}

        {type === 'discount' && (
          <div className="mb-4">
            <div 
              className="text-center py-4 rounded-md border border-white border-opacity-30"
              style={{ backgroundColor: `${customColors.text}20` }}
            >
              <div className="text-2xl font-bold">10% OFF</div>
              <div className="text-sm opacity-80">Next Purchase</div>
            </div>
          </div>
        )}

        {/* Reward section */}
        <div 
          className="text-center py-3 rounded-md font-medium border border-white border-opacity-30"
          style={{ backgroundColor: `${customColors.text}25` }}
        >
          {reward || 'Reward Description'}
        </div>

        {/* Expiry info */}
        {expiryDays && (
          <div className="mt-3 text-center">
            <p className="text-xs opacity-70">
              Expires {expiryDays} days after earning
            </p>
          </div>
        )}
      </div>

      {/* Wallet actions */}
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
