"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { updateCartItem, removeCartItem } from "@/app/actions/cartClientActions";

export function CartClient({ initialItems }: { initialItems: any[] }) {
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState(false);

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setLoading(true);
    setItems(items.map(item => item.id === itemId ? { ...item, quantity: newQuantity } : item));
    await updateCartItem(itemId, newQuantity);
    setLoading(false);
  };

  const handleRemove = async (itemId: number) => {
    setLoading(true);
    setItems(items.filter(item => item.id !== itemId));
    await removeCartItem(itemId);
    setLoading(false);
  };

  const subtotal = items.reduce((acc, item) => acc + (item.quantity * Number(item.book.price)), 0);

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <h2 className="text-xl font-bold text-navy mb-2">Keranjang Anda kosong</h2>
        <p className="text-gray-500 mb-6">Mulai belanja dan temukan buku favoritmu!</p>
        <Link href="/books" className="bg-brand hover:bg-brand-hover text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
          Lihat Katalog Buku
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        {items.map((item) => {
          const imgUrl = item.book.images?.length > 0 
            ? item.book.images[0].imageUrl 
            : item.book.coverImageUrl || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop";
          
          return (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="w-24 h-32 relative shrink-0 rounded-md overflow-hidden bg-gray-100 shadow-sm">
                <Image src={imgUrl} alt={item.book.title} fill className="object-cover" />
              </div>
              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-navy text-lg line-clamp-2 mb-1">{item.book.title}</h3>
                  <p className="text-gray-500 text-sm mb-2">Penjual: {item.book.seller.sellerProfile?.storeName || item.book.seller.name}</p>
                  <div className="font-mono font-bold text-gold text-lg">Rp {Number(item.book.price).toLocaleString('id-ID')}</div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden w-28 bg-white">
                    <button 
                      className="px-3 py-1 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={loading || item.quantity <= 1}
                    >-</button>
                    <input 
                      type="number" 
                      className="w-full text-center border-x border-gray-200 outline-none font-mono text-sm"
                      value={item.quantity}
                      readOnly
                    />
                    <button 
                      className="px-3 py-1 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      disabled={loading || item.quantity >= item.book.stock}
                    >+</button>
                  </div>
                  
                  <button 
                    onClick={() => handleRemove(item.id)}
                    disabled={loading}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
          <h3 className="font-bold text-navy text-lg mb-4">Ringkasan Belanja</h3>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Total Harga ({items.length} Barang)</span>
              <span className="font-mono">Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="flex justify-between items-end">
              <span className="font-bold text-navy">Total Tagihan</span>
              <span className="font-mono font-bold text-2xl text-gold">Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
          </div>
          
          <Link 
            href="/checkout"
            className="block w-full bg-brand hover:bg-brand-hover text-white text-center font-medium py-3 rounded-lg transition-colors"
          >
            Beli Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}
