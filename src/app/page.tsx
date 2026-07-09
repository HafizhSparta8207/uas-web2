import Link from "next/link";
import { Search, TrendingUp, BookMarked, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { BookCard } from "@/components/BookCard";
import { HomeSearch } from "@/components/HomeSearch";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const featuredBooks = await prisma.book.findMany({
    take: 4,
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      category: true,
      images: true,
    }
  });

  const categories = await prisma.category.findMany({
    take: 6,
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold via-navy to-navy"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6">
                Temukan Buku Impianmu di <span className="text-gold">LapakBuku</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg">
                Marketplace buku baru dan bekas terbesar. Jual beli mudah, aman, dan terpercaya dengan jutaan koleksi.
              </p>
              
              <HomeSearch />
            </div>
            
            <div className="hidden lg:block relative">
              {/* Decorative elements for hero */}
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-gold/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-brand/20 rounded-full blur-3xl"></div>
              
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-2xl bg-background border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-brand/10 text-brand rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookMarked className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif font-bold text-navy mb-2">Koleksi Terlengkap</h3>
              <p className="text-gray-500">Jutaan buku dari berbagai kategori, kondisi baru maupun preloved berkualitas.</p>
            </div>
            <div className="p-6 rounded-2xl bg-background border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-gold/10 text-gold rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif font-bold text-navy mb-2">Transaksi Aman</h3>
              <p className="text-gray-500">Sistem pembayaran terjamin dan fitur tracking pengiriman untuk keamanan Anda.</p>
            </div>
            <div className="p-6 rounded-2xl bg-background border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-rust/10 text-rust rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif font-bold text-navy mb-2">Harga Terbaik</h3>
              <p className="text-gray-500">Temukan buku idaman dengan harga bersaing langsung dari pembaca dan toko buku.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-serif font-bold text-navy mb-2">Buku Terbaru</h2>
              <p className="text-gray-500">Koleksi buku terbaru yang baru saja ditambahkan.</p>
            </div>
            <Link href="/books" className="hidden sm:flex text-brand hover:text-brand-hover font-medium items-center gap-1">
              Lihat Semua &rarr;
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
          
          <div className="mt-8 sm:hidden text-center">
            <Link href="/books" className="inline-block bg-white text-navy font-medium px-6 py-2.5 border border-gray-200 rounded-lg shadow-sm">
              Lihat Semua Buku
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
