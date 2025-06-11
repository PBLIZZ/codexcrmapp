/**
 * Home Page - Entry Point of the Application
 * 
 * This is the first page that gets loaded when a user visits the root URL of the application.
 * Instead of rendering content, it automatically redirects to the dashboard page.
 * This follows the pattern of having a central dashboard as the main interface after login.
 * 
 * Date: June 11, 2025
 */

import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to the dashboard
  redirect('/dashboard');
}
