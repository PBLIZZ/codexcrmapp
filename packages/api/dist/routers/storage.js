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

// src/routers/storage.ts
var storage_exports = {};
__export(storage_exports, {
  storageRouter: () => storageRouter
});
module.exports = __toCommonJS(storage_exports);
var import_server2 = require("@trpc/server");
var import_zod = require("zod");

// src/trpc.ts
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
var protectedProcedure = t.procedure.use(isAuthed);

// src/routers/storage.ts
var storageRouter = router({
  // Generate a presigned upload URL for direct browser-to-storage uploads
  getUploadUrl: protectedProcedure.input(
    import_zod.z.object({
      fileName: import_zod.z.string(),
      contentType: import_zod.z.string(),
      folderPath: import_zod.z.string().default("contacts")
    })
  ).mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new import_server2.TRPCError({ code: "UNAUTHORIZED" });
    }
    try {
      const filePath = `${input.folderPath}/${ctx.user.id}/${input.fileName}`;
      const { data, error } = await ctx.supabaseAdmin.storage.from("contact-profile-photo").createSignedUploadUrl(filePath);
      if (error) {
        console.error("Supabase createSignedUploadUrl error:", error);
        throw new import_server2.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to generate upload URL: ${error.message}`
        });
      }
      return {
        signedUrl: data.signedUrl,
        path: data.path,
        token: data.token
      };
    } catch (error) {
      console.error("Error generating upload URL:", error);
      throw new import_server2.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Failed to generate upload URL"
      });
    }
  }),
  // Get a private URL for a specific file
  getFileUrl: protectedProcedure.input(
    import_zod.z.object({
      filePath: import_zod.z.string()
    })
  ).query(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new import_server2.TRPCError({ code: "UNAUTHORIZED" });
    }
    try {
      const { data, error } = await ctx.supabaseAdmin.storage.from("contact-profile-photo").createSignedUrl(input.filePath, 3600);
      if (error) {
        console.error("Supabase createSignedUrl error:", error);
        throw new import_server2.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to generate signed URL: ${error.message}`
        });
      }
      return {
        signedUrl: data.signedUrl
      };
    } catch (error) {
      console.error("Error generating signed URL:", error);
      throw new import_server2.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Failed to generate signed URL"
      });
    }
  }),
  // Delete a file from storage
  deleteFile: protectedProcedure.input(
    import_zod.z.object({
      filePath: import_zod.z.string()
    })
  ).mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new import_server2.TRPCError({ code: "UNAUTHORIZED" });
    }
    try {
      if (!input.filePath.includes(`/${ctx.user.id}/`)) {
        throw new import_server2.TRPCError({
          code: "FORBIDDEN",
          message: "You can only delete your own files"
        });
      }
      const { error } = await ctx.supabaseAdmin.storage.from("contact-profile-photo").remove([input.filePath]);
      if (error) {
        throw new import_server2.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to delete file: ${error.message}`
        });
      }
      return { success: true };
    } catch (error) {
      console.error("Error deleting file:", error);
      throw new import_server2.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Failed to delete file"
      });
    }
  })
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  storageRouter
});
