
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CreditCard, Plus, Search, Filter, 
  MoreVertical, Edit, Trash2, Copy, QrCode, Share2, Eye
} from 'lucide-react';
import { useLoyaltyCards } from '../../hooks/useLoyaltyCards';
import WalletPassActions from '../../components/cards/WalletPassActions';

const CardsPage: React.FC = () => {
  const { cards, loading, deleteCard } = useLoyaltyCards();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCardMenu, setActiveCardMenu] = useState<string | null>(null);
  const [showWalletActions, setShowWalletActions] = useState<string | null>(null);

  const toggleCardMenu = (cardId: string) => {
    if (activeCardMenu === cardId) {
      setActiveCardMenu(null);
    } else {
      setActiveCardMenu(cardId);
    }
  };

  const toggleWalletActions = (cardId: string) => {
    if (showWalletActions === cardId) {
      setShowWalletActions(null);
    } else {
      setShowWalletActions(cardId);
      setActiveCardMenu(null);
    }
  };

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

  const handleDeleteCard = async (cardId: string) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      try {
        await deleteCard(cardId);
        setActiveCardMenu(null);
      } catch (error) {
        alert('Failed to delete card. Please try again.');
      }
    }
  };

  const filteredCards = cards.filter(card => 
    card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading your loyalty cards...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Loyalty Cards</h1>
          <p className="text-gray-600 mt-1">
            Create and manage your digital loyalty cards.
          </p>
        </div>
        <Link 
          to="/cards/create"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={18} className="mr-2" />
          <span>Create New Card</span>
        </Link>
      </div>

      {/* Search and filter */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search cards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex space-x-2">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors">
              <Filter size={18} className="mr-2 text-gray-500" />
              <span>Filter</span>
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors">
              <span>Sort: Newest</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards.map((card) => (
          <div 
            key={card.id} 
            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
          >
            <div 
              className="text-white p-4"
              style={getCardStyle(card.design?.backgroundColor)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <CreditCard className="text-blue-600" size={16} />
                  </div>
                  <span className="font-bold">{card.name}</span>
                </div>
                <div className="relative">
                  <button 
                    onClick={() => toggleCardMenu(card.id)}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full"
                  >
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
                      <button 
                        onClick={() => handleDeleteCard(card.id)}
                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
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
                <button 
                  onClick={() => toggleWalletActions(card.id)}
                  className="text-sm text-blue-600 font-medium hover:text-blue-700"
                >
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
        ))}

        {/* Create new card tile */}
        <Link 
          to="/cards/create"
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-500 transition-colors min-h-[300px]"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Plus size={28} className="text-gray-500" />
          </div>
          <span className="font-medium text-lg">Create New Card</span>
          <span className="text-sm mt-2 text-center max-w-[200px]">Design custom loyalty cards for your business</span>
        </Link>
      </div>

      {cards.length === 0 && (
        <div className="text-center py-12">
          <CreditCard size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No loyalty cards yet</h3>
          <p className="text-gray-500 mb-6">Create your first loyalty card to get started.</p>
          <Link 
            to="/cards/create"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} className="mr-2" />
            Create Your First Card
          </Link>
        </div>
      )}
    </div>
  );
};

export default CardsPage;
