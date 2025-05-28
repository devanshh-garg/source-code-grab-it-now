import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  CreditCard, Users, BarChart3, QrCode, Home, 
  Menu, X, LogOut, Settings, User
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const navItems = [
    { path: '/dashboard', icon: <Home size={20} />, label: 'Dashboard' },
    { path: '/cards', icon: <CreditCard size={20} />, label: 'Loyalty Cards' },
    { path: '/customers', icon: <Users size={20} />, label: 'Customers' },
    { path: '/analytics', icon: <BarChart3 size={20} />, label: 'Analytics' },
    { path: '/scanner', icon: <QrCode size={20} />, label: 'Scanner' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white z-10 border-b shadow-sm">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="font-semibold text-lg">LoyaltyCard</div>
          <div className="relative">
            <button className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
              {currentUser?.name.charAt(0) || 'U'}
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <CreditCard className="text-blue-500" size={24} />
              <span className="text-xl font-semibold">LoyaltyCard</span>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-md transition duration-150 ${
                  location.pathname === item.path 
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                {currentUser?.name.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {currentUser?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {currentUser?.businessName}
                </p>
              </div>
            </div>
            
            <div className="space-y-1">
              <button
                onClick={() => {/* Profile settings */}}
                className="flex w-full items-center space-x-3 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
              >
                <User size={16} />
                <span>Profile</span>
              </button>
              <button
                onClick={() => {/* Account settings */}}
                className="flex w-full items-center space-x-3 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
              >
                <Settings size={16} />
                <span>Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex w-full items-center space-x-3 px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={`pt-0 lg:pt-0 lg:pl-64 min-h-screen`}>
        <div className="hidden lg:block bg-white border-b shadow-sm">
          <div className="flex items-center justify-end p-4">
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Settings size={20} className="text-gray-600" />
              </button>
              <div className="relative">
                <button className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                  {currentUser?.name.charAt(0) || 'U'}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile spacing */}
        <div className="lg:hidden h-16"></div>
        
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default Layout;