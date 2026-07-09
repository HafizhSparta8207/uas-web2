import React from "react";

export default function TermsPage() {
  return (
    <div className="bg-background min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-navy mb-6 text-center">Syarat & Ketentuan</h1>
          <p className="text-gray-500 text-center mb-8">Pembaruan Terakhir: 1 Juli 2026</p>

          <div className="prose prose-brand max-w-none text-gray-600 space-y-6">
            <p>
              Selamat datang di <strong>LapakBuku</strong>. Dengan mengakses dan menggunakan layanan marketplace kami, Anda setuju untuk terikat dengan syarat dan ketentuan berikut. Harap membacanya dengan saksama.
            </p>

            <h3 className="text-xl font-bold text-navy mt-8 mb-3">1. Akun Pengguna</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Pengguna wajib memberikan informasi yang akurat dan valid saat pendaftaran (email, nama, dll).</li>
              <li>Satu pengguna diperbolehkan mendaftar sebagai Pembeli maupun Penjual.</li>
              <li>Keamanan kata sandi adalah tanggung jawab penuh masing-masing pemilik akun.</li>
            </ul>

            <h3 className="text-xl font-bold text-navy mt-8 mb-3">2. Aturan Berjualan (Penjual)</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Penjual dilarang keras memperjualbelikan buku bajakan, konten ilegal, atau buku yang melanggar hukum di Indonesia.</li>
              <li>Penjual wajib mendeskripsikan kondisi buku (Baru/Bekas) secara jujur, mendetail, dan melampirkan foto yang sesuai (jika perlu).</li>
              <li>Kegagalan memenuhi pesanan melebihi batas waktu (2x24 jam) akan mengakibatkan penalti performa toko.</li>
            </ul>

            <h3 className="text-xl font-bold text-navy mt-8 mb-3">3. Transaksi & Pembayaran (Pembeli)</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Semua transaksi wajib dilakukan melalui sistem pembayaran resmi yang disediakan oleh LapakBuku demi jaminan keamanan.</li>
              <li>Segala bentuk transaksi di luar platform (transfer langsung ke penjual) bukan menjadi tanggung jawab LapakBuku.</li>
            </ul>

            <h3 className="text-xl font-bold text-navy mt-8 mb-3">4. Penyelesaian Sengketa</h3>
            <p>
              Apabila terjadi perselisihan antara Pembeli dan Penjual (misal: barang rusak atau tidak sampai), LapakBuku akan bertindak sebagai mediator yang mengambil keputusan final berdasarkan bukti-bukti yang sah (seperti Resi & Video Unboxing).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
