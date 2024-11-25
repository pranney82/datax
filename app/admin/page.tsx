'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Import all JSON files
import hero1Content from '@/components/home/hero1.json';
import logos3Content from '@/components/home/logos3.json';
import hero7Content from '@/components/home/hero7.json';
import hero8Content from '@/components/home/hero8.json';
import feature74Content from '@/components/home/feature74.json';
import faqContent from '@/components/home/faq.json';
import ctaContent from '@/components/home/cta.json';
import footerContent from '@/components/home/footer.json';



// Define proper types for the content structure
type ContentValue = string | number | boolean | ContentObject | ContentArray | null;
type ContentArray = ContentValue[];
type ContentObject = {
  [key: string]: ContentValue;
};

type RenderFieldProps = {
  path: string;
  value: ContentValue;
  onChange: (path: string, value: ContentValue) => void;
};

type RenderFieldsProps = {
  data: ContentObject;
  onChange: (path: string, value: ContentValue) => void;
};

// RenderFields component for object fields
const RenderFields = ({ data, onChange }: RenderFieldsProps) => {
  return (
    <div className="space-y-4">
      {Object.entries(data).map(([key, value]) => (
        <div key={key}>
          <RenderField
            path={key}
            value={value}
            onChange={onChange}
          />
        </div>
      ))}
    </div>
  );
};

// RenderField component for individual fields
const RenderField = ({ path, value, onChange }: RenderFieldProps) => {
  // Handle arrays
  if (Array.isArray(value)) {
    return (
      <div className="space-y-2">
        {value.map((item, index) => (
          <div key={index} className="pl-4 border-l">
            <RenderFields
              data={typeof item === 'object' && item !== null ? item as ContentObject : { value: item }}
              onChange={(subPath, newValue) => 
                onChange(`${path}.${index}${subPath === 'value' ? '' : '.' + subPath}`, newValue)
              }
            />
          </div>
        ))}
      </div>
    );
  }

  // Handle objects
  if (typeof value === 'object' && value !== null) {
    return (
      <RenderFields
        data={value}
        onChange={(subPath, newValue) => 
          onChange(`${path}.${subPath}`, newValue)
        }
      />
    );
  }

  // Handle primitive values (strings, numbers, etc.)
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">{path}</label>
      <Input
        type="text"
        value={value?.toString() || ''}
        onChange={(e) => onChange(path, e.target.value)}
      />
    </div>
  );
};

export default function AdminPage() {
  const [contents, setContents] = useState({
    hero1: hero1Content,
    logos3: logos3Content,
    hero7: hero7Content,
    hero8: hero8Content,
    feature74: feature74Content,
    faq: faqContent,
    cta: ctaContent,
    footer: footerContent
  });

  const handleSave = async () => {
    try {
      const savePromises = Object.entries(contents).map(async ([key, content]) => {
        console.log(`Attempting to save ${key}...`);
        
        const response = await fetch(`/api/content?section=${key}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(content),
        });
        
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(`Failed to save ${key}: ${result.error || response.statusText}`);
        }

        console.log(`Successfully saved ${key}:`, result);
        return result;
      });
      
      await Promise.all(savePromises);
      alert('All content saved successfully!');
    } catch (error) {
      console.error('Error saving content:', error);
      alert(`Failed to save content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const updateContent = (section: string, path: string, value: ContentValue) => {
    setContents(prev => {
      const newContents = { ...prev };
      const pathArray = path.split('.');
      
      // Changed 'let' to 'const' since it's never reassigned
      const current = JSON.parse(JSON.stringify(newContents[section as keyof typeof contents]));
      newContents[section as keyof typeof contents] = current;
      
      // Navigate through the path
      let target = current;
      for (let i = 0; i < pathArray.length - 1; i++) {
        const key = pathArray[i];
        // If next key is a number, we're dealing with an array
        const nextKey = pathArray[i + 1];
        const isNextKeyArrayIndex = !isNaN(Number(nextKey));
        
        // Create new object/array if it doesn't exist
        if (!(key in target)) {
          target[key] = isNextKeyArrayIndex ? [] : {};
        }
        
        // Create new reference for nested object/array
        target[key] = Array.isArray(target[key]) 
          ? [...target[key]]
          : { ...target[key] };
          
        target = target[key];
      }
      
      // Set the final value
      const lastKey = pathArray[pathArray.length - 1];
      target[lastKey] = value;

      return newContents;
    });
  };

  return (
    <main className="flex min-h-screen flex-col">
      <div className="w-full pl-16">
      {/* Sticky Navigation */}
      <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <h1 className="text-xl font-bold">Admin</h1>
          <Button onClick={handleSave}>Save All Changes</Button>
        </div>
      </div>

      {/* Content */}
      <section className="py-4">
        <div className="grid grid-cols-1 gap-4 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {Object.entries(contents).map(([key, content]) => (
            <Card key={key}>
            <CardHeader>
              <CardTitle>{key.toUpperCase()} Content</CardTitle>
            </CardHeader>
            <CardContent>
              <RenderFields
                data={content}
                onChange={(path, value) => updateContent(key, path, value)}
              />
            </CardContent>
          </Card>
            ))}
       </div>
      </section>
      </div>
    </main>
  );
}

