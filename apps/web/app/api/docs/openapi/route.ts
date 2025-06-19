import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { getEnhancedOpenApiDocument } from '@codexcrm/server/src/utils/openapi';

/**
 * GET /api/docs/openapi
 * Returns the OpenAPI documentation in JSON format
 */
export function GET(_req: NextRequest) {
  try {
    // Get the enhanced OpenAPI document
    const openApiDocument = getEnhancedOpenApiDocument();

    // Return the OpenAPI document
    return NextResponse.json(openApiDocument, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
    });
  } catch (error) {
    console.error('Error generating OpenAPI documentation:', error);
    return NextResponse.json(
      { message: 'Error generating OpenAPI documentation' },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS /api/docs/openapi
 * Handles CORS preflight requests
 */
export function OPTIONS(_req: NextRequest) {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    }
  );
}
