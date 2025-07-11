import {
  supabaseAdmin
} from "./chunk-RBHVIQPQ.mjs";

// src/context.ts
import prisma from "@codexcrm/database";
var createInnerTRPCContext = (session) => {
  return {
    prisma,
    session,
    supabaseAdmin
    // Added for storage operations
  };
};

export {
  createInnerTRPCContext
};
