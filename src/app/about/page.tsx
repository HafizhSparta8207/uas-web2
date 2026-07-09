import React from "react";

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-navy mb-6 text-center">Tentang Kami</h1>
          <div className="prose prose-brand max-w-none text-gray-600">
            <p className="text-lg leading-relaxed mb-6">
              <strong>LapakBuku</strong> adalah sebuah prototipe aplikasi web *e-commerce marketplace* buku yang dirancang secara khusus untuk mewadahi ekosistem jual beli buku, baik baru maupun bekas.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              Aplikasi ini dikembangkan dengan arsitektur modern menggunakan teknologi <strong>Next.js 16</strong> sebagai *framework frontend* dan *backend serverless*, serta ditenagai oleh <strong>Prisma ORM</strong> dan basis data <strong>MySQL</strong> untuk manajemen data yang tangguh dan terstruktur.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              Proyek ini disusun secara akademis dan formal sebagai bentuk pemenuhan tugas Ujian Akhir Semester (UAS) pada mata kuliah Pemrograman Web. Tujuan utama dari pengembangan platform ini adalah untuk mendemonstrasikan implementasi praktis dari konsep pembuatan portal *marketplace* yang dinamis, interaktif, dan *scalable*.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
