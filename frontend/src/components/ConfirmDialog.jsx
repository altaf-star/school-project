import { HiOutlineExclamation, HiOutlineAcademicCap } from 'react-icons/hi';

export default function ConfirmDialog({ title, message, confirmLabel = 'Confirm', variant = 'danger', onConfirm, onCancel }) {
  const buttonColors =
    variant === 'danger'
      ? 'bg-red-600 hover:bg-red-700 focus:ring-red-200'
      : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-200';

  const iconBg = variant === 'info' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-red-100 dark:bg-red-900/30';
  const iconColor = variant === 'info' ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400';
  const Icon = variant === 'info' ? HiOutlineAcademicCap : HiOutlineExclamation;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm p-6 z-10 text-center">
        <div className={`w-12 h-12 ${iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2.5 text-white font-medium rounded-lg focus:ring-4 transition ${buttonColors}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
