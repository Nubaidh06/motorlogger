import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { addLog, getLog, updateLog } from '../firebase/serviceLogs'
import { useNotification } from '../hooks/useNotification'
import ServiceLogForm from '../components/logs/ServiceLogForm'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function AddEditLogPage() {
  // id = vehicle id, logId = log id (only present when editing)
  const { id, logId } = useParams()
  const isEditing     = Boolean(logId)

  const [initialData, setInitialData] = useState({})
  const [loadingData, setLoadingData] = useState(isEditing)
  const [saving, setSaving]           = useState(false)
  const [error, setError]             = useState('')

  const { currentUser } = useAuth()
  const { notify }      = useNotification()
  const navigate        = useNavigate()

  // load existing log data when editing
  useEffect(() => {
    if (!isEditing) return
    async function load() {
      try {
        const log = await getLog(logId)
        if (!log) {
          setError('Log not found.')
        } else {
          setInitialData(log)
        }
      } catch {
        setError('Could not load log details.')
      } finally {
        setLoadingData(false)
      }
    }
    load()
  }, [logId, isEditing])

  async function handleSubmit(formData) {
    setSaving(true)
    setError('')
    try {
      if (isEditing) {
        await updateLog(logId, formData)
        notify(`${formData.serviceType} log updated.`)
      } else {
        await addLog(currentUser.uid, id, formData)
        notify(`${formData.serviceType} log added.`)
      }
      navigate(`/vehicles/${id}`)
    } catch {
      setError('Could not save the log. Please try again.')
      setSaving(false)
    }
  }

  if (loadingData) return <LoadingSpinner />

  return (
    <div>
      <div className="mb-6">
        <button
          id="btn-back"
          onClick={() => navigate(`/vehicles/${id}`)}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-3 block transition-colors"
        >
          &larr; Back
        </button>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {isEditing ? 'Edit service log' : 'Add a service log'}
        </h2>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2 mb-4">
          {error}
        </p>
      )}

      <ServiceLogForm initialData={initialData} onSubmit={handleSubmit} loading={saving} />
    </div>
  )
}
