'use client'

import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { 
  Plus,
  Check
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowDownAZ, ArrowUpAZ, ArrowDownUp } from "lucide-react"
import { useState, useEffect } from 'react'
import Link from 'next/link'

// Type for our template data based on Firestore structure
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

async function getTemplates() {
  const templatesRef = collection(db, "library");
  const snapshot = await getDocs(templatesRef);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Template[];
}

import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"

// Add this type above the component
type SortOption = 'name-asc' | 'name-desc' | 'downloads-asc' | 'downloads-desc';

// Add this type definition
type FilterOption = 'all' | 'cost-group' | 'schedule' | 'todos';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('downloads-desc');
  const [filterOption, setFilterOption] = useState<FilterOption>('all');

  useEffect(() => {
    const fetchTemplates = async () => {
      const fetchedTemplates = await getTemplates();
      setTemplates(fetchedTemplates);
    };
    fetchTemplates();
  }, []);

  const sortTemplates = (templates: Template[]): Template[] => {
    return [...templates].sort((a, b) => {
      switch (sortOption) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'downloads-asc':
          return a.downloads - b.downloads;
        case 'downloads-desc':
          return b.downloads - a.downloads;
        default:
          return 0;
      }
    });
  };

  const handleSort = (option: SortOption) => {
    setSortOption(option);
  };

  const filterTemplates = (templates: Template[]): Template[] => {
    if (filterOption === 'all') return templates;
    return templates.filter(template => template.type === filterOption);
  };

  return (
    <main className="flex flex-col flex-1 p-0">
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/library">Library</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Templates</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex justify-between items-center gap-2">
          <h1 className="text-2xl font-bold">Templates</h1>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilterOption('all')}>
                  {filterOption === 'all' && <Check className="mr-2 h-4 w-4" />}
                  All Templates
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterOption('cost-group')}>
                  {filterOption === 'cost-group' && <Check className="mr-2 h-4 w-4" />}
                  Cost Groups
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterOption('schedule')}>
                  {filterOption === 'schedule' && <Check className="mr-2 h-4 w-4" />}
                  Schedules
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterOption('todos')}>
                  {filterOption === 'todos' && <Check className="mr-2 h-4 w-4" />}
                  Todo Lists
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <ArrowDownUp className="mr-2 h-4 w-4" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleSort('name-asc')}>
                <ArrowDownAZ className="mr-2 h-4 w-4" /> Name A-Z
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('name-desc')}>
                <ArrowUpAZ className="mr-2 h-4 w-4" /> Name Z-A
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('downloads-asc')}>
                Downloads (Low to High)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('downloads-desc')}>
                Downloads (High to Low)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/x/library/templates/add">
          <Button variant="outline" className="bg-primary text-primary-foreground"> 
            <Plus className="mr-2 h-4 w-4" />
                Add Template
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filterTemplates(sortTemplates(templates)).map((template) => (
            <Card key={template.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      <Link
                        href={`/x/library/templates/${template.id}`}
                        className="hover:underline"
                      >
                        {template.name}
                      </Link>
                    </CardTitle>
                    <Badge variant="outline" className="capitalize">
                      {template.type.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>                
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {template.desc}
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Downloads</span>
                      <span>{template.downloads}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created At</span>
                      <span>
                        {template.createdAt
                          ? new Date(template.createdAt).toLocaleDateString() 
                          : template.createdAt}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created By</span>
                      <span>{template.author}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
} 