import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CheckoutClient } from "./CheckoutClient";

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userId = parseInt(session.user.id);

  // Fetch cart items
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          book: true
        }
      }
    }
  });

  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }

  // Serialize Prisma Decimal to Number for Client Component
  const serializedItems = cart.items.map(item => ({
    ...item,
    book: {
      ...item.book,
      price: Number(item.book.price)
    }
  }));

  // Fetch user addresses
  const addresses = await prisma.address.findMany({
    where: { userId },
    orderBy: { isDefault: 'desc' }
  });

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-navy mb-8">Checkout</h1>
        <CheckoutClient initialItems={serializedItems} addresses={addresses} />
      </div>
    </div>
  );
}
