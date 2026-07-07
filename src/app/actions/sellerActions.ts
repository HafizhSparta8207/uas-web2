"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "COMPLETED" | "CANCELLED";

export async function updateOrderStatus(orderId: number, status: OrderStatus) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'SELLER') return { error: "Unauthorized" };

  const userId = parseInt(session.user.id);

  try {
    // Verify the order has items from this seller
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    });

    if (!order) return { error: "Pesanan tidak ditemukan" };

    const hasSellerItems = order.items.some(item => item.sellerId === userId);
    if (!hasSellerItems) return { error: "Anda tidak berhak mengubah status pesanan ini" };

    await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });

    revalidatePath("/dashboard/seller");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Gagal memperbarui status pesanan" };
  }
}

export async function deleteSellerBook(bookId: number) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'SELLER') return { error: "Unauthorized" };

  const userId = parseInt(session.user.id);

  try {
    // Verify ownership
    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) return { error: "Buku tidak ditemukan" };
    if (book.sellerId !== userId) return { error: "Anda tidak berhak menghapus buku ini" };

    // Prevent deletion if ordered
    const orderCount = await prisma.orderItem.count({ where: { bookId } });
    if (orderCount > 0) {
      return { error: "Buku ini sudah pernah dibeli dan memiliki riwayat pesanan. Tidak bisa dihapus secara permanen." };
    }

    // Delete cart items and images
    await prisma.cartItem.deleteMany({ where: { bookId } });
    await prisma.bookImage.deleteMany({ where: { bookId } });

    await prisma.book.delete({ where: { id: bookId } });
    revalidatePath("/dashboard/seller");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Gagal menghapus buku" };
  }
}
