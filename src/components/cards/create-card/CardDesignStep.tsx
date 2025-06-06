
import React from 'react';
import { Upload } from 'lucide-react';
import { colorThemes } from '../../../constants/loyalty';

interface CardDesignStepProps {
  cardData: {
    colorTheme: string;
    customColors: {
      primary: string;
      secondary: string;
      text: string;
    };
    logo: string;
  };
  handleChange: (field: string, value: any) => void;
  handleLogoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const CardDesignStep: React.FC<CardDesignStepProps> = ({
  cardData,
  handleChange,
  handleLogoUpload,
  loading,
  fileInputRef
}) => {
  return (
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
  );
};

export default CardDesignStep;
