import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, ShieldCheck, MapPin, Truck, ShoppingCart, Heart } from "lucide-react";
import { AddToCartButton } from "@/components/AddToCartButton";

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const bookId = parseInt(resolvedParams.id);
  if (isNaN(bookId)) notFound();

  const book = await prisma.book.findUnique({
    where: { id: bookId },
    include: {
      category: true,
      seller: {
        include: {
          sellerProfile: true,
          addresses: {
            where: { isDefault: true },
            take: 1
          }
        }
      },
      images: true,
      reviews: {
        include: { buyer: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!book) notFound();

  const imageUrl = book.images && book.images.length > 0 
    ? book.images[0].imageUrl 
    : book.coverImageUrl || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop";

  const averageRating = book.reviews.length > 0
    ? book.reviews.reduce((acc, rev) => acc + rev.rating, 0) / book.reviews.length
    : 0;

  return (
    <div className="bg-background min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand">Beranda</Link>
          <span className="mx-2">/</span>
          <Link href="/books" className="hover:text-brand">Buku</Link>
          <span className="mx-2">/</span>
          <Link href={`/books?category=${book.category.slug}`} className="hover:text-brand">{book.category.name}</Link>
          <span className="mx-2">/</span>
          <span className="text-navy font-medium line-clamp-1">{book.title}</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
            
            {/* Image Column */}
            <div className="md:col-span-4 lg:col-span-3 p-6 bg-gray-50 flex flex-col items-center justify-start border-r border-gray-100">
              <div className="w-full aspect-[3/4] relative rounded-lg overflow-hidden shadow-md bg-gray-200 mb-4">
                <Image 
                  src={imageUrl} 
                  alt={book.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-navy shadow-sm">
                  {book.conditionStatus === "NEW" ? "Baru" : "Bekas"}
                </div>
              </div>
              
              {/* Additional Images Thumbnails if any */}
              {book.images.length > 1 && (
                <div className="flex gap-2 w-full overflow-x-auto pb-2">
                  {book.images.map((img, i) => (
                    <div key={img.id} className="w-16 h-20 relative rounded-md overflow-hidden border border-gray-200 shrink-0">
                      <Image src={img.imageUrl} alt={`${book.title} image ${i+1}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Details Column */}
            <div className="md:col-span-8 lg:col-span-6 p-6 lg:p-8">
              <div className="mb-2">
                <Link href={`/books?category=${book.category.slug}`} className="text-brand font-medium text-sm hover:underline">
                  {book.category.name}
                </Link>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-navy mb-2 leading-tight">
                {book.title}
              </h1>
              <p className="text-gray-500 mb-4 font-medium text-lg">{book.author}</p>
              
              <div className="flex items-center gap-4 mb-6 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-gold text-gold" />
                  <span className="font-bold">{averageRating > 0 ? averageRating.toFixed(1) : "-"}</span>
                  <span className="text-gray-400">({book.reviews.length} ulasan)</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="text-gray-600">Terjual <span className="font-bold text-navy">0</span></div>
              </div>

              <div className="text-3xl font-mono font-bold text-navy mb-8">
                Rp {Number(book.price).toLocaleString('id-ID')}
              </div>

              <div className="border-t border-gray-100 pt-6 mb-6">
                <h3 className="font-bold text-navy mb-3">Deskripsi Buku</h3>
                <div className="prose prose-sm max-w-none text-gray-600">
                  {book.description ? (
                    <p className="whitespace-pre-line">{book.description}</p>
                  ) : (
                    <p className="italic text-gray-400">Tidak ada deskripsi tersedia.</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400 block mb-1">ISBN</span>
                  <span className="font-medium text-navy">{book.isbn || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-1">Kondisi</span>
                  <span className="font-medium text-navy">{book.conditionStatus === "NEW" ? "Buku Baru" : "Buku Bekas (Preloved)"}</span>
                </div>
              </div>
            </div>

            {/* Action Column */}
            <div className="md:col-span-12 lg:col-span-3 p-6 bg-gray-50 border-l border-gray-100">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <h3 className="font-bold text-navy mb-3">Atur Pembelian</h3>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Stok:</span>
                  <span className="font-bold text-navy font-mono">{book.stock > 0 ? book.stock : 'Habis'}</span>
                </div>
                
                {book.stock > 0 ? (
                  <div className="space-y-3">
                    <AddToCartButton bookId={book.id} stock={book.stock} />
                    <button className="w-full bg-navy hover:bg-navy/90 text-white font-medium py-2.5 rounded-lg transition-colors">
                      Beli Sekarang
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-navy font-medium py-2.5 border border-gray-200 rounded-lg transition-colors">
                      <Heart className="w-4 h-4" /> Wishlist
                    </button>
                  </div>
                ) : (
                  <div className="w-full bg-gray-200 text-gray-500 font-medium py-2.5 rounded-lg text-center cursor-not-allowed">
                    Stok Habis
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <h3 className="font-bold text-navy mb-3">Informasi Penjual</h3>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-brand/10 text-brand rounded-full flex items-center justify-center font-bold font-serif">
                    {book.seller.sellerProfile?.storeName.charAt(0) || book.seller.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-navy text-sm">{book.seller.sellerProfile?.storeName || book.seller.name}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-brand" /> Terverifikasi
                    </div>
                  </div>
                </div>
                
                {book.seller.addresses && book.seller.addresses.length > 0 && (
                  <div className="text-sm text-gray-600 flex items-start gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    <span>Dikirim dari <span className="font-medium text-navy">{book.seller.addresses[0].city}</span></span>
                  </div>
                )}
                <div className="text-sm text-gray-600 flex items-start gap-2">
                  <Truck className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  <span>Pengiriman reguler & kargo tersedia</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
