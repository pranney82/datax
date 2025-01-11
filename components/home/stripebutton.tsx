import React from "react";
import { Button } from "@/components/ui/button";
import { getAuth } from "firebase/auth";
import { doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getDoc } from "firebase/firestore";

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
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();
      const orgID = userData?.org;


      const idToken = await currentUser.getIdToken();
      const email = currentUser.email;
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, uid, idToken, email, orgID }),
      });

      const data = await response.json();

      if (data.url) {
        // Open Stripe Checkout in a new window
        window.open(data.url, '_blank', 'noopener,noreferrer');
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
