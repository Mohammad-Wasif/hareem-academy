import { SEO } from "@/components/SEO";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background py-16">
      <SEO
        title="Privacy Policy"
        description="Privacy policy and data protection guidelines for Hareem Academy students and visitors, guaranteeing a secure sisters-only learning environment."
      />
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="font-serif font-bold text-4xl text-primary mb-8">Privacy Policy</h1>
        <div className="prose prose-stone dark:prose-invert">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>
            At Hareem Academy, we take your privacy seriously. We are committed to protecting the personal information of our students and visitors, especially given our focus on providing a secure, female-only environment.
          </p>
          
          <h3>1. Information We Collect</h3>
          <p>
            When you enroll or contact us, we collect necessary information including your name, WhatsApp number, email address, age, and location. This allows us to process your enrollment and communicate effectively.
          </p>

          <h3>2. How We Use Your Information</h3>
          <p>
            We use your information solely to:
          </p>
          <ul>
            <li>Process your enrollment and manage your classes</li>
            <li>Send you course materials and updates via WhatsApp</li>
            <li>Respond to your inquiries</li>
            <li>Improve our academy services</li>
          </ul>

          <h3>3. Data Protection</h3>
          <p>
            Your data is stored securely. We do not sell, trade, or rent your personal information to third parties. As a female-only institution, we ensure that student records and contact details are handled with strict confidentiality.
          </p>

          <h3>4. Live Classes & Privacy</h3>
          <p>
            Our Zoom classes are strictly for females. While we encourage video participation for better learning, we respect your choice to maintain privacy. Class recordings (if any) are kept secure and shared only with enrolled students of that specific batch.
          </p>

          <h3>5. Contact Us</h3>
          <p>
            If you have questions about this Privacy Policy, please contact us at salam@hareemacademy.com or via WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
}
