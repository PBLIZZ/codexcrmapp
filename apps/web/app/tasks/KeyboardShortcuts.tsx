'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface KeyboardShortcutsProps {
  onNewTask: () => void;
  onToggleSearch: () => void;
  onToggleSidebar: () => void;
  onEscape: () => void;
}

export function KeyboardShortcuts({
  onNewTask,
  onToggleSearch,
  onToggleSidebar,
  onEscape
}: KeyboardShortcutsProps) {
  const router = useRouter();
  const [helpVisible, setHelpVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      // Command/Ctrl + key shortcuts
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 'n':
            e.preventDefault();
            onNewTask();
            break;
          case 'f':
            e.preventDefault();
            onToggleSearch();
            break;
          case '/':
            e.preventDefault();
            onToggleSearch();
            break;
          // case 'b': - Removed to avoid conflict with global sidebar toggle
          //   e.preventDefault();
          //   onToggleSidebar();
          //   break;
          case '?':
            e.preventDefault();
            setHelpVisible(true);
            break;
          default:
            break;
        }
        return;
      }

      // Single key shortcuts
      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          if (helpVisible) {
            setHelpVisible(false);
          } else {
            onEscape();
          }
          break;
        case '?':
          if (!e.shiftKey) return;
          e.preventDefault();
          setHelpVisible(true);
          break;
        case '1':
          e.preventDefault();
          router.push('/tasks?view=inbox');
          break;
        case '2':
          e.preventDefault();
          router.push('/tasks?view=today');
          break;
        case '3':
          e.preventDefault();
          router.push('/tasks?view=upcoming');
          break;
        case '4':
          e.preventDefault();
          router.push('/tasks?view=anytime');
          break;
        case '5':
          e.preventDefault();
          router.push('/tasks?view=someday');
          break;
        case '6':
          e.preventDefault();
          router.push('/tasks?view=logbook');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [router, onNewTask, onToggleSearch, onToggleSidebar, onEscape, helpVisible]);

  if (!helpVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Keyboard Shortcuts</h2>
            <button
              onClick={() => setHelpVisible(false)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Navigation</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm mr-2">1</kbd>
                  <span>Go to Inbox</span>
                </div>
                <div className="flex items-center">
                  <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm mr-2">2</kbd>
                  <span>Go to Today</span>
                </div>
                <div className="flex items-center">
                  <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm mr-2">3</kbd>
                  <span>Go to Upcoming</span>
                </div>
                <div className="flex items-center">
                  <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm mr-2">4</kbd>
                  <span>Go to Anytime</span>
                </div>
                <div className="flex items-center">
                  <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm mr-2">5</kbd>
                  <span>Go to Someday</span>
                </div>
                <div className="flex items-center">
                  <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm mr-2">6</kbd>
                  <span>Go to Logbook</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <div className="flex items-center mr-2">
                    <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm">⌘</kbd>
                    <span className="mx-1">+</span>
                    <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm">N</kbd>
                  </div>
                  <span>New Task</span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center mr-2">
                    <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm">⌘</kbd>
                    <span className="mx-1">+</span>
                    <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm">F</kbd>
                  </div>
                  <span>Search</span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center mr-2">
                    <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm">⌘</kbd>
                    <span className="mx-1">+</span>
                    <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm">B</kbd>
                  </div>
                  <span>Toggle Sidebar</span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center mr-2">
                    <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm">⌘</kbd>
                    <span className="mx-1">+</span>
                    <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm">/</kbd>
                  </div>
                  <span>Toggle Search</span>
                </div>
                <div className="flex items-center">
                  <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm mr-2">Esc</kbd>
                  <span>Close/Cancel</span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center mr-2">
                    <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm">?</kbd>
                  </div>
                  <span>Show/Hide Shortcuts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KeyboardShortcuts;