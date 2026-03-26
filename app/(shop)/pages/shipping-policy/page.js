export default function ShippingPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Shipping Policy</h1>
      <p className="text-gray-500 text-sm mb-10">Last updated: January 2025</p>

      <div className="space-y-8 text-sm text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Processing Time</h2>
          <p>All orders are processed within 1–2 business days after payment confirmation. Orders placed on weekends or public holidays will be processed the next business day.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Shipping Rates & Delivery Times</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 border border-gray-200">Destination</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 border border-gray-200">Estimated Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 border border-gray-200">Cost</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['United Kingdom', '2–4 business days', 'Free over €50 / €4.99'],
                  ['European Union', '4–7 business days', 'Free over €50 / €7.99'],
                  ['United States & Canada', '7–14 business days', '€14.99'],
                  ['Rest of World', '10–21 business days', '€19.99'],
                ].map(([dest, time, cost]) => (
                  <tr key={dest} className="border-b border-gray-100">
                    <td className="py-3 px-4 border border-gray-200">{dest}</td>
                    <td className="py-3 px-4 border border-gray-200">{time}</td>
                    <td className="py-3 px-4 border border-gray-200">{cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Order Tracking</h2>
          <p>Once your order has been shipped, you will receive a confirmation email with a tracking number. You can use this number to track your package on the carrier's website.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Customs & Import Duties</h2>
          <p>For orders outside the EU, you may be subject to import duties, taxes, and customs clearance fees. These charges are the buyer's responsibility. We are not responsible for any additional charges incurred during delivery.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Lost or Damaged Packages</h2>
          <p>If your package is lost or arrives damaged, please contact us at support@lumiglow.com within 7 days of the estimated delivery date. We will work with the carrier to investigate and, where applicable, send a replacement or issue a refund.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Address Changes</h2>
          <p>If you need to change your shipping address, please contact us immediately at support@lumiglow.com. We can only accommodate address changes before the order has been shipped.</p>
        </section>
      </div>
    </div>
  )
}
