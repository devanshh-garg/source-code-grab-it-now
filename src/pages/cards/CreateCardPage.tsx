import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, Palette, Coffee, Award, 
  Gift, ShoppingBag, Utensils, BarChart, 
  Check, ChevronRight, Image, Smartphone,
  MapPin, Link, Instagram, Twitter, Facebook,
  Plus, Minus
} from 'lucide-react';

// Card type options
const cardTypes = [
  { id: 'stamp', name: 'Stamp Card', icon: <Coffee size={20} /> },
  { id: 'points', name: 'Points System', icon: <Award size={20} /> },
  { id: 'tiered', name: 'Tiered Membership', icon: <BarChart size={20} /> },
  { id: 'discount', name: 'Discount Card', icon: <Gift size={20} /> },
];

// Card templates
const cardTemplates = [
  { id: 'coffee', name: 'Coffee Shop', icon: <Coffee size={20} /> },
  { id: 'restaurant', name: 'Restaurant', icon: <Utensils size={20} /> },
  { id: 'retail', name: 'Retail Store', icon: <ShoppingBag size={20} /> },
  { id: 'custom', name: 'Custom Design', icon: <Palette size={20} /> },
];

// Color themes
const colorThemes = [
  { id: 'blue', name: 'Blue', class: 'bg-blue-500' },
  { id: 'purple', name: 'Purple', class: 'bg-purple-500' },
  { id: 'green', name: 'Green', class: 'bg-emerald-500' },
  { id: 'amber', name: 'Amber', class: 'bg-amber-500' },
  { id: 'red', name: 'Red', class: 'bg-red-500' },
  { id: 'gray', name: 'Gray', class: 'bg-gray-500' },
];

const CreateCardPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [cardData, setCardData] = useState({
    name: '',
    type: '',
    template: '',
    color: '',
    logo: '',
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
    setCardData({
      ...cardData,
      [field]: value,
    });
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Render card preview based on selected type
  const renderCardPreview = () => {
    const { type, name, color, template, stampGoal, pointsGoal, reward } = cardData;
    const colorClass = color === 'blue' ? 'from-blue-500 to-blue-600' :
                      color === 'purple' ? 'from-purple-500 to-purple-600' :
                      color === 'green' ? 'from-emerald-500 to-emerald-600' :
                      color === 'amber' ? 'from-amber-500 to-amber-600' :
                      color === 'red' ? 'from-red-500 to-red-600' :
                      'from-gray-500 to-gray-600';

    return (
      <motion.div 
        className={`bg-gradient-to-r ${colorClass} rounded-lg p-5 text-white shadow-lg max-w-xs mx-auto`}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              {template === 'coffee' ? <Coffee className="text-blue-600\" size={20} /> :
               template === 'restaurant' ? <Utensils className="text-blue-600\" size={20} /> :
               template === 'retail' ? <ShoppingBag className="text-blue-600" size={20} /> :
               <CreditCard className="text-blue-600" size={20} />}
            </div>
            <span className="font-bold">{name || 'Card Name'}</span>
          </div>
        </div>
        
        {type === 'stamp' && (
          <motion.div 
            className="space-y-3 mb-4"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="grid grid-cols-5 gap-2">
              {[...Array(Math.min(5, stampGoal))].map((_, i) => (
                <motion.div 
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="w-full aspect-square bg-white bg-opacity-20 rounded-md flex items-center justify-center"
                >
                  <CreditCard className="text-white" size={16} />
                </motion.div>
              ))}
            </div>
            {stampGoal > 5 && (
              <div className="grid grid-cols-5 gap-2">
                {[...Array(Math.min(5, stampGoal - 5))].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: (i + 5) * 0.1 }}
                    className="w-full aspect-square bg-white bg-opacity-20 rounded-md flex items-center justify-center"
                  >
                    <CreditCard className="text-white" size={16} />
                  </motion.div>
                ))}
                {[...Array(Math.max(0, 5 - (stampGoal - 5)))].map((_, i) => (
                  <div key={i} className="w-full aspect-square bg-white bg-opacity-10 rounded-md flex items-center justify-center">
                    <CreditCard className="text-white opacity-50" size={16} />
                  </div>
                ))}
              </div>
            )}
            <motion.div 
              className="text-center py-1 bg-white text-blue-600 rounded-md text-sm font-medium"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {stampGoal} stamps = {reward || 'Free item'}
            </motion.div>
          </motion.div>
        )}
        
        {type === 'points' && (
          <motion.div 
            className="mb-4"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Current Points</span>
              <span className="font-bold">250 pts</span>
            </div>
            <div className="w-full bg-white bg-opacity-20 h-2 rounded-full mb-2">
              <motion.div 
                className="bg-white h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '25%' }}
                transition={{ duration: 0.5, delay: 0.2 }}
              ></motion.div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>0</span>
              <span>Next Reward: {pointsGoal} pts</span>
            </div>
            <motion.div 
              className="mt-3 text-center py-1 bg-white text-blue-600 rounded-md text-sm font-medium"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {reward || 'Redeem Reward'}
            </motion.div>
          </motion.div>
        )}
        
        {type === 'tiered' && (
          <motion.div 
            className="mb-4"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-center mb-3 py-2 bg-white bg-opacity-20 rounded-md">
              <div className="text-xs mb-1">Current Tier</div>
              <div className="font-bold">Silver Member</div>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <motion.div 
                className="text-center py-2 bg-white bg-opacity-30 rounded-md"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-xs mb-1">Silver</div>
                <Check size={14} className="mx-auto" />
              </motion.div>
              <motion.div 
                className="text-center py-2 bg-white bg-opacity-10 rounded-md"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-xs mb-1">Gold</div>
                <div className="text-xs">$500</div>
              </motion.div>
              <motion.div 
                className="text-center py-2 bg-white bg-opacity-10 rounded-md"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-xs mb-1">Platinum</div>
                <div className="text-xs">$1000</div>
              </motion.div>
            </div>
            <motion.div 
              className="text-center py-1 bg-white text-blue-600 rounded-md text-sm font-medium"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {reward || 'View Benefits'}
            </motion.div>
          </motion.div>
        )}
        
        {type === 'discount' && (
          <motion.div 
            className="mb-4"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-center py-3 bg-white bg-opacity-20 rounded-md mb-3">
              <div className="text-xs mb-1">Special Offer</div>
              <div className="text-xl font-bold">{reward || '15% OFF'}</div>
            </div>
            <div className="text-xs mb-2">Valid until: {cardData.expiryDate || 'Dec 31, 2023'}</div>
            <motion.div 
              className="text-center py-1 bg-white text-blue-600 rounded-md text-sm font-medium"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Use in store
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Loyalty Card</h1>
        <p className="text-gray-600 mt-1">
          Design a custom loyalty card for your customers.
        </p>
      </div>

      {/* Steps progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <motion.div 
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}
              whileHover={{ scale: 1.1 }}
            >
              {currentStep > 1 ? <Check size={16} /> : '1'}
            </motion.div>
            <motion.div 
              className={`h-1 w-12 ${currentStep > 1 ? 'bg-blue-600' : 'bg-gray-200'}`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: currentStep > 1 ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            ></motion.div>
          </div>
          <div className="flex items-center">
            <motion.div 
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}
              whileHover={{ scale: 1.1 }}
            >
              {currentStep > 2 ? <Check size={16} /> : '2'}
            </motion.div>
            <motion.div 
              className={`h-1 w-12 ${currentStep > 2 ? 'bg-blue-600' : 'bg-gray-200'}`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: currentStep > 2 ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            ></motion.div>
          </div>
          <div className="flex items-center">
            <motion.div 
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}
              whileHover={{ scale: 1.1 }}
            >
              {currentStep > 3 ? <Check size={16} /> : '3'}
            </motion.div>
            <motion.div 
              className={`h-1 w-12 ${currentStep > 3 ? 'bg-blue-600' : 'bg-gray-200'}`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: currentStep > 3 ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            ></motion.div>
          </div>
          <div className="flex items-center">
            <motion.div 
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 4 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}
              whileHover={{ scale: 1.1 }}
            >
              4
            </motion.div>
          </div>
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <div className={`${currentStep === 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
            Card Type
          </div>
          <div className={`${currentStep === 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
            Appearance
          </div>
          <div className={`${currentStep === 3 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
            Rewards
          </div>
          <div className={`${currentStep === 4 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
            Business Info
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form section */}
        <div className="lg:col-span-3">
          <motion.div 
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Step 1: Card Type */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose Card Type</h2>
                <div className="mb-6">
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
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loyalty Program Type
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {cardTypes.map((type) => (
                      <motion.div 
                        key={type.id}
                        onClick={() => handleChange('type', type.id)}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          cardData.type === type.id 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                            cardData.type === type.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {type.icon}
                          </div>
                          <div>
                            <h3 className={`font-medium ${
                              cardData.type === type.id ? 'text-blue-700' : 'text-gray-900'
                            }`}>
                              {type.name}
                            </h3>
                            <p className="text-xs mt-1 text-gray-500">
                              {type.id === 'stamp' && 'Collect stamps for each purchase, redeem when full'}
                              {type.id === 'points' && 'Earn points with purchases, redeem for rewards'}
                              {type.id === 'tiered' && 'Different tiers with increasing benefits'}
                              {type.id === 'discount' && 'Special offers and discounts for members'}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Template
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {cardTemplates.map((template) => (
                      <motion.div 
                        key={template.id}
                        onClick={() => handleChange('template', template.id)}
                        className={`border rounded-lg p-3 cursor-pointer transition-colors text-center ${
                          cardData.template === template.id 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center mb-2 ${
                          cardData.template === template.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {template.icon}
                        </div>
                        <div className="text-sm font-medium">
                          {template.name}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Appearance */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Card Appearance</h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color Theme
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {colorThemes.map((theme) => (
                      <motion.div 
                        key={theme.id}
                        onClick={() => handleChange('color', theme.id)}
                        className={`cursor-pointer transition-all ${
                          cardData.color === theme.id ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <div className={`${theme.class} h-12 rounded-md shadow-sm`}></div>
                        <div className="text-center text-xs mt-1">{theme.name}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo or Image (Optional)
                  </label>
                  <motion.div 
                    className="flex items-center justify-center w-full"
                    whileHover={{ scale: 1.02 }}
                  >
                    <label className="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <div className="flex flex-col items-center justify-center pt-7">
                        <Image size={30} className="text-gray-400" />
                        <p className="pt-1 text-sm text-gray-500">Upload a logo or image</p>
                        <p className="text-xs text-gray-400">PNG, JPG up to 2MB</p>
                      </div>
                      <input type="file" className="hidden" />
                    </label>
                  </motion.div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Description (Optional)
                  </label>
                  <textarea
                    value={cardData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={3}
                    placeholder="Brief description of your loyalty program"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  ></textarea>
                </div>
              </motion.div>
            )}

            {/* Step 3: Rewards */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Rewards Setup</h2>
                
                {cardData.type === 'stamp' && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Stamps Needed
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={cardData.stampGoal}
                      onChange={(e) => handleChange('stampGoal', parseInt(e.target.value))}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      How many stamps does a customer need to collect for a reward?
                    </p>
                  </div>
                )}
                
                {cardData.type === 'points' && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Points Needed for Reward
                    </label>
                    <input
                      type="number"
                      min={100}
                      step={100}
                      value={cardData.pointsGoal}
                      onChange={(e) => handleChange('pointsGoal', parseInt(e.target.value))}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      How many points does a customer need to earn for a reward?
                    </p>
                  </div>
                )}
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reward Description
                  </label>
                  <input
                    type="text"
                    value={cardData.reward}
                    onChange={(e) => handleChange('reward', e.target.value)}
                    placeholder={
                      cardData.type === 'stamp' ? "e.g. Free coffee" :
                      cardData.type === 'points' ? "e.g. $10 off next purchase" :
                      cardData.type === 'tiered' ? "e.g. Exclusive VIP perks" :
                      cardData.type === 'discount' ? "e.g. 15% OFF" : "Reward description"
                    }
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                {cardData.type === 'discount' && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={cardData.expiryDate}
                      onChange={(e) => handleChange('expiryDate', e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                )}
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Terms and Conditions (Optional)
                  </label>
                  <textarea
                    value={cardData.termsAndConditions}
                    onChange={(e) => handleChange('termsAndConditions', e.target.value)}
                    rows={3}
                    placeholder="e.g. One reward per customer. Cannot be combined with other offers."
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  ></textarea>
                </div>
              </motion.div>
            )}

            {/* Step 4: Business Info */}
            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={cardData.businessName}
                    onChange={(e) => handleChange('businessName', e.target.value)}
                    placeholder="e.g. Acme Coffee Shop"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Address (Optional)
                  </label>
                  <div className="flex">
                    <div className="mr-2 pt-2">
                      <MapPin size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={cardData.businessAddress}
                      onChange={(e) => handleChange('businessAddress', e.target.value)}
                      placeholder="e.g. 123 Main St, Anytown, CA 12345"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Website (Optional)
                  </label>
                  <div className="flex">
                    <div className="mr-2 pt-2">
                      <Link size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={cardData.businessWebsite}
                      onChange={(e) => handleChange('businessWebsite', e.target.value)}
                      placeholder="e.g. https://www.example.com"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Social Media Links (Optional)
                  </label>
                  
                  <div className="space-y-3">
                    <div className="flex">
                      <div className="mr-2 pt-2">
                        <Instagram size={18} className="text-gray-400" />
                      </div>
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
                    
                    <div className="flex">
                      <div className="mr-2 pt-2">
                        <Facebook size={18} className="text-gray-400" />
                      </div>
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
                    
                    <div className="flex">
                      <div className="mr-2 pt-2">
                        <Twitter size={18} className="text-gray-400" />
                      </div>
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
              </motion.div>
            )}

            {/* Navigation buttons */}
            <div className="pt-5 border-t border-gray-200 mt-8">
              <div className="flex justify-between">
                <motion.button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Previous
                </motion.button>
                
                {currentStep < 4 ? (
                  <motion.button
                    type="button"
                    onClick={nextStep}
                    className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Next
                    <ChevronRight size={16} className="ml-1" />
                  </motion.button>
                ) : (
                  <motion.button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Create Card
                    <Check size={16} className="ml-1" />
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Preview section */}
        <div className="lg:col-span-2">
          <motion.div 
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 sticky top-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Card Preview</h2>
            
            {renderCardPreview()}
            
            <div className="mt-6 border-t border-gray-200 pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Wallet Compatibility</h3>
              <div className="flex items-center space-x-4">
                <motion.div 
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <Smartphone size={16} className="text-gray-400 mr-1" />
                  <span className="text-sm text-gray-600">Apple Wallet</span>
                </motion.div>
                <motion.div 
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <Smartphone size={16} className="text-gray-400 mr-1" />
                  <span className="text-sm text-gray-600">Google Pay</span>
                </motion.div>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-xs text-gray-500">
                Preview updates as you make changes. The final card may appear slightly different on actual devices.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CreateCardPage;