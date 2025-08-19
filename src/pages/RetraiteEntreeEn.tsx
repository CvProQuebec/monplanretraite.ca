import React from 'react';
import { Phase2Wrapper } from '../features/retirement/components/Phase2Wrapper';
import { SimpleNavigation } from '../components/layout/header/SimpleNavigation';

const RetraiteEntreeEn: React.FC = () => {
  return (
    <Phase2Wrapper 
      theme="premium" 
      showParticles={true} 
      showPhysics={true}
      enableThemeRotation={true}
      enableAdaptiveLayout={true}
    >
      <SimpleNavigation />
      
      {/* Hero Section with premium theme */}
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
              Retirement Planner
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto drop-shadow-md">
              Plan your retirement with professional tools and advanced analysis
            </p>
          </div>

          {/* Complete Financial Planning Section */}
          <div className="bg-white rounded-2xl p-8 md:p-12 mb-16 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6 text-center">
              Complete Financial Planning
            </h2>
            <p className="text-lg text-gray-700 text-center mb-12 max-w-4xl mx-auto">
              Our unique platform allows you to manage your entire financial, budgetary and tax planning for a serene and optimized retirement.
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Cashflow Management */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2 text-center">
                  Cashflow Management
                </h3>
                <p className="text-blue-700 text-center text-sm">
                  Analyze and optimize your expense flows to maximize your savings
                </p>
              </div>

              {/* Withdrawal Strategies */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-green-900 mb-2 text-center">
                  Withdrawal Strategies
                </h3>
                <p className="text-green-700 text-center text-sm">
                  Determine the best time to withdraw from your investments
                </p>
              </div>

              {/* Expense Planning */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-purple-900 mb-2 text-center">
                  Expense Planning
                </h3>
                <p className="text-purple-700 text-center text-sm">
                  Evaluate the impact of major purchases on your future income
                </p>
              </div>

              {/* Tax Optimization */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2 text-center">
                  Tax Optimization
                </h3>
                <p className="text-blue-700 text-center text-sm">
                  Minimize your taxes with smart withdrawal strategies
                </p>
              </div>
            </div>
          </div>

          {/* Plan Comparison Section */}
          <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-2xl p-8 md:p-12 mb-16 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">
              Plan Comparison
            </h2>
            <p className="text-xl text-blue-100 text-center mb-12 max-w-3xl mx-auto">
              Discover what's included in each plan and choose the one that fits your needs
            </p>

            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-blue-600">
                    <th className="py-4 px-6 text-white font-semibold text-lg">Feature</th>
                    <th className="py-4 px-6 text-center">
                      <div className="text-white font-semibold">Free</div>
                      <div className="text-blue-200 text-sm">Free</div>
                    </th>
                    <th className="py-4 px-6 text-center">
                      <div className="text-white font-semibold">Professional</div>
                      <div className="text-blue-200 text-sm">$119.99/year</div>
                    </th>
                    <th className="py-4 px-6 text-center">
                      <div className="text-white font-semibold">Ultimate</div>
                      <div className="text-blue-200 text-sm">$239.99/year</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-blue-100">
                  <tr className="border-b border-blue-700">
                    <td className="py-3 px-6">Basic planning</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                  </tr>
                  <tr className="border-b border-blue-700">
                    <td className="py-3 px-6">Personal profile management</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                  </tr>
                  <tr className="border-b border-blue-700">
                    <td className="py-3 px-6">Basic retirement calculations</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                  </tr>
                  <tr className="border-b border-blue-700">
                    <td className="py-3 px-6">Savings management</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                  </tr>
                  <tr className="border-b border-blue-700">
                    <td className="py-3 px-6">Cashflow management</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                  </tr>
                  <tr className="border-b border-blue-700">
                    <td className="py-3 px-6">Expense projects</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                  </tr>
                  <tr className="border-b border-blue-700">
                    <td className="py-3 px-6">Withdrawal strategies</td>
                    <td className="py-3 px-6 text-center text-red-400">✗</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                  </tr>
                  <tr className="border-b border-blue-700">
                    <td className="py-3 px-6">Monte Carlo simulations</td>
                    <td className="py-3 px-6 text-center text-red-400">✗</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                  </tr>
                  <tr className="border-b border-blue-700">
                    <td className="py-3 px-6">Tax optimization</td>
                    <td className="py-3 px-6 text-center text-red-400">✗</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                  </tr>
                  <tr className="border-b border-blue-700">
                    <td className="py-3 px-6">AI personalized advice</td>
                    <td className="py-3 px-6 text-center text-red-400">✗</td>
                    <td className="py-3 px-6 text-center text-red-400">✗</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                  </tr>
                  <tr className="border-b border-blue-700">
                    <td className="py-3 px-6">Detailed reports</td>
                    <td className="py-3 px-6 text-center text-red-400">✗</td>
                    <td className="py-3 px-6 text-center text-red-400">✗</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                  </tr>
                  <tr className="border-b border-blue-700">
                    <td className="py-3 px-6">PDF export</td>
                    <td className="py-3 px-6 text-center text-red-400">✗</td>
                    <td className="py-3 px-6 text-center text-red-400">✗</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6">Priority support</td>
                    <td className="py-3 px-6 text-center text-red-400">✗</td>
                    <td className="py-3 px-6 text-center text-red-400">✗</td>
                    <td className="py-3 px-6 text-center text-green-400">✓</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Annual Plans Section */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 md:p-12 mb-16 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-12 text-center">
              Our Annual Plans
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Free Plan */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-300">
                <div className="text-center mb-6">
                  <span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
                    Trial
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                  <p className="text-gray-600 mb-4">Start your retirement planning</p>
                  <div className="text-4xl font-bold text-gray-900">$0</div>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Basic cashflow management
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    1 expense project
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Basic planning
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Local backup
                  </li>
                </ul>
                <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Start Free
                </button>
              </div>

              {/* Professional Plan */}
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-500 relative hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-full">
                    Recommended
                  </span>
                </div>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional</h3>
                  <p className="text-gray-600 mb-4">For advanced planning</p>
                  <div className="text-4xl font-bold text-gray-900">$119.99</div>
                  <p className="text-gray-500 text-sm">per year</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Advanced cashflow management
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Withdrawal strategies
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    100 Monte Carlo simulations
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Multiple expense projects
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Basic tax optimization
                  </li>
                </ul>
                <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Choose Professional
                </button>
              </div>

              {/* Ultimate Plan */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-200 hover:shadow-xl transition-all duration-300">
                <div className="text-center mb-6">
                  <span className="inline-block bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
                    Premium
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Ultimate</h3>
                  <p className="text-gray-600 mb-4">Complete solution with AI</p>
                  <div className="text-4xl font-bold text-gray-900">$239.99</div>
                  <p className="text-gray-500 text-sm">per year</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Expert cashflow management
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    AI-powered withdrawal strategies
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Unlimited Monte Carlo simulations
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Advanced tax optimization
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    AI personalized advice
                  </li>
                </ul>
                <button className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                  Choose Ultimate
                </button>
              </div>
            </div>
          </div>

          {/* Important Warning Section */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 md:p-12 mb-16">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-2xl font-bold text-yellow-800 mb-4">
                  Important Warning
                </h3>
                <p className="text-yellow-700 text-lg mb-6">
                  This financial planning platform is an educational and informational tool that does not replace consultation with a qualified professional.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-yellow-800 mb-3">YOUR RESPONSIBILITIES:</h4>
                    <ul className="space-y-2 text-yellow-700">
                      <li className="flex items-start">
                        <span className="text-yellow-600 mr-2">•</span>
                        Consult a licensed financial planner for important decisions
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-600 mr-2">•</span>
                        Verify the tax validity of your strategies with a tax specialist
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-600 mr-2">•</span>
                        Get legal advice for estate planning
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-yellow-800 mb-3">ADVANTAGES OF OUR SOLUTION:</h4>
                    <ul className="space-y-2 text-yellow-700">
                      <li className="flex items-start">
                        <span className="text-yellow-600 mr-2">•</span>
                        Save time by preparing your file in advance
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-600 mr-2">•</span>
                        Reduce the number of meetings with your professionals
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-600 mr-2">•</span>
                        Take control of your finances with professional tools
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-600 mr-2">•</span>
                        Optimize your consultations through better understanding
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Welcome and Promo Code Section */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 md:p-12 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600">M</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Welcome Gerald Dore!
              </h2>
              <p className="text-green-100 text-lg mb-8">
                Do you have a promo code? Unlock additional features!
              </p>
              
              <div className="max-w-md mx-auto">
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Enter your promo code...."
                    className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:ring-opacity-50 text-gray-900"
                  />
                  <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Phase2Wrapper>
  );
};

export default RetraiteEntreeEn;