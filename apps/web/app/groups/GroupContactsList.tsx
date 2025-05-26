"use client";

import { Users, Plus, X, Loader2, UserCheck, UserPlus } from "lucide-react";
import { useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/trpc";

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email?: string | null;
  company_name?: string | null;
}

interface GroupContactsListProps {
  groupId: string;
  groupName: string;
}

export function GroupContactsList({ groupId, groupName }: GroupContactsListProps) {
  const [isAddContactDialogOpen, setIsAddContactDialogOpen] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [showAllContacts, setShowAllContacts] = useState(false);

  const utils = api.useContext();

  // Get contacts in this group
  const { data: groupContacts, isLoading: isLoadingGroupContacts } = 
    api.groups.getContacts.useQuery(
      { groupId },
      { enabled: !!groupId }
    );

  // Get all contacts for the add dialog
  const { data: allContacts, isLoading: isLoadingAllContacts } = 
    api.contacts.list.useQuery(undefined, {
      enabled: isAddContactDialogOpen
    });

  // Mutation to add contact to group
  const addContactMutation = api.groups.addContact.useMutation({
    onSuccess: () => {
      utils.groups.getContacts.invalidate({ groupId });
      utils.groups.list.invalidate(); // Update contact counts
      setIsAddContactDialogOpen(false);
      setSelectedContactId("");
      setError(null);
    },
    onError: (error) => {
      setError(`Failed to add contact: ${error.message}`);
    },
  });

  // Mutation to remove contact from group
  const removeContactMutation = api.groups.removeContact.useMutation({
    onSuccess: () => {
      utils.groups.getContacts.invalidate({ groupId });
      utils.groups.list.invalidate(); // Update contact counts
      setError(null);
    },
    onError: (error) => {
      setError(`Failed to remove contact: ${error.message}`);
    },
  });

  // Filter out contacts already in group
  const availableContacts = allContacts?.filter(
    (contact: Contact) => !groupContacts?.some((gc: Contact) => gc.id === contact.id)
  );

  const handleAddContact = () => {
    if (!selectedContactId) {
      setError("Please select a contact");
      return;
    }

    addContactMutation.mutate({
      contactId: selectedContactId,
      groupId,
    });
  };

  const handleRemoveContact = (contactId: string) => {
    removeContactMutation.mutate({
      contactId,
      groupId,
    });
  };

  const displayContacts = showAllContacts ? groupContacts : groupContacts?.slice(0, 3);
  const hasMoreContacts = groupContacts && groupContacts.length > 3;

  if (isLoadingGroupContacts) {
    return (
      <div className="flex items-center space-x-2 text-sm text-purple-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading contacts...</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Contact count and add button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-purple-500" />
          <span className="text-sm text-purple-700">
            {groupContacts?.length || 0} contact{groupContacts?.length === 1 ? "" : "s"}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAddContactDialogOpen(true)}
          className="h-7 px-2 text-xs text-purple-600 hover:text-purple-700 border-purple-200 hover:bg-purple-50"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add
        </Button>
      </div>

      {/* Contacts list */}
      {groupContacts && groupContacts.length > 0 ? (
        <div className="space-y-2">
          {displayContacts?.map((contact: Contact) => (
            <div
              key={contact.id}
              className="flex items-center justify-between bg-purple-50 p-2 rounded-md hover:bg-purple-100 transition-colors"
            >
              <div className="flex items-center space-x-2 min-w-0 flex-1">
                <div className="h-6 w-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-purple-600">
                    {contact.first_name?.[0]}{contact.last_name?.[0]}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-purple-900 truncate">
                    {contact.first_name} {contact.last_name}
                  </div>
                  {contact.email && (
                    <div className="text-xs text-purple-600 truncate">
                      {contact.email}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleRemoveContact(contact.id)}
                className="flex-shrink-0 p-1 hover:bg-purple-200 rounded-full transition-colors"
                disabled={removeContactMutation.isLoading}
              >
                {removeContactMutation.isLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin text-purple-400" />
                ) : (
                  <X className="h-3 w-3 text-purple-400 hover:text-purple-600" />
                )}
              </button>
            </div>
          ))}

          {/* Show more/less toggle */}
          {hasMoreContacts && (
            <button
              onClick={() => setShowAllContacts(!showAllContacts)}
              className="text-xs text-purple-600 hover:text-purple-700 font-medium transition-colors"
            >
              {showAllContacts ? 'Show less' : `Show ${groupContacts.length - 3} more`}
            </button>
          )}
        </div>
      ) : (
        <div className="text-center py-4 text-purple-500">
          <UserPlus className="h-8 w-8 mx-auto mb-2 text-purple-300" />
          <p className="text-sm">No contacts in this group</p>
          <p className="text-xs text-purple-400">Add contacts to get started</p>
        </div>
      )}

      {/* Add contact dialog */}
      <Dialog open={isAddContactDialogOpen} onOpenChange={setIsAddContactDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Add Contact to {groupName}
            </DialogTitle>
            <DialogDescription>
              Select a contact to add to this group.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Select Contact</label>
              <Select
                value={selectedContactId}
                onValueChange={setSelectedContactId}
                disabled={isLoadingAllContacts || !availableContacts?.length}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    isLoadingAllContacts 
                      ? "Loading contacts..." 
                      : !availableContacts?.length 
                        ? "No contacts available" 
                        : "Select a contact"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {availableContacts?.map((contact) => (
                    <SelectItem key={contact.id} value={contact.id}>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-xs text-gray-600">
                            {contact.first_name?.[0]}{contact.last_name?.[0]}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">
                            {contact.first_name} {contact.last_name}
                          </div>
                          {contact.email && (
                            <div className="text-xs text-gray-500">{contact.email}</div>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddContactDialogOpen(false);
                setSelectedContactId("");
                setError(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddContact}
              disabled={!selectedContactId || addContactMutation.isLoading}
            >
              {addContactMutation.isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Contact"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
