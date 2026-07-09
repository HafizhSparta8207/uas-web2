"use client";

import { useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { createCategory, deleteCategory } from "@/app/actions/adminActions";

export function AdminCategoryTable({ categories }: { categories: any[] }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;

    setLoading(true);
    const res = await createCategory(name, slug);
    setLoading(false);

    if (res.success) {
      setName("");
      setSlug("");
    } else {
      alert(res.error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kategori ini?")) return;

    setDeletingId(id);
    const res = await deleteCategory(id);
    setDeletingId(null);

    if (res?.error) {
      alert(res.error);
    }
  };

  // Auto-generate slug from name
  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h2 className="font-bold text-navy text-lg">Manajemen Kategori</h2>
      </div>

      <div className="p-6">
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3 mb-6">
          <input 
            type="text" 
            placeholder="Nama Kategori (contoh: Fiksi Ilmiah)"
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/50"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
          />
          <input 
            type="text" 
            placeholder="Slug (contoh: fiksi-ilmiah)"
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand/50"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
          <button 
            type="submit" 
            disabled={loading || !name}
            className="bg-brand hover:bg-brand-hover text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 min-w-[120px]"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /> Tambah</>}
          </button>
        </form>

        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-200 hidden md:table-header-group">
              <tr>
                <th className="px-6 py-3 font-medium">ID</th>
                <th className="px-6 py-3 font-medium">Nama Kategori</th>
                <th className="px-6 py-3 font-medium">Slug</th>
                <th className="px-6 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 md:divide-y-0">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">Belum ada kategori.</td>
                </tr>
              ) : (
                categories.map(cat => (
                  <tr key={cat.id} className="flex flex-col md:table-row border-b border-gray-200 p-3 mb-2 bg-white rounded-lg shadow-sm md:shadow-none hover:bg-gray-50">
                    <td className="block py-1 md:table-cell md:px-6 md:py-4 text-gray-500">
                      <span className="md:hidden text-xs font-semibold text-gray-400 mr-2">ID:</span>{cat.id}
                    </td>
                    <td className="block py-1 md:table-cell md:px-6 md:py-4 font-medium text-navy">
                      <span className="md:hidden text-xs font-semibold text-gray-400 mr-2">Kategori:</span>{cat.name}
                    </td>
                    <td className="block py-1 md:table-cell md:px-6 md:py-4 font-mono text-gray-500 text-xs">
                      <span className="md:hidden text-xs font-semibold text-gray-400 mr-2">Slug:</span>{cat.slug}
                    </td>
                    <td className="block py-1 md:table-cell md:px-6 md:py-4 text-right mt-2 md:mt-0">
                      <div className="flex justify-end">
                        <button 
                          onClick={() => handleDelete(cat.id)}
                          disabled={deletingId === cat.id}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 border md:border-0 border-red-200 md:border-transparent px-3 md:px-3 py-1.5 rounded-md transition-colors inline-flex items-center justify-center gap-1.5 disabled:opacity-50 w-full md:w-auto"
                        >
                          {deletingId === cat.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          <span className="md:hidden font-medium text-sm">Hapus</span>
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
