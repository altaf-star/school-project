import { HiOutlineExclamation } from 'react-icons/hi';

export default function ConfirmDialog({ title, message, confirmLabel = 'Confirm', variant = 'danger', onConfirm, onCancel }) {
  const buttonColors =
    variant === 'danger'
      ? 'bg-red-600 hover:bg-red-700 focus:ring-red-200'
      : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-200';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 z-10 text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <HiOutlineExclamation className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
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
