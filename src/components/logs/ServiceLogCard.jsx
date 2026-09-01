// helper to format dates nicely e.g. 15 Jan 2025
function formatDate(dateString) {
  if (!dateString) return 'No date'
  return new Date(dateString).toLocaleDateString('en-LK', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export default function ServiceLogCard({ log, onEdit, onDelete }) {
  const { serviceType, date, cost, mileageAtService, location, description } = log

  return (
    <div className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl p-4">
      {/* service type and cost summary */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <p className="font-semibold text-gray-900 dark:text-white text-sm">{serviceType || 'Service'}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{formatDate(date)}</p>
        </div>
        {cost && (
          <span className="shrink-0 text-sm font-semibold text-gray-900 dark:text-white">
            Rs. {Number(cost).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        )}
      </div>

      {/* service log details */}
      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400 mb-4">
        {mileageAtService && (
          <p>
            <span className="font-medium text-gray-700 dark:text-gray-300">Mileage:</span>{' '}
            {Number(mileageAtService).toLocaleString()} km
          </p>
        )}
        {location && (
          <p>
            <span className="font-medium text-gray-700 dark:text-gray-300">Garage:</span>{' '}
            {location}
          </p>
        )}
        {description && (
          <p className="pt-1 text-gray-500 dark:text-gray-400 text-xs leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* edit and delete buttons */}
      <div className="flex items-center gap-2 border-t border-gray-100 dark:border-dark-border pt-3">
        <button
          id={`btn-edit-log-${log.id}`}
          onClick={() => onEdit(log)}
          className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          Edit
        </button>
        <span className="text-gray-200 dark:text-gray-700">|</span>
        <button
          id={`btn-delete-log-${log.id}`}
          onClick={() => onDelete(log)}
          className="text-sm font-medium text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
