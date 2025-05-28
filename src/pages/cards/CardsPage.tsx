import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CreditCard, Plus, Search, Filter, 
  MoreVertical, Edit, Trash2, Copy, QrCode, Share2, Eye
} from 'lucide-react';

// Mock data for cards
const mockCards = [
  {
    id: '1',
    name: 'Coffee Rewards',
    type: 'Stamp Card',
    created: '2023-05-15',
    status: 'Active',
    customers: 56,
    template: 'coffee',
    color: 'blue',
  },
  {
    id: '2',
    name: 'VIP Member',
    type: 'Points',
    created: '2023-06-22',
    status: 'Active',
    customers: 32,
    template: 'vip',
    color: 'purple',
  },
  {
    id: '3',
    name: 'Lunch Special',
    type: 'Discount',
    created: '2023-08-10',
    status: 'Active',
    customers: 18,
    template: 'food',
    color: 'amber',
  },
  {
    id: '4',
    name: 'Holiday Promotion',
    type: 'Limited Time',
    created: '2023-11-25',
    status: 'Draft',
    customers: 0,
    template: 'holiday',
    color: 'red',
  },
];

const CardsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCardMenu, setActiveCardMenu] = useState<string | null>(null);

  const toggleCardMenu = (cardId: string) => {
    if (activeCardMenu === cardId) {
      setActiveCardMenu(null);
    } else {
      setActiveCardMenu(cardId);
    }
  };

  const getCardColorClass = (color: string) => {
    switch (color) {
      case 'blue':
        return 'from-blue-500 to-blue-600';
      case 'purple':
        return 'from-purple-500 to-purple-600';
      case 'amber':
        return 'from-amber-500 to-amber-600';
      case 'red':
        return 'from-red-500 to-red-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const filteredCards = mockCards.filter(card => 
    card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <div className={`bg-gradient-to-r ${getCardColorClass(card.color)} text-white p-4`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <CreditCard className={`text-${card.color}-600`} size={16} />
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
                      <button className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        <Trash2 size={16} className="mr-3 text-red-500" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-xs bg-white bg-opacity-20 py-1 px-2 rounded-full inline-block mb-2">
                {card.type}
              </div>
              {card.type === 'Stamp Card' && (
                <div className="space-y-2 mb-4">
                  <div className="grid grid-cols-5 gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-full aspect-square bg-white bg-opacity-20 rounded-md flex items-center justify-center">
                        <CreditCard className="text-white" size={12} />
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-5 gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-full aspect-square bg-white bg-opacity-20 rounded-md flex items-center justify-center">
                        <CreditCard className="text-white" size={12} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {card.type === 'Points' && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-white text-opacity-80">Progress to next reward</span>
                    <span className="text-xs font-medium">25%</span>
                  </div>
                  <div className="w-full bg-white bg-opacity-20 h-2 rounded-full">
                    <div className="bg-white h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
              )}
              {card.type === 'Discount' && (
                <div className="flex items-center justify-center bg-white bg-opacity-20 rounded-md py-2 mb-4">
                  <span className="text-2xl font-bold">15% OFF</span>
                </div>
              )}
              {card.type === 'Limited Time' && (
                <div className="flex items-center justify-center bg-white bg-opacity-20 rounded-md py-2 mb-4">
                  <span className="text-sm font-medium">Valid until Dec 31, 2023</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="text-sm font-medium">
                    {card.status === 'Active' ? (
                      <span className="text-green-600">● Active</span>
                    ) : (
                      <span className="text-gray-500">◯ Draft</span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Customers</p>
                  <p className="text-sm font-medium">{card.customers}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="text-sm font-medium">{new Date(card.created).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Template</p>
                  <p className="text-sm font-medium capitalize">{card.template}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                <button className="text-sm text-blue-600 font-medium hover:text-blue-700">
                  Edit Card
                </button>
                <button className="text-sm text-gray-600 font-medium hover:text-gray-700">
                  Generate QR
                </button>
              </div>
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
    </div>
  );
};

export default CardsPage;