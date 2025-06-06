import React from 'react';
import { CreditCard, MoreVertical, Edit, Trash2, Copy, QrCode, Share2, Eye } from 'lucide-react';
import WalletPassActions from './WalletPassActions';

interface LoyaltyCardItemProps {
  card: any;
  toggleCardMenu: (cardId: string) => void;
  handleDeleteCard: (cardId: string) => void;
  toggleWalletActions: (cardId: string) => void;
  activeCardMenu: string | null;
  showWalletActions: string | null;
}

const getCardStyle = (backgroundColor?: string) => {
  if (backgroundColor) {
    return {
      background: `linear-gradient(135deg, ${backgroundColor}, ${backgroundColor}CC)`,
    };
  }
  return {
    background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
  };
};

const LoyaltyCardItem: React.FC<LoyaltyCardItemProps> = ({
  card,
  toggleCardMenu,
  handleDeleteCard,
  toggleWalletActions,
  activeCardMenu,
  showWalletActions,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="text-white p-4" style={getCardStyle(card.design?.backgroundColor)}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <CreditCard className="text-blue-600" size={16} />
            </div>
            <span className="font-bold">{card.name}</span>
          </div>
          <div className="relative">
            <button onClick={() => toggleCardMenu(card.id)} className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full">
              <MoreVertical size={18} />
            </button>
            {activeCardMenu === card.id && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
                <button className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Eye size={16} className="mr-3 text-gray-500" />
                  <span>Preview</span>
                </button>
                <button className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Edit size={16} className="mr-3 text-gray-500" />
                  <span>Edit</span>
                </button>
                <button className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <QrCode size={16} className="mr-3 text-gray-500" />
                  <span>Generate QR</span>
                </button>
                <button className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Share2 size={16} className="mr-3 text-gray-500" />
                  <span>Share</span>
                </button>
                <button className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Copy size={16} className="mr-3 text-gray-500" />
                  <span>Duplicate</span>
                </button>
                <button onClick={() => handleDeleteCard(card.id)} className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                  <Trash2 size={16} className="mr-3 text-red-500" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="text-xs bg-white bg-opacity-20 py-1 px-2 rounded-full inline-block mb-2">
          {card.type.charAt(0).toUpperCase() + card.type.slice(1)} Card
        </div>
        {card.type === 'stamp' && (
          <div className="space-y-2 mb-4">
            <div className="grid grid-cols-5 gap-1">
              {[...Array(Math.min(5, card.rules?.totalNeeded || 10))].map((_, i) => (
                <div key={i} className="w-full aspect-square bg-white bg-opacity-20 rounded-md flex items-center justify-center">
                  <CreditCard className="text-white" size={12} />
                </div>
              ))}
            </div>
            {(card.rules?.totalNeeded || 10) > 5 && (
              <div className="grid grid-cols-5 gap-1">
                {[...Array(Math.min(5, (card.rules?.totalNeeded || 10) - 5))].map((_, i) => (
                  <div key={i} className="w-full aspect-square bg-white bg-opacity-20 rounded-md flex items-center justify-center">
                    <CreditCard className="text-white" size={12} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {card.type === 'points' && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-white text-opacity-80">Progress to next reward</span>
              <span className="text-xs font-medium">0%</span>
            </div>
            <div className="w-full bg-white bg-opacity-20 h-2 rounded-full">
              <div className="bg-white h-2 rounded-full" style={{ width: '0%' }}></div>
            </div>
          </div>
        )}
        <div className="text-center py-2 bg-white bg-opacity-20 rounded-md text-sm">
          {card.rules?.rewardTitle || 'Loyalty Reward'}
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500">Status</p>
            <p className="text-sm font-medium">
              {card.active ? (
                <span className="text-green-600">● Active</span>
              ) : (
                <span className="text-gray-500">◯ Draft</span>
              )}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Type</p>
            <p className="text-sm font-medium capitalize">{card.type}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Created</p>
            <p className="text-sm font-medium">{new Date(card.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Reward</p>
            <p className="text-sm font-medium">{card.rules?.rewardTitle || 'Not set'}</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
          <button onClick={() => toggleWalletActions(card.id)} className="text-sm text-blue-600 font-medium hover:text-blue-700">
            Wallet & Share
          </button>
          <button className="text-sm text-gray-600 font-medium hover:text-gray-700">
            Edit Card
          </button>
        </div>
        {showWalletActions === card.id && (
          <WalletPassActions card={card} />
        )}
      </div>
    </div>
  );
};

export default LoyaltyCardItem;
