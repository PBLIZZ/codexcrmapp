"use client";

import React from 'react';

export function DashboardSidebar() {
  return (
    <div className="p-4 h-full">
      <h2 className="font-semibold text-lg mb-4">Dashboard</h2>
      {/* Placeholder links for DashboardSidebar */}
      <ul className="space-y-2">
        <li><a href="#" className="text-sm text-gray-700 hover:text-primary">Overview</a></li>
        <li><a href="#" className="text-sm text-gray-700 hover:text-primary">Analytics</a></li>
        <li><a href="#" className="text-sm text-gray-700 hover:text-primary">Reports</a></li>
      </ul>
    </div>
  );
}
