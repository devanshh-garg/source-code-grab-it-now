import React, { useState } from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart as RechartsBarChart,
  Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  BarChart3, TrendingUp, Users, CreditCard, 
  Calendar, ChevronDown, Download, Filter,
  PieChart, Share2
} from 'lucide-react';

const AnalyticsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState('last30');
  
  const stats = [
    { 
      name: 'Total Card Scans', 
      value: '1,253', 
      change: '+12.5%', 
      trend: 'up', 
      icon: <CreditCard size={20} className="text-blue-600" /> 
    },
    { 
      name: 'Active Customers', 
      value: '124', 
      change: '+8.2%', 
      trend: 'up', 
      icon: <Users size={20} className="text-purple-600" /> 
    },
    { 
      name: 'Reward Redemptions', 
      value: '45', 
      change: '+18.3%', 
      trend: 'up', 
      icon: <BarChart3 size={20} className="text-emerald-600" /> 
    },
    { 
      name: 'Avg. Points per Customer', 
      value: '287', 
      change: '+5.7%', 
      trend: 'up', 
      icon: <TrendingUp size={20} className="text-amber-600" /> 
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">
          Track your loyalty program performance metrics.
        </p>
      </div>

      {/* Date range selector and actions */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <Calendar size={18} className="text-gray-400 mr-2" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border-none bg-transparent text-gray-700 font-medium focus:outline-none focus:ring-0 pr-8"
            >
              <option value="last7">Last 7 days</option>
              <option value="last30">Last 30 days</option>
              <option value="last90">Last 90 days</option>
              <option value="lastYear">Last year</option>
              <option value="custom">Custom range</option>
            </select>
            <ChevronDown size={16} className="text-gray-400 -ml-6" />
          </div>
          <div className="flex space-x-2">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors">
              <Filter size={18} className="mr-2 text-gray-500" />
              <span>Filter</span>
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors">
              <Download size={18} className="mr-2 text-gray-500" />
              <span>Export</span>
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors">
              <Share2 size={18} className="mr-2 text-gray-500" />
              <span>Share</span>
            </button>
          </div>
        </div>
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
                <TrendingUp size={14} className="ml-1" />
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.name}</h3>
            <p className="text-gray-900 text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Customer Activity Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Customer Activity</h2>
            <select
              className="border border-gray-300 rounded-md text-sm p-1"
              defaultValue="daily"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          
          <div className="h-64 flex items-end space-x-2">
            {[35, 45, 30, 25, 40, 50, 60, 45, 50, 55, 65, 70, 60, 65].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-blue-500 rounded-t"
                  style={{ height: `${height}%` }}
                ></div>
                <div className="text-xs mt-1 text-gray-500">
                  {i+1}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Rewards Redemption Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Rewards Redemption</h2>
            <button className="text-sm text-blue-600">
              View Details
            </button>
          </div>
          
          <div className="flex items-center justify-center h-64">
            <div className="relative w-40 h-40">
              {/* Donut chart simulation */}
              <div className="absolute inset-0 rounded-full border-8 border-blue-500" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}></div>
              <div className="absolute inset-0 rounded-full border-8 border-purple-500" style={{ clipPath: 'polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)' }}></div>
              <div className="absolute inset-0 rounded-full border-8 border-amber-500" style={{ clipPath: 'polygon(50% 50%, 50% 100%, 0 100%, 0 50%)' }}></div>
              <div className="absolute inset-0 rounded-full border-8 border-emerald-500" style={{ clipPath: 'polygon(50% 50%, 0 50%, 0 0, 50% 0)' }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <PieChart size={24} className="text-gray-400" />
              </div>
            </div>
            
            <div className="ml-8">
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Free Coffee (45%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Discount (25%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Gift Item (20%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Other (10%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card Performance */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Card Performance</h2>
            <button className="text-sm text-blue-600">
              View All Cards
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Coffee Rewards */}
            <div className="border border-gray-100 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <CreditCard className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Coffee Rewards</h3>
                    <p className="text-sm text-gray-500">56 active customers</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">780 scans</div>
                  <div className="text-xs text-green-500">+15.4%</div>
                </div>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full mt-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            
            {/* VIP Member */}
            <div className="border border-gray-100 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <CreditCard className="text-purple-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">VIP Member</h3>
                    <p className="text-sm text-gray-500">32 active customers</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">345 scans</div>
                  <div className="text-xs text-green-500">+8.2%</div>
                </div>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full mt-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            
            {/* Lunch Special */}
            <div className="border border-gray-100 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                    <CreditCard className="text-amber-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Lunch Special</h3>
                    <p className="text-sm text-gray-500">18 active customers</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">128 scans</div>
                  <div className="text-xs text-green-500">+5.7%</div>
                </div>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full mt-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Retention */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Customer Retention</h2>
            <button className="text-sm text-blue-600">
              Details
            </button>
          </div>
          
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-8 border-blue-100">
              <div className="text-3xl font-bold text-blue-600">86%</div>
            </div>
            <p className="text-sm text-gray-500 mt-2">30-day retention rate</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">New customers</div>
              <div className="font-medium">24</div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">Returning customers</div>
              <div className="font-medium">98</div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">Inactive customers</div>
              <div className="font-medium">12</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;