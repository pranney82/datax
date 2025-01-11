'use client'

import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!template) {
    return <div>Template not found</div>;
  }

  return (
    <main className="flex flex-col flex-1 p-0">
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink>Library</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbLink href="/x/library/templates">Templates</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{template.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex justify-between items-center gap-2">
          <div>
            <h1 className="text-2xl font-bold">{template.name}</h1>
            <Badge variant="outline" className="mt-2 capitalize">
              {template.type.replace('-', ' ')}
            </Badge>
          </div>
          <Button onClick={async () => {
            try {
              // Increment the downloads counter in Firestore
              const templateRef = doc(db, "library", params.id);
              await updateDoc(templateRef, {
                downloads: increment(1)
              });
              
              // Update local state
              setTemplate(prev => prev ? {
                ...prev,
                downloads: prev.downloads + 1
              } : null);

              // Create a temporary link and trigger download directly
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
          }}>
            <Download className="mr-2 h-4 w-4" />
            Download Template
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-2">           
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-muted-foreground">
                    {template.desc}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Template Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium capitalize">{template.type.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Downloads</span>
                  <span className="font-medium">{template.downloads}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created At</span>
                  <span className="font-medium">{template.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created By</span>
                  <span className="font-medium">{template.author}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="w-fit">
          <Image 
            src={template.imageURL} 
            alt={template.name} 
            width={150} 
            height={150} 
            className="rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
            style={{ objectFit: 'cover' }}
            onClick={() => setImageOpen(true)}
          />
        </div>

        <Dialog open={imageOpen} onOpenChange={setImageOpen}>
          <DialogContent className="max-w-4xl">
            <Image
              src={template.imageURL}
              alt={template.name}
              width={800}
              height={800}
              className="w-full h-auto"
              style={{ objectFit: 'contain' }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
} 