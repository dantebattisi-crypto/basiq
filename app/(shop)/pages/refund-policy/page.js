export default function RefundPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Refund Policy</h1>
      <p className="text-gray-500 text-sm mb-10">Last updated: January 2025</p>

      <div className="space-y-8 text-sm text-gray-600 leading-relaxed">
        <section className="bg-rose-50 rounded-xl p-5 border border-rose-100">
          <p className="font-semibold text-gray-900 text-base">30-Day Money-Back Guarantee</p>
          <p className="mt-1">We stand behind every product we sell. If you are not completely satisfied, we will make it right.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Eligibility for Returns</h2>
          <p>To be eligible for a return, your item must be:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Returned within 30 days of the delivery date</li>
            <li>Unused and in the same condition you received it</li>
            <li>In the original packaging</li>
            <li>Accompanied by proof of purchase</li>
          </ul>
          <p className="mt-3">For hygiene reasons, opened skincare products may only be returned if they are defective or not as described.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">How to Initiate a Return</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Email us at returns@lumiglow.com with your order number and reason for return</li>
            <li>We will send you a return authorisation and instructions within 2 business days</li>
            <li>Pack the item securely and ship it to the address provided</li>
            <li>Once received and inspected, we will process your refund within 5–7 business days</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Refunds</h2>
          <p>Once your return is received and inspected, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed to your original payment method within 5–7 business days.</p>
          <p className="mt-3">Please note that original shipping costs are non-refundable unless the return is due to our error or a defective product.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Exchanges</h2>
          <p>We only replace items if they are defective or damaged. If you need to exchange an item for the same product, email us at returns@lumiglow.com.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Non-Returnable Items</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Gift cards</li>
            <li>Opened products (unless defective)</li>
            <li>Items purchased during final sale promotions</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Late or Missing Refunds</h2>
          <p>If you have not received your refund after 7 business days, first check your bank account, then contact your credit card company or bank. If you still have not received your refund, please contact us at returns@lumiglow.com.</p>
        </section>
      </div>
    </div>
  )
}
