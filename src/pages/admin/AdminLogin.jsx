import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'motion/react'
import { useAuth } from '../../store/AuthContext'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const { login, isLoading, error: authError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/admin'

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) return 'El email es requerido'
    if (!emailRegex.test(email)) return 'Ingresa un email válido (ej: usuario@dominio.com)'
    return ''
  }

  const validatePassword = (password) => {
    if (!password) return 'La contraseña es requerida'
    if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres'
    return ''
  }

  const validateForm = () => {
    const newErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    }
    setErrors(newErrors)
    return !newErrors.email && !newErrors.password
  }

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true })
    if (field === 'email') {
      setErrors({ ...errors, email: validateEmail(email) })
    } else if (field === 'password') {
      setErrors({ ...errors, password: validatePassword(password) })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    setTouched({ email: true, password: true })
    
    if (!validateForm()) {
      return
    }

    const success = await login(email, password)
    if (success) {
      navigate(from, { replace: true })
    }
  }

  const hasErrors = Object.values(errors).some(e => e)
  const showGeneralError = authError && !hasErrors

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <motion.div 
        className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-quaternary p-6 text-center">
          <h1 className="text-2xl font-bold text-primary">Rey Paletas</h1>
          <p className="text-gray-300 mt-1">Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <AnimatePresence>
            {showGeneralError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-sm"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Credenciales incorrectas. Por favor, verifica tu email y contraseña.</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="text"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (touched.email) {
                  setErrors({ ...errors, email: validateEmail(e.target.value) })
                }
              }}
              onBlur={() => handleBlur('email')}
              className={`w-full px-4 py-3 border rounded-lg outline-none transition-all ${
                errors.email && touched.email
                  ? 'border-red-500 focus:ring-2 focus:ring-red-500/50 focus:border-red-500'
                  : 'border-gray-300 focus:ring-2 focus:ring-primary/50 focus:border-primary'
              }`}
              placeholder="admin@reypaletas.com"
              disabled={isLoading}
            />
            <AnimatePresence>
              {errors.email && touched.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.email}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (touched.password) {
                  setErrors({ ...errors, password: validatePassword(e.target.value) })
                }
              }}
              onBlur={() => handleBlur('password')}
              className={`w-full px-4 py-3 border rounded-lg outline-none transition-all ${
                errors.password && touched.password
                  ? 'border-red-500 focus:ring-2 focus:ring-red-500/50 focus:border-red-500'
                  : 'border-gray-300 focus:ring-2 focus:ring-primary/50 focus:border-primary'
              }`}
              placeholder="••••••••"
              disabled={isLoading}
            />
            <AnimatePresence>
              {errors.password && touched.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.password}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Verificando...
              </span>
            ) : (
              'Iniciar sesión'
            )}
          </motion.button>
        </form>

        <div className="px-8 pb-6 text-center">
          <a href="/" className="text-sm text-gray-500 hover:text-primary transition-colors">
            ← Volver al sitio
          </a>
        </div>
      </motion.div>
    </div>
  )
}