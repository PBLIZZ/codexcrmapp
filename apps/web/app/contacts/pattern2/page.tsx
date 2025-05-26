import { Pattern2TableView } from "./Pattern2TableView";

/**
 * Server component for the /contacts/pattern2 route.
 * Renders the Table view with faceted filters (Pattern 2).
 */
export default function ContactPattern2Page() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Table (Facets) View (Pattern 2)</h2>
      <Pattern2TableView />
    </div>
  );
}