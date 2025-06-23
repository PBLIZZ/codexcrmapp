import { TRPCError } from '@trpc/server';
type OpenAPIV3Document = {
    openapi: string;
    info: {
        title: string;
        description: string;
        version: string;
    };
    paths: Record<string, any>;
    components?: {
        schemas?: Record<string, any>;
        securitySchemes?: Record<string, any>;
    };
    security?: Array<Record<string, any>>;
};
/**
 * Generate OpenAPI document from tRPC router
 * This is a placeholder until we can use the actual trpc-openapi package
 */
export declare const openApiDocument: OpenAPIV3Document;
/**
 * Add security schemes to OpenAPI document
 */
export declare function addSecuritySchemes(document: OpenAPIV3Document): OpenAPIV3Document;
/**
 * Add error responses to OpenAPI document
 */
export declare function addErrorResponses(document: OpenAPIV3Document): OpenAPIV3Document;
/**
 * Get enhanced OpenAPI document with security schemes and error responses
 */
export declare function getEnhancedOpenApiDocument(): OpenAPIV3Document;
/**
 * Map tRPC error codes to HTTP status codes
 */
export declare function mapTRPCErrorToHttpStatus(error: TRPCError): number;
export {};
