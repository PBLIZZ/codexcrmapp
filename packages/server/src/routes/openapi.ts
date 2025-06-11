import { NextApiRequest, NextApiResponse } from 'next';
// Import will be updated when package installation is fixed
// import { getEnhancedOpenApiDocument } from '../utils/openapi';

/**
 * Set CORS headers
 */
function setCorsHeaders(res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
}

/**
 * OpenAPI documentation handler
 * Serves the OpenAPI documentation in JSON format
 */
export default async function openApiHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set CORS headers
  setCorsHeaders(res);

  // Only allow GET requests
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  try {
    // Placeholder for OpenAPI document
    // Will be updated when package installation is fixed
    const openApiDocument = {
      openapi: '3.0.0',
      info: {
        title: 'CodexCRM API',
        description: 'API for CodexCRM with AI-powered features',
        version: '1.0.0',
      },
      paths: {},
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    };

    // Set cache headers (cache for 1 hour)
    res.setHeader('Cache-Control', 'public, max-age=3600');
    
    // Return the OpenAPI document
    res.status(200).json(openApiDocument);
  } catch (error: unknown) {
    console.error('Error generating OpenAPI documentation:', error);
    res.status(500).json({ message: 'Error generating OpenAPI documentation' });
  }
}

/**
 * Swagger UI handler
 * Serves the Swagger UI for interactive API documentation
 */
export function swaggerUiHandler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  setCorsHeaders(res);

  // Only allow GET requests
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  try {
    // Serve the Swagger UI HTML
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CodexCRM API Documentation</title>
        <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui.css" />
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui-bundle.js"></script>
        <script>
          window.onload = function() {
            window.ui = SwaggerUIBundle({
              url: "${process.env.NEXT_PUBLIC_API_URL || ''}/api/openapi",
              dom_id: '#swagger-ui',
              deepLinking: true,
              presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIBundle.SwaggerUIStandalonePreset
              ],
              layout: "BaseLayout",
              withCredentials: true,
              persistAuthorization: true,
            });
          };
        </script>
      </body>
      </html>
    `);
  } catch (error: unknown) {
    console.error('Error serving Swagger UI:', error);
    res.status(500).json({ message: 'Error serving Swagger UI' });
  }
}