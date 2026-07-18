import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SellerDashboardClient } from "./SellerDashboardClient";

export default async function SellerDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'SELLER') redirect("/");

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

  const totalEarnings = Number(totalEarningsResult._sum.price || 0);

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
}
