"use client";

import { Check, Search, User, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/trpc";


interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email?: string | null;
  company_name?: string | null;
  profile_image_url?: string | null;
}

interface BulkContactSelectorProps {
  groupId: string;
  groupName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function BulkContactSelector({ groupId, groupName, isOpen, onClose }: BulkContactSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);

  // Fetch all contacts
  const { data: allContacts = [], isLoading: contactsLoading } = api.contacts.list.useQuery();

  // Fetch contacts already in this group
  const { data: groupContacts = [] } = api.groups.getContacts.useQuery({ groupId });

  // Add contacts to group mutation
  const addContactsMutation = api.groups.addContact.useMutation({
    onSuccess: () => {
      toast.success(`Added ${selectedContactIds.length} contact(s) to ${groupName}`);
      setSelectedContactIds([]);
      onClose();
    },
    onError: (error) => {
      toast.error(`Failed to add contacts: ${error.message}`);
    }
  });

  // Filter contacts not already in group and by search term
  const existingContactIds = new Set(groupContacts.map((c: Contact) => c.id));
  const availableContacts = allContacts
    .filter((contact: Contact) => !existingContactIds.has(contact.id))
    .filter((contact: Contact) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        contact.first_name?.toLowerCase().includes(searchLower) ||
        contact.last_name?.toLowerCase().includes(searchLower) ||
        contact.email?.toLowerCase().includes(searchLower) ||
        contact.company_name?.toLowerCase().includes(searchLower)
      );
    }) as Contact[];

  const handleSelectContact = (contactId: string) => {
    setSelectedContactIds(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleSelectAll = () => {
    if (selectedContactIds.length === availableContacts.length) {
      setSelectedContactIds([]);
    } else {
      setSelectedContactIds(availableContacts.map(c => c.id));
    }
  };

  const handleAddContacts = async () => {
    for (const contactId of selectedContactIds) {
      await addContactsMutation.mutateAsync({
        contactId,
        groupId
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Contacts to {groupName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Select All */}
          {availableContacts.length > 0 && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                checked={selectedContactIds.length === availableContacts.length}
                onCheckedChange={handleSelectAll}
              />
              <label htmlFor="select-all" className="text-sm font-medium">
                Select All ({availableContacts.length} available)
              </label>
            </div>
          )}

          {/* Contact List */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {contactsLoading ? (
              <div className="text-center py-4">Loading contacts...</div>
            ) : availableContacts.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                {searchTerm ? "No contacts found matching your search" : "All contacts are already in this group"}
              </div>
            ) : (
              availableContacts.map((contact: Contact) => (
                <div
                  key={contact.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 ${
                    selectedContactIds.includes(contact.id) ? "bg-purple-50 border-purple-200" : ""
                  }`}
                  onClick={() => handleSelectContact(contact.id)}
                >
                  <Checkbox
                    checked={selectedContactIds.includes(contact.id)}
                    onChange={() => handleSelectContact(contact.id)}
                  />
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={contact.profile_image_url || undefined} />
                    <AvatarFallback>
                      {contact.first_name?.[0]}{contact.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">
                      {contact.first_name} {contact.last_name}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      {contact.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {contact.email}
                        </span>
                      )}
                      {contact.company_name && (
                        <span>• {contact.company_name}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAddContacts}
            disabled={selectedContactIds.length === 0 || addContactsMutation.isLoading}
            className="bg-purple-500 hover:bg-purple-600"
          >
            {addContactsMutation.isLoading ? "Adding..." : `Add ${selectedContactIds.length} Contact(s)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
