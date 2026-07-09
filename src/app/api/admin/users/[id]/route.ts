import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = parseInt(id);
    const body = await request.json();
    const { role } = body;

    if (!role || !['BUYER', 'SELLER', 'ADMIN'].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Prevent modifying yourself
    if (userId === parseInt(session.user.id)) {
      return NextResponse.json({ error: "Cannot modify your own role" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error("Error updating user role:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = parseInt(id);

    // Prevent deleting yourself
    if (userId === parseInt(session.user.id)) {
      return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });
    }

    // Delete related records safely (using a transaction if possible, or cascading manually)
    // NOTE: In production, you might want to use soft deletes or ensure database handles cascading.
    // For this prototype, we'll manually delete some relations first to avoid foreign key errors.
    
    // Delete SellerProfile if exists
    await prisma.sellerProfile.deleteMany({ where: { userId } });
    
    // Delete Addresses
    await prisma.address.deleteMany({ where: { userId } });
    
    // Delete Cart
    await prisma.cart.deleteMany({ where: { userId } });
    
    // Check if user has books or orders to prevent deletion or delete them
    const userBooksCount = await prisma.book.count({ where: { sellerId: userId } });
    const userOrdersCount = await prisma.order.count({ where: { buyerId: userId } });
    
    if (userBooksCount > 0 || userOrdersCount > 0) {
       return NextResponse.json({ 
         error: "Pengguna ini memiliki riwayat pesanan atau buku dagangan. Tidak dapat dihapus secara permanen." 
       }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
