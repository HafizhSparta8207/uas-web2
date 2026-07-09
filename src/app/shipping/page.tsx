import React from "react";
import { Truck, Clock, Package } from "lucide-react";

export default function ShippingPage() {
  return (
    <div className="bg-background min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-navy mb-8 text-center">Informasi Pengiriman</h1>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 space-y-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-14 h-14 bg-brand/10 text-brand rounded-full flex items-center justify-center shrink-0">
              <Truck className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-navy mb-3">Kurir yang Didukung</h2>
              <p className="text-gray-600 leading-relaxed mb-2">
                Kami bekerja sama dengan berbagai layanan logistik tepercaya di Indonesia untuk memastikan buku sampai ke tangan Anda dengan aman:
              </p>
              <ul className="list-disc list-inside text-gray-600 ml-2 space-y-1">
                <li>JNE (Reguler, YES)</li>
                <li>J&T Express</li>
                <li>SiCepat (Halu, Best)</li>
                <li>GoSend / GrabExpress (Untuk pengiriman dalam kota yang sama)</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-14 h-14 bg-gold/10 text-gold rounded-full flex items-center justify-center shrink-0">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-navy mb-3">Estimasi Pengemasan</h2>
              <p className="text-gray-600 leading-relaxed">
                Setiap penjual di LapakBuku diwajibkan untuk memproses, mengemas, dan menyerahkan pesanan kepada pihak kurir dalam waktu maksimal <strong>2x24 jam kerja</strong> sejak pembayaran berhasil diverifikasi. Jika penjual gagal mengirimkan dalam batas waktu tersebut, pesanan akan dibatalkan secara otomatis dan dana akan dikembalikan 100% kepada pembeli.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-14 h-14 bg-rust/10 text-rust rounded-full flex items-center justify-center shrink-0">
              <Package className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-navy mb-3">Lacak Pesanan</h2>
              <p className="text-gray-600 leading-relaxed">
                Nomor resi pengiriman akan ter-update secara otomatis di halaman <strong>Pesanan Saya</strong>. Anda dapat memantau pergerakan paket secara _real-time_ tanpa harus meninggalkan platform LapakBuku.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
