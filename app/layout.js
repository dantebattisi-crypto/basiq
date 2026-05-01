import './globals.css'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata = {
  title: 'BasiQ — IT Services Agency',
  description: 'Custom websites, SEO, UI/UX design and business automation. We build digital products that grow your business.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
