import { GroupCreateForm } from '@/components/groups/GroupCreateForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function CreateGroupPage() {
  // Optional: Define a handler if navigation or other actions are needed after page-based form submission
  // For now, the form's internal onSuccess will handle toast and reset.
  // If navigation is desired, it could be passed to the form or handled here.
  // const router = useRouter();
  // const handleSuccess = () => {
  //   router.push('/contacts/groups'); // Example: Navigate to groups list after creation
  // };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/contacts/groups" className="flex items-center text-sm text-muted-foreground hover:text-primary">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Groups
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create New Group</CardTitle>
          <CardDescription>
            Fill in the details below to set up a new contact group.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Render the centralized form component */}
          {/* <GroupCreateForm onSuccess={handleSuccess} /> */}
          <GroupCreateForm />
        </CardContent>
      </Card>
    </div>
  );
}
