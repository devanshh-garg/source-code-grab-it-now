
import React from 'react';
import { Upload, X } from 'lucide-react';
import { colorThemes } from '../../../constants/loyalty';
import { cardTemplates } from '../../../constants/cardTemplates';

interface CardDesignStepProps {
  cardData: {
    colorTheme: string;
    customColors: {
      primary: string;
      secondary: string;
      text: string;
    };
    logo: string;
    backgroundImage?: string;
    selectedTemplate?: string;
  };
  handleChange: (field: string, value: any) => void;
  handleLogoUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleBackgroundUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  loading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  backgroundInputRef: React.RefObject<HTMLInputElement>;
}

const CardDesignStep: React.FC<CardDesignStepProps> = ({
  cardData,
  handleChange,
  handleLogoUpload,
  handleBackgroundUpload,
  loading,
  fileInputRef,
  backgroundInputRef
}) => {
  const safeCustomColors = cardData.customColors || { primary: '#3B82F6', secondary: '#2563EB', text: '#ffffff' };

  function normalizeHex(color: string) {
    if (/^#[0-9A-Fa-f]{3}$/.test(color)) {
      return '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
    }
    return color;
  }

  const handleTemplateSelect = (template: any) => {
    handleChange('selectedTemplate', template.id);
    handleChange('customColors', template.defaultColors);
    handleChange('backgroundImage', template.backgroundImage);
    if (template.defaultColors.primary) {
      const theme = colorThemes.find(t => t.primary === template.defaultColors.primary);
      if (theme) {
        handleChange('colorTheme', theme.id);
      }
    }
  };

  const removeBackgroundImage = () => {
    handleChange('backgroundImage', '');
  };

  return (
    <>
      {/* Template Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Choose Template
        </label>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {cardTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => handleTemplateSelect(template)}
              className={`cursor-pointer rounded-lg border-2 transition-all p-3 ${
                cardData.selectedTemplate === template.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div
                className="h-20 rounded-md mb-2"
                style={{
                  background: template.backgroundImage
                    ? `linear-gradient(135deg, ${template.defaultColors.primary}AA, ${template.defaultColors.secondary}AA), url(${template.backgroundImage})`
                    : `linear-gradient(135deg, ${template.defaultColors.primary}, ${template.defaultColors.secondary})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              ></div>
              <div className="text-center text-xs font-medium">{template.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Color Theme */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Color Theme
        </label>
        <div className="grid grid-cols-3 gap-3">
          {colorThemes.map((theme) => (
            <div
              key={theme.id}
              onClick={() => {
                handleChange('colorTheme', theme.id);
                handleChange('customColors', {
                  primary: theme.primary,
                  secondary: theme.secondary,
                  text: '#ffffff',
                });
              }}
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

      {/* Custom Colors */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Custom Colors
        </label>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Primary</label>
            <input
              type="color"
              value={normalizeHex(safeCustomColors.primary)}
              onChange={(e) => handleChange('customColors', {
                ...safeCustomColors,
                primary: e.target.value
              })}
              className="block w-full h-10 rounded-md cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Secondary</label>
            <input
              type="color"
              value={normalizeHex(safeCustomColors.secondary)}
              onChange={(e) => handleChange('customColors', {
                ...safeCustomColors,
                secondary: e.target.value
              })}
              className="block w-full h-10 rounded-md cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Text</label>
            <input
              type="color"
              value={normalizeHex(safeCustomColors.text)}
              onChange={(e) => handleChange('customColors', {
                ...safeCustomColors,
                text: e.target.value
              })}
              className="block w-full h-10 rounded-md cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Background Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Background Image (Optional)
        </label>
        <div className="space-y-3">
          {cardData.backgroundImage ? (
            <div className="relative">
              <img 
                src={cardData.backgroundImage} 
                alt="Background preview" 
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                onClick={removeBackgroundImage}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <label 
                className="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={() => backgroundInputRef.current?.click()}
              >
                <div className="flex flex-col items-center justify-center pt-7">
                  <Upload size={24} className="text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Upload background image</p>
                  <p className="text-xs text-gray-400">PNG, JPG up to 2MB</p>
                </div>
                <input
                  ref={backgroundInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleBackgroundUpload}
                  disabled={loading}
                />
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Logo */}
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
  );
};

export default CardDesignStep;
