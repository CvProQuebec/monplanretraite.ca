// src/pages/RetirementReportsEn.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, BarChart3, TrendingUp, Download, Eye, Crown, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RetirementReportsEn: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToModule = () => {
    navigate('/en/retirement-module');
  };

  const handleViewReport = (reportType: string) => {
    // Navigation vers le module Retraite avec la section rapports active
    navigate('/en/retirement-module?section=reports');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        
        {/* Header with back button */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={handleBackToModule}
            className="mb-6 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Retirement Module
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              Retirement Reports
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Generate and view detailed reports to optimize your retirement planning
            </p>
          </div>
        </div>

        {/* Introduction Section */}
        <Card className="mb-12 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
              Why detailed reports?
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 max-w-4xl mx-auto">
              Reports give you a clear view of your financial situation and help you make informed decisions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Complete analysis</h3>
                <p className="text-sm text-gray-600">
                  Overview of all your assets, liabilities and projections
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Future projections</h3>
                <p className="text-sm text-gray-600">
                  Simulations based on your data and objectives
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Export and sharing</h3>
                <p className="text-sm text-gray-600">
                  PDF reports for your advisors or archives
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available report types */}
        <Card className="mb-12 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
              Available report types
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 max-w-4xl mx-auto">
              Choose the report that matches your current needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Executive Report */}
              <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <Badge variant="outline" className="text-xs">Professional+</Badge>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Executive Report</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Concise summary of your financial situation with key recommendations
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Asset overview</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Objectives and projections</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Priority recommendations</span>
                  </div>
                </div>
                <Button
                  onClick={() => handleViewReport('executive')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
              </div>

              {/* Comprehensive Report */}
              <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                  </div>
                  <Badge variant="outline" className="text-xs">Professional+</Badge>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Comprehensive Report</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Detailed analysis with all data and calculations
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Detailed CPP/RRQ analysis</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Cashflow projections</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Multiple scenarios</span>
                  </div>
                </div>
                <Button
                  onClick={() => handleViewReport('comprehensive')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
              </div>

              {/* Cashflow Report */}
              <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <Badge variant="outline" className="text-xs">Professional+</Badge>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Cashflow Report</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Detailed analysis of your cash flows
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Income and expenses</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Monthly projections</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Possible optimizations</span>
                  </div>
                </div>
                <Button
                  onClick={() => handleViewReport('cashflow')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
              </div>

              {/* Monte Carlo Report */}
              <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-orange-600" />
                  </div>
                  <Badge variant="outline" className="text-xs">Professional+</Badge>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Monte Carlo Simulation</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Risk analysis with probabilistic simulations
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Market scenarios</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Risk analysis</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Success probabilities</span>
                  </div>
                </div>
                <Button
                  onClick={() => handleViewReport('monte-carlo')}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
              </div>

              {/* Estate Planning Report */}
              <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Crown className="w-6 h-6 text-red-600" />
                  </div>
                  <Badge variant="default" className="text-xs">Expert</Badge>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Estate Planning</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Advanced planning for wealth transfer
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Tax strategies</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Family planning</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Wealth protection</span>
                  </div>
                </div>
                <Button
                  onClick={() => handleViewReport('estate-planning')}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
              </div>

              {/* Custom Report */}
              <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-indigo-600" />
                  </div>
                  <Badge variant="secondary" className="text-xs">Custom</Badge>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Custom Report</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Report adapted to your specific needs
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span>Custom content</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span>Adapted format</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span>Contact us</span>
                  </div>
                </div>
                <Button
                  onClick={() => handleViewReport('custom')}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced features section */}
        <Card className="mb-12 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
              Advanced features
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 max-w-4xl mx-auto">
              Discover additional tools to optimize your reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-lg text-gray-900 mb-4">Export and sharing</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <span className="text-sm">High quality PDF export</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <span className="text-sm">Secure email sharing</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <span className="text-sm">Automatic archiving</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <span className="text-sm">Version comparison</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-lg text-gray-900 mb-4">Customization</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <span className="text-sm">Customizable templates</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <span className="text-sm">Add notes and comments</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <span className="text-sm">Custom filters and sorting</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <span className="text-sm">Report scheduling</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 shadow-xl">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold mb-4">Ready to generate your reports?</h2>
              <p className="text-xl mb-8 opacity-90">
                Access the complete module to create personalized and detailed reports
              </p>
              <Button
                onClick={handleBackToModule}
                className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 text-lg font-medium"
              >
                Access Retirement Module
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RetirementReportsEn;
