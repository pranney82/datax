'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, CheckCircle, ArrowRight, Zap, Briefcase, X } from 'lucide-react';


interface AddOn {
  id: string;
  icon: JSX.Element;
  name: string;
  price: number;
  description: string;
  priceSuffix: string;
  additionalInfo: string;
}

const addons: AddOn[] = [
  {
    id: "tech brief",
    icon: <Briefcase className="w-12 h-12 text-[#ffd400]" />,
    name: "Tech Brief",
    price: 0,
    description: "Phone a friend for advanced JOBTREAD and integrated tech stack advice.",
    priceSuffix: "FREE",
    additionalInfo: "Jump on a virtual call with our experts to get advice on your JOBTREAD setup, software integrations, and tech stack. We'll provide you with a summary of our call and recommendations."
  },
  {
    id: "zaps",
    icon: <Zap className="w-12 h-12 text-[#ffd400]" />,
    name: "Zapier Assessment",
    price: 525,
    description: "Assessment of your current Zapier setup and recommendations for zaps.",
    priceSuffix: "/Fee",
    additionalInfo: "Our Zapier experts will analyze your current processes and desired automations, identify inefficiencies, and provide tailored zap recommendation report, along with a scope of work for us to build and maintain your zaps."
  },
  {
    id: "consulting",
    icon: <Briefcase className="w-12 h-12 text-[#ffd400]" />,
    name: "CTO Consulting",
    price: 2500,
    description: "Holistic view of your JOBTREAD and integrated tech stack.",
    priceSuffix: "/starting at month",
    additionalInfo: "Get expert guidance on your overall tech strategy, including software selection, integration, and scalability planning to support your business growth. Contract basis for 3, 6 and 12 months."
  },
];

const AddOns = () => {
  const [selectedAddons] = useState<string[]>([]);
  const [expandedAddon, setExpandedAddon] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const toggleExpand = (addonId: string) => {
    setExpandedAddon(prev => prev === addonId ? null : addonId);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const resetForm = () => {
    setShowThankYou(false);
    closeModal();
    (document.getElementById('250174963512153') as HTMLFormElement)?.reset();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const form = event.currentTarget;
    const formData = new FormData(form);
    fetch(form.action, {
      method: 'POST',
      body: formData
    }).then(response => {
      if (response.ok) {
        setShowThankYou(true);
      } else {
        console.error('Form submission failed');
      }
    }).catch(error => {
      console.error('Error:', error);
    }).finally(() => {
      setIsSubmitting(false);
    });
  };

  return (
    <section id="cto-consulting" className="py-16 w-full bg-[#000] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-16">
          <h3 className="text-4xl font-bold text-center mb-12 text-[#fff] tracking-tight">Consulting Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {addons.map((addon) => (
              <Card
                key={addon.id}
                className={`flex flex-col rounded-2xl bg-gradient-to-br from-[#111] to-[#222] shadow-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  selectedAddons.includes(addon.id) ? 'border-[#ffd400] shadow-[#ffd400]/20' : 'border-transparent hover:shadow-[#ffd400]/10'
                }`}
              >
                <CardContent className="p-8 flex flex-col justify-between h-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#ffd400]/20 to-transparent rounded-bl-full transform translate-x-16 -translate-y-16"></div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-6 relative z-10">
                      <div className="flex items-center">
                        <div className="mr-4 transition-all duration-300 ease-in-out transform hover:scale-110 hover:rotate-12 bg-[#ffd400]/10 p-3 rounded-full">
                          {addon.icon}
                        </div>
                        <h4 className="text-2xl font-bold text-[#fff]">{addon.name}</h4>
                      </div>
                    </div>
                    <div className="space-y-4 relative z-10">
                      <p className="text-[#fff]/80 text-lg">{addon.description}</p>
                      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        expandedAddon === addon.id ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                      }`}>
                        <p className="text-[#fff]/70 bg-[#fff]/5 p-4 rounded-lg mt-2 text-sm">{addon.additionalInfo}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 text-right">
                    <span className="text-4xl font-bold text-[#ffd400]">${addon.price}</span>
                    <span className="text-sm text-[#fff]/60 ml-1">{addon.priceSuffix}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#000]/30">
                  <Button
                    className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#fff]/10 text-[#fff] hover:bg-[#ffd400]/20 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#ffd400] focus:ring-opacity-50 text-lg font-medium"
                    onClick={() => toggleExpand(addon.id)}
                  >
                    {expandedAddon === addon.id ? (
                      <>
                        Less Info <ChevronUp className="ml-2 h-5 w-5 animate-bounce" />
                      </>
                    ) : (
                      <>
                        Learn More <ChevronDown className="ml-2 h-5 w-5 animate-bounce" />
                      </>
                    )}
                  </Button>
                  <Button
                    className={`w-full sm:w-auto px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#ffd400] focus:ring-opacity-50 text-lg font-bold ${
                      selectedAddons.includes(addon.id)
                        ? 'bg-[#ffd400] text-[#000] hover:bg-[#ffd400]/90'
                        : 'bg-gradient-to-r from-[#ffd400] to-[#ffea80] text-[#000] hover:from-[#ffea80] hover:to-[#ffd400]'
                    }`}
                    onClick={openModal}
                  >
                    {selectedAddons.includes(addon.id) ? (
                      <>
                        Selected <CheckCircle className="ml-2 h-5 w-5 inline-block" />
                      </>
                    ) : (
                      <>
                        Schedule Call <ArrowRight className="ml-2 h-5 w-5 inline-block animate-pulse" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#111] to-[#222] rounded-2xl p-8 max-w-4xl w-full relative border-2 border-[#ffd400] shadow-2xl transform transition-all duration-300 ease-in-out">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-[#ffd400] hover:text-[#ffea80] transition-colors duration-200 bg-[#000]/20 rounded-full p-2"
            >
              <X className="w-6 h-6" />
            </button>
            {showThankYou ? (
              <div className="text-center py-12">
                <h2 className="text-3xl font-bold text-[#ffd400] mb-4">Thank You!</h2>
                <p className="text-[#fff] text-lg mb-8">We&apos;ve received your request and will get back to you shortly.</p>
                <Button
                  onClick={resetForm}
                  className="px-8 py-3 bg-gradient-to-r from-[#ffd400] to-[#ffea80] text-[#000] font-bold rounded-full transition-all duration-300 hover:from-[#ffea80] hover:to-[#ffd400] hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#ffd400] focus:ring-opacity-50"
                >
                  Close
                </Button>
              </div>
            ) : (
              <>
                <form className="jotform-form" action="https://submit.jotform.com/submit/250174963512153" method="post" name="form_250174963512153" id="250174963512153" acceptCharset="utf-8" autoComplete="on" onSubmit={handleSubmit}>
                  <div role="main" className="form-all">
                    <ul className="form-section page-section space-y-6">
                      <li id="cid_1" className="form-input-wide" data-type="control_head">
                        <div className="form-header-group">
                          <h1 id="header_1" className="form-header text-3xl font-bold text-[#ffd400] mb-2">Appointment Request Form</h1>
                          <div id="subHeader_1" className="form-subHeader text-[#fff]/80">Let us know how we can help you!</div>
                        </div>
                      </li>
                      <li className="form-line" data-type="control_fullname" id="id_3">
                        <label className="form-label form-label-top text-[#fff]/90" id="label_3" htmlFor="first_3">Your Name</label>
                        <div id="cid_3" className="form-input-wide" data-layout="full">
                          <div className="flex space-x-4">
                            <input type="text" id="first_3" name="q3_yourName[first]" className="form-input flex-1" autoComplete="given-name" placeholder="First Name" />
                            <input type="text" id="last_3" name="q3_yourName[last]" className="form-input flex-1" autoComplete="family-name" placeholder="Last Name" />
                          </div>
                        </div>
                      </li>
                      <li className="form-line" data-type="control_email" id="id_5">
                        <label className="form-label form-label-top text-[#fff]/90" id="label_5" htmlFor="input_5">Email Address</label>
                        <div id="cid_5" className="form-input-wide">
                          <input type="email" id="input_5" name="q5_emailAddress" className="form-input" placeholder="example@example.com" />
                        </div>
                      </li>
                      <li className="form-line" data-type="control_dropdown" id="id_15">
                        <label className="form-label form-label-top text-[#fff]/90" id="label_15" htmlFor="input_15">What services are you interested in?</label>
                        <div id="cid_15" className="form-input-wide">
                          <select className="form-select" id="input_15" name="q15_whatServices15">
                            <option value="">Please Select</option>
                            <option value="Zapier Help">Zapier Help</option>
                            <option value="Formula Help">Formula Help</option>
                            <option value="CTO Consulting">CTO Consulting</option>
                            <option value="Something Else">Something Else</option>
                          </select>
                        </div>
                      </li>
                      <li className="form-line" data-type="control_textarea" id="id_10">
                        <label className="form-label form-label-top text-[#fff]/90" id="label_10" htmlFor="input_10">Additional Comments</label>
                        <div id="cid_10" className="form-input-wide">
                          <textarea id="input_10" className="form-textarea" name="q10_additionalComments" placeholder="Type here..." rows={4}></textarea>
                        </div>
                      </li>
                      <li className="form-line" data-type="control_button" id="id_14">
                        <div id="cid_14" className="form-input-wide">
                          <button 
                            id="input_14" 
                            type="submit" 
                            className="form-submit-button w-full py-3 px-6 bg-gradient-to-r from-[#ffd400] to-[#ffea80] text-[#000] font-bold rounded-full transition-all duration-300 hover:from-[#ffea80] hover:to-[#ffd400] hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#ffd400] focus:ring-opacity-50"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                          </button>
                        </div>
                      </li>
                    </ul>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
      <style jsx global>{`
        .form-all {
          font-family: Inter, sans-serif;
          color: #fff;
        }
        
        .form-input,
        .form-textarea,
        .form-select {
          width: 100%;
          padding: 10px 16px;
          border: 1px solid #444;
          border-radius: 8px;
          background: #222;
          color: #fff;
          transition: all 0.3s;
        }
        
        .form-input:focus,
        .form-textarea:focus,
        .form-select:focus {
          border-color: #ffd400;
          box-shadow: 0 0 0 2px rgba(255, 212, 0, 0.2);
          outline: none;
        }
        
        .form-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23ffd400'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 16px;
          padding-right: 40px;
        }
      `}</style>
    </section>
  );
};

export default AddOns;

