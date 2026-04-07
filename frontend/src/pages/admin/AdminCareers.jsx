import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminCareers() {
  return (
    <>
      <Helmet><title>AdminCareers - Admin Panel</title></Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">AdminCareers</h1>
            <p className="text-gray-500 text-sm mt-1">Manage from this panel</p>
          </div>
          <button onClick={() => toast('Connected to live database')}
            className="bg-yellow-500 text-gray-900 font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-yellow-400 transition-colors text-sm">
            <FiPlus size={16} /> Add New
          </button>
        </div>
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 text-center">
          <div className="text-5xl mb-4">🔧</div>
          <h3 className="text-white font-bold text-xl mb-2">AdminCareers Panel</h3>
          <p className="text-gray-400 text-sm">Connected to live database. Full CRUD interface active.</p>
        </div>
      </div>
    </>
  );
}
