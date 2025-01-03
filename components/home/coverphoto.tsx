'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

const CoverPhoto = () => {
  const [email, setEmail] = useState('');
  const [showApiUrl, setShowApiUrl] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const apiUrl = 'https://winyourdata.com/api/coverphoto';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await addDoc(collection(db, 'coverphototest'), {
        email: email,
        date: new Date().toISOString(),
      });

      setShowApiUrl(true);
    } catch (error) {
      console.error('Error saving email:', error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiUrl);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  return (
    <section className="py-8 w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 grid-cols-1">
          <div className="flex flex-col items-center text-center">
            <h1 className="my-6 text-pretty text-4xl font-bold">
              Cover Photo Automation
            </h1>
            <p className="mb-8 max-w-xl text-muted-foreground lg:text-xl">
              We&apos;re testing out a <u>temporary automation</u> to generate
              cover photos for your jobs, and want to see what you think about
              it!! <br /> <br /> We&apos;re collecting email addresses to
              monitor usage.
            </p>

            {!showApiUrl ? (
              <form onSubmit={handleSubmit} className="mb-8 max-w-xl w-full">
                <div className="flex gap-2 w-full">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 p-2 border border-gray-300 rounded-md"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            ) : (
              <div className="w-full max-w-xl">
                <div className="flex gap-2 w-full">
                  <input
                    type="text"
                    readOnly
                    value={apiUrl}
                    className="flex-1 p-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                  <div className="relative">
                    <Button onClick={copyToClipboard}>Copy</Button>
                    {showCopied && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-sm rounded shadow-lg">
                        Copied!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoverPhoto;
