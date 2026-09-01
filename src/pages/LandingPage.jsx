import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// converts firebase error codes into readable messages for the user
function getErrorMessage(code) {
  switch (code) {
    case 'auth/invalid-credential':   return 'Wrong email or password.'
    case 'auth/user-not-found':       return 'No account found with that email.'
    case 'auth/wrong-password':       return 'Wrong email or password.'
    case 'auth/email-already-in-use': return 'An account with this email already exists.'
    case 'auth/weak-password':        return 'Password must be at least 6 characters.'
    case 'auth/invalid-email':        return 'Please enter a valid email address.'
    default:                          return 'Something went wrong. Please try again.'
  }
}

// feature data shown in the "how it works" section
const features = [
  {
    title: 'Add your vehicles',
    desc: 'Register any car with its make, model, year, registration plate, mileage, and a photo. All your vehicles in one place.',
  },
  {
    title: 'Log every service',
    desc: 'Record oil changes, Revenue Licence renewals, tyre replacements, and any other work. Add the cost, garage name, and mileage at the time.',
  },
  {
    title: 'Track your spending',
    desc: 'Your dashboard shows total money spent across all vehicles and when each car was last serviced, so nothing slips through.',
  },
  {
    title: 'Revenue Licence reminders',
    desc: 'Each vehicle card shows your Revenue Licence expiry date with a warning badge when it is due within 30 days or has already expired.',
  },
]

export default function LandingPage() {
  const [tab, setTab]                         = useState('login')
  const [email, setEmail]                     = useState('')
  const [password, setPassword]               = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError]                     = useState('')
  const [loading, setLoading]                 = useState(false)

  const { login, register, currentUser } = useAuth()
  const navigate = useNavigate()

  // if already logged in, redirect straight to dashboard
  if (currentUser) return <Navigate to="/dashboard" replace />

  function switchTab(newTab) {
    setTab(newTab)
    setError('')
    setPassword('')
    setConfirmPassword('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (tab === 'register' && password !== confirmPassword) {
      return setError('Passwords do not match.')
    }
    setLoading(true)
    try {
      if (tab === 'login') {
        await login(email, password)
      } else {
        await register(email, password)
      }
      navigate('/dashboard')
    } catch (err) {
      setError(getErrorMessage(err.code))
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full border border-gray-300 dark:border-dark-border dark:bg-dark-bg dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex flex-col">

      {/* simple top bar */}
      <header className="bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border px-4 py-3">
        <div className="max-w-5xl mx-auto">
          <span className="font-bold text-lg text-gray-900 dark:text-white tracking-tight">
            Motor<span className="text-primary-700">Logger</span>
          </span>
        </div>
      </header>

      {/* hero section */}
      <section className="bg-gray-900 text-white py-20 px-4 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
          Your vehicle service history,<br />
          <span className="text-primary-500">all in one place.</span>
        </h1>
        <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto mb-8">
          MotorLogger lets you track service records, repair costs, and Revenue Licence dates
          for all your vehicles. Never lose track of a service again.
        </p>
        {/* scroll down to the auth form */}
        <a
          href="#get-started"
          className="inline-block px-6 py-3 bg-primary-700 hover:bg-primary-800 text-white font-semibold rounded-lg transition-colors text-sm"
        >
          Get started for free
        </a>
      </section>

      {/* features section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-10">
            Everything you need to stay on top of maintenance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(f => (
              <div
                key={f.title}
                className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl p-5"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* how it works - simple 3 step strip */}
      <section className="bg-white dark:bg-dark-surface border-y border-gray-200 dark:border-dark-border py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-8">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Create an account', desc: 'Sign up with your email in seconds. Your data is private to your account.' },
              { step: '2', title: 'Add your vehicles', desc: 'Enter your car details and optionally upload a photo.' },
              { step: '3', title: 'Start logging', desc: 'Record every service and repair. View your full history anytime.' },
            ].map(item => (
              <div key={item.step} className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary-700 text-white flex items-center justify-center font-bold text-lg mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* auth section */}
      <section id="get-started" className="py-16 px-4 flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-sm">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-6">
            {tab === 'login' ? 'Log in to your account' : 'Create your free account'}
          </h2>

          {/* auth card */}
          <div className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl shadow-sm p-6">
            {/* login / register tabs */}
            <div className="flex border-b border-gray-200 dark:border-dark-border mb-6">
              <button
                id="tab-login"
                onClick={() => switchTab('login')}
                className={`flex-1 pb-3 text-sm font-medium transition-colors ${
                  tab === 'login'
                    ? 'border-b-2 border-primary-700 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                Log in
              </button>
              <button
                id="tab-register"
                onClick={() => switchTab('register')}
                className={`flex-1 pb-3 text-sm font-medium transition-colors ${
                  tab === 'register'
                    ? 'border-b-2 border-primary-700 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                Create account
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  id="email" name="email" type="email" required autoComplete="email"
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <input
                  id="password" name="password" type="password" required
                  autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="At least 6 characters" className={inputClass}
                />
              </div>

              {tab === 'register' && (
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirm password
                  </label>
                  <input
                    id="confirm-password" name="confirm-password" type="password" required
                    autoComplete="new-password"
                    value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your password" className={inputClass}
                  />
                </div>
              )}

              {error && (
                <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                id="btn-submit" type="submit" disabled={loading}
                className="w-full bg-primary-700 hover:bg-primary-800 text-white font-medium py-2 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Please wait...' : tab === 'login' ? 'Log in' : 'Create account'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface py-6 px-4 text-center">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          MotorLogger &copy; {new Date().getFullYear()} &middot; COMP50075 Web Development
        </p>
      </footer>

    </div>
  )
}
