import React from 'react';
import { Minus, Plus, Check, Stamp, CreditCard, Clock } from 'lucide-react';

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

interface ScannedCustomerDisplayProps {
  scannedCustomer: ScannedCustomer;
  pointsToAdd: number;
  setPointsToAdd: (val: number) => void;
  handleAddPoints: () => void;
  handleCancel: () => void;
}

const ScannedCustomerDisplay: React.FC<ScannedCustomerDisplayProps> = ({
  scannedCustomer,
  pointsToAdd,
  setPointsToAdd,
  handleAddPoints,
  handleCancel,
}) => {
  return (
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
            <div className="text-2xl font-bold text-gray-900">
              {scannedCustomer.loyaltyCardType === 'stamp' ? scannedCustomer.currentStamps : scannedCustomer.currentPoints}
            </div>
            <p className="text-xs text-gray-500">
              {scannedCustomer.loyaltyCardType === 'stamp' ? 'Current Stamps' : 'Current Points'}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full mx-auto mb-2 shadow-sm">
              <CreditCard size={20} className="text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {scannedCustomer.loyaltyCardType === 'stamp' ? scannedCustomer.currentStamps : scannedCustomer.currentPoints}
            </div>
            <p className="text-xs text-gray-500">
              {scannedCustomer.loyaltyCardType === 'stamp' ? 'Total Stamps' : 'Total Points'}
            </p>
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
        <h3 className="text-sm font-medium text-gray-700 mb-3">Add {scannedCustomer.loyaltyCardType === 'stamp' ? 'Stamps' : 'Points'}</h3>
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
          Add {scannedCustomer.loyaltyCardType === 'stamp' ? 'Stamps' : 'Points'}
        </button>
      </div>
    </div>
  );
};

export default ScannedCustomerDisplay;
