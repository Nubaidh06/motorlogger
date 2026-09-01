import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getVehicle } from '../firebase/vehicles'
import { getLogs, deleteLog } from '../firebase/serviceLogs'
import { useNotification } from '../hooks/useNotification'
import ServiceLogCard from '../components/logs/ServiceLogCard'
import ConfirmModal from '../components/ui/ConfirmModal'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EmptyState from '../components/ui/EmptyState'

function formatDate(dateString) {
  if (!dateString) return 'Not set'
  return new Date(dateString).toLocaleDateString('en-LK', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export default function VehicleDetailPage() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { notify }      = useNotification()

  const [vehicle, setVehicle]           = useState(null)
  const [logs, setLogs]                 = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)

  // fetch vehicle details and its logs together
  useEffect(() => {
    async function loadData() {
      setLoading(true)
      setError('')
      try {
        const vehicleData = await getVehicle(id)
        const logsData    = await getLogs(id)
        if (!vehicleData) {
          setError('Vehicle not found.')
        } else {
          setVehicle(vehicleData)
          // sort logs newest first
          setLogs(logsData.sort((a, b) => new Date(b.date) - new Date(a.date)))
        }
      } catch {
        setError('Could not load vehicle details. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id])

  async function handleDeleteLog() {
    if (!deleteTarget) return
    try {
      await deleteLog(deleteTarget.id)
      setLogs(prev => prev.filter(l => l.id !== deleteTarget.id))
      notify(`${deleteTarget.serviceType} log removed.`)
    } catch {
      setError('Could not delete the log. Please try again.')
    } finally {
      setDeleteTarget(null)
    }
  }

  // add up total cost from all logs
  const totalSpent = logs.reduce((sum, log) => sum + Number(log.cost || 0), 0)

  if (loading) return <LoadingSpinner />

  if (error) return (
    <div>
      <button onClick={() => navigate('/vehicles')} className="text-sm text-gray-500 hover:text-gray-700 mb-4 block">
        &larr; Back to vehicles
      </button>
      <p className="text-sm text-red-600">{error}</p>
    </div>
  )

  return (
    <div>
      <button
        id="btn-back-vehicles"
        onClick={() => navigate('/vehicles')}
        className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-4 block transition-colors"
      >
        &larr; Back to vehicles
      </button>

      {/* vehicle info card */}
      <div className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl overflow-hidden mb-6">
        {vehicle.imageUrl && (
          <img src={vehicle.imageUrl} alt={`${vehicle.make} ${vehicle.model}`} className="w-full h-48 object-cover" />
        )}
        <div className="p-5">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{vehicle.make} {vehicle.model}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{vehicle.year}</p>

          {/* stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Number plate</p>
              <p className="font-medium text-gray-800 dark:text-gray-200">{vehicle.licensePlate || 'Not set'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Mileage</p>
              <p className="font-medium text-gray-800 dark:text-gray-200">
                {vehicle.currentMileage ? Number(vehicle.currentMileage).toLocaleString() + ' km' : 'Not set'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Revenue Licence</p>
              <p className="font-medium text-gray-800 dark:text-gray-200">{formatDate(vehicle.motDueDate)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Total spent</p>
              <p className="font-medium text-gray-800 dark:text-gray-200">
                Rs. {totalSpent.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <button
            id="btn-edit-vehicle"
            onClick={() => navigate(`/vehicles/${id}/edit`)}
            className="mt-4 text-sm text-primary-700 hover:text-primary-800 font-medium transition-colors"
          >
            Edit vehicle details
          </button>
        </div>
      </div>

      {/* service history */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Service history ({logs.length})
        </h3>
        <button
          id="btn-add-log"
          onClick={() => navigate(`/vehicles/${id}/log/add`)}
          className="px-4 py-2 bg-primary-700 hover:bg-primary-800 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Add log
        </button>
      </div>

      {logs.length === 0 && (
        <EmptyState
          message="No service records yet."
          action={{ label: 'Add the first log', onClick: () => navigate(`/vehicles/${id}/log/add`) }}
        />
      )}

      {logs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {logs.map(log => (
            <ServiceLogCard
              key={log.id}
              log={log}
              onEdit={log => navigate(`/vehicles/${id}/log/${log.id}/edit`)}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {deleteTarget && (
        <ConfirmModal
          message={`Remove this ${deleteTarget.serviceType} log?`}
          confirmLabel="Yes, remove"
          onConfirm={handleDeleteLog}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
