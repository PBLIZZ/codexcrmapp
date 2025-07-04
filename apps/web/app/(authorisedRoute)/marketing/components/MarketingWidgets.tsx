'use client';

import React from 'react';
import { 
  Mail, 
  Calendar, 
  Palette,
  Gift,
  Users,
  HelpCircle
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@codexcrm/ui/components/ui/tabs";

// Import widget components
import { EmailMarketing } from "./widgets/EmailMarketing";
import { CreatorStudio } from "./widgets/CreatorStudio";
import { ContentCalendar } from "./widgets/ContentCalendar";
import { LeadMagnetStudio } from "./widgets/LeadMagnetStudio";
import { MembershipLoyalty } from "./widgets/MembershipLoyalty";
import { QuizCreator } from "./widgets/QuizCreator";

export function MarketingWidgets() {
  return (
    <div className="w-full">
      <Tabs defaultValue="email" className="w-full">
        <TabsList className="w-full justify-start mb-6 bg-teal-50 dark:bg-teal-950/20 p-1 overflow-x-auto">
          <TabsTrigger value="email" className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-900 dark:data-[state=active]:bg-teal-900/20">
            <Mail className="h-4 w-4 mr-2" />
            Email Marketing
          </TabsTrigger>
          <TabsTrigger value="creator" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900 dark:data-[state=active]:bg-purple-900/20">
            <Palette className="h-4 w-4 mr-2" />
            Creator Studio
          </TabsTrigger>
          <TabsTrigger value="calendar" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900 dark:data-[state=active]:bg-blue-900/20">
            <Calendar className="h-4 w-4 mr-2" />
            Content Calendar
          </TabsTrigger>
          <TabsTrigger value="leadmagnet" className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900 dark:data-[state=active]:bg-amber-900/20">
            <Gift className="h-4 w-4 mr-2" />
            Lead Magnet Studio
          </TabsTrigger>
          <TabsTrigger value="membership" className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-900 dark:data-[state=active]:bg-indigo-900/20">
            <Users className="h-4 w-4 mr-2" />
            Membership & Loyalty
          </TabsTrigger>
          <TabsTrigger value="quiz" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-900 dark:data-[state=active]:bg-green-900/20">
            <HelpCircle className="h-4 w-4 mr-2" />
            Quiz Creator
          </TabsTrigger>
        </TabsList>
        
        {/* Tab content sections */}
        <TabsContent value="email">
          <EmailMarketing />
        </TabsContent>
        
        <TabsContent value="creator">
          <CreatorStudio />
        </TabsContent>
        
        <TabsContent value="calendar">
          <ContentCalendar />
        </TabsContent>
        
        <TabsContent value="leadmagnet">
          <LeadMagnetStudio />
        </TabsContent>
        
        <TabsContent value="membership">
          <MembershipLoyalty />
        </TabsContent>
        
        <TabsContent value="quiz">
          <QuizCreator />
        </TabsContent>
      </Tabs>
    </div>
  );
}
