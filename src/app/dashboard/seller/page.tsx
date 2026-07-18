import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; 
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma"; 
import { SellerDashboardClient } from "./SellerDashboardClient";

// PENTING: Menghancurkan cache statis Vercel
export const dynamic = "force-dynamic";

export default async function SellerDashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || session.user.role !== 'SELLER') {
    redirect("/login");
  }

  // 1. Ambil & Validasi ID Penjual secara aman
  let sellerId = parseInt((session.user as any).id);
  if (isNaN(sellerId) && session.user.email) {
    try {
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
      });
      if (dbUser) {
        sellerId = dbUser.id;
      }
    } catch (e) {
      console.error("Gagal mengambil ID dari email:", e);
    }
  }

  if (!sellerId || isNaN(sellerId)) {
    redirect("/login");
  }

  // 2. Ambil Profil Seller
  let sellerProfile = null;
  try {
    sellerProfile = await prisma.sellerProfile.findUnique({ where: { userId: sellerId } });
  } catch (e) {
    console.error("Gagal mengambil profil seller:", e);
  }

  // 3. Ambil data buku dengan isolasi mandiri
  let books: any[] = [];
  try {
    const rawBooks = await prisma.book.findMany({
      where: { sellerId: sellerId },
      orderBy: { createdAt: "desc" },
      include: { category: true }
    }) || [];
    
    books = rawBooks.map(book => ({
      ...book,
      price: Number(book.price)
    }));
  } catch (error) {
    console.error("Query buku gagal, fallback ke array kosong:", error);
  }

  // 4. Ambil data pesanan dengan isolasi mandiri
  let ordersCount = 0;
  let recentOrders: any[] = [];
  try {
    ordersCount = await prisma.order.count({ where: { items: { some: { sellerId: sellerId } } } });
    
    const rawOrders = await prisma.order.findMany({
      where: { items: { some: { sellerId: sellerId } } },
      orderBy: { createdAt: 'desc' },
      include: {
        buyer: true,
        items: { include: { book: true } }
      }
    }) || [];

    recentOrders = rawOrders.map(order => ({
      ...order,
      totalAmount: Number(order.totalAmount)
    }));
  } catch (error) {
    console.error("Query pesanan gagal, fallback:", error);
  }

  // 5. Ambil data pendapatan dengan isolasi mandiri (kebal error relasi)
  let totalEarnings = 0;
  try {
    const totalSalesRaw = await prisma.orderItem.aggregate({
      where: { sellerId: sellerId },
      _sum: { price: true }
    });
    totalEarnings = Number(totalSalesRaw?._sum?.price || 0);
  } catch (error) {
    console.error("Query agregasi pendapatan gagal, fallback ke 0:", error);
  }

  const stats = {
    booksCount: books.length,
    ordersCount: ordersCount,
    totalEarnings: totalEarnings
  };

  const sellerName = sellerProfile?.storeName || session.user.name || "Penjual";

  // Langsung kembalikan client UI, dijamin bypass dari catch-block utama halaman
  return (
    <SellerDashboardClient 
      stats={stats} 
      sellerName={sellerName}
      orders={recentOrders} 
      books={books}
    />
  );
}
