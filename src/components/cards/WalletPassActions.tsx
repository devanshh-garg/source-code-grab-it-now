
import React, { useState } from 'react';
import { QrCode, Copy, Download, Smartphone } from 'lucide-react';
import { useWalletPasses } from '../../hooks/useWalletPasses';
import type { LoyaltyCard } from '../../hooks/useLoyaltyCards';

interface WalletPassActionsProps {
  card: LoyaltyCard;
}

const WalletPassActions: React.FC<WalletPassActionsProps> = ({ card }) => {
  const { generateWalletPass, generateQRCode, loading } = useWalletPasses();
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  const handleGenerateQR = async () => {
    try {
      const url = await generateQRCode(card.id);
      setQrCodeUrl(url);
    } catch (error) {
      alert('Failed to generate QR code');
    }
  };

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
          onClick={handleGenerateQR}
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

      {qrCodeUrl && (
        <div className="mt-3 text-center">
          <img src={qrCodeUrl} alt="QR Code" className="mx-auto w-32 h-32" />
        </div>
      )}
    </div>
  );
};

export default WalletPassActions;
