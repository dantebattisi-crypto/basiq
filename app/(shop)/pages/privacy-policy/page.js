export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-gray-500 text-sm mb-10">Last updated: January 2025</p>

      <div className="prose prose-gray max-w-none space-y-8 text-sm text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
          <p>We collect information you provide directly to us when submitting a project enquiry, signing a service agreement, or contacting our team. This includes your name, email address, company name, and project details.</p>
          <p className="mt-3">We also automatically collect certain information when you visit our website, including your IP address, browser type, referring URLs, and pages visited, in order to improve your experience and our services.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Respond to your project enquiries and provide quotes</li>
            <li>Deliver contracted IT services and project updates</li>
            <li>Send invoices, agreements, and service communications</li>
            <li>Send marketing communications (with your consent)</li>
            <li>Improve our website and service offerings</li>
            <li>Comply with legal and regulatory obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Information Sharing</h2>
          <p>We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted sub-contractors or service providers who assist us in delivering your project, subject to strict confidentiality agreements.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Payment Information</h2>
          <p>We use industry-standard encryption to protect your billing information. All payment processing is handled by secure, PCI-compliant payment processors. We do not store complete card details on our servers.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Cookies</h2>
          <p>We use cookies to enhance your browsing experience, remember your preferences, and analyse website traffic. You can control cookie settings through your browser preferences at any time.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Your Rights</h2>
          <p>Under GDPR and applicable data protection laws, you have the right to access, correct, or delete your personal data. You may also object to or restrict processing of your data. To exercise these rights, contact us at <a href="mailto:privacy@basiq.com" className="text-blue-600 hover:underline">privacy@basiq.com</a>.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Data Retention</h2>
          <p>We retain your personal data for as long as necessary to fulfil the purposes outlined in this policy, or as required by applicable law. Project-related data is typically retained for 5 years following project completion.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@basiq.com" className="text-blue-600 hover:underline">privacy@basiq.com</a> or write to: BasiQ Ltd, 123 Tech Street, London, EC1A 1BB, United Kingdom.</p>
        </section>
      </div>
    </div>
  )
}
