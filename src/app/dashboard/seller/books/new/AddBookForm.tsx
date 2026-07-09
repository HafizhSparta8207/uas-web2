"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBook } from "@/app/actions/bookActions";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export function AddBookForm({ categories }: { categories: any[] }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [coverBase64, setCoverBase64] = useState("");
  const [fileError, setFileError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setFileError("Ukuran gambar terlalu besar! Maksimal berkas adalah 2MB.");
        setCoverBase64("");
      } else {
        setFileError("");
        const reader = new FileReader();
        reader.onloadend = () => {
          setCoverBase64(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFileError("");
      setCoverBase64("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    if (coverBase64) {
      formData.set("coverImageUrl", coverBase64);
    }
    const res = await createBook(formData);

    setLoading(false);

    if (res.error) {
      setError(res.error || "Gagal menambahkan data buku.");
      toast.error("Gagal menambahkan data buku.");
    } else {
      toast.success("Berhasil menambahkan data buku!");
      if (session?.user?.role === 'ADMIN') {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/seller");
      }
      router.refresh();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <h2 className="font-bold text-navy text-xl font-serif">Formulir Tambah Buku</h2>
        <button type="button" onClick={() => router.back()} className="text-gray-500 hover:text-navy flex items-center gap-1 text-sm font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>
      </div>

      <div className="p-6 md:p-8">
        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Judul Buku */}
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="title" className="block text-sm font-bold text-navy">Judul Buku <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                id="title" 
                name="title" 
                required 
                placeholder="Masukkan judul buku lengkap"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-colors"
              />
            </div>

            {/* Penulis */}
            <div className="space-y-2">
              <label htmlFor="author" className="block text-sm font-bold text-navy">Penulis <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                id="author" 
                name="author" 
                required 
                placeholder="Nama penulis"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-colors"
              />
            </div>

            {/* Kategori */}
            <div className="space-y-2">
              <label htmlFor="categoryId" className="block text-sm font-bold text-navy">Kategori <span className="text-red-500">*</span></label>
              <select 
                id="categoryId" 
                name="categoryId" 
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-colors bg-white"
              >
                <option value="">Pilih Kategori</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Asal Negara */}
            <div className="space-y-2">
              <label htmlFor="origin" className="block text-sm font-bold text-navy">Asal Negara <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                id="origin" 
                name="origin" 
                required 
                placeholder="Misal: Jepang, Indonesia, Inggris"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-colors"
              />
            </div>

            {/* Harga */}
            <div className="space-y-2">
              <label htmlFor="price" className="block text-sm font-bold text-navy">Harga (Rp) <span className="text-red-500">*</span></label>
              <input 
                type="number" 
                id="price" 
                name="price" 
                required 
                min="0"
                placeholder="Contoh: 95000"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-colors"
              />
            </div>

            {/* Stok & Kondisi */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="stock" className="block text-sm font-bold text-navy">Stok <span className="text-red-500">*</span></label>
                <input 
                  type="number" 
                  id="stock" 
                  name="stock" 
                  required 
                  min="1"
                  placeholder="Jumlah stok"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="conditionStatus" className="block text-sm font-bold text-navy">Kondisi <span className="text-red-500">*</span></label>
                <select 
                  id="conditionStatus" 
                  name="conditionStatus" 
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-colors bg-white"
                >
                  <option value="NEW">Baru</option>
                  <option value="USED">Bekas</option>
                </select>
              </div>
            </div>

            {/* ISBN */}
            <div className="space-y-2">
              <label htmlFor="isbn" className="block text-sm font-bold text-navy">ISBN <span className="text-gray-400 font-normal text-xs">(Opsional)</span></label>
              <input 
                type="text" 
                id="isbn" 
                name="isbn" 
                placeholder="Nomor ISBN buku"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-colors"
              />
            </div>

            {/* Gambar Sampul */}
            <div className="space-y-2">
              <label htmlFor="coverImageFile" className="block text-sm font-bold text-navy">Gambar Sampul <span className="text-gray-400 font-normal text-xs">(Opsional)</span></label>
              <input 
                type="file" 
                id="coverImageFile" 
                name="coverImageFile" 
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand/10 file:text-brand hover:file:bg-brand/20"
              />
              {fileError ? (
                <p className="text-xs text-red-500 mt-1">{fileError}</p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">Pilih gambar dari perangkat Anda. Maksimal 2MB.</p>
              )}
            </div>

            {/* Deskripsi */}
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="description" className="block text-sm font-bold text-navy">Deskripsi Buku <span className="text-gray-400 font-normal text-xs">(Opsional)</span></label>
              <textarea 
                id="description" 
                name="description" 
                rows={4}
                placeholder="Ceritakan tentang buku ini..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-colors"
              ></textarea>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
            <button 
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={loading || fileError !== ""}
              className="bg-brand hover:bg-brand-hover text-white px-8 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Simpan Buku</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
