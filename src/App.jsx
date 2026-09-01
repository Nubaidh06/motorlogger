import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/layout/Layout'

import LandingPage        from './pages/LandingPage'
import DashboardPage      from './pages/DashboardPage'
import VehiclesPage       from './pages/VehiclesPage'
import VehicleDetailPage  from './pages/VehicleDetailPage'
import AddEditVehiclePage from './pages/AddEditVehiclePage'
import AddEditLogPage     from './pages/AddEditLogPage'

export default function App() {
  // read system dark mode preference on first load
  const [darkMode, setDarkMode] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  // toggle the 'dark' class on html element so tailwind dark: classes work
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  function toggleDark() {
    setDarkMode(prev => !prev)
  }

  // helper to wrap protected pages in the nav/footer layout
  function withLayout(Page) {
    return (
      <ProtectedRoute>
        <Layout darkMode={darkMode} onToggleDark={toggleDark}>
          <Page />
        </Layout>
      </ProtectedRoute>
    )
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"                             element={<LandingPage />} />
          <Route path="/dashboard"                    element={withLayout(DashboardPage)} />
          <Route path="/vehicles"                     element={withLayout(VehiclesPage)} />
          <Route path="/vehicles/add"                 element={withLayout(AddEditVehiclePage)} />
          <Route path="/vehicles/:id"                 element={withLayout(VehicleDetailPage)} />
          <Route path="/vehicles/:id/edit"            element={withLayout(AddEditVehiclePage)} />
          <Route path="/vehicles/:id/log/add"         element={withLayout(AddEditLogPage)} />
          <Route path="/vehicles/:id/log/:logId/edit" element={withLayout(AddEditLogPage)} />
          <Route path="*"                             element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
