
import React, { useState } from 'react';
import { Download, QrCode, Link2, Copy, Smartphone, Check } from 'lucide-react';
import { useWalletPasses } from '../../hooks/useWalletPasses';
import type { LoyaltyCard } from '../../hooks/useLoyaltyCards';

interface WalletPassActionsProps {
  card: LoyaltyCard;
}

const WalletPassActions: React.FC<WalletPassActionsProps> = ({ card }) => {
  const { generateWalletPass, generateQRCode, getCardShareUrl, copyToClipboard, loading } = useWalletPasses();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownloadApplePass = async () => {
    try {
      await generateWalletPass(card, 'apple');
    } catch (error) {
      alert('Failed to generate Apple Wallet pass. Please try again.');
    }
  };

  const handleDownloadGooglePass = async () => {
    try {
      await generateWalletPass(card, 'google');
    } catch (error) {
      alert('Failed to generate Google Wallet pass. Please try again.');
    }
  };

  const handleShowQR = async () => {
    if (!qrCode) {
      try {
        const qrCodeUrl = await generateQRCode(card.id);
        setQrCode(qrCodeUrl);
      } catch (error) {
        alert('Failed to generate QR code. Please try again.');
        return;
      }
    }
    setShowQR(!showQR);
  };

  const handleCopyLink = async () => {
    const url = getCardShareUrl(card.id);
    const success = await copyToClipboard(url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      alert('Failed to copy link to clipboard.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Download Wallet Pass</h3>
        <div className="flex flex-col space-y-2">
          <button
            onClick={handleDownloadApplePass}
            disabled={loading}
            className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <Smartphone size={16} className="mr-2" />
            Add to Apple Wallet
          </button>
          <button
            onClick={handleDownloadGooglePass}
            disabled={loading}
            className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <Download size={16} className="mr-2" />
            Add to Google Wallet
          </button>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Share Card</h3>
        <div className="flex space-x-2">
          <button
            onClick={handleShowQR}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <QrCode size={16} className="mr-2" />
            QR Code
          </button>
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {copied ? <Check size={16} className="mr-2 text-green-600" /> : <Copy size={16} className="mr-2" />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>

      {showQR && qrCode && (
        <div className="border-t border-gray-200 pt-4">
          <div className="text-center">
            <img src={qrCode} alt="QR Code" className="mx-auto mb-2 w-32 h-32" />
            <p className="text-xs text-gray-500">Scan to view loyalty card</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletPassActions;
