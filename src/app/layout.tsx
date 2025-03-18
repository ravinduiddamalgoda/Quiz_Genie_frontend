
import "./globals.css";

import Navbar from './component/navbar';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navbar brand="Quiz Genie" items={[
          { label: 'Home', href: '/' },
          { label: 'Battle', href: '/battle' },
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' }
        ]} />
        {children}
      </body>
    </html>
  )
}