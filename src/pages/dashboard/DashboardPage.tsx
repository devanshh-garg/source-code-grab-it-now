import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CreditCard, Users, BarChart3, TrendingUp, 
  ArrowUpRight, Plus, QrCode
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();

  const stats = [
    { 
      name: 'Active Cards', 
      value: '3', 
      change: '+33%', 
      trend: 'up', 
      icon: <CreditCard size={20} className="text-blue-600" /> 
    },
    { 
      name: 'Total Customers', 
      value: '147', 
      change: '+12%', 
      trend: 'up', 
      icon: <Users size={20} className="text-purple-600" /> 
    },
    { 
      name: 'Points Awarded', 
      value: '1,253', 
      change: '+24%', 
      trend: 'up', 
      icon: <QrCode size={20} className="text-emerald-600" /> 
    },
    { 
      name: 'Redemptions', 
      value: '45', 
      change: '+18%', 
      trend: 'up', 
      icon: <BarChart3 size={20} className="text-amber-600" /> 
    },
  ];

  const recentActivity = [
    { 
      type: 'Card Created', 
      title: 'Summer Promo Card', 
      time: '2 hours ago', 
      icon: <CreditCard size={16} className="text-blue-500" /> 
    },
    { 
      type: 'New Customer', 
      title: 'Sarah Johnson joined', 
      time: '3 hours ago', 
      icon: <Users size={16} className="text-purple-500" /> 
    },
    { 
      type: 'Points Awarded', 
      title: '50 points to Michael B.', 
      time: '5 hours ago', 
      icon: <QrCode size={16} className="text-emerald-500" /> 
    },
    { 
      type: 'Reward Redeemed', 
      title: 'Free coffee by Alice T.', 
      time: '1 day ago', 
      icon: <BarChart3 size={16} className="text-amber-500" /> 
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {currentUser?.name}
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your loyalty program today.
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Link 
          to="/cards/create"
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <CreditCard className="text-blue-600" size={16} />
                  </div>
                  <span className="font-bold">Coffee Rewards</span>
                </div>
                <div className="text-xs bg-blue-700 py-1 px-2 rounded-full">
                  Active
                </div>
              </div>
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
              <div className="text-center py-1 bg-white text-blue-600 rounded-md text-sm font-medium">
                10 stamps = Free coffee
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <CreditCard className="text-purple-600" size={16} />
                  </div>
                  <span className="font-bold">VIP Member</span>
                </div>
                <div className="text-xs bg-purple-700 py-1 px-2 rounded-full">
                  Active
                </div>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-purple-200">Current Points</span>
                <span className="font-bold">250 pts</span>
              </div>
              <div className="w-full bg-white bg-opacity-20 h-2 rounded-full mb-3">
                <div className="bg-white h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>0</span>
                <span>Next Reward: 1,000 pts</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <CreditCard className="text-amber-600" size={16} />
                  </div>
                  <span className="font-bold">Lunch Special</span>
                </div>
                <div className="text-xs bg-amber-700 py-1 px-2 rounded-full">
                  Active
                </div>
              </div>
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-amber-200">Valid Until</span>
                  <span className="font-medium">Dec 31, 2025</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-amber-200">Discount</span>
                  <span className="font-medium">15% Off Lunch Menu</span>
                </div>
              </div>
              <div className="text-center py-1 bg-white text-amber-600 rounded-md text-sm font-medium">
                Use code: LUNCH15
              </div>
            </div>
            
            <Link 
              to="/cards/create"
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-500 transition-colors"
            >
              <Plus size={24} className="mb-2" />
              <span className="font-medium">Create New Card</span>
              <span className="text-xs mt-1">Add to your collection</span>
            </Link>
          </div>
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