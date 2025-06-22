'use client';

import { useEffect, useState } from 'react';
import FinanceEntryForm from '@/components/forms/FinanceEntryForm';

const FinancePage = () => {
  const [entries, setEntries] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editEntry, setEditEntry] = useState<any | null>(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    fetch('/api/finance')
      .then(res => res.json())
      .then(data => setEntries(data.entries || []));
  }, [refresh]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this entry?')) return;
    await fetch('/api/finance', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setRefresh(r => r + 1);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Finance Entries</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowForm(!showForm);
            setEditEntry(null);
          }}
        >
          {showForm ? 'Close' : 'Add Entry'}
        </button>
      </div>
      {(showForm || editEntry) && (
        <div className="mb-6">
          <FinanceEntryForm
            initialData={editEntry || {}}
            onSuccess={() => {
              setShowForm(false);
              setEditEntry(null);
              setRefresh(r => r + 1);
            }}
          />
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Title</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Type</th>
              <th className="p-2">Category</th>
              <th className="p-2">Reference</th>
              <th className="p-2">Date</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(entry => (
              <tr key={entry.id} className="even:bg-gray-50">
                <td className="p-2">{entry.title}</td>
                <td className="p-2">R{entry.amount.toLocaleString()}</td>
                <td className="p-2">{entry.type}</td>
                <td className="p-2">{entry.category || '--'}</td>
                <td className="p-2">{entry.reference || '--'}</td>
                <td className="p-2">{new Date(entry.date).toLocaleDateString()}</td>
                <td className="p-2 flex gap-2">
                  <button
                    className="btn btn-xs btn-secondary"
                    onClick={() => {
                      setEditEntry(entry);
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </button>
                  <button className="btn btn-xs btn-danger" onClick={() => handleDelete(entry.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinancePage;
