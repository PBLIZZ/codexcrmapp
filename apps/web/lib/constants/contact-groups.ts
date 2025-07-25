/**
 * Contact Groups System
 *
 * This system organizes contacts into lifecycle-based groups for better relationship management.
 * Groups fall into two main categories:
 * - Client Groups: For paying customers and wellness clients
 * - Business Groups: For professional connections and partnerships
 */

export const CONTACT_GROUPS = {
  // Client Lifecycle Groups (for paying customers)
  newly_interested: 'Newly Interested',
  new_clients: 'New Clients',
  core_clients: 'Core Clients',
  inner_circle: 'Inner Circle',

  // Business/Professional Groups
  reconnection: 'Reconnection',
  ambassadors: 'Ambassadors',
  collaboration_partners: 'Collaboration Partners',
} as const;

export type ContactGroupKey = keyof typeof CONTACT_GROUPS;
export type ContactGroupLabel = (typeof CONTACT_GROUPS)[ContactGroupKey];

/**
 * Determines if a group represents a paying client relationship
 */
export const isClientGroup = (groupKey: string): boolean => {
  const clientGroups: ContactGroupKey[] = [
    'newly_interested',
    'new_clients',
    'core_clients',
    'inner_circle',
  ];
  return clientGroups.includes(groupKey as ContactGroupKey);
};

/**
 * Gets the appropriate badge variant for a group
 */
export const getGroupBadgeVariant = (groupKey: string): 'default' | 'secondary' => {
  return isClientGroup(groupKey) ? 'default' : 'secondary';
};

/**
 * Array of all group keys for iteration
 */
export const CONTACT_GROUP_KEYS = Object.keys(CONTACT_GROUPS) as ContactGroupKey[];

/**
 * Group descriptions for tooltips and help text
 */
export const CONTACT_GROUP_DESCRIPTIONS = {
  newly_interested: 'Prospects who have shown initial interest in your services',
  new_clients: 'Recently onboarded clients (first 90 days)',
  core_clients: 'Established clients with ongoing engagement',
  inner_circle: 'Your most valued clients and close relationships',
  reconnection: 'Past clients or contacts for re-engagement',
  ambassadors: 'Advocates who refer others to your business',
  collaboration_partners: 'Professional partners and collaborators',
} as const satisfies Record<ContactGroupKey, string>;
