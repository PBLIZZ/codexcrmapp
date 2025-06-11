'use client';

import { useQueryClient } from '@tanstack/react-query';
import { Check, AlertCircle, Loader2, Plus, User } from 'lucide-react'; // Plus might be unused here
import { useState, useEffect, FormEvent } from 'react'; // Added FormEvent

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  // DialogClose // DialogClose is usually for a manual close button inside content, not needed here
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/trpc';
import { cn } from '@/lib/utils';

interface AddContactModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onContactAdded?: () => void;
  showTriggerButton?: boolean; // New prop
  triggerButtonComponent?: React.ReactNode; // Optional: for a completely custom trigger
}

export function AddContactModal({
  open: controlledOpen,
  onOpenChange,
  onContactAdded,
  showTriggerButton = true, // Default to true
  triggerButtonComponent, // For custom trigger from parent
}: AddContactModalProps) {
  const queryClient = useQueryClient();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const setOpen = (newOpenState: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpenState);
    } else {
      setUncontrolledOpen(newOpenState);
    }
  };

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [source, setSource] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (success) {
      // Close the modal immediately after successful contact addition
      setOpen(false);
      // Resetting form is handled by the effect watching 'open' state
    }
  }, [success, setOpen]);

  // Listen for custom event to open the modal
  useEffect(() => {
    const handleOpenModal = () => {
      setOpen(true);
    };
    
    window.addEventListener('open-add-contact-modal', handleOpenModal);
    
    return () => {
      window.removeEventListener('open-add-contact-modal', handleOpenModal);
    };
  }, [setOpen]);

  useEffect(() => {
    if (!open) {
      // Delay reset to allow animations to complete
      const timer = setTimeout(() => {
        resetForm();
      }, 300); // Adjust timing if needed
      return () => clearTimeout(timer);
    }
  }, [open]);

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setSource('');
    setSuccess(false);
    setError(null);
    // setIsSubmitting(false); // Important: also reset submitting state
  };

  const addContactMutation = api.contacts.save.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts.list'] }); // Corrected invalidateQueries
      setSuccess(true);
      if (onContactAdded) {
        onContactAdded();
      }
    },
    onError: (err: any) => {
      // Catch error here
      setError(err.message || 'Failed to add contact');
      setIsSubmitting(false); // Reset submitting state on error
    },
    // onSettled: () => { // Also reset submitting state when mutation is settled
    //   setIsSubmitting(false);
    // }
  });

  async function handleAddContact(e: FormEvent) {
    // Changed to FormEvent
    e.preventDefault();
    if (success) return; // Prevent re-submission if already successful

    setIsSubmitting(true);
    setError(null); // Clear previous errors
    setSuccess(false); // Clear previous success

    // Basic client-side validation (you can add more robust validation e.g. with Zod)
    if (!fullName.trim()) {
      setError('Full name is required.');
      setIsSubmitting(false);
      return;
    }

    try {
      await addContactMutation.mutateAsync({
        full_name: fullName.trim(),
        email: email.trim() || undefined, // Send undefined if empty
        source: source.trim() || undefined, // Send undefined if empty
        // id: undefined, // Ensure no ID is sent for new contact
      });
      // Success handling is now in onSuccess of useMutation
    } catch (err: any) {
      // This catch block might not be strictly necessary if useMutation's onError handles it,
      // but it's a safeguard.
      setError(
        err.message || 'An unexpected error occurred while adding contact.'
      );
      setIsSubmitting(false);
    }
    // No finally here, as isSubmitting is handled in onSuccess/onError
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {triggerButtonComponent ? ( // If a custom trigger is passed, use it
        <DialogTrigger asChild>{triggerButtonComponent}</DialogTrigger>
      ) : showTriggerButton ? ( // Otherwise, show default trigger if enabled
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="h-auto flex flex-col items-center justify-center p-4 space-y-2"
          >
            <User className="h-6 w-6 mb-2" />
            <span>Add Contact</span>
          </Button>
        </DialogTrigger>
      ) : null}
      {/* If no trigger specified and showTriggerButton is false, no trigger is rendered by this component */}

      <DialogContent className="max-w-md w-full p-6">
        {' '}
        {/* Removed flex items-center justify-center */}
        <DialogHeader className="w-full text-center mb-4">
          <DialogTitle className="text-teal-800 text-2xl font-extrabold tracking-tight mb-2">
            Add New Contact
          </DialogTitle>
          <DialogDescription>
            <span className="text-xs text-muted-foreground">
              Enter contact details below to add them to your CRM system
            </span>
          </DialogDescription>
        </DialogHeader>
        {success &&
          !error && ( // Only show success if there's no error
            <Alert className="mb-4 bg-green-50 border-green-200">
              <Check className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Success!</AlertTitle>
              <AlertDescription className="text-green-700">
                Contact has been added successfully. Closing soon...
              </AlertDescription>
            </Alert>
          )}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {/* Hide form after success to prevent re-submission before modal closes */}
        {!success && (
          <form
            onSubmit={handleAddContact}
            className="w-full flex flex-col gap-4"
          >
            {' '}
            {/* Removed items-center justify-center */}
            <div className="flex flex-col space-y-1.5 w-full">
              <Label htmlFor="fullNameModal" className="text-sm font-medium">
                Full Name *
              </Label>
              <Input
                id="fullNameModal"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                autoFocus
                disabled={isSubmitting}
                className="w-full"
              />
            </div>
            <div className="flex flex-col space-y-1.5 w-full">
              <Label htmlFor="emailModal" className="text-sm font-medium">
                Email
              </Label>{' '}
              {/* Changed id */}
              <Input
                id="emailModal"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="w-full"
              />
            </div>
            <div className="flex flex-col space-y-1.5 w-full">
              <Label
                htmlFor="sourceModal"
                className="text-sm font-medium text-gray-700"
              >
                {' '}
                {/* Changed id */}
                How do you know this person?
              </Label>
              <Input
                id="sourceModal"
                placeholder="e.g. Met at a conference"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                disabled={isSubmitting}
                className="w-full"
              />
            </div>
            <DialogFooter className="w-full mt-4">
              <Button
                type="submit"
                className={cn(
                  'w-full font-bold shadow-md',
                  'bg-gradient-to-r from-teal-400 to-orange-500 text-white border-0 hover:from-teal-500 hover:to-orange-600 focus:ring-2 focus:ring-orange-400 focus:outline-none',
                  'h-10 px-4 py-2'
                )}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Contact...
                  </>
                ) : (
                  'Add Contact'
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
