import { useState, useEffect } from 'react'
import { uploadImage } from '../../firebase/cloudinary'

const CURRENT_YEAR = new Date().getFullYear()

// common car makes shown as suggestions if the api doesn't load
const FALLBACK_MAKES = [
  'Alfa Romeo', 'Audi', 'BMW', 'Chevrolet', 'Chrysler', 'Citroen', 'Dacia',
  'Dodge', 'Fiat', 'Ford', 'Honda', 'Hyundai', 'Jaguar', 'Jeep', 'Kia',
  'Land Rover', 'Lexus', 'Mazda', 'Mercedes-Benz', 'MG', 'MINI', 'Mitsubishi',
  'Nissan', 'Peugeot', 'Porsche', 'Renault', 'SEAT', 'Skoda', 'Subaru',
  'Suzuki', 'Tesla', 'Toyota', 'Vauxhall', 'Volkswagen', 'Volvo',
]

// fetch car makes from the NHTSA vehicle api (free, no api key needed)
async function fetchCarMakes() {
  const res  = await fetch(
    'https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json'
  )
  const data = await res.json()
  return data.Results
    .map(item => item.MakeName)
    .filter(m => m && m.length > 0)
    .sort()
}

const emptyForm = {
  make: '', model: '', year: '', licensePlate: '', currentMileage: '', motDueDate: '',
}

export default function VehicleForm({ initialData = {}, onSubmit, loading }) {
  const [form, setForm]               = useState({ ...emptyForm, ...initialData })
  const [makes, setMakes]             = useState(FALLBACK_MAKES)
  const [imageFile, setImageFile]     = useState(null)
  const [imagePreview, setImagePreview] = useState(initialData.imageUrl || null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError]             = useState('')

  // try to load makes from api on mount, fall back to hardcoded list if it fails
  useEffect(() => {
    fetchCarMakes()
      .then(apiMakes => { if (apiMakes && apiMakes.length > 0) setMakes(apiMakes) })
      .catch(() => {})
  }, [])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file)) // show preview before upload
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!form.make.trim() || !form.model.trim() || !form.year) {
      return setError('Make, model and year are required.')
    }

    let imageUrl = initialData.imageUrl || ''

    if (imageFile) {
      try {
        setUploadingImage(true)
        imageUrl = await uploadImage(imageFile) // upload to cloudinary
      } catch {
        setError('Image upload failed. Please try again.')
        return
      } finally {
        setUploadingImage(false)
      }
    }

    onSubmit({ ...form, imageUrl })
  }

  const isWorking = loading || uploadingImage

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">

      {/* make field - uses html datalist for suggestions from the api */}
      <div>
        <label htmlFor="make" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Make
        </label>
        <input
          id="make"
          name="make"
          type="text"
          required
          list="makes-list"
          value={form.make}
          onChange={handleChange}
          placeholder="e.g. Toyota, Ford, BMW"
          className="w-full border border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
        />
        <datalist id="makes-list">
          {makes.map(make => (
            <option key={make} value={make} />
          ))}
        </datalist>
      </div>

      <div>
        <label htmlFor="model" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Model</label>
        <input id="model" name="model" type="text" required value={form.model} onChange={handleChange}
          placeholder="e.g. Corolla, Focus"
          className="w-full border border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600" />
      </div>

      <div>
        <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year</label>
        <input id="year" name="year" type="number" required min="1900" max={CURRENT_YEAR} value={form.year} onChange={handleChange}
          placeholder={String(CURRENT_YEAR)}
          className="w-full border border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600" />
      </div>

      <div>
        <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vehicle number plate</label>
        <input id="licensePlate" name="licensePlate" type="text" value={form.licensePlate} onChange={handleChange}
          placeholder="e.g. WP CAB-1234"
          className="w-full border border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 uppercase" />
      </div>

      <div>
        <label htmlFor="currentMileage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current mileage (km)</label>
        <input id="currentMileage" name="currentMileage" type="number" min="0" value={form.currentMileage} onChange={handleChange}
          placeholder="e.g. 85000"
          className="w-full border border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600" />
      </div>

      <div>
        <label htmlFor="motDueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Revenue Licence expiry</label>
        <input id="motDueDate" name="motDueDate" type="date" value={form.motDueDate} onChange={handleChange}
          className="w-full border border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600" />
      </div>

      <div>
        <label htmlFor="vehicleImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Photo <span className="text-gray-400 dark:text-gray-500 font-normal text-xs">(optional)</span>
        </label>
        {imagePreview && (
          <img src={imagePreview} alt="Preview"
            className="w-full h-40 object-cover rounded-lg mb-2 border border-gray-200 dark:border-dark-border" />
        )}
        <input id="vehicleImage" type="file" accept="image/*" onChange={handleImageChange}
          className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 dark:file:bg-dark-border dark:file:text-gray-300 hover:file:bg-gray-200 dark:hover:file:bg-gray-600" />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button id="btn-save-vehicle" type="submit" disabled={isWorking}
        className="w-full bg-primary-700 hover:bg-primary-800 text-white font-medium py-2 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
        {uploadingImage ? 'Uploading photo...' : isWorking ? 'Saving...' : 'Save vehicle'}
      </button>
    </form>
  )
}
