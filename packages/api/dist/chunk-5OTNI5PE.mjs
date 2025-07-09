import {
  importRouter
} from "./chunk-TRYVNEOJ.mjs";
import {
  storageRouter
} from "./chunk-S56DMAEA.mjs";
import {
  contactRouter
} from "./chunk-J6Q73ZYT.mjs";
import {
  dashboardRouter
} from "./chunk-SFFYMH5O.mjs";
import {
  groupRouter
} from "./chunk-GNDTYHC4.mjs";
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
