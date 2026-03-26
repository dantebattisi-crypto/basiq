import './globals.css'

export const metadata = {
  title: 'LumiGlow Beauty',
  description: 'Premium Health & Beauty Products',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
