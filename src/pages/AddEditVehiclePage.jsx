import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { addVehicle, getVehicle, updateVehicle } from '../firebase/vehicles'
import { useNotification } from '../hooks/useNotification'
import VehicleForm from '../components/vehicles/VehicleForm'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function AddEditVehiclePage() {
  // if id is in the url we are editing, otherwise adding
  const { id }    = useParams()
  const isEditing = Boolean(id)

  const [initialData, setInitialData] = useState({})
  const [loadingData, setLoadingData] = useState(isEditing)
  const [saving, setSaving]           = useState(false)
  const [error, setError]             = useState('')

  const { currentUser } = useAuth()
  const { notify }      = useNotification()
  const navigate        = useNavigate()

  // when editing, load the existing vehicle to fill the form
  useEffect(() => {
    if (!isEditing) return
    async function load() {
      try {
        const vehicle = await getVehicle(id)
        if (!vehicle) {
          setError('Vehicle not found.')
        } else {
          setInitialData(vehicle)
        }
      } catch {
        setError('Could not load vehicle details.')
      } finally {
        setLoadingData(false)
      }
    }
    load()
  }, [id, isEditing])

  async function handleSubmit(formData) {
    setSaving(true)
    setError('')
    try {
      if (isEditing) {
        await updateVehicle(id, formData)
        notify(`${formData.make} ${formData.model} updated.`)
      } else {
        await addVehicle(currentUser.uid, formData)
        notify(`${formData.make} ${formData.model} added.`)
      }
      navigate('/vehicles')
    } catch {
      setError('Could not save the vehicle. Please try again.')
      setSaving(false)
    }
  }

  if (loadingData) return <LoadingSpinner />

  return (
    <div>
      <div className="mb-6">
        <button
          id="btn-back"
          onClick={() => navigate(-1)}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-3 block transition-colors"
        >
          &larr; Back
        </button>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {isEditing ? 'Edit vehicle' : 'Add a vehicle'}
        </h2>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2 mb-4">
          {error}
        </p>
      )}

      <VehicleForm initialData={initialData} onSubmit={handleSubmit} loading={saving} />
    </div>
  )
}
