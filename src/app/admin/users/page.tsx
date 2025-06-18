import React, { Suspense } from 'react';

async function fetchUsers() {
  const res = await fetch('/api/users', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

function UsersTable({ users }: { users: any[] }) {
  if (!users.length) return <div className="text-gray-500">No users found.</div>;
  return (
    <table className="min-w-full border mt-4">
      <thead>
        <tr>
          <th className="border px-2 py-1">ID</th>
          <th className="border px-2 py-1">Email</th>
          <th className="border px-2 py-1">Role</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id}>
            <td className="border px-2 py-1">{u.id}</td>
            <td className="border px-2 py-1">{u.email}</td>
            <td className="border px-2 py-1">{u.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function AdminUsersPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">All Users</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <UsersList />
      </Suspense>
    </div>
  );
}

async function UsersList() {
  let users: any[] = [];
  let error = null;
  try {
    users = await fetchUsers();
  } catch (e: any) {
    error = e.message;
  }
  if (error) return <div className="text-red-500">Error: {error}</div>;
  return <UsersTable users={users} />;
}
