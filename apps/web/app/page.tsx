// Use relative path for auth actions
import { protectPage } from "../lib/auth/actions"; 
// Import DashboardContent using a relative path
import DashboardContent from "../components/dashboard/DashboardContent"; 

export default async function Home() {
  // Protect this page - redirects to /sign-in if not authenticated
  await protectPage();
  
  return <DashboardContent />;
}