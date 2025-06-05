import React, { useState } from 'react';
import { 
  Search, Filter, Download, MoreVertical, 
  Plus, Mail, Smartphone, Trash2, Edit, XCircle, 
  CheckCircle, ChevronDown, UserPlus, Users
} from 'lucide-react';
import { useCustomers } from '../../hooks/useCustomers';
import { useLoyaltyCards } from '../../hooks/useLoyaltyCards';
import { useCustomerLoyaltyCards } from '../../hooks/useCustomerLoyaltyCards';
import { toast } from '../../components/ui/use-toast';

const CustomersPage: React.FC = () => {
  const { customers, loading, error, createCustomer, updateCustomer, deleteCustomer } = useCustomers();
  const { cards: loyaltyCards, loading: loyaltyCardsLoading } = useLoyaltyCards();
  const { createCustomerLoyaltyCard, getCustomerLoyaltyCardsByCustomerId } = useCustomerLoyaltyCards();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCustomerMenu, setActiveCustomerMenu] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    initialPoints: 0,
    loyaltyCardId: ''
  });

  const toggleCustomerMenu = (customerId: string) => {
    if (activeCustomerMenu === customerId) {
      setActiveCustomerMenu(null);
    } else {
      setActiveCustomerMenu(customerId);
    }
  };

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.phone && customer.phone.includes(searchTerm))
  );

  const stats = [
    { 
      name: 'Total Customers', 
      value: customers.length,
      icon: <Users size={20} className="text-blue-600" /> 
    },
    { 
      name: 'Active Customers', 
      value: customers.length, // All customers are considered active for now
      icon: <CheckCircle size={20} className="text-green-600" /> 
    },
    { 
      name: 'New This Month', 
      value: customers.filter(c => {
        const customerDate = new Date(c.created_at);
        const now = new Date();
        return customerDate.getMonth() === now.getMonth() && customerDate.getFullYear() === now.getFullYear();
      }).length,
      icon: <UserPlus size={20} className="text-amber-600" /> 
    },
  ];

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newCustomer = await createCustomer({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        metadata: {
          initialPoints: formData.initialPoints
        }
      });
      
      // If a loyalty card was selected, create the customer loyalty card relationship
      if (formData.loyaltyCardId && newCustomer) {
        await createCustomerLoyaltyCard({
          customer_profile_id: newCustomer.id,
          loyalty_card_id: formData.loyaltyCardId,
          points: formData.initialPoints,
          stamps: 0
        });
      }
      
      // Reset form and close modal
      setFormData({ name: '', email: '', phone: '', initialPoints: 0, loyaltyCardId: '' });
      setShowModal(false);
      toast({
        title: "Success",
        description: "Customer created successfully"
      });
    } catch (error) {
      console.error('Failed to create customer:', error);
      toast({
        title: "Error",
        description: "Failed to create customer"
      });
    }
  };

  const handleEditClick = (customer: any) => {
    setEditingCustomer({
      ...customer,
      phone: customer.phone || '',
      initialPoints: customer.metadata?.initialPoints || 0
    });
    setShowEditModal(true);
    setActiveCustomerMenu(null);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingCustomer) return;

    try {
      await updateCustomer(editingCustomer.id, {
        name: editingCustomer.name,
        email: editingCustomer.email,
        phone: editingCustomer.phone || undefined,
        metadata: {
          ...editingCustomer.metadata,
          initialPoints: editingCustomer.initialPoints
        }
      });
      
      // Close modal and reset state
      setShowEditModal(false);
      setEditingCustomer(null);
      toast({
        title: "Success",
        description: "Customer updated successfully"
      });
    } catch (error) {
      console.error('Failed to update customer:', error);
      toast({
        title: "Error",
        description: "Failed to update customer"
      });
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer(customerId);
        setActiveCustomerMenu(null);
        toast({
          title: "Success",
          description: "Customer deleted successfully"
        });
      } catch (error) {
        console.error('Failed to delete customer:', error);
        toast({
          title: "Error",
          description: "Failed to delete customer"
        });
      }
    }
  };

  const getCustomerLoyaltyCards = (customerId: string) => {
    return getCustomerLoyaltyCardsByCustomerId(customerId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-gray-500">Loading customers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-red-500">Error loading customers: {error.message}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-1">
            Manage your loyalty program customers.
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm"
        >
          <UserPlus size={18} className="mr-2" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                {stat.icon}
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.name}</h3>
            <p className="text-gray-900 text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search and filter */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex space-x-2">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors">
              <Filter size={18} className="mr-2 text-gray-500" />
              <span>Filter</span>
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors">
              <Download size={18} className="mr-2 text-gray-500" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Customers table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
            <p className="text-gray-500 mb-4">
              {customers.length === 0 
                ? "Get started by adding your first customer"
                : "Try adjusting your search terms"
              }
            </p>
            {customers.length === 0 && (
              <button 
                onClick={() => setShowModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <UserPlus size={18} className="mr-2" />
                Add First Customer
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        Customer
                        <ChevronDown size={14} className="ml-1" />
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        Contact
                        <ChevronDown size={14} className="ml-1" />
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        Loyalty Cards
                        <ChevronDown size={14} className="ml-1" />
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        Joined
                        <ChevronDown size={14} className="ml-1" />
                      </div>
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCustomers.map((customer) => {
                    const customerLoyaltyCards = getCustomerLoyaltyCards(customer.id);
                    return (
                      <tr key={customer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                              {customer.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                              <div className="text-sm text-gray-500">{customer.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Mail size={12} className="mr-1" />
                              <span>{customer.email}</span>
                            </div>
                            {customer.phone && (
                              <div className="flex items-center">
                                <Smartphone size={12} className="mr-1" />
                                <span>{customer.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {customerLoyaltyCards.length > 0 ? (
                              <div className="space-y-1">
                                {customerLoyaltyCards.map((card) => (
                                  <div key={card.id} className="flex items-center justify-between">
                                    <span className="text-sm font-medium">{card.loyalty_card_name}</span>
                                    <div className="text-xs text-gray-500">
                                      {card.points > 0 && <span>{card.points} pts</span>}
                                      {card.stamps > 0 && <span>{card.stamps} stamps</span>}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-400">No loyalty cards</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(customer.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="relative">
                            <button 
                              onClick={() => toggleCustomerMenu(customer.id)}
                              className="text-gray-400 hover:text-gray-500"
                            >
                              <MoreVertical size={18} />
                            </button>
                            {activeCustomerMenu === customer.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
                                <button 
                                  onClick={() => handleEditClick(customer)}
                                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <Edit size={16} className="mr-3 text-gray-500" />
                                  <span>Edit Customer</span>
                                </button>
                                <button className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                  <Plus size={16} className="mr-3 text-gray-500" />
                                  <span>Add Points</span>
                                </button>
                                <button className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                  <Mail size={16} className="mr-3 text-gray-500" />
                                  <span>Send Message</span>
                                </button>
                                <button 
                                  onClick={() => handleDeleteCustomer(customer.id)}
                                  className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 size={16} className="mr-3 text-red-500" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredCustomers.length}</span> of{' '}
                    <span className="font-medium">{filteredCustomers.length}</span> results
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add Customer Modal */}
      {showModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowModal(false)}></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleFormSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Add New Customer
                        </h3>
                        <button 
                          type="button"
                          onClick={() => setShowModal(false)} 
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <XCircle size={20} />
                        </button>
                      </div>
                      
                      <div className="mt-2 space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Full Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="John Doe"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                          </label>
                          <input
                            type="email"
                            id="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="john@example.com"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>

                        <div>
                          <label htmlFor="loyaltyCard" className="block text-sm font-medium text-gray-700">
                            Loyalty Card (Optional)
                          </label>
                          <select
                            id="loyaltyCard"
                            value={formData.loyaltyCardId}
                            onChange={(e) => setFormData({ ...formData, loyaltyCardId: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            disabled={loyaltyCardsLoading}
                          >
                            <option value="">Select a loyalty card</option>
                            {loyaltyCards.map((card) => (
                              <option key={card.id} value={card.id}>
                                {card.name}
                              </option>
                            ))}
                          </select>
                          {loyaltyCardsLoading && (
                            <p className="text-sm text-gray-500 mt-1">Loading loyalty cards...</p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor="initialPoints" className="block text-sm font-medium text-gray-700">
                            Initial Points
                          </label>
                          <input
                            type="number"
                            id="initialPoints"
                            value={formData.initialPoints}
                            onChange={(e) => setFormData({ ...formData, initialPoints: parseInt(e.target.value) || 0 })}
                            min="0"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Add Customer
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {showEditModal && editingCustomer && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowEditModal(false)}></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleEditSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Edit Customer
                        </h3>
                        <button 
                          type="button"
                          onClick={() => setShowEditModal(false)} 
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <XCircle size={20} />
                        </button>
                      </div>
                      
                      <div className="mt-2 space-y-4">
                        <div>
                          <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">
                            Full Name
                          </label>
                          <input
                            type="text"
                            id="edit-name"
                            required
                            value={editingCustomer.name}
                            onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="John Doe"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700">
                            Email Address
                          </label>
                          <input
                            type="email"
                            id="edit-email"
                            required
                            value={editingCustomer.email}
                            onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="john@example.com"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="edit-phone" className="block text-sm font-medium text-gray-700">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            id="edit-phone"
                            value={editingCustomer.phone}
                            onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="edit-initialPoints" className="block text-sm font-medium text-gray-700">
                            Initial Points
                          </label>
                          <input
                            type="number"
                            id="edit-initialPoints"
                            value={editingCustomer.initialPoints}
                            onChange={(e) => setEditingCustomer({ ...editingCustomer, initialPoints: parseInt(e.target.value) || 0 })}
                            min="0"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;
