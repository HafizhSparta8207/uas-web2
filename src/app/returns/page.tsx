import React from "react";
import { ShieldAlert, Video, RefreshCw } from "lucide-react";

export default function ReturnsPage() {
  return (
    <div className="bg-background min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-navy mb-8 text-center">Kebijakan Pengembalian</h1>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg flex gap-3 mb-8">
            <ShieldAlert className="w-6 h-6 shrink-0 mt-0.5" />
            <p className="text-sm leading-relaxed">
              <strong>Penting:</strong> Dana Anda aman bersama sistem rekening bersama LapakBuku. Pastikan untuk <strong>TIDAK</strong> mengklik tombol "Pesanan Diterima" jika Anda ingin mengajukan komplain atau retur barang.
            </p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold text-navy mb-3 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-brand" /> Syarat Pengajuan Retur
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Pembeli berhak mengajukan pengembalian barang atau dana apabila memenuhi kriteria berikut:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
                <li>Buku yang diterima <strong>salah judul / volume</strong> dan tidak sesuai pesanan.</li>
                <li>Buku mengalami <strong>kerusakan parah</strong> yang tidak disebutkan di deskripsi (misal: halaman hilang, sobek besar, cover lepas).</li>
                <li>Buku terbukti sebagai bajakan/non-original padahal diklaim original oleh penjual.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-navy mb-3 flex items-center gap-2">
                <Video className="w-5 h-5 text-brand" /> Wajib Video Unboxing
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Sebagai syarat mutlak verifikasi komplain, pembeli <strong>DIWAJIBKAN</strong> menyertakan video unboxing (buka paket) yang tidak terputus/diedit dari awal paket masih tersegel rapi hingga cacat pada buku terlihat jelas. Tanpa video unboxing, pihak LapakBuku berhak menolak ajuan retur.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-navy mb-3">Batas Waktu</h2>
              <p className="text-gray-600 leading-relaxed">
                Komplain dan pengajuan retur harus dilakukan maksimal <strong>2x24 jam (2 hari)</strong> sejak status resi pengiriman dinyatakan telah sampai (Delivered) ke alamat pembeli. Jika melewati batas waktu tersebut, pesanan akan dianggap selesai dan dana akan otomatis diteruskan ke penjual.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
