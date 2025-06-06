
import { Coffee, Award, BarChart, Gift } from 'lucide-react';

export const cardTypes = [
  { id: 'stamp', name: 'Stamp Card', icon: Coffee },
  { id: 'points', name: 'Points System', icon: Award },
  { id: 'tiered', name: 'Tiered Membership', icon: BarChart },
  { id: 'discount', name: 'Discount Card', icon: Gift },
];

export const colorThemes = [
  { id: 'blue', name: 'Blue', primary: '#3B82F6', secondary: '#2563EB' },
  { id: 'purple', name: 'Purple', primary: '#8B5CF6', secondary: '#7C3AED' },
  { id: 'green', name: 'Green', primary: '#10B981', secondary: '#059669' },
  { id: 'amber', name: 'Amber', primary: '#F59E0B', secondary: '#D97706' },
  { id: 'red', name: 'Red', primary: '#EF4444', secondary: '#DC2626' },
  { id: 'gray', name: 'Gray', primary: '#4B5563', secondary: '#374151' },
];
