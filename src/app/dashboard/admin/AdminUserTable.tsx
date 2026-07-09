"use client";

import { useState } from "react";
import { ShieldCheck, User as UserIcon, Store, Trash2, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function AdminUserTable({ users }: { users: any[] }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginatedUsers = users.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleRoleChange = async (userId: number, newRole: string) => {
    setLoadingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        router.refresh();
      }
    } catch (error) {
      alert("Terjadi kesalahan saat menghubungi server.");
    }
    setLoadingId(null);
  };

  const handleDelete = async (userId: number) => {
    if (!confirm("Peringatan: Menghapus pengguna bersifat permanen. Apakah Anda yakin?")) return;
    
    setLoadingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        router.refresh();
      }
    } catch (error) {
      alert("Terjadi kesalahan saat menghubungi server.");
    }
    setLoadingId(null);
  };

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'ADMIN':
        return <span className="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full flex items-center w-fit gap-1"><ShieldCheck className="w-3 h-3" /> Admin</span>;
      case 'SELLER':
        return <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full flex items-center w-fit gap-1"><Store className="w-3 h-3" /> Seller</span>;
      default:
        return <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full flex items-center w-fit gap-1"><UserIcon className="w-3 h-3" /> Buyer</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h2 className="font-bold text-navy text-lg">Daftar Pengguna</h2>
      </div>

      <div className="p-6">
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-200 hidden md:table-header-group">
              <tr>
                <th className="px-6 py-3 font-medium">ID</th>
                <th className="px-6 py-3 font-medium">Nama Lengkap</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Peran (Role)</th>
                <th className="px-6 py-3 font-medium">Terdaftar</th>
                <th className="px-6 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 md:divide-y-0">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Belum ada pengguna terdaftar.</td>
                </tr>
              ) : (
                paginatedUsers.map(user => (
                  <tr key={user.id} className="flex flex-col md:table-row border-b border-gray-200 p-4 mb-3 bg-white rounded-lg shadow-sm md:shadow-none hover:bg-gray-50">
                    <td className="block py-1 md:table-cell md:px-6 md:py-4 text-gray-500">
                      <span className="md:hidden text-xs font-semibold text-gray-400 mr-2">ID:</span>{user.id}
                    </td>
                    <td className="block py-1 md:table-cell md:px-6 md:py-4 font-medium text-navy">
                      <span className="md:hidden text-xs font-semibold text-gray-400 mr-2">Nama:</span>{user.name}
                      {user.sellerProfile?.storeName && (
                        <div className="text-xs text-brand font-normal mt-0.5">Toko: {user.sellerProfile.storeName}</div>
                      )}
                    </td>
                    <td className="block py-1 md:table-cell md:px-6 md:py-4 text-gray-600">
                      <span className="md:hidden text-xs font-semibold text-gray-400 mr-2">Email:</span>{user.email}
                    </td>
                    <td className="block py-1 md:table-cell md:px-6 md:py-4">
                      <div className="flex items-center gap-2">
                        <span className="md:hidden text-xs font-semibold text-gray-400">Peran:</span>
                        {getRoleBadge(user.role)}
                      </div>
                    </td>
                    <td className="block py-1 md:table-cell md:px-6 md:py-4 text-gray-500">
                      <span className="md:hidden text-xs font-semibold text-gray-400 mr-2">Terdaftar:</span>
                      {new Date(user.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="block py-1 md:table-cell md:px-6 md:py-4 text-right mt-3 md:mt-0">
                      {session?.user?.id && parseInt(session.user.id) !== user.id ? (
                        <div className="flex justify-end md:justify-end gap-2 items-center w-full md:w-auto">
                          <select 
                            value={user.role} 
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            disabled={loadingId === user.id}
                            className="text-xs px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand disabled:opacity-50 flex-1 md:flex-none"
                          >
                            <option value="BUYER">BUYER</option>
                            <option value="SELLER">SELLER</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                          <button 
                            onClick={() => handleDelete(user.id)}
                            disabled={loadingId === user.id}
                            className="text-red-500 hover:text-white hover:bg-red-500 border border-red-500 px-3 md:px-2 py-1.5 rounded transition-colors inline-flex items-center justify-center gap-1 font-medium disabled:opacity-50 flex-1 md:flex-none"
                            title="Hapus Pengguna"
                          >
                            {loadingId === user.id ? <Loader2 className="w-4 h-4 md:w-3 md:h-3 animate-spin" /> : <Trash2 className="w-4 h-4 md:w-3 md:h-3" />}
                            <span className="md:hidden">Hapus</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end md:justify-end">
                          <span className="text-xs text-gray-400 italic">Diri Anda</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sebelumnya
            </button>
            <span className="text-sm text-gray-500">
              Halaman {currentPage} dari {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Selanjutnya
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
