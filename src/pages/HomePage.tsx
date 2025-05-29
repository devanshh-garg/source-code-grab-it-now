import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Smartphone, Award, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';

const HomePage: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkProfile = async () => {
      if (!loading && currentUser) {
        // Fetch the user's business profile from Supabase
        const { data, error } = await supabase
          .from('businesses')
          .select('name')
          .eq('user_id', currentUser.id)
          .single();
        if (error || !data || !data.name) {
          navigate('/complete-profile');
        } else {
          navigate('/dashboard');
        }
      }
    };
    checkProfile();
  }, [loading, currentUser, navigate]);

  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-5">
            <div className="flex items-center space-x-2">
              <CreditCard className="text-white" size={28} />
              <span className="text-2xl font-bold text-white">LoyaltyCard</span>
            </div>
            <div className="space-x-4">
              <Link 
                to="/login" 
                className="px-4 py-2 text-sm font-medium text-white hover:text-blue-100"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="px-4 py-2 text-sm font-medium bg-white text-blue-600 rounded-md hover:bg-blue-50"
              >
                Sign Up
              </Link>
            </div>
          </div>
          <div className="py-16 md:py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  Elevate Customer Loyalty with Digital Cards
                </h1>
                <p className="text-blue-100 text-lg mb-8 max-w-lg">
                  Create beautiful digital loyalty cards compatible with Apple Wallet and Google Pay. Reward your customers and boost retention with minimal effort.
                </p>
                <div className="space-x-4">
                  <Link 
                    to="/signup" 
                    className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-md font-medium hover:bg-blue-50 transition-colors"
                  >
                    Get Started
                    <ArrowRight className="ml-2" size={18} />
                  </Link>
                  <a 
                    href="#features" 
                    className="inline-flex items-center px-6 py-3 text-white border border-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                  >
                    Learn More
                  </a>
                </div>
              </div>
              <div className="hidden md:block relative">
                <div className="absolute -top-16 -right-16 w-64 h-64 bg-blue-500 rounded-full opacity-20"></div>
                <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-indigo-500 rounded-full opacity-20"></div>
                <div className="relative bg-white p-4 rounded-xl shadow-2xl transform rotate-3">
                  <div className="p-4 border-2 border-blue-500 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <CreditCard className="text-white" size={20} />
                        </div>
                        <span className="font-bold text-gray-800">Coffee Rewards</span>
                      </div>
                      <div className="text-sm bg-blue-100 text-blue-800 py-1 px-2 rounded-full">
                        Gold Member
                      </div>
                    </div>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center space-x-2">
                        <CheckCircle size={16} className="text-green-500" />
                        <span className="text-sm text-gray-600">8 coffees collected</span>
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="w-full aspect-square bg-blue-500 rounded-md flex items-center justify-center">
                            <CreditCard className="text-white" size={16} />
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="w-full aspect-square bg-blue-500 rounded-md flex items-center justify-center">
                            <CreditCard className="text-white" size={16} />
                          </div>
                        ))}
                        {[...Array(2)].map((_, i) => (
                          <div key={i} className="w-full aspect-square bg-gray-200 rounded-md flex items-center justify-center">
                            <CreditCard className="text-gray-400" size={16} />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-center py-2 bg-blue-500 text-white rounded-md">
                      2 more stamps for a free coffee!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features section */}
      <section id="features" className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features for Your Business</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to create and manage digital loyalty cards that delight your customers and grow your business.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <CreditCard className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Custom Digital Cards</h3>
              <p className="text-gray-600 mb-4">
                Design beautiful cards with your branding. Choose from templates or create your own from scratch.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center">
                  <CheckCircle size={16} className="text-green-500 mr-2" />
                  <span>Apple Wallet & Google Pay compatible</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle size={16} className="text-green-500 mr-2" />
                  <span>Update card content anytime</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle size={16} className="text-green-500 mr-2" />
                  <span>Interactive elements & links</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Flexible Reward Programs</h3>
              <p className="text-gray-600 mb-4">
                Create any type of loyalty program to match your business model and customer preferences.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center">
                  <CheckCircle size={16} className="text-green-500 mr-2" />
                  <span>Points, stamps, or tiered systems</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle size={16} className="text-green-500 mr-2" />
                  <span>Discounts and special offers</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle size={16} className="text-green-500 mr-2" />
                  <span>Customer referral incentives</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Easy Distribution</h3>
              <p className="text-gray-600 mb-4">
                Multiple ways to get your loyalty cards into your customers' hands and devices.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center">
                  <CheckCircle size={16} className="text-green-500 mr-2" />
                  <span>QR codes for quick scanning</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle size={16} className="text-green-500 mr-2" />
                  <span>Direct links via email or SMS</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle size={16} className="text-green-500 mr-2" />
                  <span>Website widgets and social media</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-12 shadow-xl">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Loyalty Program?</h2>
              <p className="text-blue-100 text-lg mb-8">
                Join thousands of businesses already delighting their customers with digital loyalty cards. Get started in minutes.
              </p>
              <Link 
                to="/signup" 
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-md font-semibold text-lg hover:bg-blue-50 transition-colors"
              >
                Start Your Free Trial
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <p className="text-blue-200 mt-4 text-sm">No credit card required. 14-day free trial.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <CreditCard className="text-blue-600" size={24} />
                <span className="text-xl font-bold text-gray-900">LoyaltyCard</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                The easiest way to create and manage digital loyalty cards for your business.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Product</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Features</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Pricing</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Integrations</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Case Studies</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Documentation</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Blog</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Support</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">API Reference</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">About</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Careers</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Contact</a></li>
                <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-200 pt-8">
            <p className="text-sm text-gray-400 text-center">
              &copy; {new Date().getFullYear()} LoyaltyCard. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;