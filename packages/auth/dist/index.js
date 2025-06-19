"use strict";
/**
 * @codexcrm/auth - Server-side authentication utilities
 *
 * This package provides server-side auth utilities for the monorepo.
 * No client components or React context here - pure server-side utilities.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthAPI = void 0;
exports.createAuthServerClient = createAuthServerClient;
exports.getAuthUser = getAuthUser;
exports.requireAuth = requireAuth;
exports.getUserId = getUserId;
exports.isAuthenticated = isAuthenticated;
exports.getUserEmail = getUserEmail;
var ssr_1 = require("@supabase/ssr");
var headers_1 = require("next/headers");
var navigation_1 = require("next/navigation");
/**
 * Create a server-side Supabase client with proper cookie handling
 */
function createAuthServerClient() {
    return __awaiter(this, void 0, void 0, function () {
        var cookieStore;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, headers_1.cookies)()];
                case 1:
                    cookieStore = _a.sent();
                    return [2 /*return*/, (0, ssr_1.createServerClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
                            cookies: {
                                getAll: function () {
                                    return cookieStore.getAll();
                                },
                                setAll: function (cookiesToSet) {
                                    try {
                                        cookiesToSet.forEach(function (_a) {
                                            var name = _a.name, value = _a.value, options = _a.options;
                                            cookieStore.set(name, value, options);
                                        });
                                    }
                                    catch (error) {
                                        // The `setAll` method was called from a Server Component.
                                        // This can be ignored if you have middleware refreshing
                                        // user sessions, but is kept for safety.
                                    }
                                },
                            },
                        })];
            }
        });
    });
}
/**
 * Get the current authenticated user on the server
 * Returns user or null, doesn't redirect
 */
function getAuthUser() {
    return __awaiter(this, void 0, void 0, function () {
        var supabase, _a, user, error, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, createAuthServerClient()];
                case 1:
                    supabase = _b.sent();
                    return [4 /*yield*/, supabase.auth.getUser()];
                case 2:
                    _a = _b.sent(), user = _a.data.user, error = _a.error;
                    return [2 /*return*/, {
                            user: user,
                            error: error ? new Error(error.message) : null
                        }];
                case 3:
                    error_1 = _b.sent();
                    return [2 /*return*/, {
                            user: null,
                            error: error_1 instanceof Error ? error_1 : new Error('Auth error')
                        }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Require authentication - redirects if not authenticated
 * Use this in pages that require auth
 */
function requireAuth() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, user, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getAuthUser()];
                case 1:
                    _a = _b.sent(), user = _a.user, error = _a.error;
                    if (!user || error) {
                        (0, navigation_1.redirect)('/log-in');
                    }
                    return [2 /*return*/, user];
            }
        });
    });
}
/**
 * Get user ID safely (for database queries)
 */
function getUserId() {
    return __awaiter(this, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getAuthUser()];
                case 1:
                    user = (_a.sent()).user;
                    return [2 /*return*/, (user === null || user === void 0 ? void 0 : user.id) || null];
            }
        });
    });
}
/**
 * Check if user is authenticated (boolean)
 */
function isAuthenticated() {
    return __awaiter(this, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getAuthUser()];
                case 1:
                    user = (_a.sent()).user;
                    return [2 /*return*/, !!user];
            }
        });
    });
}
/**
 * Get user email safely
 */
function getUserEmail() {
    return __awaiter(this, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getAuthUser()];
                case 1:
                    user = (_a.sent()).user;
                    return [2 /*return*/, (user === null || user === void 0 ? void 0 : user.email) || null];
            }
        });
    });
}
/**
 * Server-side auth utilities for tRPC procedures
 */
var AuthAPI = /** @class */ (function () {
    function AuthAPI(supabase) {
        this.supabase = supabase;
    }
    AuthAPI.prototype.getUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, user, error, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.supabase.auth.getUser()];
                    case 1:
                        _a = _b.sent(), user = _a.data.user, error = _a.error;
                        return [2 /*return*/, {
                                user: user,
                                error: error ? new Error(error.message) : null
                            }];
                    case 2:
                        error_2 = _b.sent();
                        return [2 /*return*/, {
                                user: null,
                                error: error_2 instanceof Error ? error_2 : new Error('API Auth error')
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AuthAPI.prototype.requireUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, user, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getUser()];
                    case 1:
                        _a = _b.sent(), user = _a.user, error = _a.error;
                        if (!user || error) {
                            throw new Error('Unauthorized');
                        }
                        return [2 /*return*/, user];
                }
            });
        });
    };
    return AuthAPI;
}());
exports.AuthAPI = AuthAPI;
