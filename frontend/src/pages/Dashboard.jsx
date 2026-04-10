import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStudentStats } from '../services/api';
import { HiOutlineUsers, HiOutlineUserAdd, HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, active: 0, withdrawn: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentStats()
      .then((res) => setStats(res.data))
      .catch(() => toast.error('Failed to load statistics'))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      title: 'Total Students',
      value: stats.total,
      icon: HiOutlineUsers,
      color: 'blue',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      iconBg: 'bg-blue-100',
    },
    {
      title: 'Active Students',
      value: stats.active,
      icon: HiOutlineCheckCircle,
      color: 'green',
      bg: 'bg-green-50',
      text: 'text-green-700',
      iconBg: 'bg-green-100',
    },
    {
      title: 'Withdrawn Students',
      value: stats.withdrawn,
      icon: HiOutlineXCircle,
      color: 'red',
      bg: 'bg-red-50',
      text: 'text-red-700',
      iconBg: 'bg-red-100',
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of school statistics</p>
        </div>
        <Link
          to="/students/add"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          <HiOutlineUserAdd className="w-5 h-5" />
          Add Student
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{card.title}</p>
                    <p className={`text-3xl font-bold mt-2 ${card.text}`}>{card.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${card.iconBg} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${card.text}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/students"
            className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <HiOutlineUsers className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <p className="font-medium text-gray-900">View All Students</p>
              <p className="text-sm text-gray-500">Browse and manage records</p>
            </div>
          </Link>
          <Link
            to="/students/add"
            className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition"
          >
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <HiOutlineUserAdd className="w-5 h-5 text-green-700" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Add New Student</p>
              <p className="text-sm text-gray-500">Register a new admission</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
