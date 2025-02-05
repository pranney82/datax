"use client"

import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import {
  Plus,
  Check,
  ArrowDownAZ,
  ArrowUpAZ,
  ArrowDownUp,
  Download,
  Calendar,
  User,
  YoutubeIcon as YouTube,
  ChevronDown,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Type for our template data based on Firestore structure
interface Template {
  id: string
  name: string
  desc: string
  downloads: number
  createdAt: string
  author: string
  authorID: string
  csvFileName: string
  csvFileURL: string
  imageFileName: string
  imageURL: string
  rating: number
  type: "cost-group" | "schedule" | "todos"
}

async function getTemplates() {
  const templatesRef = collection(db, "library")
  const snapshot = await getDocs(templatesRef)
  return snapshot.docs.map((doc) => {
    const data = doc.data()
    const createdAt = data.createdAt?.toDate?.() ? data.createdAt.toDate().toLocaleDateString() : data.createdAt

    return {
      id: doc.id,
      ...data,
      createdAt,
    } as Template
  })
}

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type SortOption = "name-asc" | "name-desc" | "downloads-asc" | "downloads-desc"
type FilterOption = "all" | "cost-group" | "schedule" | "todos"

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [sortOption, setSortOption] = useState<SortOption>("downloads-desc")
  const [filterOption, setFilterOption] = useState<FilterOption>("all")
  const [isTutorialOpen, setIsTutorialOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchTemplates = async () => {
      const fetchedTemplates = await getTemplates()
      setTemplates(fetchedTemplates)
    }
    fetchTemplates()
  }, [])

  const sortTemplates = (templates: Template[]): Template[] => {
    return [...templates].sort((a, b) => {
      switch (sortOption) {
        case "name-asc":
          return a.name.localeCompare(b.name)
        case "name-desc":
          return b.name.localeCompare(a.name)
        case "downloads-asc":
          return a.downloads - b.downloads
        case "downloads-desc":
          return b.downloads - a.downloads
        default:
          return 0
      }
    })
  }

  const handleSort = (option: SortOption) => {
    setSortOption(option)
  }

  const filterTemplates = (templates: Template[]): Template[] => {
    if (filterOption === "all") return templates
    return templates.filter((template) => template.type === filterOption)
  }

  const searchTemplates = (templates: Template[]): Template[] => {
    if (!searchQuery) return templates
    return templates.filter((template) => template.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }

  const getBadgeColors = (type: Template["type"]) => {
    switch (type) {
      case "cost-group":
        return "bg-green-100 text-green-800"
      case "schedule":
        return "bg-purple-100 text-purple-800"
      case "todos":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-2 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Templates</h1>
          <p className="text-sm text-gray-600 mt-1">Templates for your JobTread</p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 w-full md:w-auto">
          <div className="w-full md:hidden flex flex-col gap-2">
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <ArrowDownUp className="mr-2 h-4 w-4" />
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleSort("name-asc")}>
                    <ArrowDownAZ className="mr-2 h-4 w-4" /> Name A-Z
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort("name-desc")}>
                    <ArrowUpAZ className="mr-2 h-4 w-4" /> Name Z-A
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort("downloads-asc")}>
                    Downloads (Low to High)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort("downloads-desc")}>
                    Downloads (High to Low)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                className="flex-1 gap-2 text-black border-2 border-[#FFD400] bg-[#FFD400] transition-colors duration-300 shadow-lg hover:bg-[#FFD400]/80"
                onClick={() => setIsTutorialOpen(true)}
              >
                <YouTube className="w-5 h-5" />
                <span className="font-semibold">Tutorial</span>
              </Button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span>
                    {filterOption === "all"
                      ? "All"
                      : filterOption
                          .split("-")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                  </span>
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilterOption("all")}>
                  {filterOption === "all" && <Check className="mr-2 h-4 w-4" />}
                  All Templates
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterOption("cost-group")}>
                  {filterOption === "cost-group" && <Check className="mr-2 h-4 w-4" />}
                  Cost Groups
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterOption("schedule")}>
                  {filterOption === "schedule" && <Check className="mr-2 h-4 w-4" />}
                  Schedules
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterOption("todos")}>
                  {filterOption === "todos" && <Check className="mr-2 h-4 w-4" />}
                  Todo Lists
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Input
              type="text"
              placeholder="Search templates..."
              className="w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Input
              type="text"
              placeholder="Search templates..."
              className="w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-auto justify-between">
                  <span>
                    {filterOption === "all"
                      ? "All"
                      : filterOption
                          .split("-")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                  </span>
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilterOption("all")}>
                  {filterOption === "all" && <Check className="mr-2 h-4 w-4" />}
                  All Templates
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterOption("cost-group")}>
                  {filterOption === "cost-group" && <Check className="mr-2 h-4 w-4" />}
                  Cost Groups
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterOption("schedule")}>
                  {filterOption === "schedule" && <Check className="mr-2 h-4 w-4" />}
                  Schedules
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterOption("todos")}>
                  {filterOption === "todos" && <Check className="mr-2 h-4 w-4" />}
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
                <DropdownMenuItem onClick={() => handleSort("name-asc")}>
                  <ArrowDownAZ className="mr-2 h-4 w-4" /> Name A-Z
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("name-desc")}>
                  <ArrowUpAZ className="mr-2 h-4 w-4" /> Name Z-A
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("downloads-asc")}>Downloads (Low to High)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("downloads-desc")}>
                  Downloads (High to Low)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/x/library/templates/add">
              <Button
                variant="outline"
                className="bg-[#000] text-[#fff] border-[#000] hover:bg-[#000]/80 hover:text-[#fff]"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Template
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-auto gap-2 text-black border-2 border-[#FFD400] bg-[#FFD400] transition-colors duration-300 shadow-lg hover:bg-[#FFD400]/80"
              onClick={() => setIsTutorialOpen(true)}
            >
              <YouTube className="w-5 h-5" />
              <span className="font-semibold">Tutorial</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {searchTemplates(filterTemplates(sortTemplates(templates))).map((template) => (
          <div
            key={template.id}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 ease-in-out hover:shadow-md hover:border-gray-300 flex flex-col"
          >
            <div className="p-4 flex-grow">
              <div className="flex justify-between items-start mb-3">
                <Link
                  href={`/x/library/templates/${template.id}`}
                  className="text-lg font-semibold text-gray-900 hover:text-gray-700 transition-colors duration-200 ease-in-out group flex items-center"
                >
                  <Download className="w-5 h-5 mr-2 text-gray-400 group-hover:text-gray-600" />
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
                  <Badge
                    className={`capitalize ${getBadgeColors(template.type)} text-xs font-medium px-2 py-1 rounded`}
                  >
                    {template.type.replace("-", " ")}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Dialog open={isTutorialOpen} onOpenChange={setIsTutorialOpen}>
        <DialogContent className="sm:max-w-[800px] max-w-[90vw] w-full bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-black">Library Walkthrough</DialogTitle>
          </DialogHeader>
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/SxHCTr0IWSc"
              title="Tutorial Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}

