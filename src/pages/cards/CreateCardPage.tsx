import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, Coffee, Award, 
  Gift, BarChart, 
  Check, ChevronRight, Smartphone,
  Instagram, Twitter, Facebook,
  Upload, Plus, Minus
} from 'lucide-react';
import { useLoyaltyCards } from '../../hooks/useLoyaltyCards';
import { supabase } from '../../integrations/supabase/client';
import { useAuth } from '../../contexts/AuthContext';

// Card type options
const cardTypes = [
  { id: 'stamp', name: 'Stamp Card', icon: <Coffee size={20} /> },
  { id: 'points', name: 'Points System', icon: <Award size={20} /> },
  { id: 'tiered', name: 'Tiered Membership', icon: <BarChart size={20} /> },
  { id: 'discount', name: 'Discount Card', icon: <Gift size={20} /> },
];

// Color themes
const colorThemes = [
  { id: 'blue', name: 'Blue', primary: '#3B82F6', secondary: '#2563EB' },
  { id: 'purple', name: 'Purple', primary: '#8B5CF6', secondary: '#7C3AED' },
  { id: 'green', name: 'Green', primary: '#10B981', secondary: '#059669' },
  { id: 'amber', name: 'Amber', primary: '#F59E0B', secondary: '#D97706' },
  { id: 'red', name: 'Red', primary: '#EF4444', secondary: '#DC2626' },
  { id: 'gray', name: 'Gray', primary: '#4B5563', secondary: '#374151' },
];

const CreateCardPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { createCard } = useLoyaltyCards();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [cardData, setCardData] = useState({
    name: '',
    type: '',
    template: '',
    colorTheme: 'blue',
    customColors: {
      primary: '#3B82F6',
      secondary: '#2563EB',
      text: '#FFFFFF',
    },
    logo: '',
    logoUrl: '',
    stampGoal: 10,
    pointsGoal: 1000,
    reward: '',
    expiryDate: '',
    description: '',
    termsAndConditions: '',
    businessName: '',
    businessAddress: '',
    businessPhone: '',
    businessWebsite: '',
    socialLinks: {
      instagram: '',
      facebook: '',
      twitter: '',
    },
  });

  const handleChange = (field: string, value: any) => {
    setCardData((prev) => {
      const newData = { ...prev, [field]: value };
      
      // Update colors when theme changes
      if (field === 'colorTheme') {
        const theme = colorThemes.find(t => t.id === value);
        if (theme) {
          newData.customColors = {
            ...newData.customColors,
            primary: theme.primary,
            secondary: theme.secondary,
          };
        }
      }
      
      return newData;
    });
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentUser) return;

    try {
      setLoading(true);
      
      // Create a preview URL for immediate display
      const previewUrl = URL.createObjectURL(file);
      setCardData(prev => ({ ...prev, logo: previewUrl }));

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${currentUser.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('business-logos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('business-logos')
        .getPublicUrl(fileName);

      setCardData(prev => ({ ...prev, logoUrl: publicUrl }));
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Failed to upload logo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCard = async () => {
    if (!cardData.name.trim() || !cardData.type || !cardData.businessName.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      await createCard({
        name: cardData.name.trim(),
        type: cardData.type as 'stamp' | 'points' | 'tier',
        design: {
          backgroundColor: cardData.customColors.primary,
          logoUrl: cardData.logoUrl,
        },
        rules: {
          rewardTitle: cardData.reward.trim(),
          totalNeeded: cardData.type === 'stamp' ? cardData.stampGoal : cardData.pointsGoal,
        },
        active: true,
      });

      navigate('/cards');
    } catch (error) {
      console.error('Error creating card:', error);
      alert('Failed to create card. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);

  // Card Preview Component
  const CardPreview = () => {
    const { customColors, type, name, businessName, reward, stampGoal, pointsGoal } = cardData;
    
    return (
      <div className="w-full max-w-sm mx-auto">
        <div 
          className="rounded-xl p-6 shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${customColors.primary}, ${customColors.secondary})`,
            color: customColors.text,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <CreditCard className="text-current" style={{ color: customColors.primary }} size={20} />
              </div>
              <div>
                <h3 className="font-bold">{name || 'Card Name'}</h3>
                <p className="text-sm opacity-80">{businessName || 'Business Name'}</p>
              </div>
            </div>
            {cardData.logo && (
              <img src={cardData.logo} alt="Logo" className="w-10 h-10 rounded-full object-cover" />
            )}
          </div>

          {type === 'stamp' && (
            <div className="space-y-3 mb-4">
              <div className="grid grid-cols-5 gap-2">
                {[...Array(Math.min(5, stampGoal))].map((_, i) => (
                  <div 
                    key={i}
                    className="aspect-square rounded-md flex items-center justify-center"
                    style={{ backgroundColor: `${customColors.text}20` }}
                  >
                    <CreditCard size={16} className="opacity-60" />
                  </div>
                ))}
              </div>
              {stampGoal > 5 && (
                <div className="grid grid-cols-5 gap-2">
                  {[...Array(Math.min(5, stampGoal - 5))].map((_, i) => (
                    <div 
                      key={i}
                      className="aspect-square rounded-md flex items-center justify-center"
                      style={{ backgroundColor: `${customColors.text}20` }}
                    >
                      <CreditCard size={16} className="opacity-60" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {type === 'points' && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm opacity-80">Progress to next reward</span>
                <span className="text-sm font-medium">0/{pointsGoal} pts</span>
              </div>
              <div 
                className="h-2 rounded-full mb-2"
                style={{ backgroundColor: `${customColors.text}20` }}
              >
                <div 
                  className="h-2 rounded-full w-0"
                  style={{ backgroundColor: customColors.text }}
                ></div>
              </div>
            </div>
          )}

          {type === 'tiered' && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div 
                className="text-center py-2 rounded-md"
                style={{ backgroundColor: `${customColors.text}20` }}
              >
                <div className="text-xs mb-1">Silver</div>
                <Check size={14} className="mx-auto" />
              </div>
              <div 
                className="text-center py-2 rounded-md"
                style={{ backgroundColor: `${customColors.text}10` }}
              >
                <div className="text-xs mb-1">Gold</div>
                <div className="text-xs">$500</div>
              </div>
              <div 
                className="text-center py-2 rounded-md"
                style={{ backgroundColor: `${customColors.text}10` }}
              >
                <div className="text-xs mb-1">Platinum</div>
                <div className="text-xs">$1000</div>
              </div>
            </div>
          )}

          <div 
            className="text-center py-2 rounded-md font-medium"
            style={{ backgroundColor: `${customColors.text}20` }}
          >
            {reward || 'Reward Description'}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-center space-x-4">
            <button className="px-4 py-2 bg-gray-100 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
              <Smartphone size={16} className="inline mr-2" />
              Apple Wallet
            </button>
            <button className="px-4 py-2 bg-gray-100 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
              <Smartphone size={16} className="inline mr-2" />
              Google Pay
            </button>
          </div>
          <p className="text-xs text-center text-gray-500">
            Preview updates as you make changes. Final card may appear slightly different on actual devices.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form Section */}
      <div className="lg:max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create New Loyalty Card</h1>
          <p className="text-gray-600 mt-1">
            Design a custom loyalty card for your customers.
          </p>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-6">
            {[1, 2, 3, 4].map((step) => (
              <div 
                key={step}
                className={`flex items-center ${step < 4 ? 'flex-1' : ''}`}
              >
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= step 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {currentStep > step ? <Check size={16} /> : step}
                </div>
                {step < 4 && (
                  <div 
                    className={`h-1 flex-1 mx-2 ${
                      currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>

          {/* Step content */}
          <div className="space-y-6">
            {currentStep === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Name
                  </label>
                  <input
                    type="text"
                    value={cardData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="e.g. Coffee Rewards, VIP Member"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={cardData.businessName}
                    onChange={(e) => handleChange('businessName', e.target.value)}
                    placeholder="Your business name"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Type
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {cardTypes.map((type) => (
                      <div
                        key={type.id}
                        onClick={() => handleChange('type', type.id)}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          cardData.type === type.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-blue-200'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                            cardData.type === type.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {type.icon}
                          </div>
                          <div>
                            <h3 className="font-medium">{type.name}</h3>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color Theme
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {colorThemes.map((theme) => (
                      <div
                        key={theme.id}
                        onClick={() => handleChange('colorTheme', theme.id)}
                        className={`cursor-pointer transition-all ${
                          cardData.colorTheme === theme.id ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                        }`}
                      >
                        <div 
                          className="h-12 rounded-md"
                          style={{
                            background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`
                          }}
                        ></div>
                        <div className="text-center text-xs mt-1">{theme.name}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Colors
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Primary</label>
                      <input
                        type="color"
                        value={cardData.customColors.primary}
                        onChange={(e) => handleChange('customColors', {
                          ...cardData.customColors,
                          primary: e.target.value
                        })}
                        className="block w-full h-10 rounded-md cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Secondary</label>
                      <input
                        type="color"
                        value={cardData.customColors.secondary}
                        onChange={(e) => handleChange('customColors', {
                          ...cardData.customColors,
                          secondary: e.target.value
                        })}
                        className="block w-full h-10 rounded-md cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Text</label>
                      <input
                        type="color"
                        value={cardData.customColors.text}
                        onChange={(e) => handleChange('customColors', {
                          ...cardData.customColors,
                          text: e.target.value
                        })}
                        className="block w-full h-10 rounded-md cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo (Optional)
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label 
                      className="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {cardData.logo ? (
                        <div className="flex flex-col items-center justify-center h-full">
                          <img 
                            src={cardData.logo} 
                            alt="Logo preview" 
                            className="h-20 w-20 object-contain"
                          />
                          <p className="text-xs text-gray-500 mt-2">Click to change</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-7">
                          <Upload size={24} className="text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">Upload a logo</p>
                          <p className="text-xs text-gray-400">PNG, JPG up to 2MB</p>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        disabled={loading}
                      />
                    </label>
                  </div>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                {cardData.type === 'stamp' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stamps Needed
                    </label>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleChange('stampGoal', Math.max(1, cardData.stampGoal - 1))}
                        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
                      >
                        <Minus size={20} />
                      </button>
                      <span className="text-2xl font-bold w-12 text-center">
                        {cardData.stampGoal}
                      </span>
                      <button
                        onClick={() => handleChange('stampGoal', Math.min(20, cardData.stampGoal + 1))}
                        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                )}

                {cardData.type === 'points' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Points Goal
                    </label>
                    <input
                      type="number"
                      value={cardData.pointsGoal}
                      onChange={(e) => handleChange('pointsGoal', parseInt(e.target.value))}
                      min="100"
                      step="100"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reward Description
                  </label>
                  <input
                    type="text"
                    value={cardData.reward}
                    onChange={(e) => handleChange('reward', e.target.value)}
                    placeholder="e.g. Free coffee after 10 stamps"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Terms & Conditions
                  </label>
                  <textarea
                    value={cardData.termsAndConditions}
                    onChange={(e) => handleChange('termsAndConditions', e.target.value)}
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter terms and conditions"
                  ></textarea>
                </div>
              </>
            )}

            {currentStep === 4 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Address
                  </label>
                  <input
                    type="text"
                    value={cardData.businessAddress}
                    onChange={(e) => handleChange('businessAddress', e.target.value)}
                    placeholder="Enter business address"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Website
                  </label>
                  <input
                    type="url"
                    value={cardData.businessWebsite}
                    onChange={(e) => handleChange('businessWebsite', e.target.value)}
                    placeholder="https://example.com"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Social Media
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Instagram size={20} className="text-gray-400 mr-2" />
                      <input
                        type="text"
                        value={cardData.socialLinks.instagram}
                        onChange={(e) => handleChange('socialLinks', {
                          ...cardData.socialLinks,
                          instagram: e.target.value
                        })}
                        placeholder="Instagram username"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div className="flex items-center">
                      <Facebook size={20} className="text-gray-400 mr-2" />
                      <input
                        type="text"
                        value={cardData.socialLinks.facebook}
                        onChange={(e) => handleChange('socialLinks', {
                          ...cardData.socialLinks,
                          facebook: e.target.value
                        })}
                        placeholder="Facebook page"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div className="flex items-center">
                      <Twitter size={20} className="text-gray-400 mr-2" />
                      <input
                        type="text"
                        value={cardData.socialLinks.twitter}
                        onChange={(e) => handleChange('socialLinks', {
                          ...cardData.socialLinks,
                          twitter: e.target.value
                        })}
                        placeholder="Twitter handle"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-4 py-2 border border-gray-300 rounded-md text-sm font-medium ${
                currentStep === 1 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            <button
              onClick={currentStep < 4 ? nextStep : handleCreateCard}
              disabled={loading}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {currentStep < 4 ? (
                <>
                  Next
                  <ChevronRight size={16} className="inline ml-1" />
                </>
              ) : loading ? (
                'Creating...'
              ) : (
                'Create Card'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="lg:sticky lg:top-6 space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Card Preview</h2>
          <CardPreview />
        </div>
      </div>
    </div>
  );
};

export default CreateCardPage;
