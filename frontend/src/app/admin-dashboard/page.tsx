'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
  username: string;
  role: string;
  createdAt: string;
  phone: string;
}

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const [lastLogin, setLastLogin] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
      
      const now = new Date();
      setLastLogin(now.toLocaleString('id-ID', { 
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      }));

      fetchUsers();
    } catch (error) {
      console.error('Error parsing token:', error);
      router.push('/');
    }
  }, [router]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch users');
      
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="destructive">Logout</Button>
        </div>

        {/* Last Login Info */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <p className="text-gray-600">
            Last Login (Anda): {lastLogin} WIB
          </p>
        </div>

        {/* Users Section */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Data Pengguna ({filteredUsers.length})</h2>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Cari berdasarkan email, username..."
                  className="px-4 py-2 border rounded-lg w-80"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button onClick={fetchUsers}>Refresh</Button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              {/* PERBAIKAN: Seluruh thead dijadikan satu baris panjang agar tidak ada spasi/enter di antara tag */}
              <thead className="bg-gray-800 text-white text-sm"><tr><th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Email</th><th className="px-2 py-2 text-left">Username</th><th className="px-2 py-2 text-left">Role</th><th className="px-2 py-2 text-left">Created At</th><th className="px-2 py-2 text-left">Phone</th></tr></thead>
              <tbody className="text-sm">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="px-2 py-2">{user.id}</td>
                    <td className="px-2 py-2 text-xs">{user.email}</td>
                    <td className="px-2 py-2">{user.username}</td>
                    <td className="px-2 py-2">
                      <span className={`px-1 py-0.5 rounded-full text-xs ${user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-xs">
                      {new Date(user.createdAt).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZoneName: 'short'
                      })}
                    </td>
                    <td className="px-2 py-2">{user.phone || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}