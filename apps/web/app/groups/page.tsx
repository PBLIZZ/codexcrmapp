import { GroupsContent } from "./GroupsContent";

/**
 * Server component for the Groups page.
 * Authentication is handled by middleware.
 */
export default async function GroupsPage() {
  return <GroupsContent />;
}
