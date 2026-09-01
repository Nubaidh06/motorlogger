import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface mt-12">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Stacked on mobile, 3 columns on md+ */}
        <div className="flex flex-col md:flex-row md:justify-between gap-6">

          <div>
            <p className="font-bold text-gray-900 dark:text-white">
              Motor<span className="text-primary-700">Logger</span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Simple vehicle service tracking
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Pages
            </p>
            <ul className="space-y-1">
              <li>
                <Link to="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/vehicles" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                  My Vehicles
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
