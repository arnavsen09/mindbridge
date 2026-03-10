'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface NavbarProps {
  transparent?: boolean;
}

export default function Navbar({ transparent = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !transparent
          ? 'bg-[#0A0A0F]/80 backdrop-blur-md border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="MindBridge"
            width={32}
            height={32}
            className="h-8 w-auto"
          />
          <span className="text-xl font-bold text-[#F1F5F9]">MindBridge</span>
        </Link>

        {/* Sign In */}
        <Link
          href="/auth"
          className="px-4 py-2 text-sm font-medium text-[#F1F5F9] hover:text-white transition-colors"
        >
          Sign in
        </Link>
      </div>
    </nav>
  );
}

