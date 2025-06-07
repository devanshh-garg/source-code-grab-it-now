
import React from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { useOnboarding } from '../../contexts/OnboardingContext';

interface OnboardingTooltipProps {
  stepId: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const OnboardingTooltip: React.FC<OnboardingTooltipProps> = ({
  stepId,
  children,
  position = 'top',
  className = '',
}) => {
  const {
    isOnboardingActive,
    currentStep,
    steps,
    completeStep,
    skipOnboarding,
    nextStep,
    prevStep,
  } = useOnboarding();

  const currentStepData = steps[currentStep];
  const isCurrentStep = currentStepData?.id === stepId;

  if (!isOnboardingActive || !isCurrentStep) {
    return <>{children}</>;
  }

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    completeStep(currentStepData.id);
    if (!isLastStep) {
      nextStep();
    }
  };

  const getTooltipPosition = () => {
    switch (position) {
      case 'bottom':
        return 'top-full mt-2';
      case 'left':
        return 'right-full mr-2 top-1/2 transform -translate-y-1/2';
      case 'right':
        return 'left-full ml-2 top-1/2 transform -translate-y-1/2';
      default:
        return 'bottom-full mb-2';
    }
  };

  const getArrowPosition = () => {
    switch (position) {
      case 'bottom':
        return 'top-0 left-1/2 transform -translate-x-1/2 -translate-y-full border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white';
      case 'left':
        return 'left-full top-1/2 transform -translate-y-1/2 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-white';
      case 'right':
        return 'right-full top-1/2 transform -translate-y-1/2 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white';
      default:
        return 'bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {children}
      
      {/* Tooltip */}
      <div className={`absolute ${getTooltipPosition()} z-50 w-72`}>
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 relative">
          {/* Arrow */}
          <div className={`absolute ${getArrowPosition()}`} />
          
          {/* Close Button */}
          <button
            onClick={skipOnboarding}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Skip onboarding"
          >
            <X size={16} />
          </button>

          {/* Content */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              {currentStepData.title}
            </h3>
            <p className="text-sm text-gray-600">
              {currentStepData.description}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              {currentStep + 1} of {steps.length}
            </div>
            
            <div className="flex items-center space-x-2">
              {!isFirstStep && (
                <button
                  onClick={prevStep}
                  className="flex items-center px-2 py-1 text-xs text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft size={12} className="mr-1" />
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                className="flex items-center px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors"
              >
                {isLastStep ? 'Finish' : 'Next'}
                {!isLastStep && <ArrowRight size={12} className="ml-1" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTooltip;
