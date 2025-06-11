# CodexCRM Refactoring PRD: Next-Generation Wellness Professional Platform

## Project Overview

CodexCRM is being refactored to create a next-generation CRM platform specifically designed for wellness professionals, prioritizing emotional intelligence in client relationships through AI-augmented workflows. This document outlines the architectural and UI/UX requirements for transforming the application into a more intuitive, visually appealing, and AI-integrated platform while maintaining the existing technology stack.

## Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS, Shadcn UI components
- **Backend**: tRPC, Supabase
- **AI Integration**: LLM-powered assistant, background processing
- **Third-Party Integration**: MCP clients for Google, Calendly, MailChimp, etc.

## Key Goals

1. Create an intuitive, visually appealing UI/UX for wellness practitioners
2. Implement a foundational AI layer for contact enrichment and natural language commands
3. Refactor the database schema to support current and future AI-powered features
4. Enable third-party integrations via MCP clients
5. Organize components within the monorepo structure for maintainability

## Core Modules

### 1. Dashboard Module

The dashboard serves as the practitioner's "second brain," providing an at-a-glance view of their business metrics and upcoming activities.

**Key Features:**
- Business health visualization cards (upcoming sessions, retention risks)
- Referral network visualization (placeholder for future implementation)
- Goal progress tracking (retreats, workshops, conversions)
- AI task delegation panel with approval workflow
- Wellness-specific metrics display

**UI Components:**
- Metric cards with visual indicators
- AI suggestion inbox
- Calendar integration preview
- Quick action buttons

### 2. Contact Relationship Hub

The contact module transforms the traditional contact list into an immersive client relationship management tool focused on building stronger connections.

**Key Features:**
- Enhanced contact list with customizable columns and bulk actions
- Detailed contact cards with wellness journey timelines
- Session history with note-taking capabilities
- Client-submitted media integration (placeholder)
- Referral tracking and visualization
- AI-powered relationship insights

**UI Components:**
- Filterable contact table with action buttons
- Contact detail cards with tabbed interface
- Timeline visualization
- Group management interface
- Quick email/message composers

### 3. Task Management System

A drag-and-drop task organization system with AI-suggested tasks categorized by business area.

**Key Features:**
- Simple, intuitive task board with drag-and-drop functionality
- AI-suggested tasks with approval workflow
- Category-based organization (marketing, client follow-up, etc.)
- Task prioritization based on business impact

**UI Components:**
- Task board with column layout
- Task cards with priority indicators
- Category filters
- AI suggestion interface

### 4. AI Assistant Integration

An AI co-pilot that assists with everyday CRM operations through natural language processing.

**Key Features:**
- Global chat interface accessible from any page
- Natural language command processing
- tRPC procedure mapping for executing CRM actions
- Contact enrichment background processing
- Email draft generation and assistance

**UI Components:**
- Persistent chat bubble/button
- Chat interface with message history
- Command suggestion chips
- Approval workflow for critical actions

### 5. Contextual Navigation System

A dynamic navigation system that adapts to the user's current context within the application.

**Key Features:**
- Global navigation in the top bar
- Context-specific sidebars for each module
- Quick action buttons relevant to current view
- Recent items and favorites access

**UI Components:**
- Top navigation bar
- Module-specific sidebars
- Quick action button groups
- AI assistant access point

## Database Schema Enhancements

### Contacts Table Restructuring
- Core contact data in the main contacts table
- Extended profile information in contact_profiles
- Session and interaction history in dedicated tables
- Support for enrichment data and AI insights

### AI Actions Table
- Track AI-generated suggestions
- Maintain approval status
- Store feedback for model improvement

### Notes and Sessions Tables
- Structured format for session notes
- Support for AI analysis and tagging
- Linkage to contact timeline

## Integration Requirements

### MCP Client Architecture
- Google services integration (Calendar, Contacts, Gmail) Two Way Sync (Read/Write) 
- Email service integration (Gmail, MailChimp, custom SMTP, SendGrid)
- WhatsApp/Twilio for messaging
- Social Media Integration (Instagram, Facebook, LinkedIn)

### Authentication and User Management
- Enhanced user profiles for practitioners
- Subscription management capabilities
- Settings for AI assistant preferences

## Implementation Phases

### Phase 1: Database Refactoring and Schema Enhancement
- Update Supabase schema to support new features
- Create relationships between tables
- Implement proper indexing for performance

### Phase 2: UI Component Development
- Create reusable UI components for each module
- Implement module-specific layouts
- Develop contextual navigation system

### Phase 3: AI Integration Foundation
- Implement basic chat interface
- Create background enrichment processes
- Develop approval workflow for AI actions
- Implement AI-powered notes analysis and insights
- Implement AI-powered contact enrichment and relationship insights
- Implement AI-powered task generation and approval workflow
- Implement AI-powered email draft generation and assistance

### Phase 4: Third-Party Integration Framework
- Implement MCP client architecture
- Create integration points for key services
- Develop configuration UI for connections

### Phase 5: Advanced Visualization and Interactions
- Implement timeline visualization
- Create relationship visualization placeholders
- Develop drag-and-drop interfaces

## UI/UX Design Principles

### Wellness Aesthetic
- Color palette: Teal (primary) + Orange (accent)
- Rounded elements, generous whitespace
- Nature-inspired iconography

### Relationship-First Patterns
- Visual connection mapping
- Interaction timeline as core navigation
- Emotion-driven metrics (engagement vs. revenue)

### AI Collaboration Model
- Clear AI/human task boundaries
- Approval workflows for critical actions
- Explainable insights

## Performance Requirements

- 45-second maximum time-to-insight for new client onboarding
- Sub-100ms latency on AI-enhanced contact interactions
- Smooth transitions between UI states
- Responsive design for all device sizes

## Success Metrics

- Improved user engagement with the platform
- Reduced time spent on administrative tasks
- Increased client retention through better relationship management
- Higher adoption rate of AI-suggested actions
- Positive user feedback on the new interface

## Future Enhancements (Placeholders)

- Emotional intelligence metrics and visualization
- WebGL-powered relationship visualization engine
- Differential synchronization for offline-first wellness journaling
- AI-powered session analysis and insights
- AI-powered social media content calendar 
- AI-powered content generation and insights
