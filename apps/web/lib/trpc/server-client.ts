import { appRouter } from '@codexcrm/api/root';
import { createContext } from '@codexcrm/api/context';

// This server client allows you to call your API from Server Components
// without making an HTTP request.
export const api = appRouter.createCaller(await createContext({} as any));
