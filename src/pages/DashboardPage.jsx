import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getVehicles } from '../firebase/vehicles'
import { getUserLogs } from '../firebase/serviceLogs'
import LoadingSpinner from '../components/ui/LoadingSpinner'

// formats a date string into readable format e.g. "12 Aug 2025"
function formatDate(dateString) {
  if (!dateString) return 'No logs yet'
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl p-5">
      <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</p>}
    </div>
  )
}

export default function DashboardPage() {
  const [vehicles, setVehicles] = useState([])
  const [logs, setLogs]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')

  const { currentUser } = useAuth()
  const navigate        = useNavigate()

  // fetch vehicles and logs when the user is available
  useEffect(() => {
    if (!currentUser) return
    async function loadData() {
      setLoading(true)
      setError('')
      try {
        const vehicleData = await getVehicles(currentUser.uid)
        const logData     = await getUserLogs(currentUser.uid)
        setVehicles(vehicleData)
        setLogs(logData)
      } catch {
        setError('Could not load your data. Please refresh.')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [currentUser])

  if (loading) return <LoadingSpinner />

  // calculate stats from fetched data
  const totalSpent = logs.reduce((sum, log) => sum + Number(log.cost || 0), 0)
  const lastLogDate = logs.length > 0
    ? logs.sort((a, b) => new Date(b.date) - new Date(a.date))[0].date
    : null

  // last 5 logs sorted by date for the activity list
  const recentLogs = [...logs]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  // helper to get vehicle name from id
  function getVehicleName(vehicleId) {
    const vehicle = vehicles.find(v => v.id === vehicleId)
    return vehicle ? `${vehicle.make} ${vehicle.model}` : 'Unknown vehicle'
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Dashboard</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Welcome back, {currentUser.email}
        </p>
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      {/* 3 stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Vehicles"
          value={vehicles.length}
          sub={`${vehicles.length} vehicle${vehicles.length !== 1 ? 's' : ''} tracked`}
        />
        <StatCard
          label="Total spent"
          value={`Rs. ${totalSpent.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          sub="across all service logs"
        />
        <StatCard
          label="Last service"
          value={formatDate(lastLogDate)}
          sub={logs.length > 0 ? `${logs.length} log${logs.length !== 1 ? 's' : ''} total` : 'No logs added yet'}
        />
      </div>

      {/* quick action buttons */}
      <div className="flex gap-3 mb-8 flex-wrap">
        <button
          id="btn-dash-add-vehicle"
          onClick={() => navigate('/vehicles/add')}
          className="px-4 py-2 bg-primary-700 hover:bg-primary-800 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Add vehicle
        </button>
        <button
          id="btn-dash-view-vehicles"
          onClick={() => navigate('/vehicles')}
          className="px-4 py-2 bg-white dark:bg-dark-surface hover:bg-gray-50 dark:hover:bg-dark-border border border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-200 text-sm font-medium rounded-lg transition-colors"
        >
          View all vehicles
        </button>
      </div>

      {/* recent activity list */}
      {recentLogs.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Recent activity
          </h3>
          <div className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl divide-y divide-gray-100 dark:divide-dark-border">
            {recentLogs.map(log => (
              <div
                key={log.id}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-border transition-colors cursor-pointer"
                onClick={() => navigate(`/vehicles/${log.vehicleId}`)}
              >
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{log.serviceType}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {getVehicleName(log.vehicleId)} &middot; {formatDate(log.date)}
                  </p>
                </div>
                {log.cost && (
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Rs. {Number(log.cost).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {vehicles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">Add your first vehicle to get started.</p>
          <button
            onClick={() => navigate('/vehicles/add')}
            className="px-4 py-2 bg-primary-700 hover:bg-primary-800 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Add vehicle
          </button>
        </div>
      )}
    </div>
  )
}
