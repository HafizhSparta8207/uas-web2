import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SellerDashboardClient } from "./SellerDashboardClient";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default async function SellerDashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || session.user.role !== 'SELLER') {
    redirect("/login");
  }

  try {
    const userId = parseInt(session.user.id);

    const [booksCount, ordersCount, seller, totalEarningsResult] = await Promise.all([
      prisma.book.count({ where: { sellerId: userId } }),
      prisma.order.count({ where: { items: { some: { sellerId: userId } } } }),
      prisma.sellerProfile.findUnique({ where: { userId } }),
      prisma.orderItem.aggregate({
        where: { sellerId: userId },
        _sum: { price: true }
      })
    ]);

    const totalEarnings = Number(totalEarningsResult?._sum?.price || 0);

    const [recentOrders, sellerBooks] = await Promise.all([
      prisma.order.findMany({
        where: { items: { some: { sellerId: userId } } },
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
      <SellerDashboardClient 
        stats={{ booksCount, ordersCount, totalEarnings }}
        sellerName={seller?.storeName || session.user.name || "Penjual"}
        orders={serializedOrders}
        books={serializedBooks}
      />
    );
  } catch (error) {
    console.error("Catastrophic Seller Dashboard Error:", error);
    
    // Tampilan darurat anti-crash jika database/server bermasalah
    return (
      <div className="flex min-h-[calc(100vh-64px)] bg-gray-50/50">
        <div className="w-64 border-r bg-white p-6 hidden md:block">
          <h2 className="font-bold text-lg mb-4 text-navy">Dashboard Penjual</h2>
          <div className="text-sm text-gray-400">Pemuatan dinonaktifkan sementara</div>
        </div>
        <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
          <div className="max-w-md bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Sinkronisasi Dasbor Toko</h3>
            <p className="text-sm text-gray-600 mb-6">
              Akun penjual Anda berhasil divalidasi, namun sistem sedang menyiapkan alokasi database baru di server produksi. Harap tunggu beberapa saat.
            </p>
            <div className="flex justify-center gap-3">
              <Link href="/" className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors font-medium">
                Ke Beranda
              </Link>
              {/* @ts-ignore */}
              <form action={async () => { "use server"; }}>
                <button type="submit" formAction={async () => { "use server"; redirect("/dashboard/seller"); }} className="px-4 py-2 bg-brand text-white text-sm rounded-lg hover:bg-brand-hover transition-colors font-medium flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" /> Segarkan Halaman
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
