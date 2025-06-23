import Link from 'next/link';

export default function DocsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">CodexCRM API Documentation</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Interactive API Documentation</h2>
          <p className="text-gray-600 mb-4">
            Explore our API endpoints with an interactive Swagger UI interface.
            Test API calls directly from your browser.
          </p>
          <Link 
            href="/api/docs/swagger" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          >
            Open Swagger UI
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">OpenAPI Specification</h2>
          <p className="text-gray-600 mb-4">
            Download our OpenAPI specification in JSON format for integration
            with your API tools and code generators.
          </p>
          <Link 
            href="/api/docs/openapi" 
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
          >
            View OpenAPI Spec
          </Link>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-3">API Overview</h2>
        <p className="text-gray-600 mb-4">
          The CodexCRM API provides access to all features of the CRM system, including:
        </p>
        <ul className="list-disc pl-6 mb-4 text-gray-600">
          <li>Contact management with AI enrichment</li>
          <li>Session management with AI analysis</li>
          <li>AI actions workflow (create, approve, reject)</li>
          <li>Notes with AI tagging</li>
          <li>Dashboard metrics aggregation</li>
        </ul>
        <p className="text-gray-600">
          All API endpoints require authentication using JWT tokens. See the Swagger documentation
          for details on how to authenticate your requests.
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-3">Getting Started</h2>
        <p className="text-gray-600 mb-4">
          To get started with the CodexCRM API, follow these steps:
        </p>
        <ol className="list-decimal pl-6 mb-4 text-gray-600">
          <li className="mb-2">Create an account or log in to your existing account</li>
          <li className="mb-2">Obtain an API token from your account settings</li>
          <li className="mb-2">Include the token in the Authorization header of your requests</li>
          <li className="mb-2">Explore the API documentation to find the endpoints you need</li>
          <li>Start making API requests to integrate with your applications</li>
        </ol>
        <p className="text-gray-600">
          For more detailed information, refer to the Swagger documentation or contact our support team.
        </p>
      </div>
    </div>
  );
}