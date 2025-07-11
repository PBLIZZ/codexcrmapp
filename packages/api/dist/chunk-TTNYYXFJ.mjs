import {
  importRouter
} from "./chunk-QKRT6GL5.mjs";
import {
  storageRouter
} from "./chunk-S56DMAEA.mjs";
import {
  contactRouter
} from "./chunk-GPXHSCLR.mjs";
import {
  dashboardRouter
} from "./chunk-Z57G3OXE.mjs";
import {
  groupRouter
} from "./chunk-QLRQB7Y2.mjs";
import {
  router
} from "./chunk-JTHPFO2B.mjs";

// src/root.ts
var appRouter = router({
  contacts: contactRouter,
  // Contact router (preferred)
  groups: groupRouter,
  // Groups management router
  storage: storageRouter,
  // Storage router for file uploads (photos)
  dashboard: dashboardRouter,
  // Dashboard metrics aggregation
  import: importRouter
  // Import functionality for CSV uploads
});

export {
  appRouter
};
