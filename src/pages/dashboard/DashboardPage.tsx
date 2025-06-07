
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CreditCard, Users, BarChart3, 
  ArrowUpRight, Plus, QrCode
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useBusinessData } from '../../hooks/useBusinessData';
import { useLoyaltyCards } from '../../hooks/useLoyaltyCards';
import { useOnboarding } from '../../contexts/OnboardingContext';

const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { business } = useBusinessData();
  const { cards } = useLoyaltyCards();
  const { startOnboarding } = useOnboarding();

  const stats = [
    { 
      name: 'Active Cards', 
      value: cards.filter(card => card.active).length.toString(), 
      change: '+0%', 
      trend: 'up', 
      icon: <CreditCard size={20} className="text-blue-600" /> 
    },
    { 
      name: 'Total Customers', 
      value: '0', 
      change: '+0%', 
      trend: 'up', 
      icon: <Users size={20} className="text-purple-600" /> 
    },
    { 
      name: 'Points Awarded', 
      value: '0', 
      change: '+0%', 
      trend: 'up', 
      icon: <QrCode size={20} className="text-emerald-600" /> 
    },
    { 
      name: 'Redemptions', 
      value: '0', 
      change: '+0%', 
      trend: 'up', 
      icon: <BarChart3 size={20} className="text-amber-600" /> 
    },
  ];

  const recentActivity = [
    { 
      type: 'Welcome', 
      title: 'Welcome to your loyalty program dashboard!', 
      time: 'Just now', 
      icon: <CreditCard size={16} className="text-blue-500" /> 
    },
  ];

  // Helper to determine readable text color
  function getCardTextColor(card: any) {
    // 1. Use explicit text color if present
    if (card.design?.text) return card.design.text;
    // 2. Try to determine if background is light or dark
    const bg = card.design?.backgroundColor;
    if (bg) {
      // Accepts hex color only
      const hex = bg.replace('#', '');
      if (hex.length === 6) {
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        // Luminance formula
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.6 ? '#222' : '#fff';
      }
    }
    // 3. Fallback
    return '#fff';
  }

  console.log('DashboardPage cards:', cards);

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {currentUser?.user_metadata?.full_name || currentUser?.email}
            </h1>
            <p className="text-gray-600 mt-1">
              {business ? `Managing ${business.name}` : "Here's what's happening with your loyalty program today."}
            </p>
          </div>
          {cards.length === 0 && (
            <button
              onClick={startOnboarding}
              className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              Start Tour
            </button>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Link 
          to="/cards/create"
          data-onboarding="create-card"
          className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-5 text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Create New Card</h3>
              <p className="text-blue-100 text-sm mt-1">Design your next loyalty card</p>
            </div>
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Plus size={20} className="text-white" />
            </div>
          </div>
        </Link>
        
        <Link 
          to="/scanner"
          className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-5 text-white hover:from-purple-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Scan Customer Card</h3>
              <p className="text-purple-100 text-sm mt-1">Award points or stamps</p>
            </div>
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <QrCode size={20} className="text-white" />
            </div>
          </div>
        </Link>
        
        <Link 
          to="/analytics"
          className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg p-5 text-white hover:from-amber-600 hover:to-amber-700 transition-all shadow-md hover:shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">View Analytics</h3>
              <p className="text-amber-100 text-sm mt-1">Track loyalty program performance</p>
            </div>
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <BarChart3 size={20} className="text-white" />
            </div>
          </div>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                {stat.icon}
              </div>
              <div className={`flex items-center ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                <span className="text-xs font-medium">{stat.change}</span>
                <ArrowUpRight size={14} className="ml-1" />
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.name}</h3>
            <p className="text-gray-900 text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Your cards */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Your Loyalty Cards</h2>
            <Link to="/cards" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all
            </Link>
          </div>
          
          {cards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cards.slice(0, 3).map((card) => {
                // Defensive: check for required fields, fallback if missing
                const hasCriticalFields = card && card.name && card.type && card.design && card.rules;
                if (!hasCriticalFields) {
                  return (
                    <div key={card.id || Math.random()} className="bg-gray-100 rounded-lg p-4 text-gray-500 border border-red-200">
                      <div className="mb-2 font-bold">Card data incomplete</div>
                      <div className="text-xs">Some fields missing. Please recreate or edit this card.</div>
                      <pre className="text-xs mt-2 overflow-x-auto">{JSON.stringify(card, null, 2)}</pre>
                    </div>
                  );
                }
                return (
                  <div key={card.id}
                    className="rounded-lg p-4 shadow-lg"
                    style={{
                      background: card.design?.backgroundColor
                        ? `linear-gradient(135deg, ${card.design.backgroundColor}, ${card.design.backgroundColor}CC)`
                        : 'linear-gradient(135deg, #3B82F6, #2563EB)',
                      color: getCardTextColor(card)
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                          <CreditCard className="text-blue-600" size={16} />
                        </div>
                        <span className="font-bold">{card.name || 'Untitled Card'}</span>
                      </div>
                      <div className="text-xs bg-white bg-opacity-20 py-1 px-2 rounded-full">
                        {card.active ? 'Active' : 'Draft'}
                      </div>
                    </div>
                    {card.type === 'stamp' && (
                      <div className="space-y-2 mb-4">
                        <div className="grid grid-cols-5 gap-2">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-full aspect-square bg-white bg-opacity-20 rounded-md flex items-center justify-center">
                              <CreditCard className="text-white" size={14} />
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-full aspect-square bg-white bg-opacity-20 rounded-md flex items-center justify-center">
                              <CreditCard className="text-white" size={14} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {card.type === 'points' && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-white text-opacity-80">Progress to reward</span>
                          <span className="text-xs font-medium">0%</span>
                        </div>
                        <div className="w-full bg-white bg-opacity-20 h-2 rounded-full">
                          <div className="bg-white h-2 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                      </div>
                    )}
                    <div className="text-center py-1 bg-white bg-opacity-20 rounded-md text-sm font-medium">
                      {(card.rules?.rewardTitle && card.rules.rewardTitle.length > 0) ? card.rules.rewardTitle : 'Reward not set'}
                    </div>

                  </div>
                );
              })}
              {cards.length < 4 && (
                <Link 
                  to="/cards/create"
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-500 transition-colors"
                >
                  <Plus size={24} className="mb-2" />
                  <span className="font-medium">Create New Card</span>
                  <span className="text-xs mt-1">Add to your collection</span>
                </Link>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <CreditCard size={32} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500 mb-4">No loyalty cards created yet</p>
              <Link 
                to="/cards/create"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} className="mr-2" />
                Create Your First Card
              </Link>
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all
            </button>
          </div>
          
          <div className="space-y-5">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mt-1">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">{activity.type}</span>
                    <span className="text-xs text-gray-400">{activity.time}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mt-1">{activity.title}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-100">
            <button className="w-full py-2 bg-gray-50 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 transition-colors">
              Load More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
