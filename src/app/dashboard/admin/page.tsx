import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminDashboardClient } from "./AdminDashboardClient";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') redirect("/");

  const [usersCount, booksCount, categoriesCount] = await Promise.all([
    prisma.user.count(),
    prisma.book.count(),
    prisma.category.count()
  ]);

  // Fetch full data for tables
  const [categories, users, books] = await Promise.all([
    prisma.category.findMany({ orderBy: { id: 'asc' } }),
    prisma.user.findMany({ 
      orderBy: { createdAt: 'desc' },
      include: { sellerProfile: true }
    }),
    prisma.book.findMany({
      orderBy: { createdAt: 'desc' },
      include: { category: true, seller: { include: { sellerProfile: true } } }
    })
  ]);

  // We need to serialize Book Decimal price to Native JS Number before passing to Client Component
  const serializedBooks = books.map(b => ({
    ...b,
    price: Number(b.price)
  }));

  return (
    <AdminDashboardClient
      categories={categories}
      users={users}
      books={serializedBooks}
      stats={{ usersCount, booksCount, categoriesCount }}
      userName={session.user.name || "Admin"}
    />
  );
}
