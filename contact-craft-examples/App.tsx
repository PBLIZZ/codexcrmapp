import { Toaster } from '@codexcrm/ui';
import { Toaster as Sonner } from '@codexcrm/ui';
import { TooltipProvider } from '@codexcrm/ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Contacts from './Contacts';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Contacts />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
