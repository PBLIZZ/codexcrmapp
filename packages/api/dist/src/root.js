import { contactRouter } from './routers/contact';
import { groupRouter } from './routers/group';
import { storageRouter } from './routers/storage';
import { dashboardRouter } from './routers/dashboard';
import { importRouter } from './routers/import';
import { router } from './trpc';
export const appRouter = router({
    contacts: contactRouter, // Contact router (preferred)
    groups: groupRouter, // Groups management router
    storage: storageRouter, // Storage router for file uploads (photos)
    dashboard: dashboardRouter, // Dashboard metrics aggregation
    import: importRouter, // Import functionality for CSV uploads
});
