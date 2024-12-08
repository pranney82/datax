'use client';

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users2, Clock, Calendar, Rocket, UserCog, Pin } from "lucide-react";

interface AddOn {
  icon: JSX.Element;
  title: string;
  price: number;
  period: string;
  description: string;
}

const addOns: AddOn[] = [
  {
    icon: <Pin className="size-5" />,
    title: "Branding & White-labeling",
    price: 250,
    period: "month",
    description: "Create an on-brand experience by white-labeling your Databox Account. Allow users to login, view dashboards, and receive emails with your company's branding. Perfect if you plan to resell Databox to your clients."
  },
  {
    icon: <Users2 className="size-5" />,
    title: "Guided onboarding",
    price: 500,
    period: "",
    description: "Training and consulting on setting up Databox for your company or clients. Includes 6 training calls over Zoom and Priority Support for 3 months."
  },
  {
    icon: <Clock className="size-5" />,
    title: "15 min sync per source",
    price: 18,
    period: "month",
    description: "Sync every 15 minutes for selected Data Sources. Not available for all data sources due to vendor's API limitations and rate limits."
  },
  {
    icon: <Calendar className="size-5" />,
    title: "Fiscal calendar",
    price: 50,
    period: "month",
    description: "Monitor, visualize, and report on all of your business data based on your fiscal calendar to improve your accounting, performance, and revenue tracking processes."
  },
  {
    icon: <Rocket className="size-5" />,
    title: "Quickstart Onboarding",
    price: 1000,
    period: "",
    description: "Setup of your initial set of metrics, dashboards, and reports along with training on core Databox features and functionality."
  },
  {
    icon: <UserCog className="size-5" />,
    title: "Dedicated analyst",
    price: 200,
    period: "month",
    description: "Ongoing success planning, training and data analysis from a Databox and analytics expert."
  }
];

const AddOns = () => {
  return (
    <section className="py-8 w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-screen-xl flex-col gap-8">
          <h2 className="text-pretty text-3xl font-bold lg:text-4xl">
            Upgrade Your Experience with Add-Ons
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addOns.map((addon, index) => (
              <Card key={index} className="flex flex-col p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-muted rounded-md">
                    {addon.icon}
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-semibold">${addon.price}</span>
                    {addon.period && (
                      <span className="text-muted-foreground">/{addon.period}</span>
                    )}
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold mb-2">{addon.title}</h3>
                <p className="text-muted-foreground text-sm flex-grow mb-4">
                  {addon.description}
                </p>
                
                <Button variant="outline" className="w-full mt-auto">
                  Learn more
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddOns;
