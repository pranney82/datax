'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CirclePlus } from 'lucide-react';

interface AddOn {
  id: string;
  icon: JSX.Element;
  name: string;
  price: number;
  description: string;
}

const addons: AddOn[] = [
  {
    id: "branding",
    icon: <CirclePlus className="w-10 h-10 text-yellow-400" />,
    name: "Branding & White-labeling",
    price: 250,
    description: "Create an on-brand experience by white-labeling your Databox Account."
  },
  {
    id: "guided-onboarding",
    icon: <CirclePlus className="w-10 h-10 text-yellow-400" />,
    name: "Guided onboarding",
    price: 500,
    description: "Training and consulting on setting up Databox for your company or clients."
  },
  {
    id: "sync",
    icon: <CirclePlus className="w-10 h-10 text-yellow-400" />,
    name: "15 min sync per source",
    price: 18,
    description: "Sync every 15 minutes for selected Data Sources."
  },
  {
    id: "fiscal-calendar",
    icon: <CirclePlus className="w-10 h-10 text-yellow-400" />,
    name: "Fiscal calendar",
    price: 50,
    description: "Monitor, visualize, and report on all of your business data based on your fiscal calendar."
  },
  {
    id: "quickstart",
    icon: <CirclePlus className="w-10 h-10 text-yellow-400" />,
    name: "Quickstart Onboarding",
    price: 1000,
    description: "Setup of your initial set of metrics, dashboards, and reports."
  },
  {
    id: "dedicated-analyst",
    icon: <CirclePlus className="w-10 h-10 text-yellow-400" />,
    name: "Dedicated analyst",
    price: 200,
    description: "Ongoing success planning, training and data analysis from a Databox and analytics expert."
  }
];

const AddOns = () => {
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  const toggleAddon = (addonId: string) => {
    setSelectedAddons(prev => 
      prev.includes(addonId) 
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  return (
    <section className="py-16 w-full bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-center mb-8 text-black">Supercharge Your Plan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {addons.map((addon) => (
              <Card
                key={addon.id}
                className={`flex items-center p-6 rounded-xl bg-white shadow-lg border-2 transition-all duration-300 ${
                  selectedAddons.includes(addon.id) ? 'border-yellow-400 scale-105' : 'border-transparent'
                }`}
                onClick={() => toggleAddon(addon.id)}
              >
                <CardContent className="flex items-center p-0 w-full">
                  <div className="mr-6">
                    {addon.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold mb-2 text-black">{addon.name}</h4>
                    <p className="text-gray-600">{addon.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-black">${addon.price}</span>
                    <span className="text-gray-600">/month</span>
                    <div className="mt-2">
                      <Button
                        className={`px-4 py-2 rounded-full transition-colors ${
                          selectedAddons.includes(addon.id)
                            ? 'bg-yellow-400 text-black'
                            : 'bg-gray-200 text-gray-700 hover:bg-yellow-400 hover:text-black'
                        }`}
                      >
                        {selectedAddons.includes(addon.id) ? 'Selected' : 'Add'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddOns;

