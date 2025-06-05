import { Pattern1Kanban } from './Pattern1Kanban';

/**
 * Server component for the /contacts/pattern1 route.
 * Renders the Kanban view for Pattern 1 (Inbox + Groups).
 */
export default function ContactPattern1Page() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Kanban View (Pattern 1)</h2>
      <Pattern1Kanban />
    </div>
  );
}
