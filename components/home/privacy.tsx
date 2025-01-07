import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacyPolicy: React.FC = () => {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Privacy Policy</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
          <h3 className="text-lg font-medium mb-1">Information You Provide to Us</h3>
          <p>We collect information that personally identifies you and other personal information about you or users whose information you provide to us when you sign up for or use the Service (&quot;Personal Information&quot;). This may include:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Your name, phone number or other contact details, the company you work for and other information contained in your user profile;</li>
            <li>Your username, password and email when you register for an account to use the Service;</li>
            <li>Information about other individuals when you add users;</li>
            <li>Credit card or other financial account information in connection with your order to purchase the Service;</li>
            <li>Any information that you upload to the Service and/or input into your account;</li>
            <li>Any other information you may provide to us voluntarily through your use of the Service.</li>
          </ul>
          <p className="mt-2">The decision to provide this information is optional. However, if you choose not to provide the requested information, you may not be able to use some or all of the features of the Service.</p>
          
          <h3 className="text-lg font-medium mt-4 mb-1">Information We Collect Automatically</h3>
          <p>We automatically collect information regarding the actions you take on the Service. When you use the Service, some examples of the data we may collect could include:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>The type of web browser you use;</li>
            <li>Your operating system;</li>
            <li>Your internet service provider;</li>
            <li>Your IP address;</li>
            <li>Referring/exit pages and URLs;</li>
            <li>The pages you view and how you interact with links on the Service;</li>
            <li>Comments and other content you post via the Service;</li>
            <li>The time and duration of your visits to the Service;</li>
            <li>Other such information relating to your devices, and your activity on the Service.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">2. Tracking Technologies</h2>
          <p>We use cookies and web beacons to improve the experience of the users. We do not use cookies or web beacons to collect Personal Information. Most web browsers are initially set up to accept cookies. You can change your privacy preferences to disable cookies, but certain features of the Service may not work if you delete or disable cookies.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">3. How We Use Your Information</h2>
          <p>We use your information to provide access to, support, and improve the Service. This includes:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Email Communications: We may send you email communications related to the Service.</li>
            <li>SMS Messaging: We may send you SMS messages related to our Service.</li>
            <li>Research and Analysis: We analyze aggregated user data to enhance our Service.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">4. Who We Share Your Personal Information With</h2>
          <p>We may disclose your Personal Information to the following categories of recipients:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Service Providers</li>
            <li>Marketplace Partners</li>
            <li>Law enforcement agencies or courts, when required by law</li>
          </ul>
          <p className="mt-2">Your Personal Information is never sold or shared with any third party or affiliate other than described in this section.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">5. Children&apos;s Privacy</h2>
          <p>We do not knowingly collect Personal Information from children under the age of 13.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">6. Data Retention</h2>
          <p>We will retain your information for as long as your account is active or where we have an ongoing business need to do so.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">7. Your Rights</h2>
          <p>You can review, correct, delete or update your Personal Information by changing the relevant settings in the Service. You can opt out of receiving certain emails and text messages by changing notification settings on the Service.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">8. Third Parties/Links</h2>
          <p>Our Service may contain links or integrate with other websites and online services. We are not responsible for the privacy practices of third-party websites or online services.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">9. Privacy Policy Changes</h2>
          <p>From time to time, we may change this Privacy Policy. When we do, we will post the revised Privacy Policy on our website.</p>
        </section>
      </CardContent>
    </Card>
  );
};

export default PrivacyPolicy;

