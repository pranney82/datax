'use client'

import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Plus, Check, ArrowDownAZ, ArrowUpAZ, ArrowDownUp, Download, Calendar, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  return snapshot.docs.map(doc => {
    const data = doc.data();
    const createdAt = data.createdAt?.toDate?.() 
      ? data.createdAt.toDate().toLocaleDateString() 
      : data.createdAt;

    return {
      id: doc.id,
      ...data,
      createdAt,
    } as Template;
  });
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
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"

type SortOption = 'name-asc' | 'name-desc' | 'downloads-asc' | 'downloads-desc';
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

  const getBadgeColors = (type: Template['type']) => {
    switch (type) {
      case 'cost-group':
        return 'bg-green-100 text-green-800';
      case 'schedule':
        return 'bg-purple-100 text-purple-800';
      case 'todos':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
            <Link href="/x/library/templates/add" className="hidden md:block">
              <Button variant="outline" className="bg-primary text-primary-foreground"> 
                <Plus className="mr-2 h-4 w-4" />
                Add Template
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filterTemplates(sortTemplates(templates)).map((template) => (
            <div key={template.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 ease-in-out hover:shadow-md hover:border-gray-300 flex flex-col">
              <div className="p-4 flex-grow">
                <div className="flex justify-between items-start mb-3">
                  <Link
                    href={`/x/library/templates/${template.id}`}
                    className="text-lg font-semibold text-gray-900 hover:text-gray-700 transition-colors duration-200 ease-in-out group"
                  >
                    <span className="border-b-2 border-gray-200 group-hover:border-gray-400 pb-1">{template.name}</span>
                  </Link>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{template.desc}</p>
              </div>
              <div className="bg-gray-50 p-4 text-sm text-gray-500">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <Download className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{template.downloads} downloads</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{template.createdAt}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{template.author}</span>
                  </div>
                  <div className="pointer-events-none">
                    <Badge className={`capitalize ${getBadgeColors(template.type)} text-xs font-medium px-2 py-1 rounded`}>
                      {template.type.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
