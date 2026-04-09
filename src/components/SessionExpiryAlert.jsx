import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from '../store/AuthContext'
import { AnimatePresence, motion } from 'motion/react'

export default function SessionExpiryAlert() {
  const {
    showExpiryWarning,
    showExpiryModal,
    handleRefreshSession,
    logout
  } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleTokenExpired = () => {
      logout()
    }
    window.addEventListener('auth:token-expired', handleTokenExpired)
    return () => window.removeEventListener('auth:token-expired', handleTokenExpired)
  }, [logout])

  const handleLogoutAndRedirect = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <AnimatePresence>
      {showExpiryWarning && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <div className="bg-yellow-50 border border-yellow-400 text-yellow-800 px-6 py-4 rounded-lg shadow-lg max-w-md">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">Tu sesión está por expirar</p>
                <p className="text-sm text-yellow-700 mt-1">
                  ¿Quieres refresh tu sesión?
                </p>
              </div>
              <div className="flex gap-2">
                <motion.button
                  onClick={handleRefreshSession}
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sí
                </motion.button>
                <motion.button
                  onClick={handleLogoutAndRedirect}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  No
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {showExpiryModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4 z-10"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            <div className="text-center">
              <motion.div
                className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring' }}
              >
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Tu sesión ha expirado
              </h3>
              <p className="text-gray-600 mb-6">
                Por seguridad, tu sesión ha terminado. Por favor, inicia sesión nuevamente.
              </p>
              <motion.button
                onClick={handleLogoutAndRedirect}
                className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Ir al login
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}