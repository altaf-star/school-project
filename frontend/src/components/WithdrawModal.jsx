import { useState } from 'react';
import { withdrawStudent } from '../services/api';
import toast from 'react-hot-toast';
import { HiOutlineX } from 'react-icons/hi';
import DateInput from './DateInput';

export default function WithdrawModal({ student, onClose, onSuccess }) {
  const [form, setForm] = useState({
    withdrawalClass: student.enrolledClass || '',
    slcIssued: false,
    withdrawalDate: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await withdrawStudent(student._id, form);
      toast.success(`${student.name} has been withdrawn`);
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to withdraw student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6 z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Withdraw Student</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
            <HiOutlineX className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Mark <span className="font-semibold text-gray-700 dark:text-gray-200">{student.name}</span> ({student.admissionNumber}) as withdrawn.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Withdrawal Class</label>
            <input
              type="text"
              value={form.withdrawalClass}
              readOnly
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg outline-none transition text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Withdrawal Date</label>
            <DateInput
              name="withdrawalDate"
              value={form.withdrawalDate}
              onChange={(e) => setForm({ ...form, withdrawalDate: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 dark:text-white bg-white dark:bg-gray-700"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setForm({ ...form, slcIssued: !form.slcIssued })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                form.slcIssued ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                  form.slcIssued ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">SLC Issued</label>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Confirm Withdrawal'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
