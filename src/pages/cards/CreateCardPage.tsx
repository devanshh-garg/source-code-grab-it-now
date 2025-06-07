
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { useLoyaltyCards } from '../../hooks/useLoyaltyCards';
import { useBusinessData } from '../../hooks/useBusinessData';
import { useOnboarding } from '../../contexts/OnboardingContext';
import CardPreview from '../../components/cards/CardPreview';
import CardBasicInfoStep from '../../components/cards/create-card/CardBasicInfoStep';
import CardDesignStep from '../../components/cards/create-card/CardDesignStep';
import CardRulesStep from '../../components/cards/create-card/CardRulesStep';
import CardBusinessInfoStep from '../../components/cards/create-card/CardBusinessInfoStep';
import { Toast } from '../../components/ui/toast';

interface CardData {
  name: string;
  businessName: string;
  type: 'stamp' | 'points' | 'tier' | 'tiered' | 'discount';
  template: string;
  backgroundColor: string;
  backgroundImage: string;
  logoUrl: string;
  textColor: string;
  businessAddress: string;
  businessWebsite: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    twitter: string;
  };
  rules: {
    rewardTitle: string;
    totalNeeded: number;
    expiryEnabled: boolean;
    expiryDays: number;
    tiers: Array<{
      name: string;
      goal: number;
      reward: string;
    }>;
    customRewardType: string;
    customRewardDescription: string;
  };
}

const CreateCardPage: React.FC = () => {
  const navigate = useNavigate();
  const { createCard } = useLoyaltyCards();
  const { business } = useBusinessData();
  const { completeStep } = useOnboarding();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ title: string; description: string } | null>(null);

  const [cardData, setCardData] = useState<CardData>({
    name: '',
    businessName: business?.name || '',
    type: 'stamp',
    template: '',
    backgroundColor: '#3B82F6',
    backgroundImage: '',
    logoUrl: '',
    textColor: '#FFFFFF',
    businessAddress: '',
    businessWebsite: '',
    socialLinks: {
      instagram: '',
      facebook: '',
      twitter: '',
    },
    rules: {
      rewardTitle: '',
      totalNeeded: 10,
      expiryEnabled: false,
      expiryDays: 30,
      tiers: [],
      customRewardType: '',
      customRewardDescription: '',
    },
  });

  const steps = [
    { id: 'basics', title: 'Basic Info', component: CardBasicInfoStep },
    { id: 'design', title: 'Design', component: CardDesignStep },
    { id: 'rules', title: 'Rules', component: CardRulesStep },
    { id: 'business', title: 'Business Info', component: CardBusinessInfoStep },
  ];

  useEffect(() => {
    // Complete onboarding steps based on current step
    if (currentStep === 0) {
      completeStep('card-basics');
    } else if (currentStep === 1) {
      completeStep('card-design');
    } else if (currentStep === 2) {
      completeStep('card-rules');
    }
  }, [currentStep, completeStep]);

  const handleChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setCardData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof CardData],
          [child]: value,
        },
      }));
    } else {
      setCardData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!cardData.name.trim() || !cardData.rules.rewardTitle.trim()) {
      setToast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
      });
      return;
    }

    setLoading(true);

    try {
      await createCard({
        name: cardData.name.trim(),
        type: cardData.type,
        design: {
          backgroundColor: cardData.backgroundColor,
          logoUrl: cardData.logoUrl || undefined,
          backgroundImage: cardData.backgroundImage || undefined,
          textColor: cardData.textColor,
        },
        rules: {
          rewardTitle: cardData.rules.rewardTitle.trim(),
          totalNeeded: cardData.rules.totalNeeded,
          expiryEnabled: cardData.rules.expiryEnabled,
          expiryDays: cardData.rules.expiryDays,
          tiers: cardData.rules.tiers,
          customRewardType: cardData.rules.customRewardType,
          customRewardDescription: cardData.rules.customRewardDescription,
        },
        active: true,
      });

      // Complete onboarding
      completeStep('complete');

      setToast({
        title: 'Success!',
        description: 'Your loyalty card has been created successfully.',
      });

      setTimeout(() => {
        navigate('/cards');
      }, 1500);
    } catch (error) {
      console.error('Error creating card:', error);
      setToast({
        title: 'Error',
        description: 'Failed to create card. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/cards')}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Cards
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Create New Loyalty Card</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            {/* Progress Steps */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        index <= currentStep
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span
                      className={`ml-2 text-sm font-medium ${
                        index <= currentStep ? 'text-blue-600' : 'text-gray-500'
                      }`}
                    >
                      {step.title}
                    </span>
                    {index < steps.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-4 ${
                          index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Step Content */}
              <div className="space-y-6">
                <CurrentStepComponent
                  cardData={cardData}
                  handleChange={handleChange}
                  business={business}
                />
              </div>

              {/* Navigation */}
              <div className="flex justify-between pt-6 border-t border-gray-100">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Previous
                </button>

                {isLastStep ? (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save size={16} className="mr-2" />
                    {loading ? 'Creating...' : 'Create Card'}
                  </button>
                ) : (
                  <button
                    onClick={nextStep}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Next
                    <ArrowRight size={16} className="ml-2" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
              <CardPreview {...cardData} />
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          title={toast.title}
          description={toast.description}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default CreateCardPage;
