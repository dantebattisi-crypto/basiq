export default function TermsOfServicePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
      <p className="text-gray-500 text-sm mb-10">Last updated: January 2025</p>

      <div className="space-y-8 text-sm text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
          <p>By engaging BasiQ Ltd for IT services or using our website, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Services and Pricing</h2>
          <p>All prices shown on our website are starting prices. Final project costs are confirmed in a written proposal before work commences. We reserve the right to adjust pricing for scope changes requested after the proposal is signed. All prices are in Euros (€) and exclude VAT unless stated otherwise.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Project Agreements and Payment</h2>
          <p>Work begins upon receipt of a signed project agreement and the agreed deposit (typically 50% of the total project fee). The remaining balance is due upon project completion and prior to final delivery. All invoices are payable within 14 days of issue.</p>
          <p className="mt-3">We reserve the right to pause or cancel a project if payments are overdue by more than 14 days.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Project Scope and Revisions</h2>
          <p>Each project agreement includes a defined scope of work. Requests that fall outside the agreed scope will be quoted separately as change requests. We include a reasonable number of revision rounds within each service package — additional revisions may incur additional fees.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Refunds and Cancellations</h2>
          <p>Please refer to our Refund Policy for complete details on project cancellations and refund eligibility.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Intellectual Property</h2>
          <p>Upon receipt of final payment, the client receives full ownership of all deliverables produced specifically for their project (designs, code, content). BasiQ Ltd retains the right to display the work in our portfolio unless otherwise agreed in writing. All third-party tools, libraries, and frameworks used remain subject to their respective licences.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Client Responsibilities</h2>
          <p>The client agrees to provide all necessary materials, feedback, and approvals within agreed timeframes. Delays caused by late client responses may affect project timelines and are not the responsibility of BasiQ Ltd.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Limitation of Liability</h2>
          <p>To the fullest extent permitted by law, BasiQ Ltd shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services. Our total liability shall not exceed the total fees paid for the specific project giving rise to the claim.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Governing Law</h2>
          <p>These Terms of Service are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Contact</h2>
          <p>For questions regarding these Terms, contact us at <a href="mailto:legal@basiq.com" className="text-blue-600 hover:underline">legal@basiq.com</a> or BasiQ Ltd, 123 Tech Street, London, EC1A 1BB, United Kingdom.</p>
        </section>
      </div>
    </div>
  )
}
