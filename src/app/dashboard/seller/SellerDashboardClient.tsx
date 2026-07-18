"use client";

import { useState } from "react";
import { Book, Package, LayoutDashboard, Menu, X, DollarSign, Plus } from "lucide-react";
import Link from "next/link";
import { SellerOrderTable } from "./SellerOrderTable";
import { SellerBookTable } from "./SellerBookTable";

interface SellerDashboardClientProps {
  stats: {
    booksCount: number;
    ordersCount: number;
    totalEarnings: number;
  };
  sellerName: string;
  orders: any[];
  books: any[];
}

export function SellerDashboardClient({ stats, sellerName, orders, books }: SellerDashboardClientProps) {
  const [currentView, setCurrentView] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { id: "overview", label: "Ringkasan Toko", icon: LayoutDashboard },
    { id: "books", label: "Koleksi Buku", icon: Book },
    { id: "orders", label: "Pesanan Masuk", icon: Package },
  ];

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-background">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 md:z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        md:sticky md:top-[64px] md:h-[calc(100vh-64px)] md:translate-x-0 flex flex-col md:overflow-y-auto
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="font-bold text-navy text-lg leading-tight">Dashboard Toko</h2>
            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{sellerName}</p>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-navy">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ease-in-out
                  ${currentView === item.id 
                    ? "bg-brand text-white shadow-sm" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-navy"
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${currentView === item.id ? "text-white" : "text-gray-400"}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 w-full md:max-w-[calc(100vw-256px)]">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg md:hidden"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-serif font-bold text-navy">
                  {currentView === 'overview' ? 'Ringkasan Toko' : currentView === 'books' ? 'Koleksi Buku' : 'Pesanan Masuk'}
                </h1>
              </div>
            </div>
            
            {currentView === 'books' && (
              <Link 
                href="/dashboard/seller/books/new" 
                className="bg-brand hover:bg-brand-hover text-white px-4 py-2 rounded-lg font-medium transition-all duration-150 active:scale-95 hover:brightness-95 flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <Plus className="w-4 h-4" /> Tambah Buku Baru
              </Link>
            )}
          </div>

          {/* Active View */}
          <div key={currentView} className="space-y-8 animate-fade-in">
            {currentView === "overview" && (
              <>
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                      <Book className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Total Buku</p>
                      <h3 className="text-2xl font-bold text-navy">{stats.booksCount}</h3>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Total Pesanan</p>
                      <h3 className="text-2xl font-bold text-navy">{stats.ordersCount}</h3>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                    <div className="w-12 h-12 bg-gold/20 text-gold rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Saldo (Pendapatan)</p>
                      <h3 className="text-2xl font-bold text-navy">
                        Rp {stats.totalEarnings ? stats.totalEarnings.toLocaleString('id-ID') : "0"}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Preview Tables */}
                <div className="space-y-8">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                      <h3 className="font-bold text-navy text-lg">Pesanan Terbaru</h3>
                      <button onClick={() => setCurrentView('orders')} className="text-brand text-sm font-medium hover:underline">Lihat Semua</button>
                    </div>
                    <div className="p-0">
                      <SellerOrderTable orders={orders.slice(0, 3)} isPreview={true} />
                    </div>
                  </div>
                </div>
              </>
            )}

            {currentView === "books" && <SellerBookTable books={books} />}
            {currentView === "orders" && <SellerOrderTable orders={orders} />}
          </div>
        </div>
      </main>
    </div>
  );
}
