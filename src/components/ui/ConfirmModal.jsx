// confirmation modal popup for delete actions
export default function ConfirmModal({ message, onConfirm, onCancel, confirmLabel = 'Delete' }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4"
      onClick={onCancel}
    >
      <div
        className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl shadow-lg p-6 w-full max-w-sm"
        onClick={e => e.stopPropagation()}
      >
        <p className="text-gray-800 dark:text-gray-100 text-sm font-medium mb-6">
          {message}
        </p>

        <div className="flex gap-3 justify-end">
          <button
            id="btn-cancel-delete"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            id="btn-confirm-delete"
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
