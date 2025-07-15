'use strict';
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all) __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if ((from && typeof from === 'object') || typeof from === 'function') {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
        });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, '__esModule', { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AUTH_PAGES: () => AUTH_PAGES,
  DASHBOARD_PATH: () => DASHBOARD_PATH,
  LOG_IN_PATH: () => LOG_IN_PATH,
});
module.exports = __toCommonJS(index_exports);

// src/paths.ts
var AUTH_PAGES = [
  '/log-in',
  '/sign-up',
  '/forgot-password',
  '/reset-password',
  '/sign-up/confirmation',
];
var LOG_IN_PATH = '/log-in';
var DASHBOARD_PATH = '/dashboard';
// Annotate the CommonJS export names for ESM import in node:
0 &&
  (module.exports = {
    AUTH_PAGES,
    DASHBOARD_PATH,
    LOG_IN_PATH,
  });
//# sourceMappingURL=index.js.map
