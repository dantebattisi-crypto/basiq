export default function ShippingPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Project Process</h1>
      <p className="text-gray-500 text-sm mb-10">Last updated: January 2025</p>

      <div className="space-y-8 text-sm text-gray-600 leading-relaxed">
        <section className="bg-blue-50 rounded-xl p-5 border border-blue-100">
          <p className="font-semibold text-gray-900 text-base">Transparent from day one</p>
          <p className="mt-1">Every BasiQ project follows a clear, structured process. You will always know what stage we are at, what comes next, and what is expected from both sides.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Phase 1 — Discovery Call</h2>
          <p>We start with a free 30–60 minute consultation to understand your business, goals, and requirements. No commitment required. We ask the right questions upfront to ensure we fully understand what you need before any work begins.</p>
          <p className="mt-2 text-gray-400">Typical duration: 1–2 days</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Phase 2 — Proposal & Agreement</h2>
          <p>Based on the discovery call, we send a detailed written proposal including the scope of work, project timeline, deliverables, and fixed price. Once you approve the proposal and sign the agreement, we collect the deposit (50%) and schedule your project into our pipeline.</p>
          <p className="mt-2 text-gray-400">Typical duration: 2–5 days</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Phase 3 — Design</h2>
          <p>Our designers create wireframes, mockups, and prototypes based on your brand and requirements. You review and provide feedback. We iterate until the design is approved before moving to development.</p>
          <p className="mt-2 text-gray-400">Typical duration: 1–3 weeks depending on project size</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Phase 4 — Development</h2>
          <p>Our engineers build your solution using modern, industry-standard technologies. You have access to a staging environment throughout development so you can track progress in real time and provide feedback before the final launch.</p>
          <p className="mt-2 text-gray-400">Typical duration: 2–8 weeks depending on complexity</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Phase 5 — Testing & QA</h2>
          <p>Before launch, we carry out thorough quality assurance across all devices and browsers. This includes functional testing, performance checks, security review, and accessibility evaluation. Any issues are resolved before handover.</p>
          <p className="mt-2 text-gray-400">Typical duration: 3–7 days</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Phase 6 — Launch & Handover</h2>
          <p>Once the final balance is settled, we deploy your project to your live environment. We provide full documentation, a walkthrough session, and handover of all relevant credentials and files. Your project is yours — completely.</p>
          <p className="mt-2 text-gray-400">Typical duration: 1–2 days</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Phase 7 — Ongoing Support</h2>
          <p>After launch, we offer ongoing maintenance and support packages to keep your project running smoothly. Bug fixes, content updates, performance monitoring, and feature additions are all available on a retainer or ad-hoc basis.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Communication Standards</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 border border-gray-200">Channel</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 border border-gray-200">Used for</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 border border-gray-200">Response time</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Email', 'Proposals, agreements, invoices', 'Within 1 business day'],
                  ['Project portal', 'Task updates, feedback, files', 'Real-time'],
                  ['Video call', 'Reviews, kickoffs, walkthroughs', 'Scheduled in advance'],
                  ['Slack / Telegram', 'Quick questions (on request)', 'Within 4 hours'],
                ].map(([channel, use, response]) => (
                  <tr key={channel} className="border-b border-gray-100">
                    <td className="py-3 px-4 border border-gray-200 font-medium text-gray-800">{channel}</td>
                    <td className="py-3 px-4 border border-gray-200">{use}</td>
                    <td className="py-3 px-4 border border-gray-200">{response}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Questions?</h2>
          <p>If you have any questions about how we work, feel free to reach out at <a href="mailto:contact@basiq.com" className="text-blue-600 hover:underline">contact@basiq.com</a>. We are happy to walk you through the process before you commit to anything.</p>
        </section>
      </div>
    </div>
  )
}
