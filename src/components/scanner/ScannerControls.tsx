
import React, { useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useToast } from '../ui/use-toast';
import { Loader2, Search, AlertCircle, CheckCircle2 } from 'lucide-react';

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
  const [manualLoading, setManualLoading] = useState(false);
  const [scannerLoading, setScannerLoading] = useState(false);
  const [inputError, setInputError] = useState('');
  const { toast } = useToast();

  const handleStartScan = async () => {
    try {
      setScannerLoading(true);
      setIsCameraActive(true);
      
      scannerRef.current = new Html5QrcodeScanner(
        'qr-reader',
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          showTorchButtonIfSupported: true,
          showZoomSliderIfSupported: true,
          defaultZoomValueIfSupported: 2,
        },
        false
      );
      
      scannerRef.current.render(
        async (decodedText) => {
          if (scannerRef.current) {
            scannerRef.current.clear();
          }
          setIsCameraActive(false);
          setScannerLoading(false);
          
          try {
            const url = new URL(decodedText);
            const customerLoyaltyCardId = url.pathname.split('/').pop();
            if (!customerLoyaltyCardId) throw new Error('Invalid QR code format');
            
            await fetchCustomerData(customerLoyaltyCardId);
            toast({
              title: "QR Code Scanned Successfully",
              description: "Customer information loaded.",
            });
          } catch (error) {
            console.error('QR scan processing error:', error);
            toast({
              title: "Invalid QR Code",
              description: "Please scan a valid customer loyalty card QR code.",
            });
            setSuccessMessage('Invalid QR code or customer not found');
          }
        },
        (errorMessage) => {
          console.warn('QR scan error:', errorMessage);
          // Don't show toast for common scanning errors (user just scanning)
          if (!errorMessage.includes('No QR code found')) {
            toast({
              title: "Camera Error",
              description: "Please check camera permissions and try again.",
            });
          }
        }
      );
      
      setScannerLoading(false);
    } catch (error) {
      console.error('Scanner initialization error:', error);
      setScannerLoading(false);
      setIsCameraActive(false);
      toast({
        title: "Camera Access Failed",
        description: "Please allow camera access and try again.",
      });
    }
  };

  const handleCancel = () => {
    try {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    } catch (error) {
      console.warn('Scanner cleanup error:', error);
    } finally {
      setIsCameraActive(false);
      setScannerLoading(false);
      setScannedCustomer(null);
      setSuccessMessage('');
    }
  };

  const validateManualInput = (input: string): boolean => {
    if (!input.trim()) {
      setInputError('Please enter a search term');
      return false;
    }
    
    if (input.trim().length < 2) {
      setInputError('Search term must be at least 2 characters');
      return false;
    }
    
    setInputError('');
    return true;
  };

  const handleManualLookup = async () => {
    if (!validateManualInput(manualInput)) {
      return;
    }
    
    setManualLoading(true);
    setInputError('');
    
    try {
      // Simulate manual lookup (replace with actual implementation)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Search Feature Coming Soon",
        description: "Manual customer lookup will be available in the next update.",
      });
      
      setSuccessMessage('Manual lookup feature coming soon');
    } catch (error) {
      console.error('Manual lookup error:', error);
      toast({
        title: "Search Failed",
        description: "Unable to search for customer. Please try again.",
      });
      setInputError('Search failed. Please try again.');
    } finally {
      setManualLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setManualInput(value);
    
    // Clear error when user starts typing
    if (inputError) {
      setInputError('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !manualLoading) {
      e.preventDefault();
      handleManualLookup();
    }
  };

  return (
    <div className="space-y-6">
      {/* QR Scanner Section */}
      <div>
        {isCameraActive ? (
          <div className="space-y-4">
            <div id="qr-reader" className="rounded-lg overflow-hidden border border-gray-200"></div>
            <button 
              onClick={handleCancel} 
              disabled={scannerLoading}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Cancel QR code scanning"
            >
              {scannerLoading ? (
                <>
                  <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
                  Initializing Camera...
                </>
              ) : (
                'Cancel Scanning'
              )}
            </button>
          </div>
        ) : (
          <button 
            onClick={handleStartScan}
            disabled={scannerLoading || manualLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Start QR code scanning"
          >
            {scannerLoading ? (
              <>
                <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
                Starting Scanner...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 inline mr-2" />
                Start Scanning
              </>
            )}
          </button>
        )}
      </div>

      {/* Manual Lookup Section */}
      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Manual Lookup</h3>
        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={manualInput}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              disabled={manualLoading || isCameraActive}
              placeholder="Search by name, email or phone..."
              aria-label="Search for customer by name, email or phone"
              aria-invalid={!!inputError}
              aria-describedby={inputError ? "search-error" : "search-help"}
              className={`block w-full pl-3 pr-12 py-2 border rounded-md focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:cursor-not-allowed sm:text-sm ${
                inputError 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
            />
            <button 
              type="button"
              onClick={handleManualLookup}
              disabled={manualLoading || isCameraActive || !manualInput.trim()}
              className="absolute right-2 top-2 p-1 text-blue-600 hover:text-blue-500 disabled:text-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-label="Search for customer"
            >
              {manualLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </button>
          </div>
          
          {inputError && (
            <div id="search-error" className="flex items-center text-sm text-red-600" role="alert">
              <AlertCircle className="w-4 h-4 mr-1" />
              {inputError}
            </div>
          )}
          
          <div id="search-help" className="text-xs text-gray-500">
            Enter at least 2 characters to search for customers
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScannerControls;
