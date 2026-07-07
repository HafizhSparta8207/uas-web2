import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, CheckCircle2 } from "lucide-react";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userId = parseInt(session.user.id);

  const orders = await prisma.order.findMany({
    where: { buyerId: userId },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: { 
          book: true,
          seller: { include: { sellerProfile: true } }
        }
      }
    }
  });

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-navy mb-8">Riwayat Pesanan</h1>
        
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-navy mb-2">Belum ada pesanan</h2>
            <p className="text-gray-500 mb-6">Anda belum pernah melakukan pemesanan buku.</p>
            <Link href="/books" className="bg-brand hover:bg-brand-hover text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div>
                      <span className="block text-gray-400 text-xs">Tanggal Pesanan</span>
                      <span className="font-medium text-navy">{order.createdAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <div className="w-px h-8 bg-gray-300 hidden sm:block"></div>
                    <div>
                      <span className="block text-gray-400 text-xs">Total</span>
                      <span className="font-medium text-navy font-mono">Rp {Number(order.totalAmount).toLocaleString('id-ID')}</span>
                    </div>
                    <div className="w-px h-8 bg-gray-300 hidden sm:block"></div>
                    <div>
                      <span className="block text-gray-400 text-xs">Penjual</span>
                      <span className="font-medium text-brand">{order.items[0]?.seller.sellerProfile?.storeName || order.items[0]?.seller.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-xs">Status:</span>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  {order.items.map((item, idx) => (
                    <div key={item.id} className={`flex items-start gap-4 ${idx !== order.items.length - 1 ? 'mb-4 pb-4 border-b border-gray-100' : ''}`}>
                      <div className="flex-1">
                        <Link href={`/books/${item.bookId}`} className="font-bold text-navy hover:text-brand transition-colors text-lg block mb-1">
                          {item.book.title}
                        </Link>
                        <div className="text-gray-500 text-sm">
                          {item.quantity} x Rp {Number(item.priceAtPurchase).toLocaleString('id-ID')}
                        </div>
                      </div>
                      
                      {order.status === 'DELIVERED' && (
                        <button className="text-brand hover:bg-brand/10 px-4 py-1.5 rounded-lg border border-brand text-sm font-medium transition-colors">
                          Beri Ulasan
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
