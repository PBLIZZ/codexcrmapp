export const metadata = {
  title: "Privacy Policy | CodexCRM",
  description: "Privacy Policy and data protection information for CodexCRM platform.",
  keywords: ["privacy", "policy", "data", "protection"]
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-lg text-muted-foreground mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you create an account, 
            update your profile, or contact us for support.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to provide, maintain, and improve our services, 
            process transactions, and communicate with you.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
          <p>
            We do not sell, trade, or otherwise transfer your personal information to third parties 
            without your consent, except as described in this policy.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational security measures to protect 
            your personal information against unauthorized access, alteration, disclosure, or destruction.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us.
          </p>
        </section>
      </div>
    </div>
  );
}