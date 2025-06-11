import { contactRouter } from './routers/contact';
import { groupRouter } from './routers/group';
import { storageRouter } from './routers/storage';
import { sessionRouter } from './routers/session';
import { aiActionRouter } from './routers/ai-action';
import { noteRouter } from './routers/note';
import { dashboardRouter } from './routers/dashboard';
import { taskRouter } from './routers/task';
import { router } from './trpc';

export const appRouter = router({
  contacts: contactRouter, // Contact router (preferred)
  groups: groupRouter, // Groups management router
  storage: storageRouter, // Storage router for file uploads
  sessions: sessionRouter, // Session management with AI analysis
  aiActions: aiActionRouter, // AI actions workflow (create, approve, reject)
  notes: noteRouter, // Notes with AI tagging
  dashboard: dashboardRouter, // Dashboard metrics aggregation
  tasks: taskRouter, // Task management with drag-and-drop functionality
});
export type AppRouter = typeof appRouter;
