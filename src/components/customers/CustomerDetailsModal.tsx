
import React, { useEffect, useState } from 'react';
import { X, Calendar, CreditCard, TrendingUp, Clock } from 'lucide-react';
import { Customer } from '../../hooks/useCustomers';
import { useCustomerLoyaltyCards } from '../../hooks/useCustomerLoyaltyCards';
import { useTransactions } from '../../hooks/useTransactions';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

interface CustomerDetailsModalProps {
  customer: Customer;
  onClose: () => void;
}

const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({ customer, onClose }) => {
  const { getCustomerLoyaltyCardsByCustomerId } = useCustomerLoyaltyCards();
  const { transactions, loading: transactionsLoading, fetchTransactionsByCustomerId } = useTransactions();
  const [customerLoyaltyCards, setCustomerLoyaltyCards] = useState<any[]>([]);

  useEffect(() => {
    // Fetch customer loyalty cards
    const loyaltyCards = getCustomerLoyaltyCardsByCustomerId(customer.id);
    setCustomerLoyaltyCards(loyaltyCards);

    // Fetch transactions for this customer
    fetchTransactionsByCustomerId(customer.id);
  }, [customer.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'earn':
        return 'text-green-600 bg-green-50';
      case 'redeem':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Customer Details
              </h3>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="bg-white px-6 py-6 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Customer Profile */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3">
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                    Customer Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-sm text-gray-900">{customer.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-sm text-gray-900">{customer.email}</p>
                  </div>
                  {customer.phone && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-sm text-gray-900">{customer.phone}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-500">Member Since</label>
                    <p className="text-sm text-gray-900 flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {formatDate(customer.created_at)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Loyalty Cards */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard size={18} className="mr-2" />
                    Loyalty Cards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {customerLoyaltyCards.length > 0 ? (
                    <div className="space-y-3">
                      {customerLoyaltyCards.map((card) => (
                        <div key={card.id} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{card.loyalty_card_name}</h4>
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                              {card.tier}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-500">Points:</span>
                              <span className="ml-1 font-medium">{card.points}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Stamps:</span>
                              <span className="ml-1 font-medium">{card.stamps}</span>
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-gray-500 flex items-center">
                            <Clock size={12} className="mr-1" />
                            Last activity: {formatDate(card.last_activity)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No loyalty cards assigned</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp size={18} className="mr-2" />
                  Recent Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {transactionsLoading ? (
                  <div className="text-center py-4">
                    <div className="text-gray-500">Loading transactions...</div>
                  </div>
                ) : transactions.length > 0 ? (
                  <div className="space-y-3">
                    {transactions.slice(0, 10).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTransactionTypeColor(transaction.type)}`}>
                            {transaction.type}
                          </span>
                          <div className="text-sm">
                            {transaction.points > 0 && (
                              <span className="text-green-600">+{transaction.points} points</span>
                            )}
                            {transaction.stamps > 0 && (
                              <span className="text-blue-600">+{transaction.stamps} stamps</span>
                            )}
                            {transaction.points < 0 && (
                              <span className="text-red-600">{transaction.points} points</span>
                            )}
                            {transaction.stamps < 0 && (
                              <span className="text-red-600">{transaction.stamps} stamps</span>
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(transaction.created_at)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm text-center py-4">No transactions found</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="bg-gray-50 px-6 py-3 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsModal;
