import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Book, Package, DollarSign, Plus } from "lucide-react";
import { SellerOrderTable } from "./SellerOrderTable";
import { SellerBookTable } from "./SellerBookTable";

export default async function SellerDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'SELLER') redirect("/");

  const userId = parseInt(session.user.id);

  const [booksCount, ordersCount, seller] = await Promise.all([
    prisma.book.count({ where: { sellerId: userId } }),
    prisma.order.count({ where: { items: { some: { sellerId: userId } } } }),
    prisma.sellerProfile.findUnique({ where: { userId } })
  ]);

  const [recentOrders, sellerBooks] = await Promise.all([
    prisma.order.findMany({
      where: { items: { some: { sellerId: userId } } },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        buyer: true,
        items: { include: { book: true } }
      }
    }),
    prisma.book.findMany({
      where: { sellerId: userId },
      orderBy: { createdAt: 'desc' },
      include: { category: true }
    })
  ]);

  const serializedOrders = recentOrders.map(order => ({
    ...order,
    totalAmount: Number(order.totalAmount)
  }));

  const serializedBooks = sellerBooks.map(book => ({
    ...book,
    price: Number(book.price)
  }));

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-navy">Dashboard Penjual</h1>
            <p className="text-gray-500">Selamat datang, {seller?.storeName || session.user.name}</p>
          </div>
          <Link href="/dashboard/seller/books/new" className="bg-brand hover:bg-brand-hover text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
            <Plus className="w-5 h-5" /> Tambah Buku
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <Book className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Buku</p>
              <h3 className="text-2xl font-bold text-navy">{booksCount}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Pesanan</p>
              <h3 className="text-2xl font-bold text-navy">{ordersCount}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-gold/20 text-gold rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Saldo (Simulasi)</p>
              <h3 className="text-2xl font-bold text-navy">Rp 0</h3>
            </div>
          </div>
        </div>

        {/* Tables */}
        <div className="space-y-8">
          <SellerOrderTable orders={serializedOrders} />
          <SellerBookTable books={serializedBooks} />
        </div>
      </div>
    </div>
  );
}
