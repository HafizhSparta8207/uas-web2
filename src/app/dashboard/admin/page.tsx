import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Users, BookOpen, LayoutList } from "lucide-react";
import { AdminCategoryTable } from "./AdminCategoryTable";
import { AdminUserTable } from "./AdminUserTable";
import { AdminBookTable } from "./AdminBookTable";

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
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-navy">Dashboard Admin</h1>
          <p className="text-gray-500">Selamat datang, {session.user.name}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Pengguna</p>
              <h3 className="text-2xl font-bold text-navy">{usersCount}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Buku</p>
              <h3 className="text-2xl font-bold text-navy">{booksCount}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
              <LayoutList className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Kategori</p>
              <h3 className="text-2xl font-bold text-navy">{categoriesCount}</h3>
            </div>
          </div>
        </div>

        {/* Tables */}
        <div className="space-y-8">
          <AdminCategoryTable categories={categories} />
          <AdminUserTable users={users} />
          <AdminBookTable books={serializedBooks} />
        </div>
      </div>
    </div>
  );
}
