
import React, { useState } from 'react';
import { QrCode, Copy, Download, Smartphone } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useWalletPasses } from '../../hooks/useWalletPasses';
import type { LoyaltyCard } from '../../hooks/useLoyaltyCards';

interface WalletPassActionsProps {
  card: LoyaltyCard;
}

const WalletPassActions: React.FC<WalletPassActionsProps> = ({ card }) => {
  const { generateWalletPass, loading } = useWalletPasses();
  const [showQr, setShowQr] = useState(false);

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/card/${card.id}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Link copied to clipboard!');
  };

  const handleDownloadPass = async (type: 'apple' | 'google') => {
    try {
      await generateWalletPass(card, type);
    } catch (error) {
      alert('Failed to generate wallet pass');
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <h4 className="text-sm font-medium text-gray-900 mb-3">Share & Download</h4>
      
      <div className="grid grid-cols-2 gap-2 mb-3">
        <button
          onClick={() => handleDownloadPass('apple')}
          disabled={loading}
          className="inline-flex items-center justify-center px-3 py-2 text-xs border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <Smartphone size={14} className="mr-1" />
          Apple Wallet
        </button>
        <button
          onClick={() => handleDownloadPass('google')}
          disabled={loading}
          className="inline-flex items-center justify-center px-3 py-2 text-xs border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <Download size={14} className="mr-1" />
          Google Wallet
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setShowQr(true)}
          disabled={loading}
          className="inline-flex items-center justify-center px-3 py-2 text-xs border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <QrCode size={14} className="mr-1" />
          Get QR Code
        </button>
        <button
          onClick={handleCopyLink}
          className="inline-flex items-center justify-center px-3 py-2 text-xs border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
        >
          <Copy size={14} className="mr-1" />
          Copy Link
        </button>
      </div>

      {showQr && (
        <div className="flex flex-col items-center mt-4">
          <div className="flex flex-row gap-8">
            <div className="flex flex-col items-center">
              <QRCodeCanvas
                value={`${window.location.origin}/api/wallet/apple/${card.id}`}
                size={128}
                level="H"
                includeMargin={true}
              />
              <span className="text-xs mt-2 text-gray-500">Apple Wallet</span>
            </div>
            <div className="flex flex-col items-center">
              <QRCodeCanvas
                value={`${window.location.origin}/api/wallet/google/${card.id}`}
                size={128}
                level="H"
                includeMargin={true}
              />
              <span className="text-xs mt-2 text-gray-500">Google Wallet</span>
            </div>
          </div>
          <button
            className="mt-4 text-xs text-blue-600 hover:underline"
            onClick={() => setShowQr(false)}
          >
            Hide QR Codes
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletPassActions;
