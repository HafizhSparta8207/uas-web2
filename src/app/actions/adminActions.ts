"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createCategory(name: string, slug: string) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') return { error: "Unauthorized" };

  if (!name || !slug) return { error: "Nama dan slug wajib diisi" };

  try {
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) return { error: "Slug kategori sudah digunakan" };

    const category = await prisma.category.create({
      data: { name, slug }
    });

    revalidatePath("/dashboard/admin");
    return { success: true, category };
  } catch (error: any) {
    return { error: error.message || "Gagal membuat kategori" };
  }
}

export async function deleteCategory(id: number) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') return { error: "Unauthorized" };

  try {
    // Check if there are books using this category
    const count = await prisma.book.count({ where: { categoryId: id } });
    if (count > 0) {
      return { error: `Tidak dapat menghapus kategori karena masih ada ${count} buku yang terhubung.` };
    }

    await prisma.category.delete({ where: { id } });
    revalidatePath("/dashboard/admin");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Gagal menghapus kategori" };
  }
}

export async function deleteBook(id: number) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') return { error: "Unauthorized" };

  try {
    // Check if the book has order items. 
    // In a real system, you might soft delete. Here we will do hard delete but we must delete child references.
    // 1. Delete cart items
    await prisma.cartItem.deleteMany({ where: { bookId: id } });
    
    // 2. Delete book images
    await prisma.bookImage.deleteMany({ where: { bookId: id } });
    
    // 3. For OrderItems, deleting a book that has been ordered will break history. 
    // We should check if it's been ordered.
    const orderCount = await prisma.orderItem.count({ where: { bookId: id } });
    if (orderCount > 0) {
      return { error: "Buku ini sudah pernah dibeli dan memiliki riwayat pesanan. Tidak bisa dihapus secara permanen." };
    }

    await prisma.book.delete({ where: { id } });
    revalidatePath("/dashboard/admin");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Gagal menghapus buku" };
  }
}
