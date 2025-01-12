'use client'

import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Info } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"

interface Template {
  id: string;
  name: string;
  desc: string;
  downloads: number;
  createdAt: string;
  author: string;
  authorID: string;
  csvFileName: string;
  csvFileURL: string;
  imageFileName: string;
  imageURL: string;
  rating: number;
  type: 'cost-group' | 'schedule' | 'todos';
}

export default function TemplatePage({ params }: { params: { id: string } }) {
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageOpen, setImageOpen] = useState(false);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const templateRef = doc(db, "library", params.id);
        const templateSnap = await getDoc(templateRef);
        
        if (templateSnap.exists()) {
          const data = templateSnap.data();
          const createdAt = data.createdAt?.toDate?.() 
            ? data.createdAt.toDate().toLocaleDateString() 
            : data.createdAt;

          setTemplate({
            id: templateSnap.id,
            ...data,
            createdAt,
          } as Template);
        }
      } catch (error) {
        console.error("Error fetching template:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [params.id]);

  const handleDownload = async () => {
    if (!template) return;

    try {
      const templateRef = doc(db, "library", params.id);
      await updateDoc(templateRef, {
        downloads: increment(1)
      });
      
      setTemplate(prev => prev ? {
        ...prev,
        downloads: prev.downloads + 1
      } : null);

      const link = document.createElement('a');
      link.href = template.csvFileURL;
      link.target = '_blank';
      link.download = template.csvFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error("Error downloading template:", error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/4 mb-8" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-64 md:col-span-2" />
          <Skeleton className="h-64" />
        </div>
        <Skeleton className="h-40 w-40 mt-8" />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Template not found</h1>
        <p className="text-muted-foreground">The requested template could not be found. It may have been removed or you may have followed an invalid link.</p>
      </div>
    );
  }

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="flex flex-1 flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{template.name}</h1>
            <Badge variant="outline" className="text-sm capitalize">
              {template.type.replace('-', ' ')}
            </Badge>
          </div>
          <Button 
            onClick={handleDownload}
            className="w-full sm:w-auto transition-all duration-300 ease-in-out hover:scale-105"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Template
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2 transition-all duration-300 ease-in-out hover:shadow-lg">           
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="mr-2 h-5 w-5" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {template.desc}
              </p>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 ease-in-out hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="mr-2 h-5 w-5" />
                Template Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: "Type", value: template.type.replace('-', ' ') },
                  { label: "Downloads", value: template.downloads },
                  { label: "Created At", value: template.createdAt },
                  { label: "Created By", value: template.author },
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-1 border-b last:border-b-0">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium capitalize">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Preview</h2>
          <div className="relative group cursor-pointer overflow-hidden rounded-lg w-fit">
            <Image 
              src={template.imageURL} 
              alt={template.name} 
              width={300} 
              height={300} 
              className="rounded-lg transition-all duration-300 ease-in-out group-hover:scale-105"
              style={{ objectFit: 'cover' }}
              onClick={() => setImageOpen(true)}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
              <span className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300">Click to enlarge</span>
            </div>
          </div>
        </div>

        <Dialog open={imageOpen} onOpenChange={setImageOpen}>
          <DialogContent className="max-w-4xl">
            <Image
              src={template.imageURL}
              alt={template.name}
              width={800}
              height={800}
              className="w-full h-auto rounded-lg"
              style={{ objectFit: 'contain' }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}

