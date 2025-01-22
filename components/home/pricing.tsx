"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Zap, Rocket, Star, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthDialog } from "@/components/home/signup1"
import { useAuth } from "@/lib/context/auth-context"
import StripePaymentButton from "@/components/home/stripebutton"

const Pricing = () => {
  const { user } = useAuth()
  const [isAnnually, setIsAnnually] = useState(false)
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [authType, setAuthType] = useState<"login" | "signup">(user ? "login" : "signup")

  const plans = [
    {
      name: "FREE",
      icon: <Star className="w-16 h-16 text-[#FFD400]" />,
      price: 0,
      monthlyPrice: 0,
      features: [
        "Unlimited Users",
        "Active Jobs Map",
        "Summary Dashboard",
        "Template Library",
        "Resource Library",
        "Real-time Data Sync",
        "API Script Library",
      ],
      priceId: "",
      color: "bg-white",
      textColor: "text-black",
    },
    {
      name: "CORE",
      icon: <Zap className="w-16 h-16 text-black" />,
      price: isAnnually ? 290 : 29,
      monthlyPrice: 29,
      features: [
        "Everything in FREE",
        "Sales Dashboard",
        "Leads Dashboard",
        "Jobs Dashboard",
        "Google Street View Automation",
        "Zestimate Automation",
        "Cash Flow Calendar",
        "Inventory",
        "Support & Feature Requests",
      ],
      priceId: isAnnually ? "price_1QVggE2LwdZLeKQfk2YRCDUV" : "price_1QVNq42LwdZLeKQfaXHHsMI6",
      color: "bg-[#FFD400]",
      textColor: "text-black",
      popular: true,
    },
    {
      name: "PRO",
      icon: <Rocket className="w-16 h-16 text-white" />,
      price: isAnnually ? 1450 : 145,
      monthlyPrice: 145,
      features: [
        "Everything in CORE",
        "Zapier Maintenance",
        "TV Dashboard",
        "AIA Billing",
        "Google Calendar Sync",
        "Calendly Integration",
        "Priority Support",
      ],
      priceId: isAnnually ? "price_1QVggE2LwdZLeKQfk2YRCDUV" : "price_1QVNq42LwdZLeKQfaXHHsMI6",
      color: "bg-black",
      textColor: "text-white",
    },
  ]

  const SubscribeButton = ({
    plan,
    className,
    disabled = false,
  }: { plan: (typeof plans)[0]; className?: string; disabled?: boolean }) => {
    if (plan.price === 0) {
      return (
        <Button
          className={`w-full py-4 text-lg font-bold rounded-full bg-black text-white hover:bg-[#FFD400] hover:text-black transition-all duration-300 transform hover:scale-105 ${className}`}
          onClick={() => {
            if (!user) {
              setAuthType("signup")
              setShowAuthDialog(true)
            }
          }}
        >
          <Sparkles className="w-5 h-5 mr-2" />
          <span>{user ? "Current Plan" : "Get Started"}</span>
        </Button>
      )
    }

    if (user) {
      return (
        <StripePaymentButton
          priceId={plan.priceId}
          uid={user.uid}
          email={user.email || ""}
          className={`w-full py-4 text-lg font-bold rounded-full bg-black text-white hover:bg-[#FFD400] hover:text-black transition-all duration-300 transform hover:scale-105 ${className}`}
        />
      )
    }

    return (
      <Button
        className={`w-full py-4 text-lg font-bold rounded-full bg-black text-white hover:bg-[#FFD400] hover:text-black transition-all duration-300 transform hover:scale-105 ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={() => {
          if (!disabled) {
            setAuthType("signup")
            setShowAuthDialog(true)
          }
        }}
        disabled={disabled}
      >
        <Sparkles className="w-5 h-5 mr-2" />
        <span>{disabled ? "Coming Soon" : "Get Started"}</span>
      </Button>
    )
  }

  return (
    <section className="py-24 w-full bg-gradient-to-b from-white to-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-black to-[#FFD400]">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock the full potential of your business with our tailored solutions
          </p>
        </div>

        <div className="flex justify-center mb-16">
          <div className="relative w-64 h-16 bg-gray-200 rounded-full p-1">
            <div
              className={`absolute inset-0 w-1/2 h-full bg-[#FFD400] rounded-full shadow-lg transform transition-transform duration-300 ease-in-out ${
                isAnnually ? "translate-x-full" : ""
              }`}
            ></div>
            <div className="relative flex h-full">
              <button
                className={`flex-1 text-sm font-bold ${
                  !isAnnually ? "text-black" : "text-gray-600"
                } transition-colors duration-300`}
                onClick={() => setIsAnnually(false)}
              >
                Monthly
              </button>
              <button
                className={`flex-1 text-sm font-bold ${
                  isAnnually ? "text-black" : "text-gray-600"
                } transition-colors duration-300`}
                onClick={() => setIsAnnually(true)}
              >
                Annually
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`${plan.color} ${plan.textColor} rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300 flex flex-col ${
                plan.popular ? "md:-mt-8 md:mb-8" : "md:mt-4 md:mb-4"
              }`}
            >
              {plan.popular && (
                <div className="bg-black text-[#FFD400] text-center py-2 text-sm font-bold uppercase tracking-wide">
                  Most Popular
                </div>
              )}
              <div className="p-8 flex-grow flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  {plan.icon}
                </div>
                <div className="mb-6">
                  <span className="text-5xl font-extrabold">${plan.price}</span>
                  <span className="text-xl">/{isAnnually ? "year" : "month"}</span>
                  {isAnnually && plan.price > 0 && (
                    <div className="mt-2 bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full inline-block">
                      Save ${(plan.monthlyPrice * 12 - plan.price).toFixed(0)} per year
                    </div>
                  )}
                </div>
                <ul className="mb-8 space-y-4 flex-grow">
                  {plan.features.map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center"
                    >
                      <Check className="w-5 h-5 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>
                <SubscribeButton plan={plan} disabled={plan.name === "PRO"} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        defaultView={authType}
        redirectPath="/x"
      />
    </section>
  )
}

export default Pricing

