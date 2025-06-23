export const metadata = {
  title: "Terms of Service | CodexCRM",
  description: "Terms of Service and user agreement for CodexCRM platform.",
  keywords: ["terms", "service", "agreement", "legal"]
};

export default function TermsPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-lg text-muted-foreground mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using CodexCRM, you accept and agree to be bound by the terms 
            and provision of this agreement.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Service Description</h2>
          <p>
            CodexCRM is a customer relationship management platform designed to help 
            businesses manage their contacts, tasks, and marketing activities.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
          <p>
            Users are responsible for maintaining the confidentiality of their account 
            information and for all activities that occur under their account.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Data Privacy</h2>
          <p>
            Your privacy is important to us. Please review our Privacy Policy to 
            understand how we collect, use, and protect your information.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Contact Information</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us.
          </p>
        </section>
      </div>
    </div>
  );
}