'use client'

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/context/auth-context"
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface TaskType {
  id: string
  name: string
}

interface TTSelectorProps {
  onTaskTypeSelect: (taskId: string) => void;
}

export function TTSelector({ onTaskTypeSelect }: TTSelectorProps) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([])
  const [selectedType, setSelectedType] = useState<string>("")
  const [orgId, setOrgId] = useState<string>("")

  useEffect(() => {
    const fetchTaskTypes = async () => {
      if (!user) return

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (!userDoc.exists()) return

        const org = userDoc.data().org
        setOrgId(org)
        const orgDocRef = doc(db, 'orgs', org)
        const orgDoc = await getDoc(orgDocRef)
        const orgID = orgDoc.data()?.orgID
        const grantKey = orgDoc.data()?.grantKey

        if (orgDoc.data()?.calTaskType && orgDoc.data()?.calTaskTypeName) {
          setSelectedType(orgDoc.data()?.calTaskType)
        } else {
          // Create the fields in the database with empty values
          try {
            await updateDoc(orgDocRef, {
              calTaskType: '',
              calTaskTypeName: ''
            })
            console.log('Created calTaskType and calTaskTypeName fields in database')
          } catch (error) {
            console.error('Error creating calendar task type fields:', error)
          }
        }

        if (orgID && grantKey) {
          const response = await fetch('/api/jtfetch', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query: {
                "$": { "grantKey": grantKey },
                "organization": {
                  "$": {
                    "id": orgID
                  },
                  "id": {},
                  "taskTypes": {
                    "nodes": {
                        "id": {},
                        "name": {}
                        },
                    "$": {
                    "size": 100
                      }
                    }
                  }
                }              
            })
          })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        const nodes = data?.organization?.taskTypes?.nodes || []
        const types = nodes.map((node: TaskType) => ({
          id: node?.id || '',
          name: node?.name || ''
        }))

        //console.log('Fetched task types:', types)
        
        setTaskTypes(types)

        // Set default selected type if exists in org doc
        const savedTypeId = orgDoc.data()?.defaultTaskType
        const savedTypeName = orgDoc.data()?.defaultTaskTypeName
        if (savedTypeId && savedTypeName) {
          setSelectedType(savedTypeId)
        }
      }
    } catch (error) {
      console.error('Error fetching task types:', error)
      setTaskTypes([])
    }
  }

  fetchTaskTypes()
}, [user])

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] justify-between mr-2"
        >
          {selectedType
            ? taskTypes.find((type) => type.id === selectedType)?.name
            : "Select task type..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[250px]">
        {taskTypes && taskTypes.length > 0 ? (
          taskTypes.map((type) => (
            <DropdownMenuItem
              key={type.id}
              onSelect={() => {
                const newTypeId = type.id === selectedType ? "" : type.id
                const newTypeName = type.name
                setSelectedType(newTypeId)
                setOpen(false)
                

                try {
                  const orgDocRef = doc(db, 'orgs', orgId)
                  updateDoc(orgDocRef, {
                    calTaskType: newTypeId,
                    calTaskTypeName: newTypeName
                  })
                  //console.log('Updated calendar task type in database')
                  onTaskTypeSelect(newTypeId)
                } catch (error) {
                  console.error('Error updating calendar task type:', error)
                }
              }}
              className="flex items-center"
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  selectedType === type.id ? "opacity-100" : "opacity-0"
                )}
              />
              {type.name}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>No task types available</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
