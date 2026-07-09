"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function HomeSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/books?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="bg-white p-2 rounded-xl shadow-lg flex items-center max-w-xl">
      <div className="pl-4 text-gray-400">
        <Search className="w-6 h-6" />
      </div>
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari judul buku, penulis, atau ISBN..." 
        className="w-full px-4 py-3 text-navy focus:outline-none"
      />
      <button type="submit" className="bg-brand hover:bg-brand-hover text-white px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap">
        Cari Buku
      </button>
    </form>
  );
}
