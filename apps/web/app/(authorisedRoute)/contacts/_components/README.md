# Contact Management Forms - LLM-First Design

This directory contains redesigned contact management forms optimized for LLM integration and modern UX patterns.

## Overview

The contact management system has been refactored from a single `UnifiedContactForm` into three specialized components, each optimized for its specific use case:

1. **NewContactForm** - Essential field capture with LLM enhancement
2. **ViewContactForm** - Dynamic information display with AI insights  
3. **EditContactForm** - Comprehensive editing with progressive disclosure

## Components

### 1. NewContactForm (Priority 1)

**File**: `NewContactForm.tsx`
**Purpose**: Quick capture for essential contact information with LLM enhancement readiness.

#### Key Features:
- Focus on essential fields: fullName, email, phone, companyName, jobTitle
- Optional group assignment with AI classification fallback
- LLM enhancement integration ready
- AI-powered data connection ready
- Voice input friendly design
- Smart field grouping and progressive disclosure

#### Usage:
```tsx
import { NewContactForm } from './_components/NewContactForm';

// Basic usage
<NewContactForm />

// With success callback
<NewContactForm onSuccess={(contactId) => router.push(`/contacts/${contactId}`)} />
```

#### Design Principles:
- Minimal and intuitive interface
- Does not overwhelm new users
- Ready for voice input integration
- Optimized for AI-driven data enrichment workflows

### 2. ViewContactForm (Priority 2 - Most Important)

**File**: `ViewContactForm.tsx`  
**Purpose**: Dynamic contact information display with layered information approach.

#### Key Features:
- Hero section with avatar, name, company, group badges
- Quick action buttons (email, phone, AI chat, edit, delete)
- AI-generated summaries and insights section
- Context-aware collapsible information sections
- Wellness tracking for applicable contacts
- Mobile-responsive with progressive disclosure

#### Usage:
```tsx
import { ViewContactForm } from './_components/ViewContactForm';

<ViewContactForm contactId={contactId} />
```

#### Information Architecture:
- **Hero Section**: Key contact info, avatar, group badges, quick actions
- **AI Summary**: LLM-generated insights and communication preferences
- **Notes Section**: Case notes with inline editing
- **Sidebar**: Quick actions and collapsible detailed information

### 3. EditContactForm (Priority 3)

**File**: `EditContactForm.tsx`
**Purpose**: Comprehensive contact editing with organized field access.

#### Key Features:
- Essential information always visible (name, email, phone, groups, notes)
- Collapsible sections for detailed fields
- Image upload integration
- Tag input components with add/remove functionality
- Smart form sections that show/hide based on contact type
- Progressive disclosure with clear section headers

#### Usage:
```tsx
import { EditContactForm } from './_components/EditContactForm';

<EditContactForm contactId={contactId} />
```

#### Form Sections:
1. **Essential Information** (Always visible)
   - Profile photo, name, email, phone, company, job title
   - Group assignments, notes
2. **Professional Details** (Collapsible)
   - Website, source, referral source, relationship status
3. **Address Information** (Collapsible)
   - Street, city, postal code, country
4. **Wellness Journey** (Collapsible)
   - Status, journey stage, client since, wellness goals
5. **Tags & Social Media** (Collapsible)
   - Tags, social handles with tag input components
6. **System Information** (Collapsible)
   - Last contacted, system fields

## Shared Components & Constants

### Contact Groups System

**File**: `lib/constants/contact-groups.ts`

Defines the contact group system with lifecycle-based organization:

```tsx
import { CONTACT_GROUPS, isClientGroup, getGroupBadgeVariant } from '@/lib/constants/contact-groups';

// Available groups
const groups = CONTACT_GROUPS;
// {
//   newly_interested: 'Newly Interested',
//   new_clients: 'New Clients', 
//   core_clients: 'Core Clients',
//   reconnection: 'Reconnection',
//   inner_circle: 'Inner Circle',
//   ambassadors: 'Ambassadors',
//   collaboration_partners: 'Collaboration Partners'
// }

// Check if group represents paying client
const isClient = isClientGroup('core_clients'); // true

// Get appropriate badge variant
const variant = getGroupBadgeVariant('core_clients'); // 'default'
```

### Updated tRPC Router

The contact router (`lib/trpc/routers/contact.ts`) has been updated to support all contact fields:

```tsx
// New fields supported in contactInputSchema:
- groups: z.array(z.string()).optional()
- tags: z.array(z.string()).optional()
- socialHandles: z.array(z.string()).optional()
- wellnessGoals: z.array(z.string()).optional()
- website: z.string().url().optional().nullable()
- addressStreet, addressCity, addressPostalCode, addressCountry
- referralSource, relationshipStatus
- wellnessStatus, wellnessJourneyStage, clientSince
```

## Page Integration

The forms are integrated into the Next.js app router pages:

```tsx
// app/(authorisedRoute)/contacts/new/page.tsx
export default async function NewContactPage() {
  return <NewContactForm />;
}

// app/(authorisedRoute)/contacts/[contactId]/page.tsx  
export default async function ContactDetailPage({ params }) {
  const { contactId } = await params;
  return <ViewContactForm contactId={contactId} />;
}

// app/(authorisedRoute)/contacts/[contactId]/edit/page.tsx
export default async function EditContactPage({ params }) {
  const { contactId } = await params;  
  return <EditContactForm contactId={contactId} />;
}
```

## LLM Integration Points

The forms are designed with several LLM integration points:

### 1. New Contact Enhancement
- **Profile Photo Auto-fetch**: Based on name and company
- **Company Enrichment**: Automatically populate company details
- **Group Classification**: AI suggests appropriate contact group
- **Duplicate Detection**: Smart matching against existing contacts

### 2. Contact Insights (View Form)
- **Relationship Summary**: AI-generated analysis of interaction history
- **Communication Preferences**: Learned patterns from past interactions
- **Next Steps Suggestions**: AI-recommended follow-up actions
- **Scheduling Factors**: Best times to contact based on patterns

### 3. Smart Form Assistance (Edit Form)
- **Field Auto-completion**: Suggest values based on similar contacts
- **Data Validation**: AI-powered validation of addresses, phone numbers
- **Tag Suggestions**: Recommend relevant tags based on contact profile
- **Wellness Goal Recommendations**: Suggest goals based on client type

## Design System Components Used

The forms utilize ShadCN UI components for consistency:

- **Layout**: Card, CardHeader, CardContent, Separator
- **Forms**: Input, Label, Textarea, Select, Button
- **Data Display**: Badge, Avatar, Collapsible
- **Feedback**: Alert, Loading states, Validation messages
- **Navigation**: Tabs, Breadcrumbs
- **Interactive**: Dialog, DropdownMenu, Tooltip

## Accessibility Features

- Proper ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatible
- Focus management
- Color contrast compliance
- Semantic HTML structure

## Mobile Responsiveness

All forms are designed mobile-first with:
- Responsive grid layouts
- Touch-friendly button sizes
- Collapsible sections on smaller screens
- Optimized image upload for mobile cameras
- Swipe gestures for navigation

## Performance Considerations

- Lazy loading of non-essential sections
- Optimized image handling with Next.js Image
- Efficient API calls with tRPC
- Form validation without unnecessary re-renders
- Progressive enhancement approach

## Future Enhancements

The architecture supports future AI-driven features:
- Voice input for form fields
- Natural language contact queries
- Automatic relationship mapping
- Smart notification timing
- Predictive contact scoring
- Automated follow-up scheduling

## Migration from UnifiedContactForm

To migrate from the old unified approach:

1. Replace page imports:
```tsx
// Old
import { UnifiedContactForm } from './_components/UnifiedContactForm';
<UnifiedContactForm contactId={id} mode="view" />

// New  
import { ViewContactForm } from './_components/ViewContactForm';
<ViewContactForm contactId={id} />
```

2. Update tRPC calls to include new fields
3. Import contact groups from shared constants
4. Test LLM integration points

The old `UnifiedContactForm` can remain during transition period.