import { Link } from 'react-router-dom'

// checks if Revenue Licence is due in less than 30 days
function isDueSoon(dateString) {
  if (!dateString) return false
  const due = new Date(dateString)
  const today = new Date()
  const diffDays = (due - today) / (1000 * 60 * 60 * 24)
  return diffDays >= 0 && diffDays <= 30
}

// checks if Revenue Licence has already expired
function isOverdue(dateString) {
  if (!dateString) return false
  return new Date(dateString) < new Date()
}

function formatDate(dateString) {
  if (!dateString) return 'Not set'
  return new Date(dateString).toLocaleDateString('en-LK', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export default function VehicleCard({ vehicle, onDelete }) {
  const { id, make, model, year, licensePlate, currentMileage, motDueDate, imageUrl } = vehicle

  const overdue = isOverdue(motDueDate)
  const dueSoon = !overdue && isDueSoon(motDueDate)

  return (
    <div className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl overflow-hidden flex flex-col">
      {/* vehicle image or fallback initials */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`${make} ${model}`}
          className="w-full h-40 object-cover"
        />
      ) : (
        <div className="w-full h-40 bg-gray-100 dark:bg-dark-border flex items-center justify-center">
          <span className="text-4xl font-bold text-gray-300 dark:text-gray-600 tracking-widest">
            {make ? make.slice(0, 2).toUpperCase() : 'CAR'}
          </span>
        </div>
      )}

      <div className="p-4 flex flex-col flex-1">
        {/* title and revenue licence status badge */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-base leading-tight">
              {make} {model}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{year}</p>
          </div>

          {overdue && (
            <span className="shrink-0 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 px-2 py-1 rounded-full">
              Licence expired
            </span>
          )}
          {dueSoon && (
            <span className="shrink-0 text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 px-2 py-1 rounded-full">
              Due soon
            </span>
          )}
        </div>

        {/* vehicle details */}
        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <p><span className="font-medium text-gray-700 dark:text-gray-300">Number plate:</span> {licensePlate || 'Not set'}</p>
          <p><span className="font-medium text-gray-700 dark:text-gray-300">Mileage:</span> {currentMileage ? Number(currentMileage).toLocaleString() + ' km' : 'Not set'}</p>
          <p><span className="font-medium text-gray-700 dark:text-gray-300">Revenue Licence:</span> {formatDate(motDueDate)}</p>
        </div>

        {/* action links */}
        <div className="mt-auto flex items-center gap-2 flex-wrap">
          <Link
            to={`/vehicles/${id}`}
            className="flex-1 text-center px-3 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 dark:bg-dark-border dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg transition-colors"
          >
            View history
          </Link>
          <Link
            to={`/vehicles/${id}/edit`}
            className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-colors"
          >
            Edit
          </Link>
          <button
            id={`btn-delete-vehicle-${id}`}
            onClick={() => onDelete(vehicle)}
            className="px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
