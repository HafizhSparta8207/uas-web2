"use client";

import { useState } from "react";
import { Edit2, Trash2, Loader2, AlertTriangle } from "lucide-react";
import { deleteSellerBook } from "@/app/actions/sellerActions";
import Link from "next/link";

export function SellerBookTable({ books }: { books: any[] }) {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus buku ini dari koleksi Anda?")) return;

    setDeletingId(id);
    const res = await deleteSellerBook(id);
    setDeletingId(null);

    if (res?.error) {
      alert(res.error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h2 className="font-bold text-navy text-lg">Koleksi Buku Anda</h2>
      </div>

      <div className="p-6">
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 font-medium">Judul Buku</th>
                <th className="px-6 py-3 font-medium">Kategori</th>
                <th className="px-6 py-3 font-medium">Kondisi</th>
                <th className="px-6 py-3 font-medium">Harga & Stok</th>
                <th className="px-6 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {books.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Anda belum menambahkan buku apa pun.</td>
                </tr>
              ) : (
                books.map(book => (
                  <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/books/${book.id}`} className="font-bold text-navy hover:text-brand line-clamp-1" target="_blank">
                        {book.title}
                      </Link>
                      <div className="text-gray-500 text-xs mt-1">{book.author}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <span className="px-2.5 py-1 bg-gray-100 rounded-md text-xs">{book.category.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      {book.conditionStatus === 'NEW' ? (
                        <span className="text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">Baru</span>
                      ) : (
                        <span className="text-xs font-bold text-yellow-700 bg-yellow-100 px-2.5 py-1 rounded-full">Bekas</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-mono text-navy font-medium">Rp {Number(book.price).toLocaleString('id-ID')}</div>
                      <div className="text-xs text-gray-500 mt-1">Stok: {book.stock}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link 
                          href={`/dashboard/seller/books/${book.id}/edit`}
                          className="text-blue-500 hover:bg-blue-50 px-2.5 py-1.5 rounded-md transition-colors inline-flex items-center gap-1.5 font-medium border border-transparent hover:border-blue-200"
                          title="Edit Buku"
                        >
                          <Edit2 className="w-4 h-4" /> Edit
                        </Link>
                        <button 
                          onClick={() => handleDelete(book.id)}
                          disabled={deletingId === book.id}
                          className="text-red-500 hover:bg-red-50 px-2.5 py-1.5 rounded-md transition-colors inline-flex items-center gap-1.5 font-medium disabled:opacity-50 border border-transparent hover:border-red-200"
                          title="Hapus Buku"
                        >
                          {deletingId === book.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Trash2 className="w-4 h-4" /> Hapus</>}
                        </button>
                      </div>
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
