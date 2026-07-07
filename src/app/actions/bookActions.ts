"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createBook(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'SELLER') {
    return { error: "Unauthorized. Hanya penjual yang dapat menambahkan buku." };
  }

  const userId = parseInt(session.user.id);

  const title = formData.get("title") as string;
  const author = formData.get("author") as string;
  const categoryId = parseInt(formData.get("categoryId") as string);
  const isbn = formData.get("isbn") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string);
  const conditionStatus = formData.get("conditionStatus") as "NEW" | "USED";
  const description = formData.get("description") as string;
  const coverImageUrl = formData.get("coverImageUrl") as string;

  if (!title || !author || isNaN(categoryId) || isNaN(price) || isNaN(stock)) {
    return { error: "Mohon isi semua field yang diwajibkan dengan format yang benar." };
  }

  try {
    const book = await prisma.book.create({
      data: {
        sellerId: userId,
        categoryId,
        title,
        author,
        isbn: isbn || null,
        description: description || null,
        price,
        stock,
        conditionStatus,
        coverImageUrl: coverImageUrl || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop",
      }
    });

    revalidatePath("/dashboard/seller");
    revalidatePath("/books");

    return { success: true, bookId: book.id };
  } catch (error: any) {
    console.error("Error creating book:", error);
    return { error: error.message || "Terjadi kesalahan saat menyimpan buku." };
  }
}

export async function updateBook(bookId: number, formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'SELLER') {
    return { error: "Unauthorized. Hanya penjual yang dapat mengedit buku." };
  }

  const userId = parseInt(session.user.id);

  const title = formData.get("title") as string;
  const author = formData.get("author") as string;
  const categoryId = parseInt(formData.get("categoryId") as string);
  const isbn = formData.get("isbn") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string);
  const conditionStatus = formData.get("conditionStatus") as "NEW" | "USED";
  const description = formData.get("description") as string;
  const coverImageUrl = formData.get("coverImageUrl") as string;

  if (!title || !author || isNaN(categoryId) || isNaN(price) || isNaN(stock)) {
    return { error: "Mohon isi semua field yang diwajibkan dengan format yang benar." };
  }

  try {
    // Verify ownership
    const existingBook = await prisma.book.findUnique({
      where: { id: bookId }
    });

    if (!existingBook) {
      return { error: "Buku tidak ditemukan." };
    }

    if (existingBook.sellerId !== userId) {
      return { error: "Unauthorized. Anda tidak memiliki akses untuk mengubah buku ini." };
    }

    const book = await prisma.book.update({
      where: { id: bookId },
      data: {
        categoryId,
        title,
        author,
        isbn: isbn || null,
        description: description || null,
        price,
        stock,
        conditionStatus,
        ...(coverImageUrl ? { coverImageUrl } : {})
      }
    });

    revalidatePath("/dashboard/seller");
    revalidatePath(`/books/${bookId}`);
    revalidatePath("/books");

    return { success: true };
  } catch (error: any) {
    console.error("Error updating book:", error);
    return { error: error.message || "Terjadi kesalahan saat memperbarui buku." };
  }
}
