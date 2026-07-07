"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function updateCartItem(itemId: number, quantity: number) {
  const session = await getServerSession(authOptions);
  if (!session) return { error: "Unauthorized" };

  try {
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity }
    });
    return { success: true };
  } catch (error) {
    return { error: "Failed to update quantity" };
  }
}

export async function removeCartItem(itemId: number) {
  const session = await getServerSession(authOptions);
  if (!session) return { error: "Unauthorized" };

  try {
    await prisma.cartItem.delete({
      where: { id: itemId }
    });
    return { success: true };
  } catch (error) {
    return { error: "Failed to remove item" };
  }
}
