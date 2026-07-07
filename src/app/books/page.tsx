import { prisma } from "@/lib/prisma";
import { BookCard } from "@/components/BookCard";
import Link from "next/link";
import { CatalogFilters } from "@/components/CatalogFilters";
import { Search } from "lucide-react";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const q = typeof searchParams.q === 'string' ? searchParams.q : undefined;
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;
  const condition = typeof searchParams.condition === 'string' ? searchParams.condition : undefined;
  
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1;
  const limit = 12;
  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = {};
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { author: { contains: q } },
    ];
  }
  if (category) {
    where.category = { slug: category };
  }
  if (condition && (condition === 'NEW' || condition === 'USED')) {
    where.conditionStatus = condition;
  }

  const [books, total, categories] = await Promise.all([
    prisma.book.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { category: true, images: true }
    }),
    prisma.book.count({ where }),
    prisma.category.findMany()
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="bg-navy py-12 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">Katalog Buku</h1>
          <p className="text-gray-300 max-w-2xl">Jelajahi ribuan koleksi buku fiksi, non-fiksi, edukasi, dan lainnya. Temukan bacaan favoritmu berikutnya.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <CatalogFilters categories={categories} />

        {books.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
              {books.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    const isActive = page === pageNum;
                    return (
                      <Link
                        key={pageNum}
                        href={`/books?page=${pageNum}${q ? `&q=${q}` : ''}${category ? `&category=${category}` : ''}${condition ? `&condition=${condition}` : ''}`}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          isActive
                            ? 'z-10 bg-brand border-brand text-white'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        } ${i === 0 ? 'rounded-l-md' : ''} ${i === totalPages - 1 ? 'rounded-r-md' : ''}`}
                      >
                        {pageNum}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Search className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-navy mb-2">Tidak ada buku ditemukan</h3>
            <p className="text-gray-500">Coba sesuaikan filter atau kata kunci pencarian Anda.</p>
            <Link href="/books" className="inline-block mt-6 text-brand hover:underline font-medium">
              Hapus Filter
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
