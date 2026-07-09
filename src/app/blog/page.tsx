import React from "react";
import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";

export default function BlogPage() {
  const articles = [
    {
      id: 1,
      title: "5 Tips Ampuh Merawat Buku Bekas Agar Tetap Awet",
      excerpt: "Membeli buku bekas memang menghemat kantong, namun perawatannya butuh perhatian ekstra. Simak cara menghilangkan noda kuning dan menjaga kertas agar tidak lapuk.",
      date: "12 Juli 2026",
      author: "Admin LapakBuku",
      image: "https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?w=600&q=80"
    },
    {
      id: 2,
      title: "Membangun Sudut Literasi Nyaman di Kamar Kos",
      excerpt: "Tidak perlu ruang luas untuk membuat perpustakaan mini. Dengan rak gantung dan pencahayaan yang tepat, kamu bisa membaca dengan nyaman di ruang terbatas.",
      date: "05 Juli 2026",
      author: "Redaksi Literasi",
      image: "https://images.unsplash.com/photo-1463320726281-696a485928c7?w=600&q=80"
    },
    {
      id: 3,
      title: "Rekomendasi Novel Fiksi Sci-Fi untuk Pemula",
      excerpt: "Ingin mencoba genre fiksi ilmiah tapi takut bahasanya terlalu berat? Berikut 3 rekomendasi novel Sci-Fi ringan yang cocok untuk menemani akhir pekanmu.",
      date: "28 Juni 2026",
      author: "Budi Penjual",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80"
    }
  ];

  return (
    <div className="bg-background min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-navy mb-4">Blog & Artikel</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">Temukan inspirasi literasi, tips merawat buku, dan rekomendasi bacaan terbaik dari komunitas LapakBuku.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article key={article.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="h-48 overflow-hidden relative">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {article.date}</span>
                  <span className="flex items-center gap-1"><User className="w-3 h-3" /> {article.author}</span>
                </div>
                <h2 className="text-xl font-bold text-navy mb-3 line-clamp-2 hover:text-brand transition-colors">
                  <Link href={`/blog/${article.id}`}>{article.title}</Link>
                </h2>
                <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-1">{article.excerpt}</p>
                <Link href={`/blog/${article.id}`} className="inline-flex items-center gap-2 text-brand font-medium text-sm hover:text-brand-hover">
                  Baca Selengkapnya <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
