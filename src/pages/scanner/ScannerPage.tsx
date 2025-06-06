
import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Check } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import { useCustomerLoyaltyCards } from '../../hooks/useCustomerLoyaltyCards';
import { useTransactions } from '../../hooks/useTransactions';
import { toast } from '../../components/ui/use-toast';
import ScannerControls from '../../components/scanner/ScannerControls';
import ScannedCustomerDisplay from '../../components/scanner/ScannedCustomerDisplay';
import ScannerRecentActivity from '../../components/scanner/ScannerRecentActivity';

interface ScannedCustomer {
  id: string;
  name: string;
  email: string;
  cardType: string;
  loyaltyCardType: string;
  currentStamps?: number;
  currentPoints?: number;
  lastVisit: string;
  customerLoyaltyCardId: string;
}

const ScannerPage: React.FC = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [scannedCustomer, setScannedCustomer] = useState<ScannedCustomer | null>(null);
  const [pointsToAdd, setPointsToAdd] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const { updateCustomerLoyaltyCard } = useCustomerLoyaltyCards();
  const { createTransaction } = useTransactions();

  useEffect(() => {
    // Cleanup scanner on component unmount
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, []);

  // Return type void for ScannerControls compatibility
  const fetchCustomerData = async (customerLoyaltyCardId: string): Promise<void> => {
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

      // Clarified points/stamps logic
      const customerData: ScannedCustomer = {
        id: data.customer_profiles.id,
        name: data.customer_profiles.name,
        email: data.customer_profiles.email,
        cardType: data.loyalty_cards.name,
        loyaltyCardType: data.loyalty_cards.type,
        currentStamps: data.loyalty_cards.type === 'stamp' ? data.stamps : 0,
        currentPoints: data.loyalty_cards.type === 'points' ? data.points : 0,
        lastVisit: data.last_activity,
        customerLoyaltyCardId: data.id
      };

      setScannedCustomer(customerData);
      return;

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
      const updates = scannedCustomer.loyaltyCardType === 'points'
        ? { points: (scannedCustomer.currentPoints ?? 0) + pointsToAdd, last_activity: new Date().toISOString() }
        : { stamps: (scannedCustomer.currentStamps ?? 0) + pointsToAdd, last_activity: new Date().toISOString() };

      await updateCustomerLoyaltyCard(scannedCustomer.customerLoyaltyCardId, updates);

      // Log transaction
      const transactionData = {
        customer_card_id: scannedCustomer.customerLoyaltyCardId,
        type: 'earn',
        points: scannedCustomer.loyaltyCardType === 'points' ? pointsToAdd : 0,
        stamps: scannedCustomer.loyaltyCardType === 'stamp' ? pointsToAdd : 0,
        metadata: {}
      };

      await createTransaction(transactionData);

      // Update scanned customer state
      setScannedCustomer(prev => prev ? {
        ...prev,
        currentPoints: prev.loyaltyCardType === 'points' ? (prev.currentPoints ?? 0) + pointsToAdd : prev.currentPoints,
        currentStamps: prev.loyaltyCardType === 'stamp' ? (prev.currentStamps ?? 0) + pointsToAdd : prev.currentStamps,
        lastVisit: new Date().toISOString()
      } : null);

      // Add to recent activity
      const activity = {
        type: 'points_added',
        customerName: scannedCustomer.name,
        points: pointsToAdd,
        mode: 'add',
        timestamp: new Date().toISOString()
      };
      setRecentActivity(prev => [activity, ...prev].slice(0, 5));

      setSuccessMessage(`Successfully added ${pointsToAdd} ${scannedCustomer.loyaltyCardType === 'stamp' ? 'stamp' : 'point'}${pointsToAdd === 1 ? '' : 's'} to ${scannedCustomer.name}'s card!`);
      setPointsToAdd(1);
      setIsRedeeming(false);

      toast({
        title: "Success",
        description: `Added ${pointsToAdd} ${scannedCustomer.loyaltyCardType === 'stamp' ? 'stamp' : 'point'}${pointsToAdd === 1 ? '' : 's'} to ${scannedCustomer.name}'s card`
      });
    } catch (error) {
      console.error('Error adding points:', error);
      toast({
        title: "Error",
        description: "Failed to add points/stamps. Please try again."
      });
    }
  };

  const handleRedeemPoints = async () => {
    if (!scannedCustomer) return;
    const available = scannedCustomer.loyaltyCardType === 'points' ? (scannedCustomer.currentPoints ?? 0) : (scannedCustomer.currentStamps ?? 0);
    if (pointsToAdd > available) {
      toast({
        title: "Not enough to redeem",
        description: `Customer only has ${available} ${scannedCustomer.loyaltyCardType === 'stamp' ? 'stamps' : 'points'} available.`
      });
      return;
    }
    try {
      const updates = scannedCustomer.loyaltyCardType === 'points'
        ? { points: available - pointsToAdd, last_activity: new Date().toISOString() }
        : { stamps: available - pointsToAdd, last_activity: new Date().toISOString() };
      await updateCustomerLoyaltyCard(scannedCustomer.customerLoyaltyCardId, updates);
      // Log transaction
      const transactionData = {
        customer_card_id: scannedCustomer.customerLoyaltyCardId,
        type: 'redeem',
        points: scannedCustomer.loyaltyCardType === 'points' ? pointsToAdd : 0,
        stamps: scannedCustomer.loyaltyCardType === 'stamp' ? pointsToAdd : 0,
        metadata: {}
      };
      await createTransaction(transactionData);
      setScannedCustomer(prev => prev ? {
        ...prev,
        currentPoints: prev.loyaltyCardType === 'points' ? available - pointsToAdd : prev.currentPoints,
        currentStamps: prev.loyaltyCardType === 'stamp' ? available - pointsToAdd : prev.currentStamps,
        lastVisit: new Date().toISOString()
      } : null);
      // Add to recent activity
      const activity = {
        type: 'points_redeemed',
        customerName: scannedCustomer.name,
        points: pointsToAdd,
        mode: 'redeem',
        timestamp: new Date().toISOString()
      };
      setRecentActivity(prev => [activity, ...prev].slice(0, 5));
      setSuccessMessage(`Successfully redeemed ${pointsToAdd} ${scannedCustomer.loyaltyCardType === 'stamp' ? 'stamp' : 'point'}${pointsToAdd === 1 ? '' : 's'} from ${scannedCustomer.name}'s card!`);
      setPointsToAdd(1);
      setIsRedeeming(false);
      toast({
        title: "Success",
        description: `Redeemed ${pointsToAdd} ${scannedCustomer.loyaltyCardType === 'stamp' ? 'stamp' : 'point'}${pointsToAdd === 1 ? '' : 's'} from ${scannedCustomer.name}'s card`
      });
    } catch (error) {
      console.error('Error redeeming points:', error);
      toast({
        title: "Error",
        description: "Failed to redeem points/stamps. Please try again."
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
              <ScannerControls
                isCameraActive={isCameraActive}
                setIsCameraActive={setIsCameraActive}
                fetchCustomerData={fetchCustomerData}
                setScannedCustomer={setScannedCustomer}
                setSuccessMessage={setSuccessMessage}
                scannerRef={scannerRef}
              />
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
              <ScannedCustomerDisplay
                scannedCustomer={scannedCustomer}
                pointsToAdd={pointsToAdd}
                setPointsToAdd={setPointsToAdd}
                handleAddPoints={handleAddPoints}
                handleRedeemPoints={handleRedeemPoints}
                handleCancel={handleCancel}
                isRedeemMode={isRedeeming}
                setIsRedeemMode={setIsRedeeming}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;
