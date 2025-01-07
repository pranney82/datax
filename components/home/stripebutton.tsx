import React from "react";
import { Button } from "@/components/ui/button";
import { getAuth } from "firebase/auth";

interface StripePaymentButtonProps {
  priceId: string;
  className?: string;
}

const StripePaymentButton: React.FC<StripePaymentButtonProps> = ({ priceId, className }) => {
  const handleCheckout = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert("Please sign in to continue.");
      return;
    }
    
    try {
      const uid = currentUser.uid;
      const idToken = await currentUser.getIdToken();
      const email = currentUser.email;
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, uid, idToken, email }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        console.error("Error creating Stripe Checkout session:", data.error);
        alert("Failed to redirect to Stripe Checkout.");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      className={`w-full mt-8 ${className}`}
    >
      Subscribe
    </Button>
  );
};

export default StripePaymentButton;
