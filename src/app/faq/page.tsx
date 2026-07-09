import React from "react";

export default function FAQPage() {
  const faqs = [
    {
      q: "Bagaimana cara membeli buku di LapakBuku?",
      a: "Sangat mudah! Anda cukup membuat akun sebagai Pembeli, cari buku yang Anda inginkan di halaman Katalog, masukkan ke keranjang, dan lanjutkan ke proses Checkout. Isi alamat pengiriman dan pilih metode pembayaran untuk menyelesaikan pesanan."
    },
    {
      q: "Metode pembayaran apa saja yang didukung?",
      a: "Saat ini kami mendukung metode pembayaran via transfer Bank (BCA, Mandiri, BNI, BRI), e-Wallet (GoPay, OVO, Dana), dan Virtual Account. Sistem kami akan memverifikasi pembayaran Anda secara otomatis."
    },
    {
      q: "Bagaimana cara mendaftar menjadi Penjual (Seller)?",
      a: "Saat melakukan registrasi akun baru, Anda dapat memilih tipe akun sebagai 'Penjual'. Setelah akun jadi, Anda bisa langsung mengakses panel Dashboard Penjual untuk mengatur profil toko dan mulai menambahkan daftar buku dagangan Anda."
    },
    {
      q: "Apakah keamanan transaksi dijamin?",
      a: "Ya! Sistem kami menggunakan rekening bersama (escrow). Dana yang Anda bayarkan akan kami tahan sementara dan baru akan diteruskan kepada penjual setelah Anda mengonfirmasi bahwa buku telah diterima dalam kondisi baik."
    }
  ];

  return (
    <div className="bg-background min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-navy mb-8 text-center">Tanya Jawab (FAQ)</h1>
        
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-navy mb-3">{faq.q}</h3>
              <p className="text-gray-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-500 mb-4">Tidak menemukan jawaban yang Anda cari?</p>
          <a href="/contact" className="text-brand hover:underline font-medium">Hubungi Tim Dukungan Kami</a>
        </div>
      </div>
    </div>
  );
}
