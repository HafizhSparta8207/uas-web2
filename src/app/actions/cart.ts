"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function addToCart(bookId: number, quantity: number) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { error: "Silakan login terlebih dahulu" };
    }

    const userId = parseInt(session.user.id);

    // Get or create cart for user
    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    // Check if item already exists
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        bookId,
      },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          bookId,
          quantity,
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Gagal menambahkan ke keranjang" };
  }
}
