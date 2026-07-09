import React from "react";

export default function PrivacyPage() {
  return (
    <div className="bg-background min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-navy mb-6 text-center">Kebijakan Privasi</h1>
          <p className="text-gray-500 text-center mb-8">Efektif per: 1 Juli 2026</p>

          <div className="prose prose-brand max-w-none text-gray-600 space-y-6">
            <p>
              Privasi dan keamanan data Anda adalah prioritas utama kami di <strong>LapakBuku</strong>. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda.
            </p>

            <h3 className="text-xl font-bold text-navy mt-8 mb-3">Pengumpulan Data</h3>
            <p>
              Kami hanya mengumpulkan data yang esensial untuk memproses kelancaran transaksi Anda, yang meliputi: nama lengkap, alamat email, nomor telepon, alamat pengiriman fisik, dan riwayat transaksi.
            </p>

            <h3 className="text-xl font-bold text-navy mt-8 mb-3">Keamanan Enkripsi</h3>
            <p>
              Seluruh data otentikasi, khususnya <strong>Kata Sandi (Password)</strong>, tidak pernah kami simpan dalam bentuk teks biasa (plaintext). Kami menggunakan algoritma *Bcrypt* yang berstandar industri dengan *salt rounds* tingkat tinggi untuk mengenkripsi setiap kata sandi Anda di basis data kami.
            </p>

            <h3 className="text-xl font-bold text-navy mt-8 mb-3">Penggunaan Informasi</h3>
            <p>Informasi yang kami simpan murni digunakan untuk tujuan:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Memverifikasi identitas akun dan akses dashboard Anda.</li>
              <li>Memproses pengiriman pesanan buku dari penjual ke alamat Anda.</li>
              <li>Mencegah aktivitas penipuan dan menjaga integritas marketplace.</li>
            </ul>

            <h3 className="text-xl font-bold text-navy mt-8 mb-3">Pihak Ketiga</h3>
            <p>
              Kami tidak akan pernah menjual, menyewakan, atau menukar data pribadi Anda kepada pihak ketiga untuk kepentingan iklan sembarangan. Data pengiriman (nama & alamat) hanya akan kami bagikan secara ketat kepada pihak Jasa Ekspedisi Logistik dan Penjual terkait demi menyelesaikan pesanan Anda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
