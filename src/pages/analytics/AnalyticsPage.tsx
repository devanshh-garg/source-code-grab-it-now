import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, Users, CreditCard, 
  Calendar, ChevronDown, Download, Filter,
  Share2, Clock, ArrowUpRight, ArrowDownRight,
  DollarSign, Target, UserPlus, Award
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { supabase } from '../../integrations/supabase/client';
import { useBusinessData } from '../../hooks/useBusinessData';

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

const AnalyticsPage: React.FC = () => {
  const { business } = useBusinessData();
  const [dateRange, setDateRange] = useState('last30');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({
    totalVisits: 0,
    totalPoints: 0,
    activeCustomers: 0,
    redemptions: 0,
    revenue: 0,
    newCustomers: 0
  });
  const [dailyStats, setDailyStats] = useState<any[]>([]);
  const [rewardDistribution, setRewardDistribution] = useState<any[]>([]);

  useEffect(() => {
    if (business?.id) {
      fetchAnalytics();
    }
  }, [business, dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Calculate date range
      const endDate = endOfDay(new Date());
      const startDate = startOfDay(
        subDays(endDate, dateRange === 'last7' ? 7 : dateRange === 'last30' ? 30 : 90)
      );

      // Fetch daily stats
      const { data: statsData, error: statsError } = await supabase
        .from('analytics_daily_stats')
        .select('*')
        .eq('business_id', business?.id)
        .gte('date', startDate.toISOString())
        .lte('date', endDate.toISOString())
        .order('date', { ascending: true });

      if (statsError) throw statsError;

      // Process daily stats
      const processedStats = statsData?.map(day => ({
        date: format(new Date(day.date), 'MMM dd'),
        visits: day.total_visits,
        points: day.total_points_earned,
        revenue: day.revenue_cents / 100
      })) || [];

      setDailyStats(processedStats);

      // Calculate totals
      const totals = statsData?.reduce((acc, curr) => ({
        totalVisits: acc.totalVisits + curr.total_visits,
        totalPoints: acc.totalPoints + curr.total_points_earned,
        activeCustomers: acc.activeCustomers + curr.active_customers,
        redemptions: acc.redemptions + curr.total_points_redeemed,
        revenue: acc.revenue + curr.revenue_cents,
        newCustomers: acc.newCustomers + curr.new_customers
      }), {
        totalVisits: 0,
        totalPoints: 0,
        activeCustomers: 0,
        redemptions: 0,
        revenue: 0,
        newCustomers: 0
      });

      setStats(totals);

      // Fetch transactions and calculate distribution
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select(`
          type,
          customer_card:customer_card_id (
            card:card_id (
              business_id
            )
          )
        `)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (transactionsError) throw transactionsError;

      // Filter transactions for current business and aggregate by type
      const businessTransactions = transactionsData
        ?.filter(tx => tx.customer_card?.card?.business_id === business?.id) || [];

      const distribution = businessTransactions.reduce((acc: any[], transaction) => {
        const existingType = acc.find(item => item.type === transaction.type);
        if (existingType) {
          existingType.count++;
        } else {
          acc.push({ type: transaction.type, count: 1 });
        }
        return acc;
      }, []);

      setRewardDistribution(distribution);

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    // Implementation for downloading analytics report
    console.log('Downloading report...');
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">
          Track your loyalty program performance metrics
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
            </select>
            <ChevronDown size={16} className="text-gray-400 -ml-6" />
          </div>
          <div className="flex space-x-2">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors">
              <Filter size={18} className="mr-2 text-gray-500" />
              <span>Filter</span>
            </button>
            <button 
              onClick={downloadReport}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Download size={18} className="mr-2 text-gray-500" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <DollarSign size={20} className="text-blue-600" />
            </div>
            <div className="flex items-center text-green-500">
              <span className="text-xs font-medium">+12.5%</span>
              <ArrowUpRight size={14} className="ml-1" />
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Revenue</h3>
          <p className="text-gray-900 text-2xl font-bold mt-1">
            ${(stats.revenue / 100).toFixed(2)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <Users size={20} className="text-purple-600" />
            </div>
            <div className="flex items-center text-green-500">
              <span className="text-xs font-medium">+8.2%</span>
              <ArrowUpRight size={14} className="ml-1" />
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Active Customers</h3>
          <p className="text-gray-900 text-2xl font-bold mt-1">{stats.activeCustomers}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Award size={20} className="text-emerald-600" />
            </div>
            <div className="flex items-center text-red-500">
              <span className="text-xs font-medium">-2.3%</span>
              <ArrowDownRight size={14} className="ml-1" />
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Redemptions</h3>
          <p className="text-gray-900 text-2xl font-bold mt-1">{stats.redemptions}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <UserPlus size={20} className="text-amber-600" />
            </div>
            <div className="flex items-center text-green-500">
              <span className="text-xs font-medium">+15.7%</span>
              <ArrowUpRight size={14} className="ml-1" />
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">New Customers</h3>
          <p className="text-gray-900 text-2xl font-bold mt-1">{stats.newCustomers}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Revenue Trend</h2>
            <select className="border border-gray-300 rounded-md text-sm p-1">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyStats}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reward Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Reward Distribution</h2>
            <button className="text-sm text-blue-600">View Details</button>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={rewardDistribution}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {rewardDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            {rewardDistribution.map((reward, index) => (
              <div key={reward.type} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span className="text-sm text-gray-600">
                  {reward.type} ({((reward.count / rewardDistribution.reduce((a, b) => a + b.count, 0)) * 100).toFixed(0)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Segments */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Customer Segments</h2>
          <button className="text-sm text-blue-600">Manage Segments</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Target size={16} className="text-blue-600 mr-2" />
                <h3 className="font-medium">VIP Customers</h3>
              </div>
              <span className="text-sm text-gray-500">32%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '32%' }}></div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Target size={16} className="text-purple-600 mr-2" />
                <h3 className="font-medium">Regular Customers</h3>
              </div>
              <span className="text-sm text-gray-500">45%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Target size={16} className="text-emerald-600 mr-2" />
                <h3 className="font-medium">New Customers</h3>
              </div>
              <span className="text-sm text-gray-500">23%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '23%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;