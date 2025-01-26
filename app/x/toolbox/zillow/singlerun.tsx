'use client'

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import ModernDashboardCard from "@/components/dash-card"
import { zQuery1 } from "./zquery"
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
import { useCustomFieldsStore } from './store'

interface Job {
  id: string
  name: string
  location?: {
    id?: string
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
    id?: string
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
  const [locationID, setLocationID] = useState('')
  const [userSettings, setUserSettings] = useState<{grantKey?: string, orgId?: string}>({})
  const [zestimateField, setZestimateField] = useState<string>("")
  const [zestimateUrlField, setZestimateUrlField] = useState<string>("")
  const [yearBuiltField, setYearBuiltField] = useState<string>("")
  const [bedBathField, setBedBathField] = useState<string>("")
  const [livingAreaField, setLivingAreaField] = useState<string>("")
  const [latestSalePriceField, setLatestSalePriceField] = useState<string>("")
  const [latestSaleDateField, setLatestSaleDateField] = useState<string>("")

  const triggerRefresh = useCustomFieldsStore((state) => state.triggerRefresh)

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
        //console.log('UserSettings after set:', {
        //  grantKey: orgData.grantKey,
        //  orgId: orgData.orgID
        //})

        // Set the zestimate field ID
        setZestimateField(orgData.zestimateField || "")
        setZestimateUrlField(orgData.zillowUrlField || "")
        setYearBuiltField(orgData.yearBuiltField || "")
        setBedBathField(orgData.bedBathField || "")
        setLivingAreaField(orgData.livingAreaField || "")
        setLatestSalePriceField(orgData.latestSalePriceField || "")
        setLatestSaleDateField(orgData.latestSaleDateField || "") 
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
      if (!debouncedValue || !userSettings.grantKey || !userSettings.orgId) {
        // console.log('Search aborted. Debug values:', {
        //   debouncedValue,
        //   grantKey: userSettings.grantKey,
        //   orgId: userSettings.orgId
        // });
        setJobs([]);
        return;
      }

      setIsSearching(true);
      try {
        const query = {
          "$": { "grantKey": userSettings.grantKey },
          ...zQuery1({ 
            orgID: userSettings.orgId, 
            value: debouncedValue 
          })
        };
        
        //console.log('Sending query:', JSON.stringify(query, null, 2));

        const response = await fetch('/api/jtfetch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query })
        });
        
        const data = await response.json();
        
        if (!data?.organization?.jobs?.nodes) {
          console.error('Invalid response structure:', data);
          return;
        }

        const jobsData = data.organization.jobs.nodes;
        const mappedJobs = jobsData.map((job: JobData) => ({
          id: job.id || '',
          name: job.name || '',
          location: {
            id: job.location?.id || '',
            formattedAddress: job.location?.formattedAddress || '',
            account: {
              name: job.location?.account?.name || ''
            }
          }
        }));

        setJobs(mappedJobs);
        if (mappedJobs[0]?.location?.id) {
          setLocationID(mappedJobs[0].location.id);
        }
      } catch (error) {
        console.error('Job search error:', error);
      } finally {
        setIsSearching(false);
      }
    };
    //console.log('locationID', locationID)
    searchJobs();
  }, [debouncedValue, userSettings]);

  const handleJobSelect = (selectedJob: Job) => {
    //console.log('Selected job:', selectedJob);
    setJobId(selectedJob.id);
    setAddress(selectedJob.location?.formattedAddress || '');
    setLocationID(selectedJob.location?.id || '');
    setOpen(false);
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

      if (!userSettings.grantKey) {
        throw new Error('No grant key found');
      }

      if (!zestimateField) {
        throw new Error('No Zestimate field configured');
      }

      if (!zestimateUrlField) {
        throw new Error('No Zestimate URL field configured');
      }

      if (!yearBuiltField) {
        throw new Error('No Year Built field configured');
      }

      if (!bedBathField) {
        throw new Error('No Bed Bath field configured');
      }

      if (!livingAreaField) {
        throw new Error('No Living Area field configured');
      }

      if (!latestSalePriceField) {
        throw new Error('No Latest Sale Price field configured');
      }

      if (!latestSaleDateField) {
        throw new Error('No Latest Sale Date field configured');
      }

      // console.log('Submitting with:', {
      //   grantKey: userSettings.grantKey,
      //   locid: locationID,
      //   zestimateField: zestimateField,
      //   zestimateUrlField: zestimateUrlField,
      //   address: address
      // });
      
      const response = await fetch('/api/zillow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orgId: userSettings.orgId,
          locid: locationID,
          email: user.email,
          grantKey: userSettings.grantKey,
          zestimateField: zestimateField,
          zestimateUrlField: zestimateUrlField,
          yearBuiltField: yearBuiltField,
          bedBathField: bedBathField,
          livingAreaField: livingAreaField,
          latestSalePriceField: latestSalePriceField,
          latestSaleDateField: latestSaleDateField,
          address: address
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        console.error('API error response:', data);
        throw new Error(data.error || 'Failed to update Zillow data');
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
      <ModernDashboardCard
        title="Update location data for a specific job"
        description=""
        loading={isLoading}
        content={
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
                Zillow data updated successfully!
              </div>
            )}

            <Button 
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Processing...' : 'Update Zillow Data'}
            </Button>
          </div>
        }
      />
    </div>
  )
}