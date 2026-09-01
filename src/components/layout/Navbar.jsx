import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/vehicles',  label: 'My Vehicles' },
]

export default function Navbar({ darkMode, onToggleDark }) {
  const [drawerOpen, setDrawerOpen]       = useState(false)
  const [installPrompt, setInstallPrompt] = useState(null)
  const { logout } = useAuth()
  const navigate   = useNavigate()

  // capture the PWA install prompt so we can trigger it with our own button
  useEffect(() => {
    function handler(e) {
      e.preventDefault()
      setInstallPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  async function handleInstall() {
    if (!installPrompt) return
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') setInstallPrompt(null)
  }

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  const activeClass   = 'text-sm font-medium text-primary-700'
  const inactiveClass = 'text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors'

  return (
    <>
      {/* fixed top navigation bar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

          <NavLink to="/dashboard" className="font-bold text-lg text-gray-900 dark:text-white tracking-tight shrink-0">
            Motor<span className="text-primary-700">Logger</span>
          </NavLink>

          {/* desktop/tablet links - hidden on mobile */}
          <div className="hidden sm:flex items-center gap-6 flex-1">
            {navLinks.map(link => (
              <NavLink key={link.to} to={link.to}
                className={({ isActive }) => isActive ? activeClass : inactiveClass}>
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* dark mode toggle */}
            <button
              id="btn-toggle-dark"
              onClick={onToggleDark}
              aria-label="Toggle dark mode"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-border transition-colors text-base"
            >
              {darkMode ? '☀' : '☾'}
            </button>

            {/* install button only shows when the PWA is ready to install */}
            {installPrompt && (
              <button
                id="btn-install-app"
                onClick={handleInstall}
                className="hidden sm:block text-sm font-medium text-primary-700 hover:text-primary-800 border border-primary-700 hover:border-primary-800 px-3 py-1 rounded-lg transition-colors"
              >
                Install app
              </button>
            )}

            <button
              id="btn-logout-desktop"
              onClick={handleLogout}
              className="hidden sm:block text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-border"
            >
              Log out
            </button>

            {/* hamburger button - mobile only */}
            <button
              id="btn-hamburger"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              className="sm:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-border transition-colors"
            >
              <span className="block w-5 space-y-1">
                <span className="block h-0.5 bg-current rounded" />
                <span className="block h-0.5 bg-current rounded" />
                <span className="block h-0.5 bg-current rounded" />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* backdrop behind the drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 sm:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* slide-in mobile drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 z-50 bg-white dark:bg-dark-surface border-r border-gray-200 dark:border-dark-border transition-transform duration-200 sm:hidden ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 h-14 border-b border-gray-200 dark:border-dark-border">
          <span className="font-bold text-gray-900 dark:text-white">
            Motor<span className="text-primary-700">Logger</span>
          </span>
          <button
            id="btn-close-drawer"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-border transition-colors text-lg leading-none"
          >
            &times;
          </button>
        </div>

        <div className="p-3 flex flex-col gap-1">
          {navLinks.map(link => (
            <NavLink key={link.to} to={link.to} onClick={() => setDrawerOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-400'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-border'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          <hr className="my-2 border-gray-200 dark:border-dark-border" />

          {installPrompt && (
            <button
              id="btn-install-app-mobile"
              onClick={handleInstall}
              className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-primary-700 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-950 transition-colors"
            >
              Install app
            </button>
          )}

          <button
            id="btn-logout-mobile"
            onClick={handleLogout}
            className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-border transition-colors"
          >
            Log out
          </button>
        </div>
      </div>
    </>
  )
}
