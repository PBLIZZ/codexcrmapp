# OmniCRM Layout Flow Diagrams

## 1. Overall Application Layout Structure

```mermaid
graph TB
    subgraph "Browser Window"
        subgraph "MainLayout"
            subgraph "SidebarProvider"
                subgraph "Sidebar (Left Panel)"
                    SH[SidebarHeader<br/>Logo + Brand]
                    SC[SidebarContent<br/>AppSidebarController]
                    SF[SidebarFooter<br/>UserNav]
                end
                
                subgraph "SidebarInset (Main Area)"
                    subgraph "Header Bar"
                        ST[SidebarTrigger]
                        SEP[Separator]
                        BC[DynamicBreadcrumb]
                        FLEX[Flex Spacer]
                        MSN[MainSectionNav]
                    end
                    
                    MAIN[Main Content Area<br/>Page Components]
                end
            end
        end
    end
    
    SH --> SC
    SC --> SF
    ST --> SEP
    SEP --> BC
    BC --> FLEX
    FLEX --> MSN
```

## 2. Sidebar Controller Decision Flow

```mermaid
graph TD
    START[User Navigates] --> PATH{Get Current Pathname}
    PATH --> ASC[AppSidebarController]
    
    ASC --> D1{pathname.startsWith<br/>'/dashboard'}
    ASC --> D2{pathname.startsWith<br/>'/contacts'}
    ASC --> D3{pathname.startsWith<br/>'/tasks'}
    ASC --> D4{pathname.startsWith<br/>'/marketing'}
    ASC --> D5{pathname.startsWith<br/>'/messages'}
    ASC --> D6{pathname.startsWith<br/>'/calendar'}
    ASC --> D7{pathname.startsWith<br/>'/settings'}
    
    D1 -->|Yes| DS[DashboardSidebar]
    D2 -->|Yes| CS[ContactsSidebar]
    D3 -->|Yes| TS[TasksSidebar]
    D4 -->|Yes| MS[MarketingSidebar]
    D5 -->|Yes| MES[MessagesSidebar]
    D6 -->|Yes| CAS[CalendarSidebar]
    D7 -->|Yes| SS[SettingsSidebar]
    
    D1 -->|No| D2
    D2 -->|No| D3
    D3 -->|No| D4
    D4 -->|No| D5
    D5 -->|No| D6
    D6 -->|No| D7
    D7 -->|No| DEFAULT[Default: DashboardSidebar]
    
    DS --> RENDER[Render Selected Sidebar]
    CS --> RENDER
    TS --> RENDER
    MS --> RENDER
    MES --> RENDER
    CAS --> RENDER
    SS --> RENDER
    DEFAULT --> RENDER
```

## 3. Section-Specific Sidebar Structures

### Dashboard Sidebar Structure
```mermaid
graph TD
    subgraph "DashboardSidebar"
        DSH[Header: Logo + Brand]
        
        subgraph "Content Groups"
            QA[Quick Actions<br/>• Add Contact<br/>• Create Group<br/>• Add Task]
            BG[Business Goals<br/>• Content Calendar<br/>• Workshops<br/>• Plan Schedule]
            SCH[Schedule<br/>• Next 5 Appointments<br/>• New Appointment<br/>• Add Quick Note<br/>• See Next Free Slot]
            SET[Settings<br/>• Help<br/>• Upgrade<br/>• Contact Support<br/>• Account Settings]
            PROJ[Projects<br/>Dynamic list with progress]
        end
        
        DSF[Footer: UserNav]
    end
    
    DSH --> QA
    QA --> BG
    BG --> SCH
    SCH --> SET
    SET --> PROJ
    PROJ --> DSF
```

### Contacts Sidebar Structure
```mermaid
graph TD
    subgraph "ContactsSidebar"
        CSH[Header: Logo + Brand]
        
        subgraph "Content Groups"
            CONT[Contacts<br/>• All Contacts<br/>• Groups<br/>• Import Contacts<br/>• Add Contact]
            QAC[Quick Actions<br/>Placeholder for future actions]
            GRPS[Groups<br/>Dynamic groups list<br/>Currently: "No groups found"]
        end
        
        CSF[Footer: UserNav]
    end
    
    CSH --> CONT
    CONT --> QAC
    QAC --> GRPS
    GRPS --> CSF
```

### Tasks Sidebar Structure
```mermaid
graph TD
    subgraph "TasksSidebar"
        TSH[Header: Logo + Brand]
        
        subgraph "Content Groups"
            TM[Task Management<br/>• Dashboard<br/>• Inbox (12)<br/>• Today (5)<br/>• Upcoming<br/>• Anytime<br/>• Someday<br/>• Completed]
            QAT[Quick Actions<br/>• New Task<br/>• New Project<br/>• Quick Capture<br/>• Time Tracker]
            AP[Active Projects<br/>Dynamic list with progress bars]
            PT[Productivity<br/>• Focus Mode<br/>• Pomodoro Timer<br/>• Team Tasks<br/>• Analytics]
            TSET[Settings<br/>• Task Settings]
        end
        
        TSF[Footer: UserNav]
    end
    
    TSH --> TM
    TM --> QAT
    QAT --> AP
    AP --> PT
    PT --> TSET
    TSET --> TSF
```

### Marketing Sidebar Structure
```mermaid
graph TD
    subgraph "MarketingSidebar"
        MSH[Header: Logo + Brand]
        
        subgraph "Content Groups"
            MT[Marketing Tools<br/>• Dashboard<br/>• Campaigns (4)<br/>• Email Marketing<br/>• Social Media<br/>• Content Library<br/>• Website & SEO<br/>• Referral Program]
            CC[Create Content<br/>• New Email Campaign<br/>• Social Media Post<br/>• Blog Post<br/>• Video Content<br/>• Newsletter<br/>• Special Offer]
            AC[Active Campaigns<br/>Dynamic list with status]
            WT[Wellness Templates<br/>• Yoga & Meditation<br/>• Nutrition & Wellness<br/>• Mindfulness & Self-Care<br/>• Seasonal Campaigns]
            MSET[Settings<br/>• Marketing Settings]
        end
        
        MSF[Footer: UserNav]
    end
    
    MSH --> MT
    MT --> CC
    CC --> AC
    AC --> WT
    WT --> MSET
    MSET --> MSF
```

### Messages Sidebar Structure
```mermaid
graph TD
    subgraph "MessagesSidebar"
        MESH[Header: Logo + Brand]
        
        subgraph "Content Groups"
            MN[Messages<br/>• Inbox (6)<br/>• Sent<br/>• Starred (2)<br/>• Archived]
            QAM[Quick Actions<br/>• New Message<br/>• Send Broadcast<br/>• Schedule Message]
            RC[Recent Conversations<br/>Dynamic list with:<br/>• Contact avatars<br/>• Last message preview<br/>• Unread counts<br/>• Timestamps]
            MESET[Settings<br/>• Message Settings]
        end
        
        MESF[Footer: UserNav]
    end
    
    MESH --> MN
    MN --> QAM
    QAM --> RC
    RC --> MESET
    MESET --> MESF
```

## 4. Navigation State Flow

```mermaid
stateDiagram-v2
    [*] --> Dashboard
    
    Dashboard --> Contacts: /contacts
    Dashboard --> Tasks: /tasks
    Dashboard --> Marketing: /marketing
    Dashboard --> Messages: /messages
    Dashboard --> Calendar: /calendar
    Dashboard --> Settings: /settings
    
    Contacts --> Dashboard: /dashboard or /
    Tasks --> Dashboard: /dashboard or /
    Marketing --> Dashboard: /dashboard or /
    Messages --> Dashboard: /dashboard or /
    Calendar --> Dashboard: /dashboard or /
    Settings --> Dashboard: /dashboard or /
    
    Contacts --> Tasks: Direct navigation
    Tasks --> Marketing: Direct navigation
    Marketing --> Messages: Direct navigation
    Messages --> Calendar: Direct navigation
    Calendar --> Settings: Direct navigation
    
    note right of Dashboard
        Default section
        Fallback for unknown routes
    end note
    
    note right of Contacts
        Contact management
        Groups and imports
    end note
    
    note right of Tasks
        GTD-style task management
        Projects and productivity
    end note
    
    note right of Marketing
        Campaign management
        Content creation
    end note
    
    note right of Messages
        Communication hub
        Thread management
    end note
```

## 5. Responsive Behavior Flow

```mermaid
graph TD
    subgraph "Screen Size Detection"
        DESKTOP[Desktop<br/>> 1024px]
        TABLET[Tablet<br/>768px - 1024px]
        MOBILE[Mobile<br/>< 768px]
    end
    
    subgraph "Sidebar Behavior"
        DESKTOP --> FULL[Full Sidebar<br/>Collapsible to Icon]
        TABLET --> ICON[Icon Sidebar<br/>Expandable on Hover]
        MOBILE --> OVERLAY[Overlay Sidebar<br/>Toggle with Trigger]
    end
    
    subgraph "Navigation Adaptation"
        FULL --> MAINNAV[MainSectionNav Visible<br/>Icons + Text]
        ICON --> MAINICON[MainSectionNav Visible<br/>Icons Only]
        OVERLAY --> MAINHIDDEN[MainSectionNav Hidden<br/>Access via Sidebar]
    end
    
    subgraph "Content Area"
        MAINNAV --> CONTENTFULL[Content with Sidebar Space]
        MAINICON --> CONTENTICON[Content with Icon Space]
        MAINHIDDEN --> CONTENTFULL2[Full Width Content]
    end
```

## 6. Breadcrumb Generation Flow

```mermaid
graph TD
    START[Page Navigation] --> GETPATH[Get Current Pathname]
    GETPATH --> CHECKCONFIG{Route in Config?}
    
    CHECKCONFIG -->|Yes| BUILDCHAIN[Build Breadcrumb Chain]
    CHECKCONFIG -->|No| DYNAMIC[Check Dynamic Routes]
    
    DYNAMIC --> SEGMENTS[Split Path into Segments]
    SEGMENTS --> TESTPATHS[Test Segment Combinations]
    TESTPATHS --> FOUND{Match Found?}
    
    FOUND -->|Yes| BUILDCHAIN
    FOUND -->|No| FALLBACK[Use Default Breadcrumb]
    
    BUILDCHAIN --> TRAVERSE[Traverse Parent Chain]
    TRAVERSE --> BREADCRUMBS[Generate Breadcrumb Items]
    
    FALLBACK --> BREADCRUMBS
    BREADCRUMBS --> RENDER[Render Breadcrumb Component]
    
    subgraph "Breadcrumb Structure"
        RENDER --> HOME[Home Link]
        HOME --> SEGMENTS2[Path Segments]
        SEGMENTS2 --> CURRENT[Current Page]
    end
```

## 7. User Interaction Flow

```mermaid
sequenceDiagram
    participant U as User
    participant MSN as MainSectionNav
    participant ASC as AppSidebarController
    participant S as Sidebar
    participant BC as Breadcrumb
    participant C as Content
    
    U->>MSN: Click Section (e.g., Contacts)
    MSN->>ASC: Route Change (/contacts)
    ASC->>S: Load ContactsSidebar
    S->>BC: Update Breadcrumb
    BC->>C: Load Contacts Page
    
    Note over U,C: User sees Contacts section with appropriate sidebar
    
    U->>S: Click Sidebar Item (e.g., Add Contact)
    S->>BC: Update Breadcrumb (/contacts/new)
    BC->>C: Load New Contact Form
    
    Note over U,C: Sidebar remains ContactsSidebar, content updates
```

This comprehensive flow diagram system shows how all the layout components work together to provide a seamless, responsive user experience across different sections of the OmniCRM application.