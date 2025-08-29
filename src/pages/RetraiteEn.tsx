// src/pages/RetraiteEn.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Shield, Calculator, TrendingUp, FileText, Users, DollarSign, Zap, Crown, Lock, Database, AlertTriangle, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../features/retirement/hooks/useLanguage';
import { translations } from '../features/retirement/translations';
import { RetirementNavigation } from '../features/retirement';

const RetraiteEn: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Integrated Phase 1 Navigation */}
      <RetirementNavigation />
      
      {/* Main content */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Intelligent Retirement Planning
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Plan your financial future with our professional tools and advanced analysis
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Basic planning */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Basic Planning
              </CardTitle>
              <CardDescription>
                Free features to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-green-600" />
                Personal profile and goals
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calculator className="w-4 h-4 text-green-600" />
                Basic retirement calculations
              </div>
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-green-600" />
                Savings management
              </div>
              <Button 
                onClick={() => navigate('/en/retirement-module-phase1')}
                className="w-full mt-4"
              >
                Start Free
              </Button>
            </CardContent>
          </Card>

          {/* Advanced features */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                Advanced Features
              </CardTitle>
              <CardDescription>
                Professional tools and detailed analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-purple-600" />
                Detailed reports and analysis
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-purple-600" />
                Advanced simulators
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Crown className="w-4 h-4 text-purple-600" />
                Tax optimization
              </div>
              <Button 
                onClick={() => navigate('/en/retirement-module')}
                className="w-full mt-4"
                variant="outline"
              >
                Discover Pro
              </Button>
            </CardContent>
          </Card>

          {/* Security and backup */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-green-600" />
                Security & Backup
              </CardTitle>
              <CardDescription>
                Data protection and advice
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Database className="w-4 h-4 text-green-600" />
                Secure backup
              </div>
              <div className="flex items-center gap-2 text-sm">
                <AlertTriangle className="w-4 h-4 text-green-600" />
                Security tips
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ExternalLink className="w-4 h-4 text-green-600" />
                Emergency information
              </div>
              <Button 
                onClick={() => navigate('/en/retirement-module?section=backup-security')}
                className="w-full mt-4"
                variant="outline"
              >
                Learn More
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Call to action */}
        <div className="text-center">
          <Button 
            onClick={() => navigate('/en/retirement-module-phase1')}
            size="lg"
            className="text-lg px-8 py-4"
          >
            🚀 Access Complete Module
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RetraiteEn;