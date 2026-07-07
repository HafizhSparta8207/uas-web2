"use client";

import { useState } from "react";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { deleteBook } from "@/app/actions/adminActions";
import Link from "next/link";

export function AdminBookTable({ books }: { books: any[] }) {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm("Peringatan: Menghapus buku bersifat permanen. Apakah Anda yakin ingin memoderasi (menghapus) buku ini?")) return;

    setDeletingId(id);
    const res = await deleteBook(id);
    setDeletingId(null);

    if (res?.error) {
      alert(res.error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h2 className="font-bold text-navy text-lg">Moderasi Buku</h2>
      </div>

      <div className="p-6">
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 font-medium">Judul Buku</th>
                <th className="px-6 py-3 font-medium">Kategori</th>
                <th className="px-6 py-3 font-medium">Penjual</th>
                <th className="px-6 py-3 font-medium">Harga & Stok</th>
                <th className="px-6 py-3 font-medium text-right">Moderasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {books.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Belum ada buku terdaftar.</td>
                </tr>
              ) : (
                books.map(book => (
                  <tr key={book.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link href={`/books/${book.id}`} className="font-bold text-navy hover:text-brand line-clamp-2" target="_blank">
                        {book.title}
                      </Link>
                      <div className="text-gray-500 text-xs mt-1">{book.author}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <span className="px-2 py-1 bg-gray-100 rounded-md text-xs">{book.category.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-700">{book.seller.sellerProfile?.storeName || book.seller.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-mono text-navy font-medium">Rp {Number(book.price).toLocaleString('id-ID')}</div>
                      <div className="text-xs text-gray-500 mt-1">Stok: {book.stock}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(book.id)}
                        disabled={deletingId === book.id}
                        className="text-red-500 hover:text-white hover:bg-red-500 border border-red-500 px-3 py-1.5 rounded-md transition-colors inline-flex items-center gap-1.5 font-medium disabled:opacity-50"
                        title="Hapus Buku"
                      >
                        {deletingId === book.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><AlertTriangle className="w-4 h-4" /> Hapus</>}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
