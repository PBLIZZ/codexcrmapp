"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown, Mail, Phone, Edit, Trash2 } from "lucide-react"
import {
  Button,
  Checkbox,
  Badge,
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@codexcrm/ui"
import { formatDistanceToNow, format } from "date-fns"

// Contact type based on Supabase schema
export type Contact = {
  id: string
  user_id: string
  full_name: string
  email: string
  phone?: string | null
  job_title?: string | null
  company_name?: string | null
  source?: string | null
  notes?: string | null
  last_contacted_at?: string | null
  enrichment_status?: string | null
  enriched_data?: any
  created_at: string
  updated_at: string
  profile_image_url?: string | null
  website?: string | null
  tags?: string[] | null
  social_handles?: string[] | null
  address_street?: string | null
  address_city?: string | null
  address_postal_code?: string | null
  address_country?: string | null
  phone_country_code?: string | null
  wellness_goals?: string[] | null
  wellness_journey_stage?: string | null
  wellness_status?: string | null
  last_assessment_date?: string | null
  client_since?: string | null
  relationship_status?: string | null
  referral_source?: string | null
  communication_preferences?: any
  groups?: Group[]
}

export type Group = {
  id: string
  name: string
  description?: string | null
  color?: string | null
  emoji?: string | null
}

// Custom filter functions
const dateRangeFilterFn = (row: any, columnId: string, filterValue: any) => {
  if (!filterValue || !Array.isArray(filterValue) || filterValue.length !== 2) {
    return true
  }
  
  const cellValue = row.getValue(columnId)
  if (!cellValue) return false
  
  const date = new Date(cellValue)
  const [start, end] = filterValue
  
  return date >= start && date <= end
}

const tagsFilterFn = (row: any, columnId: string, filterValue: string[]) => {
  if (!filterValue || filterValue.length === 0) return true
  
  const cellValue = row.getValue(columnId) as string[]
  if (!cellValue || !Array.isArray(cellValue)) return false
  
  return filterValue.some(tag => cellValue.includes(tag))
}

const groupsFilterFn = (row: any, columnId: string, filterValue: string[]) => {
  if (!filterValue || filterValue.length === 0) return true
  
  const cellValue = row.getValue(columnId) as Group[]
  if (!cellValue || !Array.isArray(cellValue)) return false
  
  return filterValue.some(groupId => 
    cellValue.some(group => group.id === groupId)
  )
}

// Action handlers (these should be passed as props)
interface ActionHandlers {
  onEdit: (contact: Contact) => void
  onDelete: (contact: Contact) => void
  onEmail: (contact: Contact) => void
  onCall: (contact: Contact) => void
  onTagClick: (tag: string) => void
  onGroupClick: (group: Group) => void
}

export const createColumns = (handlers: ActionHandlers): ColumnDef<Contact>[] => [
  // Selection column
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // Avatar and Name column (sticky)
  {
    accessorKey: "full_name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-8 px-2"
      >
        Contact
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const contact = row.original
      const initials = contact.full_name
        .split(' ')
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()

      return (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={contact.profile_image_url || undefined} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{contact.full_name}</span>
            {contact.job_title && (
              <span className="text-xs text-muted-foreground">
                {contact.job_title}
              </span>
            )}
          </div>
        </div>
      )
    },
    enableSorting: true,
    enableHiding: false,
  },

  // Email column
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-8 px-2"
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const email = row.getValue("email") as string
      return (
        <div className="flex items-center space-x-2">
          <span className="font-mono text-sm">{email}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => handlers.onEmail(row.original)}
          >
            <Mail className="h-3 w-3" />
          </Button>
        </div>
      )
    },
    enableSorting: true,
    enableColumnFilter: true,
  },

  // Phone column
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.getValue("phone") as string
      if (!phone) return <span className="text-muted-foreground">—</span>
      
      return (
        <div className="flex items-center space-x-2">
          <span className="font-mono text-sm">{phone}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => handlers.onCall(row.original)}
          >
            <Phone className="h-3 w-3" />
          </Button>
        </div>
      )
    },
    enableSorting: false,
  },

  // Company column
  {
    accessorKey: "company_name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-8 px-2"
      >
        Company
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const company = row.getValue("company_name") as string
      return company ? (
        <span className="font-medium">{company}</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      )
    },
    enableSorting: true,
  },

  // Groups column with filtering
  {
    id: "groups",
    header: "Groups",
    accessorFn: (row) => row.groups,
    cell: ({ row }) => {
      const groups = row.original.groups || []
      if (groups.length === 0) {
        return <span className="text-muted-foreground">—</span>
      }

      return (
        <div className="flex flex-wrap gap-1">
          {groups.slice(0, 2).map((group) => (
            <Badge
              key={group.id}
              variant="secondary"
              className="cursor-pointer hover:bg-secondary/80"
              style={{ backgroundColor: group.color || undefined }}
              onClick={() => handlers.onGroupClick(group)}
            >
              {group.emoji && <span className="mr-1">{group.emoji}</span>}
              {group.name}
            </Badge>
          ))}
          {groups.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{groups.length - 2}
            </Badge>
          )}
        </div>
      )
    },
    enableSorting: false,
    enableColumnFilter: true,
    filterFn: groupsFilterFn,
  },

  // Tags column with filtering
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => {
      const tags = row.getValue("tags") as string[]
      if (!tags || tags.length === 0) {
        return <span className="text-muted-foreground">—</span>
      }

      return (
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 2).map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="cursor-pointer hover:bg-muted"
              onClick={() => handlers.onTagClick(tag)}
            >
              {tag}
            </Badge>
          ))}
          {tags.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{tags.length - 2}
            </Badge>
          )}
        </div>
      )
    },
    enableSorting: false,
    enableColumnFilter: true,
    filterFn: tagsFilterFn,
  },

  // Wellness Status column
  {
    accessorKey: "wellness_status",
    header: "Wellness Status",
    cell: ({ row }) => {
      const status = row.getValue("wellness_status") as string
      if (!status) return <span className="text-muted-foreground">—</span>

      const statusColors: Record<string, string> = {
        excellent: "bg-green-100 text-green-800",
        good: "bg-blue-100 text-blue-800",
        fair: "bg-yellow-100 text-yellow-800",
        poor: "bg-red-100 text-red-800",
      }

      return (
        <Badge
          variant="secondary"
          className={statusColors[status.toLowerCase()] || "bg-gray-100 text-gray-800"}
        >
          {status}
        </Badge>
      )
    },
    enableSorting: true,
  },

  // Last Contacted column with date sorting
  {
    accessorKey: "last_contacted_at",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-8 px-2"
      >
        Last Contact
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.getValue("last_contacted_at") as string
      if (!date) return <span className="text-muted-foreground">Never</span>

      return (
        <div className="flex flex-col">
          <span className="text-sm">
            {formatDistanceToNow(new Date(date), { addSuffix: true })}
          </span>
          <span className="text-xs text-muted-foreground">
            {format(new Date(date), "MMM d, yyyy")}
          </span>
        </div>
      )
    },
    enableSorting: true,
    sortingFn: "datetime",
    enableColumnFilter: true,
    filterFn: dateRangeFilterFn,
  },

  // Created At column with date sorting
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-8 px-2"
      >
        Created
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.getValue("created_at") as string
      return (
        <div className="flex flex-col">
          <span className="text-sm">
            {formatDistanceToNow(new Date(date), { addSuffix: true })}
          </span>
          <span className="text-xs text-muted-foreground">
            {format(new Date(date), "MMM d, yyyy")}
          </span>
        </div>
      )
    },
    enableSorting: true,
    sortingFn: "datetime",
    enableColumnFilter: true,
    filterFn: dateRangeFilterFn,
  },

  // Source column
  {
    accessorKey: "source",
    header: "Source",
    cell: ({ row }) => {
      const source = row.getValue("source") as string
      return source ? (
        <Badge variant="outline">{source}</Badge>
      ) : (
        <span className="text-muted-foreground">—</span>
      )
    },
    enableSorting: true,
  },

  // Relationship Status column
  {
    accessorKey: "relationship_status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("relationship_status") as string
      if (!status) return <span className="text-muted-foreground">—</span>

      const statusColors: Record<string, string> = {
        active: "bg-green-100 text-green-800",
        prospect: "bg-blue-100 text-blue-800",
        inactive: "bg-gray-100 text-gray-800",
        former: "bg-red-100 text-red-800",
      }

      return (
        <Badge
          variant="secondary"
          className={statusColors[status.toLowerCase()] || "bg-gray-100 text-gray-800"}
        >
          {status}
        </Badge>
      )
    },
    enableSorting: true,
  },

  // Actions column
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const contact = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(contact.email)}
            >
              Copy email
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handlers.onEmail(contact)}
            >
              <Mail className="mr-2 h-4 w-4" />
              Send email
            </DropdownMenuItem>
            {contact.phone && (
              <DropdownMenuItem
                onClick={() => handlers.onCall(contact)}
              >
                <Phone className="mr-2 h-4 w-4" />
                Call
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handlers.onEdit(contact)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit contact
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handlers.onDelete(contact)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete contact
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
]