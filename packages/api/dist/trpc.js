"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/trpc.ts
var trpc_exports = {};
__export(trpc_exports, {
  hasRole: () => hasRole,
  middleware: () => middleware,
  protectedProcedure: () => protectedProcedure,
  publicProcedure: () => publicProcedure,
  rateLimit: () => rateLimit,
  router: () => router
});
module.exports = __toCommonJS(trpc_exports);
var import_server = require("@trpc/server");
var import_superjson = __toESM(require("superjson"));
var t = import_server.initTRPC.context().create({
  transformer: import_superjson.default
});
var router = t.router;
var publicProcedure = t.procedure;
var middleware = t.middleware;
var isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) throw new import_server.TRPCError({
    code: "UNAUTHORIZED",
    message: "You must be logged in to access this resource"
  });
  return next({ ctx: { ...ctx, user: ctx.session.user } });
});
var hasRole = (requiredRoles) => t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new import_server.TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource"
    });
  }
  const userRoles = ctx.session.user.app_metadata?.roles || [];
  const hasRequiredRole = requiredRoles.some((role) => userRoles.includes(role));
  if (!hasRequiredRole) {
    throw new import_server.TRPCError({
      code: "FORBIDDEN",
      message: "You do not have permission to access this resource"
    });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.session.user,
      roles: userRoles
    }
  });
});
var rateLimit = (limit, timeWindowMs = 6e4) => {
  const store = /* @__PURE__ */ new Map();
  return t.middleware(({ ctx, next }) => {
    if (!ctx.session?.user) {
      return next({ ctx });
    }
    const userId = ctx.session.user.id;
    const now = Date.now();
    const userRateLimit = store.get(userId);
    if (!userRateLimit || now > userRateLimit.resetTime) {
      store.set(userId, { count: 1, resetTime: now + timeWindowMs });
      return next({ ctx });
    }
    if (userRateLimit.count >= limit) {
      throw new import_server.TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: "Rate limit exceeded. Please try again later."
      });
    }
    userRateLimit.count += 1;
    store.set(userId, userRateLimit);
    return next({ ctx });
  });
};
var protectedProcedure = t.procedure.use(isAuthed);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  hasRole,
  middleware,
  protectedProcedure,
  publicProcedure,
  rateLimit,
  router
});
