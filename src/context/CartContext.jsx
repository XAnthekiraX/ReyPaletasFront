/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'

const CART_KEY = 'rey_paletas_cart'

const CartContext = createContext(null)

function getCart() {
  try {
    const data = localStorage.getItem(CART_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => getCart())

  useEffect(() => {
    saveCart(cartItems)
  }, [cartItems])

  const removeFromCart = useCallback((itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId))
  }, [])

  const addToCart = useCallback((product, quantity, variantName = null) => {
    if (!product?.id) {
      console.warn('Product has no ID:', product)
      return
    }

    const price = product.variants && product.variants.length > 0
      ? Math.min(...product.variants.map(v => v.price))
      : product.price || 0

    const newItem = {
      id: product.id,
      name: product.name,
      image_url: product.image_url,
      price: price,
      quantity: quantity,
      variantName: variantName,
      price_varies: product.price_varies || false
    }

    setCartItems(prev => [...prev, newItem])
  }, [])

  const updateQuantity = useCallback((itemId, newQuantity) => {
    if (newQuantity < 1) {
      return
    }

    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }, [])

  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

  const isInCart = useCallback((productId) => {
    if (!productId) return false
    return cartItems.some(item => item.id === productId)
  }, [cartItems])

  const cartCount = cartItems.length

  const value = useMemo(() => ({
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isInCart,
    cartCount
  }), [cartItems, addToCart, updateQuantity, removeFromCart, clearCart, isInCart, cartCount])

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
