import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStudentStats } from '../services/api';
import { HiOutlineUsers, HiOutlineUserAdd, HiOutlineCheckCircle, HiOutlineUserRemove, HiOutlineAcademicCap } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, active: 0, withdrawn: 0, graduated: 0 });
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
      text: 'text-blue-700 dark:text-blue-400',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      title: 'Active Students',
      value: stats.active,
      icon: HiOutlineCheckCircle,
      text: 'text-green-700 dark:text-green-400',
      iconBg: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      title: 'Graduated Students',
      value: stats.graduated,
      icon: HiOutlineAcademicCap,
      text: 'text-purple-700 dark:text-purple-400',
      iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    },
    {
      title: 'Withdrawn Students',
      value: stats.withdrawn,
      icon: HiOutlineUserRemove,
      text: 'text-red-700 dark:text-red-400',
      iconBg: 'bg-red-100 dark:bg-red-900/30',
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Overview of school statistics</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.title}</p>
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
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/students"
            className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition"
          >
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <HiOutlineUsers className="w-5 h-5 text-blue-700 dark:text-blue-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">View All Students</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Browse and manage records</p>
            </div>
          </Link>
          <Link
            to="/students/add"
            className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition"
          >
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <HiOutlineUserAdd className="w-5 h-5 text-green-700 dark:text-green-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Add New Student</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Register a new admission</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
