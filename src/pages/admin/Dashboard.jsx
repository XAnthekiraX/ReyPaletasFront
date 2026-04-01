import { useState, useEffect } from 'react'
import { privateApi } from '../../services/api'

function StatCard({ icon, label, total, active, inactive, loading, error }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{label}</p>
        <div className="bg-primary/10 p-2.5 rounded-lg">
          {icon({ className: "w-5 h-5 text-primary" })}
        </div>
      </div>
      
      {loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-9 bg-gray-100 rounded w-16"></div>
          <div className="h-4 bg-gray-100 rounded w-24"></div>
          <div className="h-4 bg-gray-100 rounded w-20"></div>
        </div>
      ) : error ? (
        <p className="text-red-500 text-sm">{error}</p>
      ) : (
        <div className="space-y-2">
          <p className="text-4xl font-bold text-gray-900">{total}</p>
          <div className="flex items-center gap-4 pt-1">
            <span className="flex items-center text-sm text-green-600">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
              {active} activos
            </span>
            <span className="flex items-center text-sm text-gray-400">
              <span className="w-2 h-2 bg-gray-300 rounded-full mr-1.5"></span>
              {inactive} pendientes
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

function SimpleStatCard({ icon, label, value, loading, error }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{label}</p>
        <div className="bg-primary/10 p-2.5 rounded-lg">
          {icon({ className: "w-5 h-5 text-primary" })}
        </div>
      </div>
      
      {loading ? (
        <div className="animate-pulse">
          <div className="h-9 bg-gray-100 rounded w-16"></div>
        </div>
      ) : error ? (
        <p className="text-red-500 text-sm">{error}</p>
      ) : (
        <p className="text-4xl font-bold text-gray-900">{value}</p>
      )}
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    productsTotal: 0,
    productsActive: 0,
    productsInactive: 0,
    announcementsTotal: 0,
    announcementsActive: 0,
    announcementsInactive: 0,
    franchises: 0,
  })
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const fetchStats = async () => {
      await new Promise(resolve => setTimeout(resolve, 300))

      try {
        const [products, announcements, franchises] = await Promise.all([
          privateApi.getProducts(),
          privateApi.getAnnouncements(),
          privateApi.getFranchises(),
        ])

        const productsData = products?.data || products || []
        const announcementsData = announcements?.data || announcements || []

        const productsAdded = productsData.filter(p => p.exists === true).length
        const productsPending = productsData.filter(p => p.exists === false).length
        const announcementsActive = announcementsData.filter(a => a.active === true).length
        const announcementsInactive = announcementsData.filter(a => a.active === false).length

        setStats({
          productsTotal: productsData.length,
          productsAdded,
          productsPending,
          announcementsTotal: announcementsData.length,
          announcementsActive,
          announcementsInactive,
          franchises: (franchises?.data || franchises || []).length,
        })
      } catch (err) {
        console.error('Error fetching dashboard stats:', err)
        setErrors({
          products: 'Error al cargar',
          announcements: 'Error al cargar',
          franchises: 'Error al cargar',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Resumen de tu panel de administración</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={({ className }) => (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          )}
          label="Productos"
          total={stats.productsTotal}
          active={stats.productsAdded}
          inactive={stats.productsPending}
          loading={loading}
          error={errors.products}
        />
        
        <StatCard
          icon={({ className }) => (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          )}
          label="Anuncios"
          total={stats.announcementsTotal}
          active={stats.announcementsActive}
          inactive={stats.announcementsInactive}
          loading={loading}
          error={errors.announcements}
        />
        
        <SimpleStatCard
          icon={({ className }) => (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          )}
          label="Franquicias"
          value={stats.franchises}
          loading={loading}
          error={errors.franchises}
        />
      </div>
    </div>
  )
}
