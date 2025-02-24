"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { auth } from "@/lib/firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { Zap, Check, Star, Rocket, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { getFirestore, doc, setDoc, collection } from "firebase/firestore"
import { useAuth } from "@/lib/context/auth-context"

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(3, "Name must be at least 3 characters"),
})

const STRIPE_PRICE_IDS = {
  core: {
    monthly: process.env.NEXT_PUBLIC_STRIPE_CORE_MONTHLY_PRICE_ID,
    annual: process.env.NEXT_PUBLIC_STRIPE_CORE_ANNUAL_PRICE_ID,
  },
}

const plans = [
  {
    id: "free",
    name: "FREE",
    icon: <Star className="w-16 h-16 text-[#FFD400]" />,
    price: {
      monthly: "0",
      annual: "0",
    },
    features: [
      "Unlimited Users",
      "Syncs with JOBTREAD",
      "Active Jobs Map",
      "Summary Dashboard",
      "Cost Group Templates",
      "Schedule Templates",
    ],
    color: "bg-white",
    textColor: "text-black",
  },
  {
    id: "core",
    name: "CORE",
    icon: <Zap className="w-16 h-16 text-black" />,
    price: {
      monthly: "29",
      annual: "290",
    },
    features: [
      "Everything in FREE",
      "Leads Dashboard",
      "Sales Dashboard",
      "Google Street Cover Photo",
      "Zillow Information",
      "Cash Flow Calendar",
      "Support & Feature Requests",
    ],
    popular: true,
    color: "bg-[#FFD400]",
    textColor: "text-black",
  },
  {
    id: "pro",
    name: "PRO",
    icon: <Rocket className="w-16 h-16 text-white" />,
    price: {
      monthly: "145",
      annual: "1450",
    },
    features: [
      "Everything in CORE",
      "AIA Billing Invoice",
      "Inventory Tracking",
      "Google Calendar Sync",
      "Calendly Integration",
      "TV Dashboard",
      "Priority Support",
    ],
    color: "bg-black",
    textColor: "text-white",
  },
]

const notifyDiscord = async (userData: { email: string; name?: string; tier: string }) => {
  try {
    await fetch("/api/discord-notify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "new-user",
        data: userData,
      }),
    })
  } catch (error) {
    console.error("Failed to send Discord notification:", error)
  }
}

export default function SignUpPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTier, setSelectedTier] = useState("core")
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly")

  // Read billing period from URL on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const billingParam = searchParams.get("billing")
    if (billingParam === "annual" || billingParam === "monthly") {
      setBillingPeriod(billingParam)
    }
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  })

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (user) {
    router.push("/x")
    return null
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password)

      const db = getFirestore()

      const orgRef = doc(collection(db, "orgs"))
      await setDoc(orgRef, {
        createdAt: new Date(),
        updatedAt: new Date(),
        grantKey: "",
        orgID: "",
        owner: userCredential.user.uid,
      })

      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: values.email,
        name: values.name,
        createdAt: new Date(),
        subscriptionStatus: "inactive",
        tier: selectedTier,
        updatedAt: new Date(),
        org: orgRef.id,
      })

      await notifyDiscord({
        email: values.email,
        name: values.name,
        tier: selectedTier,
      })

      if (selectedTier === "core") {
        const priceId = STRIPE_PRICE_IDS.core[billingPeriod]
        if (!priceId) {
          throw new Error("Price ID not found")
        }

        const response = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            priceId,
            uid: userCredential.user.uid,
            email: values.email,
            orgID: orgRef.id,
          }),
        })

        const { url } = await response.json()
        if (url) {
          router.push(url)
        } else {
          throw new Error("Failed to create checkout session")
        }
      } else {
        router.push("/x")
      }
    } catch (error: unknown) {
      console.error("Auth error:", error)
      if (error && typeof error === "object" && "code" in error && typeof error.code === "string") {
        switch (error.code) {
          case "auth/email-already-in-use":
            form.setError("email", { message: "Email already in use" })
            break
          case "auth/invalid-email":
            form.setError("email", { message: "Invalid email address" })
            break
          case "auth/weak-password":
            form.setError("password", { message: "Password is too weak" })
            break
          default:
            form.setError("root", { message: "An error occurred. Please try again." })
        }
      } else {
        console.error("Unknown error:", error)
        form.setError("root", { message: "An unexpected error occurred. Please try again." })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 py-6 sm:py-12">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-6">
            <nav className="flex justify-center mb-8">
              <div className="relative flex w-full max-w-2xl justify-between bg-white/10 backdrop-blur-md p-1.5 sm:p-1.5 rounded-full shadow-lg border border-white/20">
                {plans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => plan.id !== "pro" && setSelectedTier(plan.id)}
                    className={cn(
                      "group relative px-2 sm:px-6 py-3.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-1 sm:space-x-2 overflow-hidden flex-1",
                      plan.id === "pro"
                        ? "opacity-50 cursor-not-allowed text-gray-500"
                        : selectedTier === plan.id
                          ? plan.id === "core"
                            ? "text-gray-900 font-bold bg-[#FFD400] shadow-md"
                            : "text-gray-900 font-bold bg-white shadow-md"
                          : "text-gray-700 hover:text-[#FFD400] hover:bg-white/20",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {plan.id === "free" && <Star className="w-5 h-5" />}
                      {plan.id === "core" && <Zap className="w-5 h-5" />}
                      {plan.id === "pro" && <Rocket className="w-5 h-5" />}
                      <span>{plan.name}</span>
                      {plan.id === "pro" && <span className="text-xs">(Coming Soon)</span>}
                    </div>
                  </button>
                ))}
              </div>
            </nav>

            <div className="lg:flex lg:space-x-8 lg:items-start">
              <div className="lg:w-1/2 mb-8 lg:mb-0">
                {plans.map((plan) => (
                  plan.id === selectedTier && (
                    <div
                      key={plan.id}
                      className={cn(
                        "rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-300 flex flex-col w-full",
                        plan.color,
                        plan.textColor,
                      )}
                    >
                      {plan.id === "free" && (
                        <div className="bg-black text-[#FFD400] text-center py-2 text-sm font-bold uppercase tracking-wide">
                          Free Forever
                        </div>
                      )}
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
                          {billingPeriod === "annual" && plan.id !== "free" ? (
                            <>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-2xl line-through text-gray-500">
                                  ${Number(plan.price.monthly) * 12}
                                </span>
                                <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                                  Save ${(Number(plan.price.monthly) * 12 - Number(plan.price.annual)).toFixed(0)}
                                </span>
                              </div>
                              <div>
                                <span className="text-5xl font-extrabold">${plan.price.annual}</span>
                                <span className="text-xl">/year</span>
                              </div>
                            </>
                          ) : (
                            <div>
                              <span className="text-5xl font-extrabold">${plan.price[billingPeriod]}</span>
                              <span className="text-xl">/{billingPeriod === "monthly" ? "month" : "year"}</span>
                            </div>
                          )}
                        </div>
                        <ul className="mb-8 space-y-4 flex-grow">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <Check className="w-5 h-5 mr-2 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        {plan.id === "pro" && (
                          <Button
                            className="w-full py-4 text-lg font-bold rounded-full bg-black text-white hover:bg-[#FFD400] hover:text-black transition-all duration-300 transform hover:scale-105 opacity-50 cursor-not-allowed"
                            disabled
                          >
                            <Sparkles className="w-5 h-5 mr-2" />
                            <span>Coming Soon</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                ))}
              </div>

              <div className="lg:w-1/2">
                <div className="bg-white rounded-2xl shadow-xl p-3 sm:p-6">
                  <div className="text-center mb-6">
                    <Image src="/assets/logos/5.png" width={180} height={120} alt="DATAx" className="mx-auto" />
                    <h2 className="text-2xl font-bold mb-2">Create your account</h2>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-lg font-semibold">
                        Selected Plan: <span className="text-[#FFD400]">{plans.find(p => p.id === selectedTier)?.name}</span>
                      </p>
                      <p className="text-md">
                        Price: <span className="font-bold">${plans.find(p => p.id === selectedTier)?.price[billingPeriod]}</span>
                        {billingPeriod === "monthly" ? "/month" : "/year"}
                      </p>
                    </div>
                    {selectedTier !== "free" && (
                      <div className="bg-gray-100 p-1.5 rounded-full shadow-sm inline-flex">
                        <button
                          onClick={() => setBillingPeriod("monthly")}
                          className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                            billingPeriod === "monthly"
                              ? "bg-[#FFD400] text-black"
                              : "text-gray-700 hover:bg-gray-200"
                          )}
                        >
                          Monthly
                        </button>
                        <button
                          onClick={() => setBillingPeriod("annual")}
                          className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 relative",
                            billingPeriod === "annual"
                              ? "bg-[#FFD400] text-black"
                              : "text-gray-700 hover:bg-gray-200"
                          )}
                        >
                          Annually
                          <span className="absolute -top-3 -right-3 bg-green-100 text-green-800 text-[10px] px-1.5 py-0.5 rounded-full whitespace-nowrap">
                            2 months free
                          </span>
                        </button>
                      </div>
                    )}
                  </div>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      {form.formState.errors.root && (
                        <div className="text-sm font-medium text-destructive">{form.formState.errors.root.message}</div>
                      )}

                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Work Email</FormLabel>
                            <FormControl>
                              <Input placeholder="email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-2">
                        <Button
                          type="submit"
                          className="w-full bg-[#FFD400] text-black hover:bg-[#FFD400]/90"
                          disabled={isLoading || selectedTier === "pro"}
                        >
                          {isLoading
                            ? "Creating account..."
                            : selectedTier === "pro"
                            ? "Coming Soon"
                            : selectedTier === "core"
                            ? billingPeriod === "monthly"
                              ? "Create Account & Continue to Monthly Payment"
                              : "Create Account & Continue to Annual Payment"
                            : "Create Free Account"}
                        </Button>
                        {selectedTier === "core" && (
                          <p className="text-sm text-gray-500 text-center">
                            You&apos;ll be redirected to our secure payment page after account creation
                          </p>
                        )}
                      </div>
                    </form>
                  </Form>

                  <div className="mt-6 text-center text-xs sm:text-sm text-gray-600 px-2">
                    By creating an account, you agree to our{" "}
                    <a href="/terms" className="text-[#FFD400] hover:underline" target="_blank" rel="noopener noreferrer">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-[#FFD400] hover:underline" target="_blank" rel="noopener noreferrer">
                      Privacy Policy
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

