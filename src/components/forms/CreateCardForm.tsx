
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Save } from 'lucide-react';
import { useLoyaltyCards } from '../../hooks/useLoyaltyCards';
import { supabase } from '../../integrations/supabase/client';
import { useAuth } from '../../contexts/AuthContext';

const CreateCardForm: React.FC = () => {
  const navigate = useNavigate();
  const { createCard } = useLoyaltyCards();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    type: 'stamp' as 'stamp' | 'points' | 'tier',
    backgroundColor: '#3B82F6',
    rewardTitle: '',
    totalNeeded: 10,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalNeeded' ? parseInt(value) || 0 : value
    }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    setLogoFile(file);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${currentUser.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('business-logos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('business-logos')
        .getPublicUrl(fileName);

      setLogoUrl(data.publicUrl);
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Failed to upload logo. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.rewardTitle.trim()) {
      alert('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    try {
      await createCard({
        name: formData.name.trim(),
        type: formData.type,
        design: {
          backgroundColor: formData.backgroundColor,
          logoUrl: logoUrl || undefined,
        },
        rules: {
          rewardTitle: formData.rewardTitle.trim(),
          totalNeeded: formData.totalNeeded,
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

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Loyalty Card</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Card Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Coffee Rewards Card"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              Card Type *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="stamp">Stamp Card</option>
              <option value="points">Points Card</option>
              <option value="tier">Tier Card</option>
            </select>
          </div>

          <div>
            <label htmlFor="backgroundColor" className="block text-sm font-medium text-gray-700 mb-2">
              Background Color
            </label>
            <input
              type="color"
              id="backgroundColor"
              name="backgroundColor"
              value={formData.backgroundColor}
              onChange={handleInputChange}
              className="w-20 h-10 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-2">
              Logo Upload
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                id="logo"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <label
                htmlFor="logo"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                <Upload size={16} className="mr-2" />
                Choose Logo
              </label>
              {logoFile && (
                <span className="text-sm text-gray-600">{logoFile.name}</span>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="rewardTitle" className="block text-sm font-medium text-gray-700 mb-2">
              Reward Title *
            </label>
            <input
              type="text"
              id="rewardTitle"
              name="rewardTitle"
              value={formData.rewardTitle}
              onChange={handleInputChange}
              placeholder="e.g., Buy 10 coffees, get 1 free"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="totalNeeded" className="block text-sm font-medium text-gray-700 mb-2">
              Total {formData.type === 'stamp' ? 'Stamps' : 'Points'} Needed for Reward *
            </label>
            <input
              type="number"
              id="totalNeeded"
              name="totalNeeded"
              value={formData.totalNeeded}
              onChange={handleInputChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/cards')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              <Save size={16} className="mr-2" />
              {loading ? 'Creating...' : 'Create Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCardForm;
