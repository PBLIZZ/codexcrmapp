// src/context.ts
import prisma from "@codexcrm/database";
var createInnerTRPCContext = (session) => {
  return {
    prisma,
    session
  };
};

export {
  createInnerTRPCContext
};
