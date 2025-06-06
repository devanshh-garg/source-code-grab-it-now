import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { 
  QrCode, Check, Plus, Minus, Users, 
  CreditCard, Clock, Stamp
} from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import { useCustomerLoyaltyCards } from '../../hooks/useCustomerLoyaltyCards';
import { toast } from '../../components/ui/use-toast';

interface ScannedCustomer {
  id: string;
  name: string;
  email: string;
  cardType: string;
  loyaltyCardType: string;
  currentPoints: number;
  totalPoints: number;
  scans: number;
  lastVisit: string;
  customerLoyaltyCardId: string;
}

const ScannerPage: React.FC = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [scannedCustomer, setScannedCustomer] = useState<ScannedCustomer | null>(null);
  const [pointsToAdd, setPointsToAdd] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const { updateCustomerLoyaltyCard } = useCustomerLoyaltyCards();

  useEffect(() => {
    // Cleanup scanner on component unmount
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, []);

  const fetchCustomerData = async (customerLoyaltyCardId: string) => {
    try {
      const { data, error } = await supabase
        .from('customer_loyalty_cards')
        .select(`
          id,
          points,
          stamps,
          last_activity,
          customer_profiles (
            id,
            name,
            email
          ),
          loyalty_cards (
            id,
            name,
            type
          )
        `)
        .eq('id', customerLoyaltyCardId)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Customer loyalty card not found');

      const customerData: ScannedCustomer = {
        id: data.customer_profiles.id,
        name: data.customer_profiles.name,
        email: data.customer_profiles.email,
        cardType: data.loyalty_cards.name,
        loyaltyCardType: data.loyalty_cards.type,
        currentPoints: data.stamps || data.points || 0,
        totalPoints: data.points || 0,
        scans: 0, // This could be calculated from a transactions table if needed
        lastVisit: data.last_activity,
        customerLoyaltyCardId: data.id
      };

      setScannedCustomer(customerData);
      return customerData;
    } catch (error) {
      console.error('Error fetching customer data:', error);
      throw error;
    }
  };

  const handleStartScan = () => {
    setIsCameraActive(true);
    
    // Initialize QR scanner
    scannerRef.current = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scannerRef.current.render(
      async (decodedText) => {
        // Stop scanning after successful scan
        if (scannerRef.current) {
          scannerRef.current.clear();
        }
        setIsCameraActive(false);

        try {
          // Extract customer loyalty card ID from QR code
          const url = new URL(decodedText);
          const customerLoyaltyCardId = url.pathname.split('/').pop();
          
          if (!customerLoyaltyCardId) {
            throw new Error('Invalid QR code');
          }

          // Fetch customer data
          await fetchCustomerData(customerLoyaltyCardId);
        } catch (error) {
          console.error('Error processing QR code:', error);
          toast({
            title: "Error",
            description: "Invalid QR code or customer not found"
          });
        }
      },
      (errorMessage) => {
        console.error('QR scan error:', errorMessage);
      }
    );
  };

  const handleCancel = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
    }
    setIsCameraActive(false);
    setScannedCustomer(null);
    setSuccessMessage('');
  };

  const handleAddPoints = async () => {
    if (!scannedCustomer) return;

    try {
      const updates = {
        points: scannedCustomer.currentPoints + pointsToAdd,
        last_activity: new Date().toISOString()
      };

      await updateCustomerLoyaltyCard(scannedCustomer.customerLoyaltyCardId, updates);

      // Log transaction
      const transactionData = {
        customer_card_id: scannedCustomer.customerLoyaltyCardId,
        type: 'earn',
        points: scannedCustomer.loyaltyCardType === 'points' ? pointsToAdd : 0,
        stamps: scannedCustomer.loyaltyCardType === 'stamp' ? pointsToAdd : 0,
        metadata: {}
      };

      const { error: transactionError } = await supabase
        .from('transactions')
        .insert(transactionData);

      if (transactionError) {
        console.error('Error logging transaction:', transactionError);
        throw transactionError;
      }

      // Update scanned customer state
      setScannedCustomer(prev => prev ? {
        ...prev,
        currentPoints: prev.currentPoints + pointsToAdd,
        totalPoints: prev.totalPoints + pointsToAdd,
        lastVisit: new Date().toISOString()
      } : null);

      // Add to recent activity
      const activity = {
        type: 'points_added',
        customerName: scannedCustomer.name,
        points: pointsToAdd,
        timestamp: new Date().toISOString()
      };
      setRecentActivity(prev => [activity, ...prev].slice(0, 5));

      setSuccessMessage(`Successfully added ${pointsToAdd} ${pointsToAdd === 1 ? 'point' : 'points'} to ${scannedCustomer.name}'s card!`);
      setPointsToAdd(1);

      toast({
        title: "Success",
        description: `Added ${pointsToAdd} points to ${scannedCustomer.name}'s card`
      });
    } catch (error) {
      console.error('Error adding points:', error);
      toast({
        title: "Error",
        description: "Failed to add points. Please try again."
      });
    }
  };

  const handleNewScan = () => {
    setScannedCustomer(null);
    setSuccessMessage('');
    handleStartScan();
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
                    <div id="qr-reader" className="mb-4"></div>
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
                      <p className="text-xs text-gray-500">Current Points</p>
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
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Add Points</h3>
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
                    Add Points
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
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      Added {activity.points} point(s) for <span className="text-blue-600">{activity.customerName}</span>
                    </p>
                  </div>
                </div>
              ))}

              {recentActivity.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  No recent activity
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;
