'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LogIn, UserPlus } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
}

interface NavbarProps {
  brand: string;
  items: NavItem[];
}

const Navbar: React.FC<NavbarProps> = ({ brand, items }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const pathname = usePathname();

  // Handle scroll event to add shadow effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = (): void => {
    setIsOpen(!isOpen);
  };

  const isActive = (href: string): boolean => {
    return pathname === href;
  };

  // Function to determine if a nav item is an auth item
  const isAuthItem = (label: string): boolean => {
    return label === 'Login' || label === 'Signup';
  };

  // Generate appropriate styling based on the nav item
  const getNavItemStyle = (item: NavItem, isMobile: boolean = false) => {
    // Base styles
    let baseStyles = isMobile
      ? "flex items-center px-3 py-2 rounded-md text-base font-medium transition-all duration-200 "
      : "relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ";
    
    // Auth item specific styles
    if (isAuthItem(item.label)) {
      if (item.label === 'Login') {
        return `${baseStyles} ${
          isActive(item.href)
            ? 'bg-blue-600 text-white'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`;
      } else if (item.label === 'Signup') {
        return `${baseStyles} ${
          isActive(item.href)
            ? 'bg-green-600 text-white'
            : 'bg-green-500 text-white hover:bg-green-600'
        }`;
      }
    }
    
    // Regular nav item styles
    return `${baseStyles} ${
      isActive(item.href)
        ? 'text-white bg-gray-700' 
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;
  };

  return (
    <nav className={`bg-gray-800 ${scrolled ? 'shadow-xl' : 'shadow-lg'} sticky top-0 z-50 transition-all duration-300`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-white text-xl font-bold flex items-center group">
              <span className="relative overflow-hidden">
                {brand}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-2">
              {items.map((item, index) => (
                <Link 
                  key={index} 
                  href={item.href} 
                  className={getNavItemStyle(item)}
                >
                  <span className="relative z-10 flex items-center">
                    {item.label === 'Login' && <LogIn className="mr-1 h-4 w-4" />}
                    {item.label === 'Signup' && <UserPlus className="mr-1 h-4 w-4" />}
                    {item.label}
                  </span>
                  {isActive(item.href) && !isAuthItem(item.label) && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400"></span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile menu button with enhanced animation */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none transition-colors"
              aria-expanded={isOpen ? 'true' : 'false'}
            >
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu with animation */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={getNavItemStyle(item, true)}
              onClick={() => setIsOpen(false)}
            >
              <span className="flex items-center">
                {item.label === 'Login' && <LogIn className="mr-2 h-4 w-4" />}
                {item.label === 'Signup' && <UserPlus className="mr-2 h-4 w-4" />}
                {item.label}
              </span>
              {isActive(item.href) && !isAuthItem(item.label) && (
                <span className="ml-2 w-1 h-1 rounded-full bg-blue-400"></span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;