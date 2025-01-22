'use client'

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { cpQuery1 } from "./cpquery"
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
  location?: {
    formattedAddress?: string
    account?: {
      name?: string
    }
  }
}

interface JobData {
  id?: string
  name?: string
  location?: {
    formattedAddress?: string
    account?: {
      name?: string
    }
  }
}

export function SingleRun() {
  const { user } = useAuth()
  const [jobId, setJobId] = useState('')
  const [address, setAddress] = useState('')
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
      if (!user?.uid) {
        //console.log('No user available')
        return
      }

      try {
        // First get the user doc to get the orgId
        const userDocRef = doc(db, 'users', user.uid)
        //console.log('Attempting to fetch user doc with ref:', user.uid)
        
        const userDoc = await getDoc(userDocRef)
        //console.log('User doc exists?:', userDoc.exists())
        
        if (!userDoc.exists()) {
          //console.error('User document not found for uid:', user.uid)
          return
        }

        const userData = userDoc.data()
        const orgId = userData.org

        if (!orgId) {
          //console.error('No orgId found in user document')
          return
        }

        // Then get the org doc to get the grantKey
        const orgDocRef = doc(db, 'orgs', orgId)
        //console.log('Attempting to fetch org doc with ref:', orgDocRef)

        const orgDoc = await getDoc(orgDocRef)
        if (!orgDoc.exists()) {
          //console.error('Organization document not found for orgId:', orgId)
          return
        }

        const orgData = orgDoc.data()
        //console.log('Organization data retrieved:', {
        //  grantKey: orgData.grantKey,
        //  orgID: orgData.orgID
        //})

        setUserSettings({
          grantKey: orgData.grantKey,
          orgId: orgData.orgID
        })
      } catch (error) {
        console.error('Error fetching settings:', error)
        if (error instanceof Error) {
          console.error('Error details:', error.message)
        }
      }
    }

    fetchUserSettings()
  }, [user])

  // Search jobs using the cached user settings
  useEffect(() => {
    const searchJobs = async () => {
      //console.log('Search triggered with:', debouncedValue)
      if (!debouncedValue || !userSettings.grantKey || !userSettings.orgId) {
        //console.log('Empty search or missing settings, clearing jobs')
        setJobs([])
        return
      }

      setIsSearching(true)
      try {
        //console.log('Fetching jobs with query:', {
        //  orgID: userSettings.orgId,
        //  value: debouncedValue
        //})

        const response = await fetch('/api/jtfetch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: {
              "$": { "grantKey": userSettings.grantKey },
              ...cpQuery1({ 
                orgID: userSettings.orgId, 
                value: debouncedValue 
              })
            }
          })
        })
        
        const data = await response.json()
        //console.log('API Parsed Response:', data)

        const jobsData = data?.organization?.jobs?.nodes || []
        //console.log('Raw jobs data:', jobsData)

        const mappedJobs = jobsData.map((job: JobData) => ({
          id: job.id || '',
          name: job.name || '',
          location: {
            formattedAddress: job.location?.formattedAddress || '',
            account: {
              name: job.location?.account?.name || ''
            }
          }
        }))
        //console.log('Mapped jobs:', mappedJobs)
        
        setJobs(mappedJobs)
      } catch (error) {
        console.error('Job search error:', error)
      } finally {
        setIsSearching(false)
      }
    }

    searchJobs()
  }, [debouncedValue, userSettings]) // Only depends on debouncedValue and cached userSettings

  const handleJobSelect = (selectedJob: Job) => {
    //console.log('Selected job:', selectedJob)
    setJobId(selectedJob.id)
    setAddress(selectedJob.location?.formattedAddress || '')
    setOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //console.log('Form submitted with:', { jobId, address });
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!user?.email) {
        throw new Error('User not authenticated');
      }

      const response = await fetch('/api/coverphoto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId,
          address,
          orgId: userSettings.orgId,
          grantKey: userSettings.grantKey,
          email: user.email,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        console.error('API error response:', data);
        throw new Error(data.error || 'Failed to update cover photo');
      }

      //console.log('API call successful');
      setSuccess(true);
      setJobId('');
      setAddress('');
      triggerRefresh();
    } catch (err) {
      console.error('Submit error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <p className="text-sm text-muted-foreground">
        Update cover photo for a specific job
      </p>
          <div className="w-full space-y-4">
            <div className="space-y-2 w-full">
              <Label htmlFor="jobId">Job ID</Label>
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
                      placeholder="Search jobs..." 
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
                              <div>{job.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {job.location?.account?.name}
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
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Enter full address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
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
                Cover photo updated successfully!
              </div>
            )}

            <Button 
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Processing...' : 'Update Cover Photo'}
            </Button>
          </div>
    </div>
  )
}