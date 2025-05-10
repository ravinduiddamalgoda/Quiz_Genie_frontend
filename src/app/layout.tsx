'use client';

import "./globals.css";
import Navbar from '@/component/navbar';
import { useAuthStore } from '@/store/useStore';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuthStore(); // Assuming "id" is used to identify logged-in user

  // Define base navigation items
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Battle', href: '/battle' },
    { label: 'Review', href: '/review' },
    { label: 'Generate Quiz', href: '/generateQuiz' },
    { label: 'PDF Manage', href: '/pdfView' }
  ];

  // Add auth buttons only if user is NOT logged in
  if (!user) {
    navItems.push(
      { label: 'Login', href: '/user/login' },
      { label: 'Signup', href: '/user/register' }
    );
  }

  return (
    <html lang="en" className="hydrated">
      <body>
        <Navbar brand="Quiz Genie" items={navItems} />
        {children}
      </body>
    </html>
  );
}
