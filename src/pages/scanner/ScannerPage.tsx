import React, { useState } from 'react';
import { 
  QrCode, Check, Plus, Minus, Users, 
  CreditCard, Clock, Stamp
} from 'lucide-react';

const ScannerPage: React.FC = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [scannedCustomer, setScannedCustomer] = useState<any>(null);
  const [pointsToAdd, setPointsToAdd] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');

  // Mock scan function
  const handleStartScan = () => {
    setIsCameraActive(true);
    // Simulate a scan after 2 seconds
    setTimeout(() => {
      const mockCustomer = {
        id: 'cust-123',
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        cardType: 'Coffee Rewards',
        currentPoints: 6,
        totalPoints: 450,
        scans: 24,
        lastVisit: '2023-11-10',
      };
      setScannedCustomer(mockCustomer);
      setIsCameraActive(false);
    }, 2000);
  };

  const handleCancel = () => {
    setIsCameraActive(false);
    setScannedCustomer(null);
    setSuccessMessage('');
  };

  const handleAddPoints = () => {
    // Simulate adding points
    setSuccessMessage(`Successfully added ${pointsToAdd} ${pointsToAdd === 1 ? 'stamp' : 'stamps'} to ${scannedCustomer.name}'s card!`);
    setScannedCustomer({
      ...scannedCustomer,
      currentPoints: scannedCustomer.currentPoints + pointsToAdd,
      totalPoints: scannedCustomer.totalPoints + (pointsToAdd * 10),
      scans: scannedCustomer.scans + 1,
    });
    
    // Reset points to add
    setPointsToAdd(1);
  };

  const handleNewScan = () => {
    setScannedCustomer(null);
    setSuccessMessage('');
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Scanner</h1>
        <p className="text-gray-600 mt-1">
          Scan customer cards to award points or stamps.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Scanner section */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            {!scannedCustomer && !successMessage && (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <QrCode size={32} className="text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Scan Customer Card</h2>
                  <p className="text-gray-500 mt-1">
                    Scan the QR code on a customer's digital loyalty card
                  </p>
                </div>

                {isCameraActive ? (
                  <div>
                    <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center relative overflow-hidden mb-4">
                      <div className="absolute inset-0 bg-gray-800"></div>
                      <div className="absolute w-3/4 h-3/4 border-2 border-blue-400 rounded-lg"></div>
                      <div className="absolute w-full h-0.5 bg-blue-400 animate-scan"></div>
                      <p className="text-white text-sm absolute bottom-4">Scanning...</p>
                    </div>
                    <button
                      onClick={handleCancel}
                      className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleStartScan}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                  >
                    Start Scanning
                  </button>
                )}

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Manual Lookup</h3>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by name, email or phone..."
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <button className="absolute right-2 top-2 text-blue-600">
                      Search
                    </button>
                  </div>
                </div>
              </>
            )}

            {successMessage && (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={32} className="text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Success!</h2>
                <p className="text-gray-600 mb-6">{successMessage}</p>
                <div className="flex space-x-4 justify-center">
                  <button
                    onClick={handleNewScan}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                  >
                    Scan New Card
                  </button>
                </div>
              </div>
            )}

            {scannedCustomer && !successMessage && (
              <div>
                <div className="flex items-start mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    {scannedCustomer.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{scannedCustomer.name}</h2>
                    <p className="text-gray-500">{scannedCustomer.email}</p>
                    <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {scannedCustomer.cardType}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full mx-auto mb-2 shadow-sm">
                        <Stamp size={20} className="text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{scannedCustomer.currentPoints}</div>
                      <p className="text-xs text-gray-500">Current Stamps</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full mx-auto mb-2 shadow-sm">
                        <CreditCard size={20} className="text-purple-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{scannedCustomer.totalPoints}</div>
                      <p className="text-xs text-gray-500">Total Points</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full mx-auto mb-2 shadow-sm">
                        <Clock size={20} className="text-emerald-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{new Date(scannedCustomer.lastVisit).toLocaleDateString()}</div>
                      <p className="text-xs text-gray-500">Last Visit</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Add Stamps</h3>
                  <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
                    <button
                      onClick={() => setPointsToAdd(Math.max(1, pointsToAdd - 1))}
                      className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <Minus size={20} className="text-gray-600" />
                    </button>
                    <span className="text-2xl font-bold text-gray-900">{pointsToAdd}</span>
                    <button
                      onClick={() => setPointsToAdd(pointsToAdd + 1)}
                      className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <Plus size={20} className="text-gray-600" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleCancel}
                    className="py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddPoints}
                    className="py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                  >
                    Add Stamps
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent activity section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <button className="text-sm text-blue-600 font-medium">
                View All
              </button>
            </div>
            
            <div className="space-y-5">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                  <Stamp size={16} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">10 min ago</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mt-1">Added 1 stamp for <span className="text-blue-600">Michael Brown</span></p>
                  <p className="text-xs text-gray-500 mt-1">Coffee Rewards • Current stamps: 7</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mt-1">
                  <Check size={16} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">35 min ago</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mt-1"><span className="text-blue-600">Alice Thompson</span> redeemed a reward</p>
                  <p className="text-xs text-gray-500 mt-1">Free Coffee • 10 stamps completed</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                  <Stamp size={16} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">1 hour ago</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mt-1">Added 2 stamps for <span className="text-blue-600">Emily Davis</span></p>
                  <p className="text-xs text-gray-500 mt-1">Coffee Rewards • Current stamps: 4</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                  <Stamp size={16} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">2 hours ago</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mt-1">Added 1 stamp for <span className="text-blue-600">James Wilson</span></p>
                  <p className="text-xs text-gray-500 mt-1">Coffee Rewards • Current stamps: 9</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mt-1">
                  <Users size={16} className="text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">3 hours ago</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mt-1">New customer: <span className="text-blue-600">Robert Martinez</span></p>
                  <p className="text-xs text-gray-500 mt-1">Joined VIP Member program</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100">
              <button className="w-full py-2 bg-gray-50 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 transition-colors">
                Load More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;