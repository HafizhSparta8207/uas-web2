"use client";

import { useState } from "react";
import { Users, BookOpen, LayoutList, Menu, X } from "lucide-react";
import { AdminCategoryTable } from "./AdminCategoryTable";
import { AdminUserTable } from "./AdminUserTable";
import { AdminBookTable } from "./AdminBookTable";

interface AdminDashboardClientProps {
  categories: any[];
  users: any[];
  books: any[];
  stats: {
    usersCount: number;
    booksCount: number;
    categoriesCount: number;
  };
  userName: string;
}

export function AdminDashboardClient({ categories, users, books, stats, userName }: AdminDashboardClientProps) {
  const [currentView, setCurrentView] = useState("books");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { id: "books", label: "Kelola Buku", icon: BookOpen },
    { id: "users", label: "Kelola Pengguna", icon: Users },
    { id: "categories", label: "Kelola Kategori", icon: LayoutList },
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
        <div className="p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold font-serif text-navy">Admin Panel</h2>
          <button 
            className="md:hidden text-gray-500 hover:text-navy"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="mt-2 px-4 flex-1 space-y-2">
          {menuItems.map((item) => (
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
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-background">
        {/* Mobile Header with Hamburger */}
        <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-600 hover:text-navy"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold font-serif text-navy">Dashboard Admin</h1>
        </div>

        <div className="flex-1 p-4 sm:p-6 md:p-8">
          <div className="hidden md:block mb-8">
            <h1 className="text-3xl font-serif font-bold text-navy">Dashboard Admin</h1>
            <p className="text-gray-500 mt-1">Selamat datang, {userName}</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Total Buku</p>
                <h3 className="text-xl font-bold text-navy">{stats.booksCount}</h3>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Total Pengguna</p>
                <h3 className="text-xl font-bold text-navy">{stats.usersCount}</h3>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                <LayoutList className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Kategori</p>
                <h3 className="text-xl font-bold text-navy">{stats.categoriesCount}</h3>
              </div>
            </div>
          </div>

          {/* Active View */}
          <div key={currentView} className="space-y-8 animate-fade-in">
            {currentView === "books" && <AdminBookTable books={books} />}
            {currentView === "users" && <AdminUserTable users={users} />}
            {currentView === "categories" && <AdminCategoryTable categories={categories} />}
          </div>
        </div>
      </main>
    </div>
  );
}
