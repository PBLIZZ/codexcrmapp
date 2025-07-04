"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { DataTable } from "./data-table"
import { createColumns, type Contact, type Group } from "./columns"
import { api } from "@/lib/trpc"

interface ContactViewProps {
  className?: string
  searchQuery?: string
  groupId?: string
}

export function ContactView({ className, searchQuery = "", groupId }: ContactViewProps) {
  const router = useRouter()
  const utils = api.useUtils()
  
  // Query contacts using tRPC
  const {
    data: contacts = [],
    isLoading,
    error: queryError,
  } = api.clients.list.useQuery(
    {
      search: searchQuery,
      groupId: groupId,
    },
    {
      placeholderData: (prev) => prev ?? [],
    }
  )

  // Delete mutation
  const deleteMutation = api.clients.delete.useMutation({
    onSuccess: async () => {
      await utils.clients.list.invalidate()
      toast.success("Contact deleted successfully")
    },
    onError: (error) => {
      toast.error(`Failed to delete contact: ${error.message}`)
    },
  })

  // Action handlers
  const handleEdit = React.useCallback((contact: Contact) => {
    router.push(`/contacts/${contact.id}/edit`)
  }, [router])

  const handleDelete = React.useCallback(async (contact: Contact) => {
    if (confirm(`Are you sure you want to delete ${contact.full_name}?`)) {
      try {
        await deleteMutation.mutateAsync({ id: contact.id })
      } catch (error) {
        // Error handled by mutation onError
      }
    }
  }, [deleteMutation])

  const handleEmail = React.useCallback((contact: Contact) => {
    if (contact.email) {
      window.open(`mailto:${contact.email}`, '_blank')
    }
  }, [])

  const handleCall = React.useCallback((contact: Contact) => {
    if (contact.phone) {
      window.open(`tel:${contact.phone}`, '_blank')
    }
  }, [])

  const handleTagClick = React.useCallback((tag: string) => {
    // You could implement tag filtering here by updating search params
    console.log("Filter by tag:", tag)
    // Example: router.push(`/contacts?tag=${encodeURIComponent(tag)}`)
  }, [])

  const handleGroupClick = React.useCallback((group: Group) => {
    router.push(`/contacts/groups/${group.id}`)
  }, [router])

  // Create columns with action handlers
  const columns = React.useMemo(
    () => createColumns({
      onEdit: handleEdit,
      onDelete: handleDelete,
      onEmail: handleEmail,
      onCall: handleCall,
      onTagClick: handleTagClick,
      onGroupClick: handleGroupClick,
    }),
    [handleEdit, handleDelete, handleEmail, handleCall, handleTagClick, handleGroupClick]
  )

  // Show error if query failed
  if (queryError) {
    toast.error(`Failed to load contacts: ${queryError.message}`)
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between space-y-2 pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Contacts</h2>
          <p className="text-muted-foreground">
            Manage your client relationships and wellness journeys
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={contacts}
        searchPlaceholder="Search contacts by email, name..."
        searchColumn="email"
      />
      
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-sm text-muted-foreground">Loading contacts...</div>
        </div>
      )}
    </div>
  )
}