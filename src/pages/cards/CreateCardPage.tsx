import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight } from 'lucide-react';
import { useLoyaltyCards } from '../../hooks/useLoyaltyCards';
import { supabase } from '../../integrations/supabase/client';
import { useAuth } from '../../contexts/AuthContext';
import { useBusinessData } from '../../hooks/useBusinessData';
import CardPreview from '../../components/cards/CardPreview';
import CardBasicInfoStep from '../../components/cards/create-card/CardBasicInfoStep';
import CardDesignStep from '../../components/cards/create-card/CardDesignStep';
import CardRulesStep from '../../components/cards/create-card/CardRulesStep';
import CardBusinessInfoStep from '../../components/cards/create-card/CardBusinessInfoStep';

const CreateCardPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { business, loading: businessLoading } = useBusinessData();
  const { createCard } = useLoyaltyCards();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(1);
  const [cardData, setCardData] = useState({
    name: '',
    type: '',
    template: '',
    selectedTemplate: '',
    colorTheme: 'blue',
    customColors: {
      primary: '#3B82F6',
      secondary: '#2563EB',
      text: '#FFFFFF',
    },
    logo: '',
    logoUrl: '',
    backgroundImage: '',
    backgroundImageUrl: '',
    stampGoal: 10,
    pointsGoal: 1000,
    reward: '',
    expiryDate: '',
    expiryDays: undefined as number | undefined,
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
    tiers: [] as Array<{ name: string; goal: number; reward: string }>,
    customRewardType: 'free_item',
  });

  // Show loading state while business is being fetched/created
  if (businessLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Setting up your business profile...</div>
      </div>
    );
  }

  // Show error if no business could be created
  if (!business) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 mb-4">Unable to load business profile</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (field: string, value: any) => {
    setCardData((prev) => ({ ...prev, [field]: value }));
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
      setError('Failed to upload logo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackgroundUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentUser) return;

    try {
      setLoading(true);
      
      // Create a preview URL for immediate display
      const previewUrl = URL.createObjectURL(file);
      setCardData(prev => ({ ...prev, backgroundImage: previewUrl }));

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `backgrounds/${currentUser.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('business-logos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('business-logos')
        .getPublicUrl(fileName);

      setCardData(prev => ({ ...prev, backgroundImageUrl: publicUrl }));
    } catch (error) {
      console.error('Error uploading background:', error);
      setError('Failed to upload background image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCard = async () => {
    if (!cardData.name.trim() || !cardData.type || !cardData.reward.trim()) {
      setError('Please fill in all required fields: Card Name, Type, and Reward Title.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const cardToCreate = {
        name: cardData.name.trim(),
        type: cardData.type as 'stamp' | 'points' | 'tier' | 'tiered' | 'discount',
        design: {
          backgroundColor: cardData.customColors.primary,
          customColors: cardData.customColors,
          logoUrl: cardData.logoUrl || undefined,
          backgroundImageUrl: cardData.backgroundImageUrl || undefined,
          selectedTemplate: cardData.selectedTemplate || undefined,
        },
        rules: {
          rewardTitle: cardData.reward.trim(),
          totalNeeded: cardData.type === 'stamp' ? cardData.stampGoal : cardData.pointsGoal,
          tiers: cardData.tiers.length > 0 ? cardData.tiers : undefined,
          expiryDays: cardData.expiryDays || undefined,
          customRewardType: cardData.customRewardType || undefined,
          termsAndConditions: cardData.termsAndConditions || undefined,
        },
        active: true,
      };
      
      console.log('Creating loyalty card with data:', cardToCreate);
      await createCard(cardToCreate);

      navigate('/cards');
    } catch (error) {
      console.error('Error creating card:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create card. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <CardBasicInfoStep
            cardData={cardData}
            handleChange={handleChange}
            business={business}
          />
        );
      case 2:
        return (
          <CardDesignStep
            cardData={cardData}
            handleChange={handleChange}
            handleLogoUpload={handleLogoUpload}
            handleBackgroundUpload={handleBackgroundUpload}
            loading={loading}
            fileInputRef={fileInputRef}
            backgroundInputRef={backgroundInputRef}
          />
        );
      case 3:
        return (
          <CardRulesStep
            cardData={cardData}
            handleChange={handleChange}
          />
        );
      case 4:
        return (
          <CardBusinessInfoStep
            cardData={cardData}
            handleChange={handleChange}
          />
        );
      default:
        return null;
    }
  };

  // Prepare preview data
  const previewData = {
    ...cardData,
    businessName: business?.name || cardData.businessName,
    backgroundImage: cardData.backgroundImage || (cardData.selectedTemplate ? cardData.backgroundImage : undefined),
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
          {business && (
            <p className="text-sm text-green-600 mt-1">
              ✓ Business profile: {business.name}
            </p>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

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
            {renderStepContent()}
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
          <CardPreview cardData={previewData} />
        </div>
      </div>
    </div>
  );
};

export default CreateCardPage;
