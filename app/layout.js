import './globals.css'

export const metadata = {
  title: 'BasiQ — IT Services Agency',
  description: 'Custom websites, SEO, UI/UX design and business automation. We build digital products that grow your business.',
  icons: { icon: '/logo.png' },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
