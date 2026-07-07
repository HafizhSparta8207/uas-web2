import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Book, Category } from "@prisma/client";

interface BookCardProps {
  book: Book & {
    category: Category;
    images?: { imageUrl: string }[];
  };
}

export function BookCard({ book }: BookCardProps) {
  // Use first image or a placeholder
  const imageUrl = book.images && book.images.length > 0 
    ? book.images[0].imageUrl 
    : book.coverImageUrl || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop";

  return (
    <div className="group relative flex flex-col bg-white rounded-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl shadow-md overflow-hidden">
      {/* Book Spine Effect - shadow on left side */}
      <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/20 to-transparent z-10 pointer-events-none mix-blend-multiply rounded-l-xl"></div>
      <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-white/40 z-20 pointer-events-none"></div>
      
      <Link href={`/books/${book.id}`} className="flex-grow flex flex-col relative z-0">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100 rounded-t-xl">
          <Image 
            src={imageUrl} 
            alt={book.title} 
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-navy shadow-sm border border-white/50">
            {book.conditionStatus === "NEW" ? "Baru" : "Bekas"}
          </div>
          
          {/* Spine label effect */}
          <div className="absolute bottom-3 left-0 bg-brand text-white text-xs font-medium px-3 py-1 rounded-r-md shadow-md border-y border-r border-brand-hover">
            {book.category.name}
          </div>
        </div>
        
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-serif font-bold text-navy text-lg line-clamp-2 leading-tight mb-1 group-hover:text-brand transition-colors">
            {book.title}
          </h3>
          <p className="text-gray-500 text-sm mb-3 font-medium">{book.author}</p>
          
          <div className="mt-auto flex items-center justify-between">
            <div className="font-mono font-bold text-gold text-lg">
              Rp {Number(book.price).toLocaleString('id-ID')}
            </div>
            
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Star className="w-4 h-4 fill-gold text-gold" />
              <span>4.8</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
