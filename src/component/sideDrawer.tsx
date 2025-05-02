'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface MenuItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface SideDrawerProps {
  menuItems?: MenuItem[];
  title?: string;
  exitButtonText?: string;
  exitHref?: string;
}

const SideDrawer: React.FC<SideDrawerProps> = ({
  menuItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Contact', href: '/contact' }
  ],
  title = 'Menu',
  exitButtonText = 'Exit',
  exitHref = '/'
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [triggerZoneActive, setTriggerZoneActive] = useState<boolean>(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
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
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node) && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    };

    // Handle escape key to close drawer
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDrawerOpen, triggerZoneActive]);

  const handleExit = () => {
    setIsDrawerOpen(false);
    
    if (exitButtonText.toLowerCase().includes('leave') || 
        exitButtonText.toLowerCase().includes('exit')) {
      // If it's an exit/leave button, navigate to the specified route
      router.push(exitHref);
    }
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <>
      {/* Hamburger menu for mobile and as alternative trigger */}
      <button
        className="fixed top-4 left-4 z-40 p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none md:hidden"
        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
        aria-label={isDrawerOpen ? 'Close menu' : 'Open menu'}
      >
        <Menu size={24} />
      </button>
      
      {/* Drawer background overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity"
          onClick={closeDrawer}
        />
      )}
      
      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-transform duration-300 ease-in-out w-64 transform ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col z-50`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold text-blue-700">{title}</h2>
          <button
            onClick={closeDrawer}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="Close menu"
          >
            <ArrowLeft size={20} className="text-gray-500" />
          </button>
        </div>
        
        <div className="p-4 flex-grow overflow-y-auto">
          <nav>
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link 
                    href={item.href} 
                    className="flex items-center p-2 hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded transition-colors"
                    onClick={closeDrawer}
                  >
                    {item.icon && <span className="mr-2">{item.icon}</span>}
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
      
      {/* Invisible left edge trigger zone */}
      <div 
        className="fixed top-0 left-0 w-5 h-full z-30"
        onMouseEnter={() => setTriggerZoneActive(true)}
        onMouseLeave={() => setTriggerZoneActive(false)}
      />
    </>
  );
};

export default SideDrawer;