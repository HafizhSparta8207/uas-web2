import React from "react";
import { MapPin, Mail, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-background min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-navy mb-4">Hubungi Kami</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">Punya pertanyaan, kritik, atau saran? Jangan ragu untuk mengirimkan pesan kepada tim dukungan LapakBuku.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Contact Info */}
          <div className="bg-navy p-10 text-white">
            <h2 className="text-2xl font-serif font-bold mb-6">Informasi Operasional</h2>
            <p className="text-gray-300 mb-8 leading-relaxed">
              Tim dukungan kami selalu siap sedia membantu kendala transaksi, masalah akun, maupun diskusi kemitraan untuk memajukan literasi bersama.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-gold mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-1">Kantor Hub Utama</h3>
                  <p className="text-gray-300">
                    Gedung Literasi Lt. 3<br />
                    Jalan Panglima Batur No. 99<br />
                    Kota Banjarbaru, Kalimantan Selatan 70711
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-gold mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-1">Email Dukungan</h3>
                  <p className="text-gray-300">support@lapakbuku.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-gold mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-1">Telepon</h3>
                  <p className="text-gray-300">(0511) 477-8899</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="p-10">
            <h2 className="text-2xl font-serif font-bold text-navy mb-6">Kirim Pesan</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-navy mb-2">Nama Lengkap</label>
                <input 
                  type="text" 
                  id="name" 
                  placeholder="Masukkan nama Anda"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-colors"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-navy mb-2">Alamat Email</label>
                <input 
                  type="email" 
                  id="email" 
                  placeholder="nama@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-colors"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-bold text-navy mb-2">Pesan Aspirasi</label>
                <textarea 
                  id="message" 
                  rows={5}
                  placeholder="Tuliskan pertanyaan atau masukan Anda di sini..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-colors resize-none"
                ></textarea>
              </div>
              <button 
                type="button" 
                className="w-full bg-brand hover:bg-brand-hover text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Kirim Pesan
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
