import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children, darkMode, onToggleDark }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-dark-bg">
      <Navbar darkMode={darkMode} onToggleDark={onToggleDark} />

      {/* pt-14 = height of the fixed navbar */}
      <main className="flex-1 pt-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  )
}
