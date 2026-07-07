import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CartClient } from "./CartClient";

export default async function CartPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const userId = parseInt(session.user.id);

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          book: {
            include: {
              images: true,
              seller: {
                include: { sellerProfile: true }
              }
            }
          }
        }
      }
    }
  });

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-navy mb-8">Keranjang Belanja</h1>
        
        {!cart || cart.items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <h2 className="text-xl font-bold text-navy mb-2">Keranjang Anda kosong</h2>
            <p className="text-gray-500 mb-6">Mulai belanja dan temukan buku favoritmu!</p>
            <a href="/books" className="bg-brand hover:bg-brand-hover text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
              Lihat Katalog Buku
            </a>
          </div>
        ) : (
          <CartClient initialItems={cart.items} />
        )}
      </div>
    </div>
  );
}
