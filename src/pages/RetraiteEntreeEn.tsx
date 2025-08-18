import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Shield, TrendingUp, Crown, Zap, FileText, Users, Calculator, Target } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/use-toast';
import { PromoCodeInput } from '../components/ui/promo-code-input';
import { usePromoCode } from '../hooks/usePromoCode';

const RetraiteEntreeEn: React.FC = () => {
  const { user, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const { promoCode, setPromoCode, appliedCode, applyPromoCode, clearPromoCode } = usePromoCode();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast({
        title: "Login successful",
        description: "Welcome to your retirement planner!",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Login error",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        
                 {/* Header and Introduction */}
         <div className="text-center mb-16">
           <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 flex items-center justify-center gap-4">
             <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
               <TrendingUp className="w-6 h-6 text-white" />
             </div>
             Retirement planner
           </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Plan your retirement with professional tools and advanced analytics
          </p>
        </div>

        {/* Product Description */}
        <Card className="mb-16 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="text-center pb-8">
                      <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
            Complete financial planning
          </CardTitle>
                     <CardDescription className="text-lg text-gray-600 max-w-4xl mx-auto">
             Our unique platform allows you to manage your complete financial,<br />
             budgetary and tax planning for a serene and optimized retirement.
           </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-8 h-8 text-blue-600" />
                </div>
                                 <h3 className="font-semibold text-gray-900 mb-2">Cashflow management (treasury flow)</h3>
                <p className="text-sm text-gray-600">
                  Analyze and optimize your expense flows to maximize your savings
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Withdrawal strategies</h3>
                <p className="text-sm text-gray-600">
                  Determine the best time to withdraw from your investments
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Expense planning</h3>
                <p className="text-sm text-gray-600">
                  Evaluate the impact of major purchases on your future income
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Tax optimization</h3>
                <p className="text-sm text-gray-600">
                  Minimize your taxes with intelligent withdrawal strategies
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plans and Pricing */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our annual plans</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <Card className="relative bg-white border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900">Free</CardTitle>
                <Badge variant="secondary" className="w-fit mx-auto">Trial</Badge>
                <CardDescription className="text-gray-600">
                  Start your retirement planning
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-4">$0</div>
                <ul className="text-sm text-gray-600 space-y-2 mb-6">
                  <li>• Basic cashflow management</li>
                  <li>• 1 expense project</li>
                  <li>• Basic planning</li>
                  <li>• Local backup</li>
                </ul>
                <Button 
                  onClick={handleGoogleSignIn}
                  className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                >
                  Start Free
                </Button>
              </CardContent>
            </Card>

            {/* Professional Plan */}
            <Card className="relative bg-white border-2 border-blue-500 shadow-lg transform scale-105">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600 text-white px-4 py-1">Recommended</Badge>
              </div>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900">Professional</CardTitle>
                <CardDescription className="text-gray-600">
                  For advanced planning
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">$119.99</div>
                <div className="text-sm text-gray-500 mb-4">per year</div>
                <ul className="text-sm text-gray-600 space-y-2 mb-6">
                  <li>• Advanced cashflow management</li>
                  <li>• Withdrawal strategies</li>
                  <li>• 100 Monte Carlo simulations</li>
                  <li>• Multiple expense projects</li>
                  <li>• Basic tax optimization</li>
                </ul>
                <Button 
                  onClick={handleGoogleSignIn}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Choose Professional
                </Button>
              </CardContent>
            </Card>

            {/* Ultimate Plan */}
            <Card className="relative bg-white border-2 border-purple-500 hover:border-purple-600 transition-all duration-300 hover:shadow-lg">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-purple-600 text-white px-4 py-1">Premium</Badge>
              </div>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900">Ultimate</CardTitle>
                <CardDescription className="text-gray-600">
                  Complete solution with AI
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">$239.99</div>
                <div className="text-sm text-gray-500 mb-4">per year</div>
                <ul className="text-sm text-gray-600 space-y-2 mb-6">
                  <li>• Expert cashflow management</li>
                  <li>• AI withdrawal strategies</li>
                  <li>• Unlimited Monte Carlo simulations</li>
                  <li>• Advanced tax optimization</li>
                  <li>• Personalized AI advice</li>
                </ul>
                <Button 
                  onClick={handleGoogleSignIn}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Choose Ultimate
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

                 {/* Legal Warning */}
         <Card className="bg-amber-50 border-amber-200 mb-8">
           <CardHeader className="pb-3">
             <div className="flex items-center gap-2">
               <AlertTriangle className="h-5 w-5 text-amber-600" />
               <CardTitle className="text-lg text-amber-800">Important Warning</CardTitle>
             </div>
           </CardHeader>
           <CardContent>
             <div className="text-sm text-amber-700 space-y-2">
               <p>
                 <strong>⚠️ This financial planning platform is an educational and informational tool 
                 that does not replace consultation with a qualified professional.</strong>
               </p>
               <p>
                 <strong>YOUR RESPONSIBILITIES:</strong>
               </p>
               <ul className="list-disc list-inside ml-4 space-y-1">
                 <li>Consult a licensed financial planner for important decisions</li>
                 <li>Verify the tax validity of your strategies with a tax specialist</li>
                 <li>Obtain legal advice for estate planning</li>
               </ul>
               <p>
                 <strong>ADVANTAGES OF OUR SOLUTION:</strong>
               </p>
               <ul className="list-disc list-inside ml-4 space-y-1">
                 <li>Save time by preparing your file in advance</li>
                 <li>Reduce the number of meetings with your professionals</li>
                 <li>Take control of your finances with professional tools</li>
                 <li>Optimize your consultations through better understanding</li>
               </ul>
             </div>
           </CardContent>
         </Card>

         {/* Connection Section */}
         {!user ? (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Shield className="h-12 w-12 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-blue-900">
                Start Now
              </CardTitle>
              <CardDescription className="text-blue-700">
                Connect with Google to access your retirement planning
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                onClick={handleGoogleSignIn}
                className="bg-white text-blue-700 border-blue-300 hover:bg-blue-50 px-8 py-4 text-lg font-medium mb-4"
                size="lg"
              >
                <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5 mr-3" />
                Continue with Google
              </Button>
              <div className="text-sm text-blue-600">
                Secure and private connection
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Promo Code Section for connected users without plan */
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Crown className="h-12 w-12 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-green-900">
                Welcome {user.displayName || user.email}!
              </CardTitle>
              <CardDescription className="text-green-700">
                Do you have a promo code? Unlock additional features!
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <PromoCodeInput
                value={promoCode}
                onChange={setPromoCode}
                onSubmit={handlePromoCodeSubmit}
                onClear={clearPromoCode}
                appliedCode={appliedCode}
                placeholder="Enter your promo code..."
                className="max-w-md mx-auto"
              />
              <div className="mt-4 text-sm text-green-600">
                Popular codes: TESTER100, Calvin2025
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RetraiteEntreeEn;
