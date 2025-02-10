'use client'

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { aiaQuery1 } from "./aiaquery"
import { useDebounce } from "./hooks/useDebounce"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLogsStore } from './store'

interface Job {
  id: string
  name: string
  number: string
  total: number
  location?: {
    formattedAddress?: string
    account?: {
      name?: string
      id?: string
    }
  }
  customer?: {
    name?: string
    id?: string
  }
}

interface JobData {
  id?: string
  name?: string
  number?: string
  total?: number
  location?: {
    formattedAddress?: string
    account?: {
      name?: string
      id?: string
    }
  }
  customer?: {
    name?: string
    id?: string
  }
}

export function SingleRun(): JSX.Element {
  const { user } = useAuth()
  const [jobId, setJobId] = useState('')
  const [invoice, setInvoice] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const debouncedValue = useDebounce(inputValue, 300)
  const [jobs, setJobs] = useState<Job[]>([])
  const [userSettings, setUserSettings] = useState<{grantKey?: string, orgId?: string}>({})

  const triggerRefresh = useLogsStore((state) => state.triggerRefresh)

  // Fetch user settings once when component mounts
  useEffect(() => {
    const fetchUserSettings = async () => {
      if (!user?.uid) return

      try {
        const userDocRef = doc(db, "users", user.uid)
        const userDoc = await getDoc(userDocRef)
        const userData = userDoc.data()
        const orgDocRef = doc(db, "orgs", userData?.org)
        const orgDoc = await getDoc(orgDocRef)
        const orgData = orgDoc.data()

        if (!orgData?.orgID || !orgData?.grantKey) {
          console.error("Organization settings not found")
          return
        }

        setUserSettings({
          grantKey: orgData.grantKey,
          orgId: orgData.orgID
        })
      } catch (error) {
        console.error('Error fetching settings:', error)
      }
    }

    fetchUserSettings()
  }, [user])

  // Search jobs using the cached user settings
  useEffect(() => {
    const searchJobs = async () => {
      if (!debouncedValue || !userSettings.grantKey || !userSettings.orgId) {
        setJobs([])
        return
      }

      setIsSearching(true)
      try {
        const query = {
          "$": { "grantKey": userSettings.grantKey },
          ...aiaQuery1({ 
            orgID: userSettings.orgId, 
            value: debouncedValue 
          })
        }
        console.log('User settings:', {
          orgId: userSettings.orgId,
          hasGrantKey: !!userSettings.grantKey
        })
        console.log('Full query:', JSON.stringify(query, null, 2))

        const response = await fetch('/api/jtfetch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(query)
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          console.error('API error:', errorData)
          throw new Error('Failed to fetch jobs')
        }
        
        const data = await response.json()
        console.log('API Response:', data)

        const jobsData = data?.organization?.jobs?.nodes || []
        console.log('Raw job data:', jobsData)

        if (Array.isArray(jobsData)) {
          const mappedJobs = jobsData.map((job: JobData) => ({
            id: job.id || '',
            name: job.name || '',
            number: job.number || '',
            total: job.total || 0,
            location: {
              formattedAddress: job.location?.formattedAddress || '',
              account: {
                name: job.location?.account?.name || '',
                id: job.location?.account?.id || ''
              }
            },
            customer: {
              name: job.customer?.name || '',
              id: job.customer?.id || ''
            }
          }))
          console.log('Mapped jobs:', mappedJobs)
          setJobs(mappedJobs)
        } else {
          console.error('Invalid job data structure:', jobsData)
          setJobs([])
        }
      } catch (error) {
        console.error('Job search error:', error)
        setJobs([])
      } finally {
        setIsSearching(false)
      }
    }

    searchJobs()
  }, [debouncedValue, userSettings])

  const handleJobSelect = (selectedJob: Job) => {
    setJobId(selectedJob.id)
    setInvoice('')  // Reset invoice when new job is selected
    setOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      if (!user?.email) {
        throw new Error('User not authenticated')
      }

      const selectedJob = jobs.find(job => job.id === jobId)
      if (!selectedJob) {
        throw new Error('Selected job not found')
      }

      const webhookPayload = {
        event: 'jobCreated',
        job: {
          id: jobId,
          name: selectedJob.name,
          number: selectedJob.number,
          total: selectedJob.total,
          invoice: invoice,
          location: {
            account: {
              name: selectedJob.location?.account?.name,
              id: selectedJob.location?.account?.id
            }
          },
          customer: {
            name: selectedJob.customer?.name,
            id: selectedJob.customer?.id
          }
        },
        organization: {
          id: userSettings.orgId || ''
        }
      }
      console.log('Sending webhook payload:', webhookPayload)

      const response = await fetch('/api/aiabilling/2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookPayload),
      })

      if (!response.ok) {
        const data = await response.json()
        console.error('API error response:', data)
        throw new Error(data.error || 'Failed to attach aia billing pdf')
      }

      setSuccess(true)
      setJobId('')
      setInvoice('')
      triggerRefresh()
    } catch (err) {
      console.error('Submit error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      <p className="text-sm text-muted-foreground">
        Add AIA Billing PDF for a specific job invoice
      </p>
      <div className="w-full space-y-4">
        <div className="space-y-2 w-full">
          <Label htmlFor="jobId">Search Jobs</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {jobId
                  ? jobs.find((job) => job.id === jobId)?.name || jobId
                  : "Select a job..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[400px] p-0">
              <Command shouldFilter={false}>
                <CommandInput 
                  placeholder="Type to search jobs..."
                  value={inputValue}
                  onValueChange={(value) => setInputValue(value)}
                />
                <CommandList>
                  <CommandEmpty>
                    {isSearching ? "Searching..." : "No jobs found."}
                  </CommandEmpty>
                  <CommandGroup>
                    {jobs.map((job) => (
                      <CommandItem
                        key={job.id}
                        value={job.id}
                        onSelect={() => handleJobSelect(job)}
                        className="w-full"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            jobId === job.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex-1">
                          <div>{job.name} ({job.number})</div>
                          <div className="text-sm text-muted-foreground">
                            {job.location?.account?.name} - {job.customer?.name}
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2 w-full">
          <Label htmlFor="invoice">Invoice</Label>
          <Input
            id="invoice"
            placeholder="Invoice number"
            value={invoice}
            onChange={(e) => setInvoice(e.target.value)}
            required
            className="w-full"
          />
        </div>

        {error && (
          <div className="text-sm text-red-600 w-full">
            {error}
          </div>
        )}

        {success && (
          <div className="text-sm text-green-600 w-full">
            AIA Billing PDF updated successfully!
          </div>
        )}

        <Button 
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Processing...' : 'AIA Billing PDF'}
        </Button>
      </div>
    </div>
  )
}