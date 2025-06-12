PRD: MainLayout Component Architecture Refactor
Version: 1.3
Status: Finalized
Author: AI Assistant & Peter James Blizzard
Date: June 11, 2025
Goal: Decompose the monolithic MainLayout.tsx into a modular, maintainable, and scalable application shell architecture, featuring a new floating AI assistant UI.
1. Overview & Problem Statement
The current MainLayout.tsx and its closely-related Navbar.tsx have absorbed too many responsibilities, including global navigation, contextual sidebar rendering, state management, and complex UI logic. This makes the layout difficult to maintain and extend. This initiative will refactor these components into a clean "skeleton" that delegates responsibilities to specialized, single-responsibility child components.
2. Goals & Objectives
Decompose Header Logic: Refactor the oversized Navbar.tsx into a clean Header.tsx and a separate MobileMenu.tsx.
Decouple Sidebar Logic: Create a controller to manage which contextual sidebar is displayed.
Centralize Shared Components: Ensure global elements like UserNav are reusable and placed correctly.
Implement Floating AI Sidebar UI: Create a floating action button that reveals the OmniBot interface in a floating sidebar panel.
Simplify MainLayout.tsx: Strip the main layout down to a pure structural component.
3. Scope & Requirements (Sequenced for Task Parsing)
Task Group 1: Refactor the Header & Navigation
REQ-1.1 (Task 1): Create Dedicated MobileMenu Component
Description: Create a new MobileMenu.tsx component by extracting the mobile Sheet-based navigation logic from the existing Navbar.tsx.
Details:
The new component will contain the <Sheet>, <SheetTrigger>, and <SheetContent>.
All JSX related to the mobile slide-out panel, its logo, and its navigation links must be moved here.
The mainNavItems constant should be co-located within this file for now.
REQ-1.2 (Task 2): Refactor Navbar.tsx into Header.tsx
Description: Rename Navbar.tsx to Header.tsx and refactor it to be the primary desktop header, delegating mobile concerns to the new MobileMenu component.
Details:
Rename the file apps/web/components/layout/Navbar.tsx to Header.tsx.
Update the component's function name from Navbar to Header.
Remove all the mobile Sheet JSX that was extracted in the previous task.
Import and render the new <MobileMenu /> component in the appropriate position (typically on the far left).
The component will now be responsible for the overall header layout, the desktop logo, the centered desktop navigation links, and the right-aligned user action icons (Settings, User Profile Dropdown).
Task Group 2: Create Reusable Global & Sidebar Components
REQ-2.1 (Task 3): Implement Floating OmniBot UI (OmniBotFloat.tsx)
Description: Create a new component OmniBotFloat.tsx that provides a floating action button (FAB) to trigger the AI assistant sidebar.
Details:
It will contain a circular FAB with a Bot icon, fixed to the bottom-right of the viewport.
The FAB will be a <SheetTrigger> that opens a <SheetContent> panel.
The <SheetContent> must be styled to appear as a floating panel on the right (with margin, rounded corners, shadow, and a defined size), not a full-height slide-out.
The panel will house the existing <OmniBot /> component.
REQ-2.2 (Task 4): Create Shared UserNav Component
Description: Create or isolate a UserNav.tsx component that displays the current user's avatar and name/email.
Details:
It must use the useAuth() hook to fetch user data.
It will be a self-contained unit, ready to be placed at the bottom of any sidebar.
REQ-2.3 (Task 5): Create AppSidebarController Component
Description: Create a new AppSidebarController.tsx component to manage the display of contextual sidebars.
Details:
It must use the usePathname hook to determine the current route.
It will contain the if/else or switch logic to decide which sidebar to render (e.g., ContactsSidebar, TasksSidebar).
REQ-2.4 (Task 6): Update Individual Sidebar Components
Description: Refactor at least one existing sidebar (e.g., ContactsSidebar.tsx) to conform to the new pattern.
Details:
Ensure the sidebar is a self-contained component with its specific links.
It must import and render the <UserNav /> component at the bottom of its layout.
Task Group 3: Finalize the MainLayout Integration
REQ-3.1 (Task 7): Simplify MainLayout.tsx to a Skeleton
Description: The final step. Strip MainLayout.tsx down to its essential structural role, integrating all the new components.
Details:
Remove all state management, helper functions, and complex JSX that has been moved to other components.
The component's return statement should define the primary page grid.
It must import and render the new <Header />, <AppSidebarController />, and <OmniBotFloat /> components in their correct layout positions.
4. Success Metrics
Navbar.tsx no longer exists; it has been replaced by a cleaner Header.tsx and MobileMenu.tsx.
MainLayout.tsx is significantly reduced in complexity and contains no complex logic.
A floating action button opens the OmniBot interface in a styled, floating panel.
Contextual sidebars render correctly, and each contains the UserNav component.
The application is fully functional with no regressions.
The new component structure is modular and easy to navigate.