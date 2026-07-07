"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface CatalogFiltersProps {
  categories: { id: number; name: string; slug: string }[];
}

export function CatalogFilters({ categories }: CatalogFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const q = searchParams.get('q') || "";
  const category = searchParams.get('category') || "";
  const condition = searchParams.get('condition') || "";

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    router.push(`/books?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchVal = formData.get('q') as string;
    updateFilters('q', searchVal);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col md:flex-row gap-4 mb-8 border border-gray-100">
      <form onSubmit={handleSearch} className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <Search className="h-5 w-5" />
        </div>
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Cari buku atau penulis..."
          className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand sm:text-sm transition-all outline-none"
        />
      </form>

      <div className="flex gap-2">
        <div className="relative flex-1 md:w-48">
          <select 
            value={category}
            onChange={(e) => updateFilters('category', e.target.value)}
            className="block w-full py-2.5 px-3 border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand sm:text-sm appearance-none"
          >
            <option value="">Semua Kategori</option>
            {categories.map(c => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
        
        <div className="relative flex-1 md:w-40">
          <select 
            value={condition}
            onChange={(e) => updateFilters('condition', e.target.value)}
            className="block w-full py-2.5 px-3 border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand sm:text-sm appearance-none"
          >
            <option value="">Semua Kondisi</option>
            <option value="NEW">Baru</option>
            <option value="USED">Bekas</option>
          </select>
        </div>
      </div>
    </div>
  );
}
