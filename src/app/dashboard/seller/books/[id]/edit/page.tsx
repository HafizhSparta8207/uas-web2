import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { EditBookForm } from "./EditBookForm";

export default async function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'SELLER') {
    redirect("/");
  }

  const userId = parseInt(session.user.id);
  const resolvedParams = await params;
  const bookId = parseInt(resolvedParams.id);

  if (isNaN(bookId)) {
    redirect("/dashboard/seller");
  }

  // Fetch the book and categories concurrently
  const [book, categories] = await Promise.all([
    prisma.book.findUnique({ where: { id: bookId } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } })
  ]);

  // If book doesn't exist, or doesn't belong to the logged in seller, redirect
  if (!book || book.sellerId !== userId) {
    redirect("/dashboard/seller");
  }

  // Serialize Prisma Decimal to Number before passing to Client Component
  const serializedBook = {
    ...book,
    price: Number(book.price)
  };

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <EditBookForm book={serializedBook} categories={categories} />
      </div>
    </div>
  );
}
