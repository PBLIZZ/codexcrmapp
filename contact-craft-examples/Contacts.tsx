import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@codexcrm/ui';
import { Input } from '@codexcrm/ui';
import { Label } from '@codexcrm/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@codexcrm/ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@codexcrm/ui';
import { Textarea } from '@codexcrm/ui';
import { useToast } from '@codexcrm/ui/src/hooks/use-toast';
import { Trash2, Plus, UserPlus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@codexcrm/ui';

interface Contact {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  created_at: string;
}

const Contacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    notes: '',
  });
  const { toast } = useToast();

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contacts')
        .select('id, full_name, email, phone, notes, created_at')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch contacts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.full_name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Name is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase.from('contacts').insert([
        {
          full_name: formData.full_name.trim(),
          email: formData.email.trim() || null,
          phone: formData.phone.trim() || null,
          notes: formData.notes.trim() || null,
          user_id: '00000000-0000-0000-0000-000000000000', // Temporary user ID for demo
        },
      ]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Contact added successfully',
      });

      setFormData({ full_name: '', email: '', phone: '', notes: '' });
      setIsAddingContact(false);
      fetchContacts();
    } catch (error) {
      console.error('Error adding contact:', error);
      toast({
        title: 'Error',
        description: 'Failed to add contact',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    try {
      const { error } = await supabase.from('contacts').delete().eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Contact deleted successfully',
      });

      fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete contact',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  if (loading) {
    return (
      <div className='min-h-screen bg-background p-8'>
        <div className='max-w-6xl mx-auto'>
          <div className='text-center py-12'>
            <div className='text-lg text-muted-foreground'>Loading contacts...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background p-8'>
      <div className='max-w-6xl mx-auto space-y-8'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div>
            <h1 className='text-3xl font-bold text-foreground'>MiniCRM</h1>
            <p className='text-muted-foreground'>Manage your contacts</p>
          </div>

          <Dialog open={isAddingContact} onOpenChange={setIsAddingContact}>
            <DialogTrigger asChild>
              <Button className='gap-2'>
                <UserPlus className='h-4 w-4' />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-md'>
              <DialogHeader>
                <DialogTitle>Add New Contact</DialogTitle>
                <DialogDescription>Fill in the contact details below.</DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='full_name'>Name *</Label>
                  <Input
                    id='full_name'
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder='Enter full name'
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    type='email'
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder='Enter email address'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='phone'>Phone</Label>
                  <Input
                    id='phone'
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder='Enter phone number'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='notes'>Notes</Label>
                  <Textarea
                    id='notes'
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder='Add any notes...'
                    rows={3}
                  />
                </div>

                <div className='flex gap-2 pt-4'>
                  <Button type='submit' className='flex-1'>
                    Add Contact
                  </Button>
                  <Button type='button' variant='outline' onClick={() => setIsAddingContact(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Contacts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Contacts ({contacts.length})</CardTitle>
            <CardDescription>View and manage all your contacts</CardDescription>
          </CardHeader>
          <CardContent>
            {contacts.length === 0 ? (
              <div className='text-center py-12'>
                <UserPlus className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
                <h3 className='text-lg font-medium text-foreground mb-2'>No contacts yet</h3>
                <p className='text-muted-foreground mb-4'>
                  Get started by adding your first contact.
                </p>
                <Button onClick={() => setIsAddingContact(true)} className='gap-2'>
                  <Plus className='h-4 w-4' />
                  Add Contact
                </Button>
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className='w-[50px]'></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell className='font-medium'>{contact.full_name}</TableCell>
                        <TableCell className='text-muted-foreground'>
                          {contact.email || '—'}
                        </TableCell>
                        <TableCell className='text-muted-foreground'>
                          {contact.phone || '—'}
                        </TableCell>
                        <TableCell className='text-muted-foreground max-w-xs truncate'>
                          {contact.notes || '—'}
                        </TableCell>
                        <TableCell className='text-muted-foreground'>
                          {new Date(contact.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleDelete(contact.id)}
                            className='text-destructive hover:text-destructive'
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contacts;
