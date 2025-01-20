'use client';

import { Check, Zap, Rocket, Star, Sparkles, Users, ArrowRight } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { AuthDialog } from '@/components/home/signup1';
import { useAuth } from '@/lib/context/auth-context';
import StripePaymentButton from '@/components/home/stripebutton';

const Pricing = () => {
  const { user } = useAuth();
  const [isAnnually, setIsAnnually] = useState(true);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'signup'>(user ? 'login' : 'signup');

  const plans = [
    {
      name: 'FREE',
      active: true,
      icon: <Star className="w-6 h-6 text-yellow-400" />,
      price: 0,
      monthlyPrice: 0,
      features: [
        'Unlimited Users',
        'Active Jobs Map',
        'Summary Dashboard',
        'Template Library',
        'Resource Library',
        'Real-time Data Sync',
        'API Script Library',
      ],
      priceId: '',
      color: 'bg-gradient-to-br from-gray-100 to-gray-200',
      buttonColor: 'bg-black hover:bg-gray-800 text-white hover:text-yellow-400',
    },
    {
      name: 'CORE',
      active: true,
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      price: isAnnually ? 290 : 29,
      monthlyPrice: 29,
      features: [
        'Everything in FREE',
        'Sales Dashboard',
        'Leads Dashboard',
        'Jobs Dashboard',
        'Google Street View Automation',
        'Zestimate Automation',
        'Cash Flow Calendar',
        'Inventory',
        'Support & Feature Requests',
      ],
      priceId: isAnnually ? "price_1QVggE2LwdZLeKQfk2YRCDUV" : "price_1QVNq42LwdZLeKQfaXHHsMI6",
      color: 'bg-gradient-to-br from-yellow-100 to-yellow-200',
      buttonColor: 'bg-yellow-400 hover:bg-yellow-500 text-black hover:text-white transition-colors',
      popular: true,
    },
    {
      name: 'PRO (Coming Soon)',
      active: false,
      icon: <Rocket className="w-6 h-6 text-yellow-400" />,
      price: isAnnually ? 1450 : 145,
      monthlyPrice: 145,
      features: [
        'Everything in CORE',
        'Zapier Maintenance',
        'TV Dashboard',
        'AIA Billing', 
        'Google Calendar Sync',
        'Calendly Integration',
        'Priority Support',
      ],
      priceId: isAnnually ? "price_1QVggE2LwdZLeKQfk2YRCDUV" : "price_1QVNq42LwdZLeKQfaXHHsMI6",
      color: 'bg-gradient-to-br from-gray-100 to-gray-200',
      buttonColor: 'bg-black hover:bg-gray-800 text-white hover:text-yellow-400',
    },
  ];

  const SubscribeButton = ({ plan, className }: { plan: typeof plans[0], className?: string }) => {
    if (!plan.active) {
      return (
        <Button 
          disabled
          className={`w-full py-4 text-lg font-bold rounded-xl opacity-50 cursor-not-allowed ${className}`}
        >
          <Sparkles className="w-5 h-5" />
          <span>Coming Soon</span>
        </Button>
      );
    }

    if (plan.price === 0) {
      return (
        <Button 
          className={`w-full py-4 text-lg font-bold rounded-xl ${className}`}
          onClick={() => {
            if (!user) {
              setAuthType('signup');
              setShowAuthDialog(true);
            }
          }}
        >
          <Sparkles className="w-5 h-5" />
          <span>{user ? 'Current Plan' : 'Get Started'}</span>
        </Button>
      );
    }

    if (user) {
      return (
        <StripePaymentButton 
          priceId={plan.priceId} 
          uid={user.uid}
          email={user.email || ''}
          className={`w-full py-4 text-lg font-bold rounded-xl ${className}`}
        />
      );
    }

    return (
      <Button 
        className={`w-full py-4 text-lg font-bold rounded-xl ${className} transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2`}
        onClick={() => {
          setAuthType('signup');
          setShowAuthDialog(true);
        }}
      >
        <Sparkles className="w-5 h-5" />
        <span>Get Started</span>
      </Button>
    );
  };

  return (
    <section className="py-16 w-full bg-gradient-to-b from-white to-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-screen-xl flex-col gap-6">
          <div className="text-center">
            <h2 className="text-pretty text-5xl font-bold lg:text-7xl mb-4 text-black">
              Choose Your Perfect Plan
            </h2>
            <p className="text-xl text-gray-600">Unlock the full potential of your business with our flexible pricing options</p>
          </div>

          {/* Consulting Services Section */}
          <div className="mb-8 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <h3 className="text-3xl md:text-4xl font-bold text-black mb-4">Need Custom Solutions?</h3>
                <p className="text-xl text-gray-700 mb-6">
                  Check out our expert consulting services tailored to your business needs.
                </p>
                <Button 
                  className="bg-black hover:bg-gray-800 text-white hover:text-yellow-400 transition-colors py-3 px-6 text-lg font-semibold rounded-xl"
                  onClick={() => {
                    window.location.href = '/pricing/#cto-consulting';
                  }}
                >
                  Explore Consulting Services
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <div className="flex-shrink-0">
                <Users className="h-32 w-32 text-yellow-400" />
              </div>
            </div>
          </div>
          
          <div className="flex justify-center my-6">
            <div className="flex h-14 w-fit shrink-0 items-center rounded-full bg-gray-200 p-1 text-lg shadow-lg">
              <RadioGroup
                defaultValue="annually"
                className="h-full grid-cols-2"
                onValueChange={(value) => {
                  setIsAnnually(value === 'annually');
                }}
              >
                <div className='h-full rounded-full transition-all has-[button[data-state="checked"]]:bg-white'>
                  <RadioGroupItem
                    value="monthly"
                    id="monthly"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="monthly"
                    className="flex h-full cursor-pointer items-center justify-center px-8 font-semibold text-gray-700 peer-data-[state=checked]:text-black"
                  >
                    Monthly
                  </Label>
                </div>
                <div className='h-full rounded-full transition-all has-[button[data-state="checked"]]:bg-white'>
                  <RadioGroupItem
                    value="annually"
                    id="annually"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="annually"
                    className="flex h-full cursor-pointer items-center justify-center px-8 font-semibold text-gray-700 peer-data-[state=checked]:text-black"
                  >
                    Annual (Save, 2 months FREE!)
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-start">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`flex flex-col rounded-2xl shadow-xl overflow-hidden ${plan.color} transition-all duration-300 ${plan.popular ? 'md:scale-110 md:shadow-2xl z-10' : ''}`}
              >
                {plan.popular && (
                  <div className="bg-yellow-400 text-black text-center py-2 font-semibold">
                    Most Popular
                  </div>
                )}
                <div className={`p-6 flex flex-col flex-1 ${plan.popular ? 'md:p-8' : ''}`}>
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={`text-lg font-semibold px-4 py-1 rounded-full bg-white ${plan.popular ? 'text-yellow-400 hover:text-black transition-colors' : 'text-black'}`}>
                      {plan.name}
                    </Badge>
                    {plan.icon}
                  </div>
                  <div className="mb-6">
                    <span className={`text-5xl font-bold ${plan.popular ? 'md:text-6xl' : ''} text-black`}>${plan.price}</span>
                    <span className="text-gray-600">/{isAnnually ? 'year' : 'month'}</span>
                    {isAnnually && plan.price > 0 && (
                      <div className="mt-2 text-green-600 font-semibold">
                        Save ${(plan.monthlyPrice * 12 - plan.price).toFixed(0)} per year
                      </div>
                    )}
                  </div>
                  <Separator className="my-6" />
                  <ul className={`space-y-4 text-gray-700 mb-auto ${plan.popular ? 'md:text-lg' : ''}`}>
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className={`size-5 ${plan.popular ? 'text-yellow-400' : 'text-green-500'} ${plan.popular ? 'md:size-6' : ''}`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`p-4 bg-white ${plan.popular ? 'md:p-6' : ''}`}>
                  <SubscribeButton 
                    plan={plan} 
                    className={`${plan.buttonColor}`} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <AuthDialog 
        isOpen={showAuthDialog} 
        onClose={() => setShowAuthDialog(false)}
        defaultView={authType}
        redirectPath="/x"
      />
    </section>
  );
};

export default Pricing;

