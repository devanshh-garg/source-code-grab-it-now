import React from 'react';
import { Stamp } from 'lucide-react';

interface Activity {
  type: string; // 'points_added' | 'points_redeemed' | ...
  customerName: string;
  points: number;
  mode?: 'add' | 'redeem';
  timestamp: string;
}

interface ScannerRecentActivityProps {
  recentActivity: Activity[];
}

const ScannerRecentActivity: React.FC<ScannerRecentActivityProps> = ({ recentActivity }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
      </div>
      <div className="space-y-5">
        {recentActivity.map((activity, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mt-1">
              <Stamp size={16} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">
                  {new Date(activity.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`px-2 py-0.5 text-xs rounded-full font-semibold ${activity.mode === 'redeem' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}
                >
                  {activity.mode === 'redeem' ? 'Redeem' : 'Add'}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {activity.mode === 'redeem' ? 'Redeemed' : 'Added'} {activity.points} {activity.type === 'points_redeemed' || activity.type === 'points_added' ? 'point(s)' : 'stamp(s)'} for <span className="text-blue-600">{activity.customerName}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
        {recentActivity.length === 0 && (
          <div className="text-center text-gray-500 py-4">No recent activity</div>
        )}
      </div>
    </div>
  );
};

export default ScannerRecentActivity;
