import Link from "next/link";
import { BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-12 pb-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-brand mb-4">
              <BookOpen className="w-8 h-8" />
              <span className="font-serif font-bold text-2xl tracking-tight text-navy">LapakBuku</span>
            </Link>
            <p className="text-gray-500 text-sm mb-4">
              Platform marketplace jual beli buku baru dan bekas terpercaya di Indonesia. Temukan buku favoritmu di sini.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-navy mb-4 font-serif">LapakBuku</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/about" className="hover:text-brand transition-colors">Tentang Kami</Link></li>
              <li><Link href="/books" className="hover:text-brand transition-colors">Katalog Buku</Link></li>
              <li><Link href="/blog" className="hover:text-brand transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-brand transition-colors">Hubungi Kami</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-navy mb-4 font-serif">Bantuan</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/faq" className="hover:text-brand transition-colors">FAQ</Link></li>
              <li><Link href="/shipping" className="hover:text-brand transition-colors">Pengiriman</Link></li>
              <li><Link href="/returns" className="hover:text-brand transition-colors">Pengembalian</Link></li>
              <li><Link href="/terms" className="hover:text-brand transition-colors">Syarat & Ketentuan</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} LapakBuku. Hak Cipta Dilindungi.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-brand">Kebijakan Privasi</Link>
            <Link href="/terms" className="hover:text-brand">Syarat Layanan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
