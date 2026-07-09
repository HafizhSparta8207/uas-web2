"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { BookOpen, ShoppingCart, User as UserIcon, Menu } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-navy text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 text-white hover:text-gold transition-colors">
              <BookOpen className="w-6 h-6" />
              <span className="font-serif font-bold text-xl tracking-tight">LapakBuku</span>
            </Link>
            
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link href="/" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">Beranda</Link>
              <Link href="/books" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">Katalog</Link>
              <Link href="/about" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">Tentang</Link>
              <Link href="/contact" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">Hubungi Kami</Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">

            <Link href="/cart" className="text-gray-300 hover:text-white p-2 relative transition-colors">
              <ShoppingCart className="w-5 h-5" />
            </Link>

            {session ? (
              <div className="flex items-center gap-4 ml-4">
                <Link 
                  href={session.user.role === 'SELLER' ? '/dashboard/seller' : session.user.role === 'ADMIN' ? '/dashboard/admin' : '/orders'}
                  className="flex items-center gap-2 text-sm font-medium hover:text-gold transition-colors"
                >
                  <UserIcon className="w-4 h-4" />
                  {session.user.name}
                </Link>
                <button 
                  onClick={() => signOut()} 
                  className="bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full transition-colors"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-4">
                <Link href="/login" className="text-sm font-medium hover:text-gold transition-colors">Masuk</Link>
                <Link href="/register" className="bg-brand hover:bg-brand-hover text-white text-sm font-medium px-4 py-1.5 rounded-full transition-colors">
                  Daftar
                </Link>
              </div>
            )}
          </div>

          <div className="flex md:hidden items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-white">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-navy border-t border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="block px-3 py-2 text-base font-medium text-white hover:bg-white/10 rounded-md">Beranda</Link>
            <Link href="/books" className="block px-3 py-2 text-base font-medium text-white hover:bg-white/10 rounded-md">Katalog</Link>
            <Link href="/about" className="block px-3 py-2 text-base font-medium text-white hover:bg-white/10 rounded-md">Tentang</Link>
            <Link href="/contact" className="block px-3 py-2 text-base font-medium text-white hover:bg-white/10 rounded-md">Hubungi Kami</Link>
            <Link href="/cart" className="block px-3 py-2 text-base font-medium text-white hover:bg-white/10 rounded-md">Keranjang</Link>
            {session ? (
              <>
                <Link 
                  href={session.user.role === 'SELLER' ? '/dashboard/seller' : session.user.role === 'ADMIN' ? '/dashboard/admin' : '/orders'}
                  className="block px-3 py-2 text-base font-medium text-white hover:bg-white/10 rounded-md"
                >
                  Dashboard ({session.user.name})
                </Link>
                <button onClick={() => signOut()} className="block w-full text-left px-3 py-2 text-base font-medium text-white hover:bg-white/10 rounded-md">
                  Keluar
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-3 py-2 text-base font-medium text-white hover:bg-white/10 rounded-md">Masuk</Link>
                <Link href="/register" className="block px-3 py-2 text-base font-medium text-brand hover:bg-white/10 rounded-md">Daftar</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
