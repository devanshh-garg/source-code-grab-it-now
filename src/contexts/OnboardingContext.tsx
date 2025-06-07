
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../integrations/supabase/client';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target?: string;
  completed: boolean;
}

interface OnboardingContextType {
  isOnboardingActive: boolean;
  currentStep: number;
  steps: OnboardingStep[];
  startOnboarding: () => void;
  completeStep: (stepId: string) => void;
  skipOnboarding: () => void;
  nextStep: () => void;
  prevStep: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

const defaultSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to LoyaltyCard!',
    description: 'Let\'s get you started with creating your first digital loyalty card.',
    completed: false,
  },
  {
    id: 'create-card',
    title: 'Create Your First Card',
    description: 'Click "Create New Card" to design your first loyalty card.',
    target: '[data-onboarding="create-card"]',
    completed: false,
  },
  {
    id: 'card-basics',
    title: 'Set Card Details',
    description: 'Give your card a name and choose the type that fits your business.',
    completed: false,
  },
  {
    id: 'card-design',
    title: 'Customize Design',
    description: 'Make your card stand out with colors, logos, and templates.',
    completed: false,
  },
  {
    id: 'card-rules',
    title: 'Configure Rewards',
    description: 'Set up how customers earn and redeem rewards.',
    completed: false,
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    description: 'Your first loyalty card is ready. You can now share it with customers!',
    completed: false,
  },
];

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [isOnboardingActive, setIsOnboardingActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<OnboardingStep[]>(defaultSteps);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!currentUser) return;

      try {
        // Check if user has completed onboarding
        const { data: profile } = await supabase
          .from('businesses')
          .select('onboarding_completed')
          .eq('user_id', currentUser.id)
          .single();

        // Check if user has any loyalty cards
        const { data: cards } = await supabase
          .from('loyalty_cards')
          .select('id')
          .eq('business_id', profile?.id);

        const hasCompletedOnboarding = profile?.onboarding_completed;
        const hasCards = cards && cards.length > 0;

        // Start onboarding if user hasn't completed it and has no cards
        if (!hasCompletedOnboarding && !hasCards) {
          setIsOnboardingActive(true);
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      }
    };

    checkOnboardingStatus();
  }, [currentUser]);

  const startOnboarding = () => {
    setIsOnboardingActive(true);
    setCurrentStep(0);
    setSteps(defaultSteps.map(step => ({ ...step, completed: false })));
  };

  const completeStep = async (stepId: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, completed: true } : step
    ));

    // If this is the last step, mark onboarding as completed
    if (stepId === 'complete') {
      try {
        if (currentUser) {
          await supabase
            .from('businesses')
            .update({ onboarding_completed: true })
            .eq('user_id', currentUser.id);
        }
        setIsOnboardingActive(false);
      } catch (error) {
        console.error('Error marking onboarding as completed:', error);
      }
    }
  };

  const skipOnboarding = async () => {
    try {
      if (currentUser) {
        await supabase
          .from('businesses')
          .update({ onboarding_completed: true })
          .eq('user_id', currentUser.id);
      }
      setIsOnboardingActive(false);
    } catch (error) {
      console.error('Error skipping onboarding:', error);
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

  return (
    <OnboardingContext.Provider
      value={{
        isOnboardingActive,
        currentStep,
        steps,
        startOnboarding,
        completeStep,
        skipOnboarding,
        nextStep,
        prevStep,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};
