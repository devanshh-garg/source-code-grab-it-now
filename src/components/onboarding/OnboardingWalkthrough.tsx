
import React, { useEffect, useRef } from 'react';
import { X, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { useOnboarding } from '../../contexts/OnboardingContext';

const OnboardingWalkthrough: React.FC = () => {
  const {
    isOnboardingActive,
    currentStep,
    steps,
    completeStep,
    skipOnboarding,
    nextStep,
    prevStep,
  } = useOnboarding();

  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOnboardingActive) return;

    const currentStepData = steps[currentStep];
    if (currentStepData?.target) {
      const targetElement = document.querySelector(currentStepData.target);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Highlight the target element
        targetElement.classList.add('onboarding-highlight');
        
        return () => {
          targetElement.classList.remove('onboarding-highlight');
        };
      }
    }
  }, [isOnboardingActive, currentStep, steps]);

  if (!isOnboardingActive || !steps[currentStep]) {
    return null;
  }

  const currentStepData = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    completeStep(currentStepData.id);
    if (!isLastStep) {
      nextStep();
    }
  };

  const handleSkip = () => {
    skipOnboarding();
  };

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 pointer-events-none"
        style={{
          background: currentStepData.target
            ? 'radial-gradient(circle at center, transparent 100px, rgba(0,0,0,0.5) 120px)'
            : 'rgba(0,0,0,0.5)',
        }}
      />

      {/* Walkthrough Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4">
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-6 relative">
          {/* Close Button */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Skip onboarding"
          >
            <X size={20} />
          </button>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(((currentStep + 1) / steps.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              {currentStepData.completed ? (
                <CheckCircle className="text-green-500 mr-2" size={24} />
              ) : (
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium mr-2">
                  {currentStep + 1}
                </div>
              )}
              <h2 className="text-lg font-semibold text-gray-900">
                {currentStepData.title}
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {currentStepData.description}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {!isFirstStep && (
                <button
                  onClick={prevStep}
                  className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Back
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleSkip}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Skip Tour
              </button>
              <button
                onClick={handleNext}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                {isLastStep ? 'Finish' : 'Next'}
                {!isLastStep && <ArrowRight size={16} className="ml-1" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles for Highlighting */}
      <style>
        {`
          .onboarding-highlight {
            position: relative;
            z-index: 51;
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3);
            border-radius: 8px;
            transition: all 0.3s ease;
          }
        `}
      </style>
    </>
  );
};

export default OnboardingWalkthrough;
