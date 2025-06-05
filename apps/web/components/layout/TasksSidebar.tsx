'use client';

import React from 'react';

export function TasksSidebar() {
  return (
    <div className="p-4 h-full">
      <h2 className="font-semibold text-lg mb-4">Tasks</h2>
      {/* Placeholder links for TasksSidebar */}
      <ul className="space-y-2">
        <li>
          <a href="#" className="text-sm text-gray-700 hover:text-primary">
            My Tasks
          </a>
        </li>
        <li>
          <a href="#" className="text-sm text-gray-700 hover:text-primary">
            Due Soon
          </a>
        </li>
        <li>
          <a href="#" className="text-sm text-gray-700 hover:text-primary">
            Completed
          </a>
        </li>
        <li>
          <a href="#" className="text-sm text-gray-700 hover:text-primary">
            Create Task
          </a>
        </li>
      </ul>
    </div>
  );
}
