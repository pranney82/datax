'use client';

import { Check } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { AuthDialog } from '@/components/home/signup1';

const Pricing = () => {
  const [isAnnually, setIsAnnually] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'signup'>('signup');
  return (
    <section className="py-8 w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-screen-xl flex-col gap-6">
          <h2 className="text-pretty text-4xl font-bold lg:text-6xl">
            Pricing
          </h2>
          <div className="flex flex-col justify-between gap-10 md:flex-row">
            <div className="flex h-11 w-fit shrink-0 items-center rounded-md bg-muted p-1 text-lg">
              <RadioGroup
                defaultValue="monthly"
                className="h-full grid-cols-2"
                onValueChange={(value) => {
                  setIsAnnually(value === 'annually');
                }}
              >
                <div className='h-full rounded-md transition-all has-[button[data-state="checked"]]:bg-primary'>
                  <RadioGroupItem
                    value="monthly"
                    id="monthly"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="monthly"
                    className="flex h-full cursor-pointer items-center justify-center px-7 font-semibold text-muted-foreground peer-data-[state=checked]:text-black"
                  >
                    Monthly
                  </Label>
                </div>
                <div className='h-full rounded-md transition-all has-[button[data-state="checked"]]:bg-primary'>
                  <RadioGroupItem
                    value="annually"
                    id="annually"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="annually"
                    className="flex h-full cursor-pointer items-center justify-center px-7 font-semibold text-muted-foreground peer-data-[state=checked]:text-black"
                  >
                    Yearly
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <div className="flex w-full flex-col items-stretch gap-6 md:flex-row">
            <div className="flex w-full flex-col rounded-lg border p-6">
              <div className="flex flex-col flex-1">
                <Badge className="mb-8 block w-fit">FREE</Badge>
                <span className="text-4xl font-medium">$0</span>
                <p className="invisible text-muted-foreground">Per month</p>
                <Separator className="my-6" />
                <ul className="space-y-4 text-muted-foreground mb-auto">
                  <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>Unlimited Users</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>Summary Dashboard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>Template Library</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>Resource Library</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>Real-time Data Sync</span>
                  </li>
                </ul>
              </div>
              <Button className="w-full mt-8" 
              onClick={() => {
                setAuthType('signup');
                setShowAuthDialog(true);
              }}>Get Started for free</Button>
            </div>
            <div className="flex w-full flex-col rounded-lg border p-6">
              <div className="flex flex-col flex-1">
                <Badge className="mb-8 block w-fit">Standard</Badge>
                <span className="text-4xl font-medium">{isAnnually ? '$290' : '$29'}</span>
                <span className="text-muted-foreground">{isAnnually ? <s>$348</s> : ''}</span>
                <p className="text-muted-foreground">{isAnnually ? 'per year' : 'per month'}</p>
                <Separator className="my-6" />
                <ul className="space-y-4 text-muted-foreground mb-auto">
                  <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>Everything in FREE</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>Sales Dashboard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>Leads Dashboard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>Jobs Dashboard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>Support & Feature Requests</span>
                  </li>
                </ul>
              </div>
              <Button className="w-full mt-8" 
              onClick={() => {
                setAuthType('signup');
                setShowAuthDialog(true);
              }}>Upgrade to Standard</Button>
            </div>
            <div className="flex w-full flex-col rounded-lg border p-6">
              <div className="flex flex-col flex-1">
                <Badge className="mb-8 block w-fit">PRO</Badge>
                <span className="text-4xl font-medium">{isAnnually ? '$1290' : '$129'}</span>
                <span className="text-muted-foreground">{isAnnually ? <s>$1548</s> : ''}</span>
                <p className="text-muted-foreground">{isAnnually ? 'per year' : 'per month'}</p>
                <Separator className="my-6" />
                <ul className="space-y-4 text-muted-foreground mb-auto">
                  <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>Everything in Standard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>Toolbox Access:</span>
                  </li>
                  <ul className="ml-6 space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="size-4" />
                      <span>JT Integrated Inventory</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4" />
                      <span>JT Internal Automations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4" />
                      <span>Google Street View Integration</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4" />
                      <span>Cash Flow Projection Calendars</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4" />
                      <span>Jobs Maps</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4" />
                      <span>Print ToDos & Calendars</span>
                    </li>
                  </ul>
                </ul>
              </div>
              <Button className="w-full mt-8" 
              onClick={() => {
                setAuthType('signup');
                setShowAuthDialog(true);
              }}>Upgrade to PRO</Button>
            </div>
          </div>
        </div>
      </div>
      <AuthDialog 
        isOpen={showAuthDialog} 
        onClose={() => setShowAuthDialog(false)}
        defaultView={authType}
      />
    </section>
  );
};

export default Pricing;
