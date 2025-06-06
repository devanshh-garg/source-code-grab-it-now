import React, { useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface ScannerControlsProps {
  isCameraActive: boolean;
  setIsCameraActive: (active: boolean) => void;
  fetchCustomerData: (customerLoyaltyCardId: string) => Promise<void>;
  setScannedCustomer: (customer: any) => void;
  setSuccessMessage: (msg: string) => void;
  scannerRef: React.MutableRefObject<Html5QrcodeScanner | null>;
}

const ScannerControls: React.FC<ScannerControlsProps> = ({
  isCameraActive,
  setIsCameraActive,
  fetchCustomerData,
  setScannedCustomer,
  setSuccessMessage,
  scannerRef,
}) => {
  const [manualInput, setManualInput] = useState('');

  const handleStartScan = () => {
    setIsCameraActive(true);
    scannerRef.current = new Html5QrcodeScanner(
      'qr-reader',
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );
    scannerRef.current.render(
      async (decodedText) => {
        if (scannerRef.current) {
          scannerRef.current.clear();
        }
        setIsCameraActive(false);
        try {
          const url = new URL(decodedText);
          const customerLoyaltyCardId = url.pathname.split('/').pop();
          if (!customerLoyaltyCardId) throw new Error('Invalid QR code');
          await fetchCustomerData(customerLoyaltyCardId);
        } catch (error) {
          setSuccessMessage('Invalid QR code or customer not found');
        }
      },
      (errorMessage) => {
        setSuccessMessage('QR scan error: ' + errorMessage);
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

  const handleManualLookup = () => {
    // Implement manual lookup logic here
    setSuccessMessage('Manual lookup not implemented');
  };

  return (
    <div>
      {isCameraActive ? (
        <div>
          <div id="qr-reader" className="mb-4"></div>
          <button onClick={handleCancel} className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md transition-colors">
            Cancel
          </button>
        </div>
      ) : (
        <button onClick={handleStartScan} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors">
          Start Scanning
        </button>
      )}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Manual Lookup</h3>
        <div className="relative">
          <input
            type="text"
            value={manualInput}
            onChange={e => setManualInput(e.target.value)}
            placeholder="Search by name, email or phone..."
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <button className="absolute right-2 top-2 text-blue-600" onClick={handleManualLookup}>
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScannerControls;
