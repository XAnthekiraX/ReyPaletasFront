import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { publicAPI } from '../../services/api'

export default function Home() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    publicAPI.getAnnouncements()
      .then(data => setAnnouncements(data))
      .catch(err => console.error('Failed to load announcements:', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <section className="bg-pink-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Rey Paletas</h1>
          <p className="text-xl mb-8">Los mejores helados y paletas artesanales</p>
          <Link 
            to="/menu" 
            className="inline-block bg-white text-pink-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            Ver Menu
          </Link>
        </div>
      </section>

      {!loading && announcements.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Noticias</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {announcements.map((announcement, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {announcement.image_url && (
                    <img 
                      src={announcement.image_url} 
                      alt={announcement.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{announcement.title}</h3>
                    <p className="text-gray-600">{announcement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Visítanos</h2>
          <Link 
            to="/locations" 
            className="inline-block border-2 border-pink-600 text-pink-600 px-8 py-3 rounded-full font-semibold hover:bg-pink-600 hover:text-white transition"
          >
            Ver Ubicaciones
          </Link>
        </div>
      </section>
    </div>
  )
}
