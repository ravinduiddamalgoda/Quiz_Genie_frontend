
import "./globals.css";

import Navbar from '@/component/navbar';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="hydrated">
      <body>
        <Navbar brand="Quiz Genie" items={[
          { label: 'Home', href: '/' },
          { label: 'Battle', href: '/battle' },
          { label: 'Review', href: '/review' },
          { label: 'Generate Quiz', href: '/generateQuiz' },
          { label: 'PDF Manage', href: '/pdfView' },
          { label: 'About', href: '/sample' },
          // { label: 'Contact', href: '/contact' }
        ]} />
        {children}
      </body>
    </html>
  )
}