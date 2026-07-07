"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "@/app/actions/orderActions";
import { MapPin, CreditCard } from "lucide-react";

export function CheckoutClient({ initialItems, addresses }: { initialItems: any[], addresses: any[] }) {
  const router = useRouter();
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(addresses.length > 0 ? addresses[0].id : null);
  const [paymentMethod, setPaymentMethod] = useState("Transfer Bank");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subtotal = initialItems.reduce((acc, item) => acc + (item.quantity * Number(item.book.price)), 0);

  const handleCheckout = async () => {
    if (!selectedAddressId) {
      setError("Silakan pilih atau tambahkan alamat pengiriman");
      return;
    }

    setLoading(true);
    setError("");

    const res = await createOrder({
      addressId: selectedAddressId,
      paymentMethod,
    });

    setLoading(false);

    if (res.success) {
      router.push("/orders?success=true");
    } else {
      setError(res.error || "Gagal membuat pesanan");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-brand" /> Alamat Pengiriman
          </h2>
          
          {addresses.length === 0 ? (
            <div className="text-gray-500 mb-4">Anda belum memiliki alamat tersimpan. Silakan tambahkan alamat terlebih dahulu di profil Anda.</div>
          ) : (
            <div className="space-y-3">
              {addresses.map((addr) => (
                <label key={addr.id} className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${selectedAddressId === addr.id ? 'border-brand bg-brand/5' : 'border-gray-200 hover:border-brand/50'}`}>
                  <input 
                    type="radio" 
                    name="address" 
                    className="mt-1 text-brand focus:ring-brand"
                    checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)}
                  />
                  <div>
                    <div className="font-bold text-navy">{addr.recipientName}</div>
                    <div className="text-sm text-gray-500">{addr.phone}</div>
                    <div className="text-sm text-gray-600 mt-1">{addr.fullAddress}, {addr.city}, {addr.province} {addr.postalCode}</div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-brand" /> Metode Pembayaran (Simulasi)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {["Transfer Bank", "Virtual Account", "Kartu Kredit", "COD"].map((method) => (
              <label key={method} className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === method ? 'border-brand bg-brand/5' : 'border-gray-200 hover:border-brand/50'}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  className="text-brand focus:ring-brand"
                  checked={paymentMethod === method}
                  onChange={() => setPaymentMethod(method)}
                />
                <span className="font-medium text-navy">{method}</span>
              </label>
            ))}
          </div>
        </div>

      </div>
      
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
          <h3 className="font-bold text-navy text-lg mb-4">Ringkasan Pesanan</h3>
          
          <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {initialItems.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <div className="text-gray-600 flex-1 pr-4 line-clamp-2">{item.book.title} <span className="text-gray-400">x{item.quantity}</span></div>
                <div className="font-mono text-navy font-medium shrink-0">Rp {(item.quantity * Number(item.book.price)).toLocaleString('id-ID')}</div>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-200 pt-4 space-y-3 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Total Harga</span>
              <span className="font-mono">Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Ongkos Kirim</span>
              <span className="font-mono text-brand font-medium">Gratis</span>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="flex justify-between items-end">
              <span className="font-bold text-navy">Total Tagihan</span>
              <span className="font-mono font-bold text-2xl text-gold">Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
          </div>
          
          <button 
            onClick={handleCheckout}
            disabled={loading || !selectedAddressId}
            className="w-full bg-brand hover:bg-brand-hover text-white text-center font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Buat Pesanan"}
          </button>
        </div>
      </div>
    </div>
  );
}
