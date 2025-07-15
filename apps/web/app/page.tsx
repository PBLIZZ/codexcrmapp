import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to the dashboard route which is protected
  redirect('/dashboard');
}
