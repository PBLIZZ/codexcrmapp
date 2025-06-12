/**
 * Generate OpenAPI document from tRPC router
 * This is a placeholder until we can use the actual trpc-openapi package
 */
export const openApiDocument = {
    openapi: '3.0.0',
    info: {
        title: 'CodexCRM API',
        description: 'API for CodexCRM with AI-powered features',
        version: '1.0.0',
    },
    paths: {},
    components: {
        schemas: {},
        securitySchemes: {},
    },
};
/**
 * Add security schemes to OpenAPI document
 */
export function addSecuritySchemes(document) {
    return {
        ...document,
        components: {
            ...document.components,
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'JWT token for authentication',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    };
}
/**
 * Add error responses to OpenAPI document
 */
export function addErrorResponses(document) {
    const paths = { ...document.paths };
    // Define common error responses
    const errorResponses = {
        '400': {
            description: 'Bad Request',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            message: { type: 'string' },
                            code: { type: 'string', enum: ['BAD_REQUEST'] },
                        },
                    },
                },
            },
        },
        '401': {
            description: 'Unauthorized',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            message: { type: 'string' },
                            code: { type: 'string', enum: ['UNAUTHORIZED'] },
                        },
                    },
                },
            },
        },
        '403': {
            description: 'Forbidden',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            message: { type: 'string' },
                            code: { type: 'string', enum: ['FORBIDDEN'] },
                        },
                    },
                },
            },
        },
        '404': {
            description: 'Not Found',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            message: { type: 'string' },
                            code: { type: 'string', enum: ['NOT_FOUND'] },
                        },
                    },
                },
            },
        },
        '429': {
            description: 'Too Many Requests',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            message: { type: 'string' },
                            code: { type: 'string', enum: ['TOO_MANY_REQUESTS'] },
                        },
                    },
                },
            },
        },
        '500': {
            description: 'Internal Server Error',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            message: { type: 'string' },
                            code: { type: 'string', enum: ['INTERNAL_SERVER_ERROR'] },
                        },
                    },
                },
            },
        },
    };
    // Add error responses to each path
    Object.keys(paths).forEach((path) => {
        const pathItem = paths[path];
        Object.keys(pathItem).forEach((method) => {
            if (method === 'parameters')
                return;
            const operation = pathItem[method];
            if (!operation)
                return;
            // Add error responses
            operation.responses = {
                ...operation.responses,
                ...errorResponses,
            };
            // Update path item
            pathItem[method] = operation;
        });
        paths[path] = pathItem;
    });
    return {
        ...document,
        paths,
    };
}
/**
 * Get enhanced OpenAPI document with security schemes and error responses
 */
export function getEnhancedOpenApiDocument() {
    let document = openApiDocument;
    document = addSecuritySchemes(document);
    document = addErrorResponses(document);
    return document;
}
/**
 * Map tRPC error codes to HTTP status codes
 */
export function mapTRPCErrorToHttpStatus(error) {
    switch (error.code) {
        case 'BAD_REQUEST':
            return 400;
        case 'UNAUTHORIZED':
            return 401;
        case 'FORBIDDEN':
            return 403;
        case 'NOT_FOUND':
            return 404;
        case 'TIMEOUT':
            return 408;
        case 'CONFLICT':
            return 409;
        case 'PRECONDITION_FAILED':
            return 412;
        case 'PAYLOAD_TOO_LARGE':
            return 413;
        case 'METHOD_NOT_SUPPORTED':
            return 405;
        case 'UNPROCESSABLE_CONTENT':
            return 422;
        case 'TOO_MANY_REQUESTS':
            return 429;
        case 'CLIENT_CLOSED_REQUEST':
            return 499;
        case 'INTERNAL_SERVER_ERROR':
            return 500;
        case 'NOT_IMPLEMENTED':
            return 501;
        case 'BAD_GATEWAY':
            return 502;
        case 'SERVICE_UNAVAILABLE':
            return 503;
        case 'GATEWAY_TIMEOUT':
            return 504;
        default:
            return 500;
    }
}
