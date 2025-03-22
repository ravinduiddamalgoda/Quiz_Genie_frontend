// components/SideDrawer.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface MenuItem {
  label: string;
  href: string;
}

interface SideDrawerProps {
  menuItems?: MenuItem[];
  title?: string;
  exitButtonText?: string;
}

const SideDrawer: React.FC<SideDrawerProps> = ({
  menuItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Contact', href: '/contact' }
  ],
  title = 'Menu',
  exitButtonText = 'Exit'
  
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [triggerZoneActive, setTriggerZoneActive] = useState<boolean>(false);

  // Detect mouse position to show drawer when cursor is on the left edge
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const triggerThreshold = 20; // pixels from left edge to trigger
      
      if (e.clientX <= triggerThreshold) {
        setTriggerZoneActive(true);
        
        // Add a small delay to prevent accidental triggers
        const timer = setTimeout(() => {
          if (triggerZoneActive) {
            setIsDrawerOpen(true);
          }
        }, 200);
        
        return () => clearTimeout(timer);
      } else {
        setTriggerZoneActive(false);
      }
    };

    // Hide drawer when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      if (isDrawerOpen && e.clientX > 300) { // 300px is drawer width
        setIsDrawerOpen(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClickOutside);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClickOutside);
    };
  }, [isDrawerOpen, triggerZoneActive]);

  const handleExit = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div 
      className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-transform duration-300 ease-in-out w-64 transform ${
        isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
      } flex flex-col z-50`}
    >
      <div className="p-4 flex-grow">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link href={item.href} className="block p-2 hover:bg-gray-100 rounded">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      {/* Exit button at bottom of drawer */}
      <div className="p-4 border-t border-gray-200">
        <button 
          onClick={handleExit}
          className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded transition-colors duration-200"
        >
          {exitButtonText}
        </button>
      </div>
    </div>
  );
};

export default SideDrawer;