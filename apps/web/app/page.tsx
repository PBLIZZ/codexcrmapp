// Import DashboardContent using a relative path
import DashboardContent from "../components/dashboard/DashboardContent"; 
// Redirect import is no longer needed here
// import { redirect } from 'next/navigation';
// protectPage import is no longer needed here
// import { protectPage } from "../lib/auth/actions"; 

export default async function Home() {
  // Authentication is now handled by middleware
  // const user = await protectPage();
  // 
  // if (!user) {
  //   redirect('/sign-in');
  // }
  
  // Render the dashboard directly
  return <DashboardContent />;
}