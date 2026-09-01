// simple empty state placeholder when a list is empty
export default function EmptyState({ message, action }) {
  return (
    <div className="text-center py-16 px-4">
      <p className="text-gray-400 dark:text-gray-500 text-sm">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-4 py-2 bg-primary-700 hover:bg-primary-800 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
