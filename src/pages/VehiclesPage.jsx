import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getVehicles, deleteVehicle } from '../firebase/vehicles'
import { deleteLogsByVehicleId } from '../firebase/serviceLogs'
import { useNotification } from '../hooks/useNotification'
import VehicleCard from '../components/vehicles/VehicleCard'
import ConfirmModal from '../components/ui/ConfirmModal'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EmptyState from '../components/ui/EmptyState'

export default function VehiclesPage() {
  const [vehicles, setVehicles]         = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)

  const { currentUser } = useAuth()
  const { notify }      = useNotification()
  const navigate        = useNavigate()

  // load vehicles when user is available
  useEffect(() => {
    if (currentUser) loadVehicles()
  }, [currentUser])

  async function loadVehicles() {
    if (!currentUser) return
    setLoading(true)
    setError('')
    try {
      const data = await getVehicles(currentUser.uid)
      setVehicles(data)
    } catch {
      setError('Could not load your vehicles. Please try again.')
    } finally {
      // finally always runs so the spinner doesn't get stuck
      setLoading(false)
    }
  }

  // called when the user confirms deletion in the modal
  async function handleDelete() {
    if (!deleteTarget) return
    try {
      // delete the logs first, then the vehicle
      await deleteLogsByVehicleId(deleteTarget.id)
      await deleteVehicle(deleteTarget.id)
      setVehicles(prev => prev.filter(v => v.id !== deleteTarget.id))
      notify(`${deleteTarget.make} ${deleteTarget.model} removed.`)
    } catch {
      setError('Could not delete the vehicle. Please try again.')
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">My vehicles</h2>
        <button
          id="btn-add-vehicle"
          onClick={() => navigate('/vehicles/add')}
          className="px-4 py-2 bg-primary-700 hover:bg-primary-800 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Add vehicle
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2 mb-4">
          {error}
        </p>
      )}

      {loading && <LoadingSpinner />}

      {!loading && vehicles.length === 0 && (
        <EmptyState
          message="No vehicles added yet."
          action={{ label: 'Add your first vehicle', onClick: () => navigate('/vehicles/add') }}
        />
      )}

      {/* responsive grid - 1 col mobile, 2 tablet, 3 desktop */}
      {!loading && vehicles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map(vehicle => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} onDelete={setDeleteTarget} />
          ))}
        </div>
      )}

      {/* confirm before deleting */}
      {deleteTarget && (
        <ConfirmModal
          message={`Remove ${deleteTarget.make} ${deleteTarget.model} and all its service records?`}
          confirmLabel="Yes, remove"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
