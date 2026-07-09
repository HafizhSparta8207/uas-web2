"use client";

import { useState } from "react";
import { Trash2, AlertTriangle, Loader2, Search } from "lucide-react";
import { deleteBook } from "@/app/actions/adminActions";
import Link from "next/link";

export function AdminBookTable({ books }: { books: any[] }) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const paginatedBooks = filteredBooks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
      <div className="px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 bg-gray-50">
        <h2 className="font-bold text-navy text-lg">Moderasi Buku</h2>
        <div className="flex flex-col md:flex-row md:items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-80 md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Cari judul buku atau penulis di sini..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/50 text-sm bg-white"
            />
          </div>
          <Link 
            href="/dashboard/seller/books/new"
            className="bg-brand hover:bg-brand-hover text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm w-full md:w-auto text-center whitespace-nowrap"
          >
            + Tambah Buku Baru
          </Link>
        </div>
      </div>

      <div className="p-6">
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-200 hidden md:table-header-group">
              <tr>
                <th className="px-6 py-3 font-medium">Judul Buku</th>
                <th className="px-6 py-3 font-medium">Kategori</th>
                <th className="px-6 py-3 font-medium">Penjual</th>
                <th className="px-6 py-3 font-medium">Harga & Stok</th>
                <th className="px-6 py-3 font-medium text-right">Moderasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 md:divide-y-0">
              {filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    {searchQuery ? "Buku yang Anda cari tidak ditemukan." : "Belum ada buku terdaftar."}
                  </td>
                </tr>
              ) : (
                paginatedBooks.map(book => (
                  <tr key={book.id} className="flex flex-col md:table-row border-b border-gray-200 p-4 mb-3 bg-white rounded-lg shadow-sm md:shadow-none hover:bg-gray-50">
                    <td className="block py-1 md:table-cell md:px-6 md:py-4">
                      <Link href={`/books/${book.id}`} className="font-bold text-navy hover:text-brand line-clamp-2" target="_blank">
                        {book.title}
                      </Link>
                      <div className="text-gray-500 text-xs mt-1">{book.author}</div>
                    </td>
                    <td className="block py-1 md:table-cell md:px-6 md:py-4 text-gray-600">
                      <span className="px-2 py-1 bg-gray-100 rounded-md text-xs">{book.category.name}</span>
                    </td>
                    <td className="block py-1 md:table-cell md:px-6 md:py-4">
                      <div className="font-medium text-gray-700">
                        <span className="md:hidden text-xs text-gray-500 mr-2">Penjual:</span>
                        {book.seller.sellerProfile?.storeName || book.seller.name}
                      </div>
                    </td>
                    <td className="block py-1 md:table-cell md:px-6 md:py-4">
                      <div className="font-mono text-navy font-medium">Rp {Number(book.price).toLocaleString('id-ID')}</div>
                      <div className="text-xs text-gray-500 mt-1">Stok: {book.stock}</div>
                    </td>
                    <td className="flex gap-2 mt-3 justify-end md:justify-end md:mt-0 md:table-cell md:px-6 md:py-4 md:text-right">
                      <Link
                        href={`/dashboard/seller/books/${book.id}/edit`}
                        className="text-brand hover:text-white hover:bg-brand border border-brand px-3 py-1.5 rounded-md transition-colors inline-flex items-center justify-center gap-1.5 font-medium w-full md:w-auto md:mr-2"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(book.id)}
                        disabled={deletingId === book.id}
                        className="text-red-500 hover:text-white hover:bg-red-500 border border-red-500 px-3 py-1.5 rounded-md transition-colors inline-flex items-center justify-center gap-1.5 font-medium disabled:opacity-50 w-full md:w-auto"
                        title="Hapus Buku"
                      >
                        {deletingId === book.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Trash2 className="w-4 h-4" /> Hapus</>}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sebelumnya
            </button>
            <span className="text-sm text-gray-500">
              Halaman {currentPage} dari {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Selanjutnya
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
