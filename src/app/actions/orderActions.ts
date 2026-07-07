"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function createOrder({ addressId, paymentMethod }: { addressId: number, paymentMethod: string }) {
  const session = await getServerSession(authOptions);
  if (!session) return { error: "Unauthorized" };

  const userId = parseInt(session.user.id);

  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Get user cart
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: { book: true }
          }
        }
      });

      if (!cart || cart.items.length === 0) {
        throw new Error("Keranjang kosong");
      }

      const totalAmount = cart.items.reduce((acc, item) => acc + (item.quantity * Number(item.book.price)), 0);

      // 2. Check stock
      for (const item of cart.items) {
        if (item.book.stock < item.quantity) {
          throw new Error(`Stok buku ${item.book.title} tidak mencukupi`);
        }
      }

      // 3. Create Order
      const order = await tx.order.create({
        data: {
          buyerId: userId,
          addressId,
          totalAmount,
          status: 'PENDING',
          paymentMethod,
          items: {
            create: cart.items.map(item => ({
              bookId: item.bookId,
              sellerId: item.book.sellerId,
              quantity: item.quantity,
              priceAtPurchase: item.book.price,
            }))
          }
        }
      });

      // 4. Reduce Book Stock
      for (const item of cart.items) {
        await tx.book.update({
          where: { id: item.bookId },
          data: { stock: { decrement: item.quantity } }
        });
      }

      // 5. Empty Cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id }
      });

      return { success: true, orderId: order.id };
    });
  } catch (error: any) {
    console.error("Order error:", error);
    return { error: error.message || "Gagal membuat pesanan" };
  }
}
