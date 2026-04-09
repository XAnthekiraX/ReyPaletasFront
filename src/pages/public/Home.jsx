import { useState, useEffect } from 'react'
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'motion/react'
import { publicApi } from '../../services/api'

const HERO_IMAGES = [
    { id: 1, url: 'https://vmlaixvlmiiyucesmgpj.supabase.co/storage/v1/object/public/HeroImages/Hero1.webp', alt: 'Helado artesanal 1' },
    { id: 2, url: 'https://vmlaixvlmiiyucesmgpj.supabase.co/storage/v1/object/public/HeroImages/Hero2.webp', alt: 'Helado artesanal 2' },
    { id: 3, url: 'https://vmlaixvlmiiyucesmgpj.supabase.co/storage/v1/object/public/HeroImages/Hero3.webp', alt: 'Helado artesanal 3' },
    { id: 4, url: 'https://vmlaixvlmiiyucesmgpj.supabase.co/storage/v1/object/public/HeroImages/Hero4.webp', alt: 'Helado artesanal 4' },
    { id: 5, url: 'https://vmlaixvlmiiyucesmgpj.supabase.co/storage/v1/object/public/HeroImages/Hero5.webp', alt: 'Helado artesanal 5' },
    { id: 6, url: 'https://vmlaixvlmiiyucesmgpj.supabase.co/storage/v1/object/public/HeroImages/Hero6.webp', alt: 'Helado artesanal 6' },
    { id: 7, url: 'https://vmlaixvlmiiyucesmgpj.supabase.co/storage/v1/object/public/HeroImages/Hero7.webp', alt: 'Helado artesanal 7' },
]

const HERO_PHRASE = "Eleva tu antojo con paletas artesanales rellenas de sabor premium."

function HeroSection() {
    const [currentImage, setCurrentImage] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % HERO_IMAGES.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    return (
        <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentImage}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0"
                >
                    <img
                        src={HERO_IMAGES[currentImage].url}
                        alt={HERO_IMAGES[currentImage].alt}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-center px-4 max-w-4xl"
                >
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 font-display">
                        Rey Paletas
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-200 font-display">
                        {HERO_PHRASE}
                    </p>
                </motion.div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                {HERO_IMAGES.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentImage(index)}
                        className={`w-3 h-3 rounded-full transition-all ${index === currentImage ? 'bg-white w-8' : 'bg-white/50'
                            }`}
                    />
                ))}
            </div>
        </section>
    )
}

function AnnouncementsSection() {
    const [announcements, setAnnouncements] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const data = await publicApi.getAnnouncements(true)
                setAnnouncements(data || [])
            } catch (error) {
                console.error('Error fetching announcements:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchAnnouncements()
    }, [])

    useEffect(() => {
        if (announcements.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % announcements.length)
            }, 4000)
            return () => clearInterval(interval)
        }
    }, [announcements.length])

    if (loading) {
        return (
            <section className="py-16 bg-secondary">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="animate-pulse flex justify-center gap-4">
                        <div className="w-64 h-8 bg-gray-300 rounded" />
                    </div>
                </div>
            </section>
        )
    }

    if (!announcements.length) {
        return null
    }

    const isCarousel = announcements.length > 1

    return (
        <section className="py-16 bg-secondary">
            <div className="max-w-7xl mx-auto px-4">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-bold text-primary text-center mb-10"
                >
                    Noticias y Promociones
                </motion.h2>

                <div className="relative">
                    {isCarousel && (
                        <>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentIndex}
                                    initial={{ opacity: 0, x: 100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-2xl mx-auto"
                                >
                                    <div className="md:flex">
                                        {announcements[currentIndex].image_url && (
                                            <div className="md:w-1/2 h-64 flex justify-center items-center md:h-auto relative">
                                                <img
                                                    src={announcements[currentIndex].image_url}
                                                    alt={announcements[currentIndex].title}
                                                    className="w-full h-full object-contain z-10"
                                                />
                                                <img
                                                    src={announcements[currentIndex].image_url}
                                                    alt={announcements[currentIndex].title}
                                                    className="absolute w-full h-full object-cover blur-md z-0"
                                                />
                                            </div>
                                        )}
                                        <div className="p-8 md:w-1/2 flex flex-col justify-center">
                                            <h3 className="text-2xl font-bold text-quaternary mb-3">
                                                {announcements[currentIndex].title}
                                            </h3>
                                            <p className="text-gray-600">
                                                {announcements[currentIndex].description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            <div className="flex justify-center gap-2 mt-6">
                                {announcements.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        className={`w-3 h-3 rounded-full transition-all ${index === currentIndex ? 'bg-quaternary' : 'bg-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {!isCarousel && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-2xl mx-auto"
                        >
                            <div className="md:flex">
                                {announcements[0].image_url && (
                                    <div className="md:w-1/2 h-64 md:h-auto">
                                        <img
                                            src={announcements[0].image_url}
                                            alt={announcements[0].title}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                )}
                                <div className="p-8 md:w-1/2 flex flex-col justify-center">
                                    <h3 className="text-2xl font-bold text-quaternary mb-3">
                                        {announcements[0].title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {announcements[0].description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    )
}

function UpcomingProductsSection() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await publicApi.getProducts(null, false)
                setProducts(data || [])
            } catch (error) {
                console.error('Error fetching upcoming products:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    if (loading) {
        return (
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-square bg-gray-300 rounded-xl mb-3" />
                                <div className="h-4 bg-gray-300 rounded w-3/4" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    if (!products.length) {
        return null
    }

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-bold text-primary text-center mb-4"
                >
                    Productos Futuros
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-center text-gray-600 mb-10 max-w-2xl mx-auto"
                >
                    Sabores y texturas únicas que elevan tu paladar a nuevas alturas. ¡Mantente atento a nuestras próximas delicias!
                </motion.p>

                <div className="flex justify-around items-center gap-6 object-center">
                    {products.map((product, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group"
                        >
                            <div className="relative aspect-square rounded-xl overflow-hidden mb-3 p-5 bg-white">
                                {product.image_url ? (
                                    <>
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="w-full h-full object-contain blur-sm"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="bg-primary/80 text-white px-4 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                                                Próximamente
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <h3 className="font-semibold text-gray-800 text-center group-hover:text-primary transition-colors">
                                {product.name}
                            </h3>
                            {product.variants && product.variants.length > 0 ? (
                                <p className="text-sm text-gray-500 text-center mt-1">
                                    Desde ${Math.min(...product.variants.map(v => v.price)).toFixed(2)}
                                </p>
                            ) : product.price ? (
                                <p className="text-sm text-gray-500 text-center mt-1">
                                    ${product.price.toFixed(2)}
                                </p>
                            ) : null}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default function Home() {
    return (
        <div className="min-h-screen">
            <HeroSection />
            <AnnouncementsSection />
            <UpcomingProductsSection />
        </div>
    )
}