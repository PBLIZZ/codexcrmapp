// apps/web/app/groups/[groupId]/page.tsx
// Server component for group-specific contacts view
// Authentication handled by middleware
import { ContactsView } from '@/app/contacts/ContactsView';

interface GroupDetailPageProps {
  params: Promise<{ groupId: string }>;
}

export default async function GroupDetailPage(
  props: GroupDetailPageProps,
) {
  const params = await props.params;
  // Render the contacts view pre-filtered to the given group
  return <ContactsView initialGroupId={params.groupId} />;
}
