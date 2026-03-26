import React, { useState, useEffect, useRef } from 'react'
import { publicApi } from '../../services/api'
import { useCart } from '../../context/CartContext'
import { Icon } from '@iconify/react'

function CategoryNav({ categories, selectedCategory, onSelectCategory }) {
    const scrollRef = useRef(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
            setCanScrollLeft(scrollLeft > 0)
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1)
        }
    }

    useEffect(() => {
        checkScroll()
        window.addEventListener('resize', checkScroll)
        return () => window.removeEventListener('resize', checkScroll)
    }, [])

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 200
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            })
        }
    }

    return (
        <div className="relative mb-8">
            {canScrollLeft && (
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors md:hidden"
                >
                    <Icon icon="mdi:chevron-left" className="w-6 h-6 text-gray-700" />
                </button>
            )}

            <div
                ref={scrollRef}
                onScroll={checkScroll}
                className="flex gap-3 overflow-x-auto scrollbar-hide py-2 px-1 justify-center"
            >
                <button
                    onClick={() => onSelectCategory(null)}
                    className={`flex-shrink-0 px-5 py-2.5 rounded-full font-medium transition-all duration-200 ${selectedCategory === null
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    Todos
                </button>

                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => onSelectCategory(category.id)}
                        className={`flex-shrink-0 px-5 py-2.5 rounded-full font-medium transition-all duration-200 ${selectedCategory === category.id
                            ? 'bg-primary text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            {canScrollRight && (
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors md:hidden"
                >
                    <Icon icon="mdi:chevron-right" className="w-6 h-6 text-gray-700" />
                </button>
            )}
        </div>
    )
}

function VariantSelector({ variants, selectedVariant, onSelectVariant }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="mb-3">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-3 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition-colors"
            >
                <span className="text-gray-700">
                    {selectedVariant?.name || 'Seleccionar'} - <span className="font-bold text-primary">${selectedVariant?.price.toFixed(2)}</span>
                </span>
                <Icon 
                    icon={isOpen ? "mdi:chevron-up" : "mdi:chevron-down"} 
                    className="w-5 h-5 text-gray-700" 
                />
            </button>

            {isOpen && (
                <div className="mt-2 space-y-1 bg-gray-50 rounded-lg p-2">
                    {variants.map((variant, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                onSelectVariant(variant)
                                setIsOpen(false)
                            }}
                            className={`w-full px-3 py-2 text-left text-sm rounded-md transition-all ${
                                selectedVariant?.name === variant.name
                                    ? 'bg-primary text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            {variant.name} - ${variant.price.toFixed(2)}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

function ProductCard({ product }) {
    const { addToCart, isInCart } = useCart()
    const [quantity, setQuantity] = useState(1)
    const [selectedVariant, setSelectedVariant] = useState(() => {
        const hasVariants = product.price_varies && product.variants && product.variants.length > 0
        return hasVariants ? product.variants[0] : null
    })

    const hasVariants = product.price_varies && product.variants && product.variants.length > 0

    const getCurrentPrice = () => {
        if (hasVariants && selectedVariant) {
            return selectedVariant.price
        }
        if (hasVariants && product.variants && product.variants.length > 0) {
            return Math.min(...product.variants.map(v => v.price))
        }
        return product.price || 0
    }

    const handleAddToCart = () => {
        const variantName = hasVariants ? selectedVariant?.name : null
        addToCart(product, quantity, variantName)
    }

    const inCart = isInCart(product.id)
    const currentPrice = getCurrentPrice()

    if (inCart) {
        return (
            <div className="bg-gray-50 rounded-2xl p-4 flex flex-col h-full border-2 border-green-200">
                <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-gray-200">
                    {product.image_url ? (
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Icon icon="mdi:ice-cream" className="w-16 h-16" />
                        </div>
                    )}
                </div>

                <h3 className="font-semibold text-gray-800 text-center mb-2 line-clamp-2">
                    {product.name}
                </h3>

                <p className="text-sm text-green-600 text-center font-medium mb-3">
                    ✓ En carrito
                </p>

                <div className="mt-auto pt-3 border-t border-gray-200">
                    <p className="text-lg font-bold text-primary text-center">
                        ${currentPrice.toFixed(2)}
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-2xl p-4 flex flex-col h-full shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-gray-100">
                {product.image_url ? (
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Icon icon="mdi:ice-cream" className="w-16 h-16" />
                    </div>
                )}
            </div>

            <h3 className="font-semibold text-gray-800 text-center mb-2 line-clamp-2">
                {product.name}
            </h3>

            {hasVariants ? (
                <VariantSelector
                    variants={product.variants}
                    selectedVariant={selectedVariant}
                    onSelectVariant={setSelectedVariant}
                />
            ) : null}

            <p className="text-lg font-bold text-primary text-center mb-4">
                ${currentPrice.toFixed(2)}
            </p>

            <div className="mt-auto">
                <div className="flex items-center justify-center gap-3 mb-3">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                        <Icon icon="mdi:minus" className="w-5 h-5 text-gray-700" />
                    </button>

                    <span className="w-8 text-center font-semibold text-lg text-gray-800">
                        {quantity}
                    </span>

                    <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                        <Icon icon="mdi:plus" className="w-5 h-5 text-gray-700" />
                    </button>
                </div>

                <button
                    onClick={handleAddToCart}
                    className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                    <Icon icon="mdi:cart-plus" className="w-5 h-5" />
                    Añadir al carrito
                </button>
            </div>
        </div>
    )
}

export default function Products() {
    const [categories, setCategories] = useState([])
    const [products, setProducts] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [loading, setLoading] = useState(true)
    const [loadingProducts, setLoadingProducts] = useState(false)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await publicApi.getCategories()
                setCategories(data || [])
            } catch (error) {
                console.error('Error fetching categories:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchCategories()
    }, [])

    useEffect(() => {
        const fetchProducts = async () => {
            setLoadingProducts(true)
            try {
                const data = await publicApi.getProducts(selectedCategory, true)
                setProducts(data || [])
            } catch (error) {
                console.error('Error fetching products:', error)
            } finally {
                setLoadingProducts(false)
            }
        }
        fetchProducts()
    }, [selectedCategory])

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="animate-pulse">
                        <div className="h-10 bg-gray-200 rounded w-48 mx-auto mb-8" />
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i}>
                                    <div className="aspect-square bg-gray-200 rounded-2xl mb-3" />
                                    <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
                                    <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <h1 className="text-3xl md:text-4xl font-bold text-primary text-center mb-4">
                    Nuestros Sabores
                </h1>
                <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
                    Explora nuestra variedad de paletas artesanales
                </p>

                <CategoryNav
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                />

                {loadingProducts ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-square bg-gray-200 rounded-2xl mb-3" />
                                <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
                                <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto" />
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-16">
                        <Icon icon="mdi:ice-cream-off" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No hay productos disponibles en esta categoría</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product, index) => (
                            <ProductCard
                                key={index}
                                product={product}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
