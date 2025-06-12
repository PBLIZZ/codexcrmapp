import { NextApiRequest, NextApiResponse } from 'next';
/**
 * OpenAPI documentation handler
 * Serves the OpenAPI documentation in JSON format
 */
export default function openApiHandler(req: NextApiRequest, res: NextApiResponse): Promise<void>;
/**
 * Swagger UI handler
 * Serves the Swagger UI for interactive API documentation
 */
export declare function swaggerUiHandler(req: NextApiRequest, res: NextApiResponse): void;
