import { useState } from 'react'
import serviceTypes from '../../data/serviceTypes.json'

const emptyForm = {
  serviceType: '',
  date: '',
  cost: '',
  mileageAtService: '',
  location: '',
  description: '',
}

export default function ServiceLogForm({ initialData = {}, onSubmit, loading }) {
  const [form, setForm]   = useState({ ...emptyForm, ...initialData })
  const [error, setError] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.serviceType) return setError('Please select a service type.')
    if (!form.date)        return setError('Please enter the service date.')
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
      {/* service type dropdown populated from local JSON file */}
      <div>
        <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Service type
        </label>
        <select
          id="serviceType"
          name="serviceType"
          required
          value={form.serviceType}
          onChange={handleChange}
          className="w-full border border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
        >
          <option value="" disabled>Select a type</option>
          {serviceTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Date
        </label>
        <input
          id="date"
          name="date"
          type="date"
          required
          value={form.date}
          onChange={handleChange}
          className="w-full border border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
        />
      </div>

      <div>
        <label htmlFor="cost" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Cost (LKR) <span className="text-gray-400 font-normal text-xs">(optional)</span>
        </label>
        <input
          id="cost"
          name="cost"
          type="number"
          min="0"
          step="0.01"
          value={form.cost}
          onChange={handleChange}
          placeholder="e.g. 85.00"
          className="w-full border border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
        />
      </div>

      <div>
        <label htmlFor="mileageAtService" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Mileage at service <span className="text-gray-400 font-normal text-xs">(optional)</span>
        </label>
        <input
          id="mileageAtService"
          name="mileageAtService"
          type="number"
          min="0"
          value={form.mileageAtService}
          onChange={handleChange}
          placeholder="e.g. 45200"
          className="w-full border border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
        />
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Garage or workshop <span className="text-gray-400 font-normal text-xs">(optional)</span>
        </label>
        <input
          id="location"
          name="location"
          type="text"
          value={form.location}
          onChange={handleChange}
          placeholder="e.g. Kwik Fit Manchester"
          className="w-full border border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Notes <span className="text-gray-400 font-normal text-xs">(optional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={form.description}
          onChange={handleChange}
          placeholder="Any extra details about the service..."
          className="w-full border border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 resize-none"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        id="btn-save-log"
        type="submit"
        disabled={loading}
        className="w-full bg-primary-700 hover:bg-primary-800 text-white font-medium py-2 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Saving...' : 'Save log'}
      </button>
    </form>
  )
}
