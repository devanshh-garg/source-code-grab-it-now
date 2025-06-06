import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLoyaltyCards } from '../../hooks/useLoyaltyCards';
import { useBusinessData } from '../../hooks/useBusinessData';

import CardPreview from '../../components/cards/CardPreview';
import CardBasicInfoStep from '../../components/cards/create-card/CardBasicInfoStep';
import CardDesignStep from '../../components/cards/create-card/CardDesignStep';
import CardRulesStep from '../../components/cards/create-card/CardRulesStep';
import CardBusinessInfoStep from '../../components/cards/create-card/CardBusinessInfoStep';

const EditCardPage: React.FC = () => {
  const navigate = useNavigate();
  const { cardId } = useParams<{ cardId: string }>();
  // Removed unused currentUser to resolve lint warning
  const { business, loading: businessLoading } = useBusinessData();
  const { getCardById, updateCard } = useLoyaltyCards();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(1);
  const [cardData, setCardData] = useState<any>(null);

  // Fetch card data on mount
  useEffect(() => {
    const fetchCard = async () => {
      if (!cardId || typeof cardId !== 'string') {
        setError('No card ID provided.');
        return;
      }
      setLoading(true);
      try {
        const card = await getCardById(cardId);
        if (!card) throw new Error('Card not found');
        // Map all relevant fields for editing UI
        setCardData({
          id: card.id,
          name: card.name || '',
          type: card.type || 'stamp',
          reward: card.rules?.rewardTitle || '',
          stampGoal: card.rules?.totalNeeded || 10,
          pointsGoal: card.rules?.totalNeeded || 1000,
          logo: card.design?.logoUrl || '',
          customColors: (card.design as any)?.customColors || { primary: '#3B82F6', secondary: '#2563EB', text: '#ffffff' },
          colorTheme: (card.design as any)?.colorTheme || 'blue',
          // Optionally preserve extra fields if they exist in the DB
          ...((card as any).businessAddress ? { businessAddress: (card as any).businessAddress } : {}),
          ...((card as any).businessWebsite ? { businessWebsite: (card as any).businessWebsite } : {}),
          ...((card as any).socialLinks ? { socialLinks: (card as any).socialLinks } : {}),
        });
      } catch (err) {
        setError('Failed to load card data.');
      } finally {
        setLoading(false);
      }
    };
    fetchCard();
  }, [cardId, getCardById]);

  // Defensive: Ensure cardData.customColors is always defined
  // Defensive: Provide defaults for all required fields
  const safeCardData = {
    name: cardData?.name || '',
    type: cardData?.type || 'stamp',
    businessName: cardData?.businessName || '',
    reward: cardData?.reward || '',
    stampGoal: typeof cardData?.stampGoal === 'number' && !isNaN(cardData.stampGoal) ? cardData.stampGoal : 10,
    pointsGoal: typeof cardData?.pointsGoal === 'number' && !isNaN(cardData.pointsGoal) ? cardData.pointsGoal : 1000,
    logo: cardData?.logo || '',
    customColors: cardData?.customColors || { primary: '#3B82F6', secondary: '#2563EB', text: '#ffffff' },
    businessAddress: cardData?.businessAddress || '',
    businessWebsite: cardData?.businessWebsite || '',
    socialLinks: cardData?.socialLinks || { instagram: '', facebook: '', twitter: '' },
    ...cardData,
  };


  if (businessLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading card data...</div>
      </div>
    );
  }

  if (!cardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Card not found or you do not have access.</div>
      </div>
    );
  }

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
    setCardData((prev: any) => ({ ...prev, [field]: value }));
  };

  // Handles uploading a logo to Supabase and updates cardData with local and public URLs
  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    // Local preview URL
    const localUrl = URL.createObjectURL(file);
    setCardData((prev: any) => ({ ...prev, logo: localUrl }));
    // Upload to Supabase Storage
    try {
      setLoading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `logo_${cardId}_${Date.now()}.${fileExt}`;
      const { data, error } = await import('../../integrations/supabase/client').then(m => m.supabase.storage.from('logos').upload(fileName, file, { upsert: true }));
      if (error) throw error;
      // Get public URL
      const { data: publicUrlData } = await import('../../integrations/supabase/client').then(m => m.supabase.storage.from('logos').getPublicUrl(fileName));
      const publicUrl = publicUrlData?.publicUrl;
      if (publicUrl) {
        setCardData((prev: any) => ({ ...prev, logo: publicUrl }));
      }
    } catch (err) {
      setError('Failed to upload logo.');
    } finally {
      setLoading(false);
    }
  };


  const handleStepChange = (step: number) => setCurrentStep(step);

  const handleSubmit = async () => {
    // Basic validation
    if (!cardData.name || !cardData.type) {
      setError('Please fill out all required fields (name and type).');
      return;
    }
    if (!cardId || typeof cardId !== 'string') {
      setError('No card ID provided. Cannot update.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await updateCard(cardId, cardData);
      navigate('/cards');
    } catch (err) {
      setError('Failed to update card.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-8 text-gray-900">Edit Loyalty Card</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {currentStep === 1 && (
            <CardBasicInfoStep cardData={cardData} handleChange={handleChange} business={business} />
          )}
          {currentStep === 2 && (
            <CardDesignStep cardData={cardData} handleChange={handleChange} handleLogoUpload={handleLogoUpload} loading={loading} fileInputRef={fileInputRef} />
          )}
          {currentStep === 3 && (
            <CardRulesStep cardData={safeCardData} handleChange={handleChange} />
          )}
          {currentStep === 4 && (
            <CardBusinessInfoStep cardData={safeCardData} handleChange={handleChange} />
          )}
          <div className="flex items-center mt-6 space-x-4">
            {currentStep > 1 && (
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => handleStepChange(currentStep - 1)}
              >
                Back
              </button>
            )}
            {currentStep < 4 && (
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => handleStepChange(currentStep + 1)}
              >
                Next
              </button>
            )}
            {currentStep === 4 && (
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            )}
          </div>
          {error && <div className="text-red-500 mt-4">{error}</div>}
        </div>
        <div className="md:col-span-1">
          <CardPreview cardData={safeCardData} />
        </div>
      </div>
    </div>
  );
};

export default EditCardPage;
