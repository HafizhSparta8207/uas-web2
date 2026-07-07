"use client";

import { ShieldCheck, User as UserIcon, Store } from "lucide-react";

export function AdminUserTable({ users }: { users: any[] }) {
  
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
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 font-medium">ID</th>
                <th className="px-6 py-3 font-medium">Nama Lengkap</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Peran (Role)</th>
                <th className="px-6 py-3 font-medium text-right">Terdaftar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Belum ada pengguna terdaftar.</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-500">{user.id}</td>
                    <td className="px-6 py-4 font-medium text-navy">
                      {user.name}
                      {user.sellerProfile?.storeName && (
                        <div className="text-xs text-brand font-normal mt-0.5">Toko: {user.sellerProfile.storeName}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString('id-ID')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
