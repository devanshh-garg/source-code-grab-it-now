
import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Search, Star, Gift, QrCode } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import { useAuth } from '../../contexts/AuthContext';

interface LoyaltyCard {
  id: string;
  name: string;
  type: string;
  design: any;
  business: {
    name: string;
    logo_url?: string;
  };
}

interface CustomerLoyaltyCard {
  id: string;
  points: number;
  stamps: number;
  tier: string;
  joined_at: string;
  loyalty_card: LoyaltyCard;
}

const CustomerDashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [loyaltyCards, setLoyaltyCards] = useState<CustomerLoyaltyCard[]>([]);
  const [availableCards, setAvailableCards] = useState<LoyaltyCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (currentUser) {
      fetchCustomerData();
      fetchAvailableCards();
    }
  }, [currentUser]);

  const fetchCustomerData = async () => {
    try {
      // Get customer profile
      const { data: profile } = await supabase
        .from('customer_profiles')
        .select('id')
        .eq('user_id', currentUser?.id)
        .single();

      if (profile) {
        // Get customer's loyalty cards
        const { data: cards } = await supabase
          .from('customer_loyalty_cards')
          .select(`
            *,
            loyalty_cards (
              id,
              name,
              type,
              design,
              businesses (
                name,
                logo_url
              )
            )
          `)
          .eq('customer_profile_id', profile.id);

        setLoyaltyCards(cards || []);
      }
    } catch (error) {
      console.error('Error fetching customer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableCards = async () => {
    try {
      const { data: cards } = await supabase
        .from('loyalty_cards')
        .select(`
          *,
          businesses (
            name,
            logo_url
          )
        `)
        .eq('active', true);

      setAvailableCards(cards || []);
    } catch (error) {
      console.error('Error fetching available cards:', error);
    }
  };

  const joinLoyaltyProgram = async (cardId: string) => {
    try {
      // Get customer profile
      const { data: profile } = await supabase
        .from('customer_profiles')
        .select('id')
        .eq('user_id', currentUser?.id)
        .single();

      if (profile) {
        await supabase
          .from('customer_loyalty_cards')
          .insert({
            customer_profile_id: profile.id,
            loyalty_card_id: cardId
          });

        fetchCustomerData();
      }
    } catch (error) {
      console.error('Error joining loyalty program:', error);
    }
  };

  const filteredAvailableCards = availableCards.filter(card =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.business?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your loyalty cards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Loyalty Cards</h1>
          <p className="mt-2 text-gray-600">Manage your loyalty programs and rewards</p>
        </div>

        {/* My Cards Section */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">My Cards</h2>
          {loyaltyCards.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No loyalty cards yet</h3>
              <p className="text-gray-600 mb-4">Join loyalty programs below to start earning rewards!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loyaltyCards.map((card) => (
                <div key={card.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div 
                    className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white"
                    style={{
                      background: card.loyalty_card.design?.gradient || 'linear-gradient(to right, #3b82f6, #8b5cf6)'
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{card.loyalty_card.business?.name}</h3>
                        <p className="text-sm opacity-90">{card.loyalty_card.name}</p>
                      </div>
                      <QrCode className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Points</span>
                      <span className="font-semibold text-blue-600">{card.points}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Stamps</span>
                      <span className="font-semibold text-green-600">{card.stamps}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Tier</span>
                      <span className="font-semibold text-purple-600 capitalize">{card.tier}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Programs Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Join New Programs</h2>
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAvailableCards
              .filter(card => !loyaltyCards.some(lc => lc.loyalty_card.id === card.id))
              .map((card) => (
                <div key={card.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      {card.business?.logo_url ? (
                        <img 
                          src={card.business.logo_url} 
                          alt={card.business.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <CreditCard className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      <div className="ml-3">
                        <h3 className="font-semibold text-gray-900">{card.business?.name}</h3>
                        <p className="text-sm text-gray-600">{card.name}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        card.type === 'points' ? 'bg-blue-100 text-blue-800' :
                        card.type === 'stamp' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {card.type === 'points' && <Star className="h-3 w-3 mr-1" />}
                        {card.type === 'stamp' && <Gift className="h-3 w-3 mr-1" />}
                        {card.type.charAt(0).toUpperCase() + card.type.slice(1)} Program
                      </span>
                    </div>

                    <button
                      onClick={() => joinLoyaltyProgram(card.id)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Join Program
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboardPage;
