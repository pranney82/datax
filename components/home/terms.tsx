import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsOfService: React.FC = () => {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Contractor CTO Software Terms of Service</CardTitle>
        <p className="text-sm text-muted-foreground">Effective Date: Decebmer 1, 2024</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <section>
          <p>The following Contractor CTO Software Terms of Service together with an Order Form issued hereunder are collectively a legal agreement (the &ldquo;Agreement&rdquo;) between Contractor CTO Software, LLC (&ldquo;Contractor CTO&rdquo;), and the customer named in the Order Form (&ldquo;Customer&rdquo;). This Agreement commences on the date of the Order Form. This Agreement incorporates Contractor CTO&apos;s Privacy Policy. Use of the Service is offered to Customer conditioned upon acceptance, without modification, of the terms, conditions, and notices contained in this Agreement.</p>
          <p className="mt-2">If you are entering into this Agreement on behalf of your organization, that organization is deemed to be the Customer and you represent that you have the power and authority to bind that organization to this Agreement.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">1. Definitions</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>1.1 &ldquo;Authorized User&rdquo;</strong> means an individual who is authorized by Customer to use the Service under Customer&apos;s account.</li>
            <li><strong>1.2 &ldquo;Customer Data&rdquo;</strong> means information submitted by an Authorized User through the Service, including all associated job information, messages, attachments, files, tasks, daily logs, invoices, photographs, videos, client information, and other similar content.</li>
            <li><strong>1.3 &ldquo;Intellectual Property Rights&rdquo;</strong> means unpatented inventions, patent applications, patents, design rights, copyrights, trademarks, service marks, trade names, domain name rights, mask work rights, know-how and other trade secret rights, and all other intellectual property rights, derivatives thereof, and forms of protection of a similar nature anywhere in the world.</li>
            <li><strong>1.4 &ldquo;Improvements&rdquo;</strong> means new versions, features, functionality, enhancements, upgrades, error corrections, and bug fixes to the Service. Certain Improvements may incur additional Subscription Fees.</li>
            <li><strong>1.5 &ldquo;Order Form&rdquo;</strong> means an ordering document or an online order provided by email or through the Service interface specifying the Service to be provided by Contractor CTO to Customer under this Agreement.</li>
            <li><strong>1.6 &ldquo;Service&rdquo;</strong> means Contractor CTO&apos;s construction project management software as a service platform, including any Improvements.</li>
            <li><strong>1.7 &ldquo;Subscription&rdquo;</strong> means the access to the Service purchased by Customer as set forth in an applicable Order Form specifying the term of service (&ldquo;Subscription Term&rdquo;), number of Authorized Users, and applicable fees (&ldquo;Subscription Fees&rdquo;).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">2. The Service</h2>
          <h3 className="text-lg font-medium mb-1">2.1 Access Rights</h3>
          <p>Contractor CTO hereby grants Customer a non-exclusive, non-transferable (except as specifically permitted in this Agreement), revocable right to access and use the Service to facilitate project management for Customer&apos;s projects including interaction with Customer&apos;s clients, vendors, suppliers, and subcontractors, pursuant to the terms of this Agreement, during the applicable Subscription Term.</p>
          
          <h3 className="text-lg font-medium mt-4 mb-1">2.2 Usage Restrictions</h3>
          <p>Customer shall not:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Make the Service available to, or use the Service for the benefit of, anyone other than Customer and its Authorized Users</li>
            <li>Rent, sublicense, re-sell, assign, transfer, distribute, time share, or similarly exploit the Service</li>
            <li>Reverse engineer, copy, modify, adapt, hack, or otherwise attempt to gain unauthorized access to the Service</li>
            <li>Access the Service or Contractor CTO&apos;s Confidential Information to build a competitive product or service</li>
            <li>Alter or remove, or permit any third party to alter or remove, any proprietary trademark or copyright markings incorporated in, marked on, or affixed to the Service</li>
            <li>Allow Authorized User Subscriptions to be shared or used by more than one individual Authorized User</li>
            <li>Use any software, devices, scripts, crawlers, robots, or other automated processes to copy, scrape, or systematically acquire any content contained within the Service without the express written consent of Contractor CTO</li>
            <li>Access or use the Service to send or store infringing, obscene, threatening, or otherwise unlawful material, including material violative of third-party privacy rights</li>
            <li>Use the Service in violation of applicable laws</li>
            <li>Send or store material knowingly or intentionally containing software viruses, worms, Trojan horses or other harmful computer code, files, or scripts</li>
            <li>Use the Service in a manner that interferes with or disrupts the integrity or performance of the Service (or the data contained therein)</li>
          </ul>
          
          <h3 className="text-lg font-medium mt-4 mb-1">2.3 Protection of Customer Data</h3>
          <p>Contractor CTO shall implement and maintain industry standard administrative, organizational, and technical safeguards designed for the protection, confidentiality, and integrity of Customer Data.</p>
          
          <h3 className="text-lg font-medium mt-4 mb-1">2.4 Suspension</h3>
          <p>Contractor CTO may suspend the account of any Authorized User who violates this Agreement or uses the Service in a manner that Contractor CTO reasonably believes may cause a security risk, a disruption to others&apos; use of the Service, or liability for Contractor CTO.</p>
        </section>

        {/* Additional sections would be added here, following the same structure */}

        <section>
          <h2 className="text-xl font-semibold mb-2">11. Miscellaneous</h2>
          <h3 className="text-lg font-medium mb-1">11.1 Governing Law; Venue</h3>
          <p>This Agreement and any disputes arising under it will be governed by the laws of the State of Texas without regard to its conflict of laws provisions, and each party consents to the personal jurisdiction and venue of the state or federal courts located in Dallas, Texas.</p>
          
          <h3 className="text-lg font-medium mt-4 mb-1">11.2 Notice</h3>
          <p>Contractor CTO may give notices to Customer related to the Service through email, text, in-app notifications, or by posting them on the Contractor CTO website or through the Service.</p>
          
          <h3 className="text-lg font-medium mt-4 mb-1">11.3 Publicity</h3>
          <p>Contractor CTO may include Customer&apos;s name and logo in Contractor CTO&apos;s online customer list and in print and electronic marketing materials.</p>
          
          <h3 className="text-lg font-medium mt-4 mb-1">11.4 Relationship of the Parties</h3>
          <p>The parties are and shall be independent contractors with respect to all services provided under this Agreement.</p>
          
          <h3 className="text-lg font-medium mt-4 mb-1">11.5 Force Majeure</h3>
          <p>Contractor CTO shall not be liable to Customer for any delay or failure to perform any obligation under this Agreement if the delay or failure is due to events which are beyond the reasonable control of Contractor CTO.</p>
          
          <h3 className="text-lg font-medium mt-4 mb-1">11.6 Severability; No Waiver</h3>
          <p>In the event that any provision of this Agreement is found to be invalid or unenforceable, such provision shall be limited or eliminated to the minimum extent necessary so that this Agreement shall otherwise remain in full force and effect.</p>
          
          <h3 className="text-lg font-medium mt-4 mb-1">11.7 Assignment</h3>
          <p>Neither this Agreement nor any of the rights and licenses granted under this Agreement may be transferred or assigned by either party without the other party&apos;s express written consent, with certain exceptions.</p>
          
          <h3 className="text-lg font-medium mt-4 mb-1">11.8 Modifications</h3>
          <p>Contractor CTO reserves the right to change or modify any of the terms and conditions contained in this Agreement or any policy governing the use of the Service, at any time.</p>
          
          <h3 className="text-lg font-medium mt-4 mb-1">11.9 Third-Party Services</h3>
          <p>The Service may use or provide access to one or more third-parties to process payments, process account or user registrations, or provide other services.</p>
          
          <h3 className="text-lg font-medium mt-4 mb-1">11.10 Hyperlinks</h3>
          <p>A link from the Service to a third party&apos;s website does not mean that Contractor CTO endorses or accepts any responsibility for the content, functioning, policies, or use of such website.</p>
          
          <h3 className="text-lg font-medium mt-4 mb-1">11.11 Entire Agreement</h3>
          <p>This Agreement and any Order Form(s) hereunder, constitutes the entire agreement between the parties concerning the subject matter hereof and supersedes and replaces any prior or contemporaneous representations, understandings and agreements.</p>
        </section>
      </CardContent>
    </Card>
  );
};

export default TermsOfService;

