# Naming Convention Validation Report

## Executive Summary

This report analyzes **133** TypeScript React component files across the CodexCRM monorepo for compliance with established naming conventions. The analysis prioritizes business-critical components and core navigation elements.

### Validation Results

- ✅ **Valid Files**: 124 (93.2%)
- ❌ **Violations**: 9 (6.8%)

### Violation Severity Breakdown

| Impact Level | Count | Percentage |
|--------------|-------|------------|
| 🔴 Critical | 0 | 0.0% |
| 🟡 High | 0 | 0.0% |
| 🟠 Medium | 1 | 0.8% |
| 🟢 Low | 8 | 6.0% |

## Naming Convention Standards

### Expected Patterns

1. **React Components**: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
2. **Next.js Pages**: `page.tsx` (App Router convention)
3. **Next.js Layouts**: `layout.tsx` (App Router convention)
4. **UI Components**: `kebab-case.tsx` (shadcn/ui convention for primitives)

### Validation Regex

Components are validated against: `^[A-Z][a-zA-Z0-9]*\.tsx$`

## 🚨 Naming Convention Violations

The following files violate established naming conventions and require immediate attention:

### 🟠 MEDIUM Impact Violations (1)

| File Path | Current Name | Expected Pattern | Violation Type | App Section |
|-----------|--------------|------------------|----------------|-------------|
| `./apps/web/app/contacts/form-components.tsx` | `form-components.tsx` | `PascalCase.tsx` | kebab-case in non-UI component | Contacts |

### 🟢 LOW Impact Violations (8)

| File Path | Current Name | Expected Pattern | Violation Type | App Section |
|-----------|--------------|------------------|----------------|-------------|
| `./apps/web/components/nav-main.tsx` | `nav-main.tsx` | `PascalCase.tsx` | kebab-case in non-UI component | Other |
| `./apps/web/components/nav-projects.tsx` | `nav-projects.tsx` | `PascalCase.tsx` | kebab-case in non-UI component | Other |
| `./apps/web/components/nav-user.tsx` | `nav-user.tsx` | `PascalCase.tsx` | kebab-case in non-UI component | Other |
| `./apps/web/components/team-switcher.tsx` | `team-switcher.tsx` | `PascalCase.tsx` | kebab-case in non-UI component | Other |
| `./apps/web/app/providers.tsx` | `providers.tsx` | `PascalCase.tsx` | lowercase filename | Other |
| `./apps/web/app/providers-client.tsx` | `providers-client.tsx` | `PascalCase.tsx` | kebab-case in non-UI component | Other |
| `./apps/web/provider.tsx` | `provider.tsx` | `PascalCase.tsx` | lowercase filename | Other |
| `./apps/web/app/global-error.tsx` | `global-error.tsx` | `PascalCase.tsx` | kebab-case in non-UI component | Other |

## ✅ Compliant Files Summary

The following 124 files follow proper naming conventions:

### By Application Section

#### Layout (20 files)

| File Path | Pattern Used |
|-----------|-------------|
| `./apps/web/components/layout/MainLayout.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/components/layout/AppContent.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/components/layout/AppSidebarController.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/components/layout/MainSectionNav.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/components/layout/Header.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/components/layout/MobileMenu.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/components/layout/UserNav.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/components/layout/SidebarNavLink.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/components/layout/SidebarGroupLink.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/components/layout/ProjectLinksNav.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/components/layout/QuickLinksNav.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/components/layout/sidebars/DashboardSidebar.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/components/layout/sidebars/ContactsSidebar.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/components/layout/sidebars/TasksSidebar.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/components/layout/sidebars/MessagesSidebar.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/components/layout/sidebars/CalendarSidebar.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/components/layout/sidebars/MarketingSidebar.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/components/layout/sidebars/AnalyticsSidebar.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/components/layout/sidebars/SettingsSidebar.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/components/layout/OmniBotFloat.tsx` | PascalCase.tsx (React component convention) |

#### Other (9 files)

| File Path | Pattern Used |
|-----------|-------------|
| `./apps/web/app/layout.tsx` | layout.tsx (Next.js convention) |
| `./apps/web/app/(auth)/log-in/page.tsx` | page.tsx (Next.js convention) |
| `./apps/web/app/(auth)/sign-up/page.tsx` | page.tsx (Next.js convention) |
| `./apps/web/app/(auth)/sign-up/confirmation/page.tsx` | page.tsx (Next.js convention) |
| `./apps/web/app/(auth)/forgot-password/page.tsx` | page.tsx (Next.js convention) |
| `./apps/web/app/(auth)/reset-password/page.tsx` | page.tsx (Next.js convention) |
| `./apps/web/app/(auth)/reset-password/ResetPasswordContent.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/components/SupabaseProvider.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/app/page.tsx` | page.tsx (Next.js convention) |

#### Dashboard (10 files)

| File Path | Pattern Used |
|-----------|-------------|
| `./apps/web/app/dashboard/DashboardClient.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/app/dashboard/DashboardContent.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/app/dashboard/components/DashboardWidgets.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/components/dashboard/business-metrics/BusinessMetricsCard.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/components/dashboard/calendar-preview/CalendarPreview.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/components/dashboard/quick-actions/QuickActions.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/components/dashboard/ai-client-insights/AiClientInsights.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/components/dashboard/ai-task-panel/AiTaskPanel.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/components/dashboard/daily-inspiration/DailyInspirationCard.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/components/dashboard/therapist-check-in/TherapistCheckIn.tsx` | PascalCase.tsx (React component convention) |

#### Contacts (28 files)

| File Path | Pattern Used |
|-----------|-------------|
| `./apps/web/app/contacts/ContactForm.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/app/contacts/ContactsContent.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/app/contacts/ContactsMainContent.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/app/contacts/ContactsLayout.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/app/contacts/ContactList.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/app/contacts/EnhancedContactList.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/app/contacts/ContactsTable.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/app/contacts/ContactsTableClient.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/app/contacts/ColumnSelector.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/app/contacts/ContactGroupManager.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/app/contacts/ContactGroupTags.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/app/contacts/[contactId]/ContactDetailView.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/app/contacts/[contactId]/ContactGroupsSection.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/app/contacts/[contactId]/ContactTimeline.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/app/contacts/groups/ContactGroupsPage.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/app/contacts/groups/GroupContactsList.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/app/contacts/groups/GroupsContent.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/components/contacts/ContactsTable.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/components/contacts/ContactsWidgets.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/components/contacts/AddContactModal.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/app/contacts/page.tsx` | page.tsx (Next.js convention) |
| `./apps/web/app/contacts/new/page.tsx` | page.tsx (Next.js convention) |
| `./apps/web/app/contacts/import/page.tsx` | page.tsx (Next.js convention) |
| `./apps/web/app/contacts/import/csv-upload-test/page.tsx` | page.tsx (Next.js convention) |
| `./apps/web/app/contacts/[contactId]/page.tsx` | page.tsx (Next.js convention) |
| `./apps/web/app/contacts/[contactId]/edit/page.tsx` | page.tsx (Next.js convention) |
| `./apps/web/app/contacts/groups/page.tsx` | page.tsx (Next.js convention) |
| `./apps/web/app/contacts/groups/[groupId]/page.tsx` | page.tsx (Next.js convention) |

#### Groups (3 files)

| File Path | Pattern Used |
|-----------|-------------|
| `./apps/web/components/groups/CreateGroupDialog.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/components/groups/BulkContactSelector.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/components/groups/QuickCreateGroupButton.tsx` | PascalCase.tsx (React component convention) |

#### Tasks (14 files)

| File Path | Pattern Used |
|-----------|-------------|
| `./apps/web/app/tasks/TaskBoard.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/app/tasks/TaskDetailView.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/app/tasks/TaskCard.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/app/tasks/TaskColumn.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/app/tasks/TaskForm.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/app/tasks/TasksTableClient.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/app/tasks/BreadcrumbNavigation.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/app/tasks/CategoryViews.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/app/tasks/DraggableTaskList.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/app/tasks/KeyboardShortcuts.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/app/tasks/ThingsTaskCard.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/app/tasks/VirtualizedTaskList.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/components/tasks/TasksWidgets.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/app/tasks/page.tsx` | page.tsx (Next.js convention) |

#### UI Components (30 files)

| File Path | Pattern Used |
|-----------|-------------|
| `./apps/web/components/ui/calendar.tsx` | kebab-case.tsx (shadcn UI convention) |
| `./apps/web/components/ui/alert.tsx` | kebab-case.tsx (shadcn UI convention) |
| `./apps/web/components/ui/avatar.tsx` | kebab-case.tsx (shadcn UI convention) |
| `./apps/web/components/ui/avatar-image.tsx` | kebab-case.tsx (shadcn UI convention) |
| `./apps/web/components/ui/badge.tsx` | kebab-case.tsx (shadcn UI convention) |
| `./apps/web/components/ui/breadcrumb.tsx` | kebab-case.tsx (shadcn UI convention) |
| `./apps/web/components/ui/button.tsx` | kebab-case.tsx (shadcn UI convention) |
| `./apps/web/components/ui/card.tsx` | kebab-case.tsx (shadcn UI convention) |
| `./apps/web/components/ui/carousel.tsx` | kebab-case.tsx (shadcn UI convention) |
| `./apps/web/components/ui/checkbox.tsx` | kebab-case.tsx (shadcn UI convention) |
| `./apps/web/components/ui/collapsible.tsx` | kebab-case.tsx (shadcn UI convention) |
| `./apps/web/components/ui/command.tsx` | kebab-case.tsx (shadcn UI convention) |
| `./apps/web/components/ui/dialog.tsx` | kebab-case.tsx (shadcn UI convention) |
| `./apps/web/components/ui/dropdown-menu.tsx` | kebab-case.tsx (shadcn UI convention) |
| `./apps/web/components/ui/form.tsx` | kebab-case.tsx (shadcn UI convention) |
| `./apps/web/components/ui/input.tsx` | kebab-case.tsx (shadcn UI convention) |
| `./apps/web/components/ui/label.tsx` | kebab-case.tsx (shadcn UI convention) |
| `./apps/web/components/ui/popover.tsx` | kebab-case.tsx (shadcn UI convention) |
| `./apps/web/components/ui/select.tsx` | kebab-case.tsx (shadcn UI convention) |
| `./apps/web/components/ui/separator.tsx` | kebab-case.tsx (shadcn UI convention) |
| `./apps/web/components/ui/sheet.tsx` | kebab-case.tsx (shadcn UI convention) |
| `./apps/web/components/ui/sidebar.tsx` | kebab-case.tsx (shadcn UI convention) |
| `./apps/web/components/ui/skeleton.tsx` | kebab-case.tsx (shadcn UI convention) |
| `./apps/web/components/ui/sonner.tsx` | kebab-case.tsx (shadcn UI convention) |
| `./apps/web/components/ui/table.tsx` | kebab-case.tsx (shadcn UI convention) |
| `./apps/web/components/ui/tabs.tsx` | kebab-case.tsx (shadcn UI convention) |
| `./apps/web/components/ui/textarea.tsx` | kebab-case.tsx (shadcn UI convention) |
| `./apps/web/components/ui/tooltip.tsx` | kebab-case.tsx (shadcn UI convention) |
| `./apps/web/components/ui/csv-upload.tsx` | kebab-case.tsx (shadcn UI convention) |
| `./apps/web/components/ui/image-upload.tsx` | kebab-case.tsx (shadcn UI convention) |

#### Marketing (8 files)

| File Path | Pattern Used |
|-----------|-------------|
| `./apps/web/app/marketing/components/widgets/ContentCalendar.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/app/marketing/components/MarketingWidgets.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/app/marketing/components/widgets/CreatorStudio.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/app/marketing/components/widgets/EmailMarketing.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/app/marketing/components/widgets/LeadMagnetStudio.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/app/marketing/components/widgets/MembershipLoyalty.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/app/marketing/components/widgets/QuizCreator.tsx` | PascalCase.tsx (React component convention) |
| `./apps/web/app/marketing/page.tsx` | page.tsx (Next.js convention) |

#### OmniBot (1 files)

| File Path | Pattern Used |
|-----------|-------------|
| `./apps/web/components/omni-bot/OmniBot.tsx` | PascalCase.tsx (React component convention) |

#### Authentication (1 files)

| File Path | Pattern Used |
|-----------|-------------|
| `./apps/web/components/auth/OneTapComponent.tsx` | PascalCase.tsx (React component convention) |

## Recommendations

### Immediate Actions Required

1. **Address Critical Violations**: Fix all critical impact violations immediately as they affect core app functionality
2. **High Priority Fixes**: Resolve high impact violations in layout and navigation components
3. **Standardization**: Implement consistent PascalCase naming for all React components
4. **Exception Documentation**: Document valid exceptions (page.tsx, layout.tsx, kebab-case UI primitives)

### Implementation Strategy

1. **Phase 1**: Fix critical and high impact violations first
2. **Phase 2**: Address medium impact violations in business logic components
3. **Phase 3**: Clean up low impact violations for consistency

### Automated Prevention

Consider implementing:
- ESLint rules for file naming conventions
- Pre-commit hooks to validate naming patterns
- CI/CD checks for naming compliance

---

*Report generated on 2025-06-15T16:58:21.001Z for Task #286*
*Total files analyzed: 133 | Compliance rate: 93.2%*
