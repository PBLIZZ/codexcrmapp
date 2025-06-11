// Import will be updated when package installation is fixed
// import { generateOpenApiDocument } from 'trpc-openapi';
import { appRouter } from '../root';
import { createContext } from '../context';
import { TRPCError } from '@trpc/server';

// Define OpenAPI types until we can import them
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
export const openApiDocument: OpenAPIV3Document = {
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

// Define more OpenAPI types
type PathItemObject = {
  parameters?: any[];
  [method: string]: any;
};

type OperationObject = {
  responses?: Record<string, any>;
  [key: string]: any;
};

type ResponseObject = {
  description: string;
  content?: Record<string, any>;
};

/**
 * Add security schemes to OpenAPI document
 */
export function addSecuritySchemes(document: OpenAPIV3Document): OpenAPIV3Document {
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
export function addErrorResponses(document: OpenAPIV3Document): OpenAPIV3Document {
  const paths = { ...document.paths };

  // Define common error responses
  const errorResponses: Record<string, ResponseObject> = {
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
    const pathItem = paths[path] as PathItemObject;
    
    Object.keys(pathItem).forEach((method) => {
      if (method === 'parameters') return;
      
      const operation = pathItem[method] as OperationObject;
      
      if (!operation) return;
      
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
export function getEnhancedOpenApiDocument(): OpenAPIV3Document {
  let document = openApiDocument;
  document = addSecuritySchemes(document);
  document = addErrorResponses(document);
  return document;
}

/**
 * Map tRPC error codes to HTTP status codes
 */
export function mapTRPCErrorToHttpStatus(error: TRPCError): number {
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