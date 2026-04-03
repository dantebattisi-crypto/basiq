export default function RefundPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Refund Policy</h1>
      <p className="text-gray-500 text-sm mb-10">Last updated: January 2025</p>

      <div className="space-y-8 text-sm text-gray-600 leading-relaxed">
        <section className="bg-blue-50 rounded-xl p-5 border border-blue-100">
          <p className="font-semibold text-gray-900 text-base">Satisfaction Guarantee</p>
          <p className="mt-1">We stand behind every project we deliver. If something is not right, we will work with you to make it right — no matter what it takes.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Project Cancellation — Before Work Begins</h2>
          <p>If you cancel the project before work has commenced, your deposit will be refunded in full within 5–7 business days. Please notify us in writing as soon as possible.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Project Cancellation — During Active Work</h2>
          <p>If you choose to cancel during an active project, refunds are calculated based on the work completed at the time of cancellation:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Less than 25% completed — 75% of the deposit refunded</li>
            <li>25–50% completed — 50% of the deposit refunded</li>
            <li>More than 50% completed — deposit is non-refundable</li>
          </ul>
          <p className="mt-3">All work completed up to the cancellation date remains the property of BasiQ Ltd until outstanding balances are settled.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">How to Request a Refund or Raise a Dispute</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Email us at <a href="mailto:contact@basiq.com" className="text-blue-600 hover:underline">contact@basiq.com</a> with your project reference and a description of the issue</li>
            <li>We will acknowledge your request within 1 business day</li>
            <li>Our team will review the situation and propose a resolution within 3 business days</li>
            <li>If a refund is approved, it will be processed to your original payment method within 5–7 business days</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Revision Disputes</h2>
          <p>If you are unhappy with a deliverable, please raise this during the revision phase. We include a reasonable number of revision rounds in every project. If the final deliverable does not match the agreed scope and requirements, we will revise it at no additional charge.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Non-Refundable Items</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Third-party software licences or subscriptions purchased on your behalf</li>
            <li>Domain registrations and hosting fees</li>
            <li>Work completed and approved by the client at each milestone</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Questions</h2>
          <p>If you have any questions about our refund policy, please contact us at <a href="mailto:contact@basiq.com" className="text-blue-600 hover:underline">contact@basiq.com</a>. We are always happy to discuss any concerns before, during, or after your project.</p>
        </section>
      </div>
    </div>
  )
}
