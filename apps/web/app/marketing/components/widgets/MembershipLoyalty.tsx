'use client';

import React, { useState } from 'react';
import { Users, ArrowRight, Sparkles, Award, Star, BadgePercent } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

export function MembershipLoyalty() {
  const [programName, setProgramName] = useState('');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <div className="bg-indigo-50 dark:bg-indigo-950/20 p-6 rounded-lg">
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-4 text-indigo-700 dark:text-indigo-300">
            <Users className="h-6 w-6" />
            Membership & Loyalty
          </h2>
          <p className="text-muted-foreground mb-6">
            Create compelling membership programs and loyalty incentives that keep clients coming back. 
            Our tools help you design, launch, and manage membership tiers and rewards that increase retention.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Program Name</label>
              <Input 
                placeholder="e.g., 'Wellness Circle' or 'Inner Balance Club'"
                value={programName}
                onChange={(e) => setProgramName(e.target.value)}
                className="bg-white dark:bg-indigo-950/40"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Program Type</label>
                <select className="w-full h-9 rounded-md border border-input bg-white dark:bg-indigo-950/40 px-3 py-1 text-sm">
                  <option value="tiered">Tiered Membership</option>
                  <option value="subscription">Subscription</option>
                  <option value="points">Points-Based Loyalty</option>
                  <option value="visits">Visit-Based Rewards</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Billing Cycle</label>
                <select className="w-full h-9 rounded-md border border-input bg-white dark:bg-indigo-950/40 px-3 py-1 text-sm">
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annual">Annual</option>
                  <option value="lifetime">Lifetime</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Base Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input 
                  type="number"
                  placeholder="99.99"
                  className="bg-white dark:bg-indigo-950/40 pl-7"
                />
              </div>
            </div>
            
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
              <Sparkles className="h-4 w-4 mr-2" />
              Create Membership Program
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                <span className="text-sm">Customizable membership tiers and benefits</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                <span className="text-sm">Automated billing and subscription management</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                <span className="text-sm">Member-only content and exclusive offers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                <span className="text-sm">Loyalty points tracking and redemption</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-6">
        <Card className="border-indigo-100 dark:border-indigo-900/50">
          <CardHeader className="pb-3 bg-indigo-50 dark:bg-indigo-950/20 rounded-t-lg">
            <CardTitle className="text-lg font-semibold">Membership Tiers</CardTitle>
            <CardDescription>Sample membership structure</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="border rounded-md p-4 bg-white dark:bg-indigo-950/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-amber-400" />
                    <h3 className="font-medium">Gold Tier</h3>
                  </div>
                  <span className="text-sm font-medium">$149/mo</span>
                </div>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li className="flex items-center gap-1.5">
                    <Star className="h-3 w-3 text-indigo-400" />
                    <span>Unlimited sessions</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Star className="h-3 w-3 text-indigo-400" />
                    <span>Priority booking</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Star className="h-3 w-3 text-indigo-400" />
                    <span>Exclusive content</span>
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-md p-4 bg-white dark:bg-indigo-950/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-slate-400" />
                    <h3 className="font-medium">Silver Tier</h3>
                  </div>
                  <span className="text-sm font-medium">$99/mo</span>
                </div>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li className="flex items-center gap-1.5">
                    <Star className="h-3 w-3 text-indigo-400" />
                    <span>8 sessions per month</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Star className="h-3 w-3 text-indigo-400" />
                    <span>Member resources</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Star className="h-3 w-3 text-indigo-400" />
                    <span>10% off products</span>
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-md p-4 bg-white dark:bg-indigo-950/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-amber-700" />
                    <h3 className="font-medium">Bronze Tier</h3>
                  </div>
                  <span className="text-sm font-medium">$49/mo</span>
                </div>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li className="flex items-center gap-1.5">
                    <Star className="h-3 w-3 text-indigo-400" />
                    <span>4 sessions per month</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Star className="h-3 w-3 text-indigo-400" />
                    <span>Basic resources</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Star className="h-3 w-3 text-indigo-400" />
                    <span>5% off products</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <Button variant="outline" size="sm" asChild>
              <Link href={{ pathname: "/marketing/membership/templates" }}>
                Browse Templates
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/20 dark:hover:bg-indigo-900/30" asChild>
              <Link href={{ pathname: "/marketing/membership" }}>
                Manage Programs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
          <h3 className="font-medium flex items-center gap-2 text-green-700 dark:text-green-300">
            <BadgePercent className="h-4 w-4" />
            Try Our Quiz Creator
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Want to engage potential members? Create interactive quizzes that help clients discover which membership tier is right for them.
          </p>
          <Button variant="link" className="text-green-600 dark:text-green-400 p-0 h-auto mt-2" onClick={() => document.querySelector('[value="quiz"]')?.dispatchEvent(new MouseEvent('click'))}>
            Explore Quiz Creator
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}