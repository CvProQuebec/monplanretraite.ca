// src/pages/RetraiteEn.tsx
import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Shield, TrendingUp, Crown, Zap, FileText, Users, Calculator, Target, Check, ArrowRight, User, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/use-toast';
import { PromoCodeInput } from '../components/ui/promo-code-input';
import { usePromoCode } from '../hooks/usePromoCode';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/header';

const RetraiteEn: React.FC = () => {
  const { user, signInWithGoogle, signOut } = useAuth();
  const { toast } = useToast();
  const { promoCode, setPromoCode, appliedCode, applyPromoCode, clearPromoCode } = usePromoCode();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast({
        title: "Connection successful",
        description: "Welcome to your retirement planner!",
        variant: "default"
      });
      // Redirect to complete module after connection
      navigate('/en/retirement-module');
    } catch (error) {
      toast({
        title: "Connection error",
        description: "Unable to connect with Google. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePromoCodeSubmit = async () => {
    if (!promoCode.trim()) return;
    
    try {
      const result = await applyPromoCode(promoCode);
      if (result.success) {
        toast({
          title: "Promo code applied!",
          description: result.message,
          variant: "default"
        });
      } else {
        toast({
          title: "Invalid promo code",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to validate promo code",
        variant: "destructive"
      });
    }
  };

  const handleAccessModule = () => {
    if (user) {
      navigate('/en/retirement-module');
    } else {
      toast({
        title: "Connection required",
        description: "Please connect to access the complete module",
        variant: "destructive"
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Sign out successful",
        description: "You have been successfully signed out",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Sign out error",
        description: "Unable to sign out. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header seulement, sans footer */}
      <Header isEnglish={true} />
      <div className="pt-24">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          
          {/* Connection indicator at the top of the page */}
          {user && (
            <div className="flex justify-end mb-8">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
                  <User className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-700">
                    Connected as:
                  </span>
                  <span className="font-medium text-green-800">
                    {user.displayName || user.email}
                  </span>
                </div>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          )}
          
          {/* Header and Introduction */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              Retirement Planner
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Plan your retirement with professional tools and advanced analysis
            </p>
          </div>

          {/* Google Connection Section */}
          <Card className="mb-16 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
                Start your planning
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 max-w-4xl mx-auto">
                Connect with your Google account to access all retirement planning tools
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!user ? (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <Button
                      onClick={handleGoogleSignIn}
                      className="bg-white text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-medium border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-6 h-6 mr-3" />
                      Sign in with Google
                    </Button>
                  </div>
                  
                  {/* Optional promo code */}
                  <div className="mt-6">
                    <div className="text-center">
                      <p className="text-gray-600 mb-3">Do you have a promo code?</p>
                      <div className="flex justify-center gap-2 max-w-md mx-auto">
                        <PromoCodeInput
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Promo code (optional)"
                          className="flex-1"
                        />
                        <Button
                          onClick={handlePromoCodeSubmit}
                          variant="outline"
                          size="sm"
                          disabled={!promoCode.trim()}
                        >
                          Apply
                        </Button>
                      </div>
                      {appliedCode && (
                        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-green-700 text-sm">
                            Promo code applied: {appliedCode}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={clearPromoCode}
                              className="ml-2 text-green-600 hover:text-green-800"
                            >
                              Remove
                            </Button>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-center gap-3 text-green-600">
                    <Check className="w-8 h-8" />
                    <span className="text-xl font-medium">You are connected!</span>
                  </div>
                  <div className="text-center">
                    <button
                      onClick={() => navigate('/en/retirement-module-phase1')}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      🚀 Access complete module
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features comparison table by plan */}
          <Card className="mb-16 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
                Plan comparison
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 max-w-4xl mx-auto">
                Discover what's included in each plan and choose the one that fits your needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="py-4 px-6 text-left font-bold text-gray-900 text-lg">Feature</th>
                      <th className="py-4 px-6 text-center font-bold text-gray-900 text-lg">
                        <div className="flex flex-col items-center">
                          <span>Free</span>
                          <Badge variant="secondary" className="mt-1">Free</Badge>
                        </div>
                      </th>
                      <th className="py-4 px-6 text-center font-bold text-gray-900 text-lg">
                        <div className="flex flex-col items-center">
                          <span>Professional</span>
                          <Badge variant="default" className="mt-1 bg-blue-600">$29/month</Badge>
                        </div>
                      </th>
                      <th className="py-4 px-6 text-center font-bold text-gray-900 text-lg">
                        <div className="flex flex-col items-center">
                          <span>Ultimate</span>
                          <Badge variant="default" className="mt-1 bg-purple-600">$99/month</Badge>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium text-gray-900">Basic planning</td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium text-gray-900">Personal profile management</td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium text-gray-900">Basic retirement calculations</td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium text-gray-900">Savings management</td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium text-gray-900">Emergency module</td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium text-gray-900">Session management</td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium text-gray-900">Cash flow analysis</td>
                      <td className="text-center py-4 px-6 text-gray-400">—</td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium text-gray-900">CPP and RRQ calculations</td>
                      <td className="text-center py-4 px-6 text-gray-400">—</td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium text-gray-900">Tax optimization</td>
                      <td className="text-center py-4 px-6 text-gray-400">—</td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium text-gray-900">Monte Carlo simulator</td>
                      <td className="text-center py-4 px-6 text-gray-400">—</td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium text-gray-900">Report generation</td>
                      <td className="text-center py-4 px-6 text-gray-400">—</td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium text-gray-900">Advanced estate planning</td>
                      <td className="text-center py-4 px-6 text-gray-400">—</td>
                      <td className="text-center py-4 px-6 text-gray-400">—</td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium text-gray-900">Collaboration and sharing</td>
                      <td className="text-center py-4 px-6 text-gray-400">—</td>
                      <td className="text-center py-4 px-6 text-gray-400">—</td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium text-gray-900">Advanced financial simulations</td>
                      <td className="text-center py-4 px-6 text-gray-400">—</td>
                      <td className="text-center py-4 px-6 text-gray-400">—</td>
                      <td className="text-center py-4 px-6"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-xl">
              <CardContent className="py-12">
                <h2 className="text-3xl font-bold mb-4">Ready to plan your retirement?</h2>
                <p className="text-xl mb-8 opacity-90">
                  Start today with our comprehensive financial planning platform
                </p>
                {!user ? (
                  <Button
                    onClick={handleGoogleSignIn}
                    className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-medium"
                  >
                    <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-6 h-6 mr-3" />
                    Start now
                  </Button>
                ) : (
                  <Button
                    onClick={handleAccessModule}
                    className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-medium"
                  >
                    Access complete module
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetraiteEn;