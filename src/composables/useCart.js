import { ref, watch } from 'vue'

const STORAGE_KEY = 'fuxin_cart'

const loadCart = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') }
  catch { return [] }
}

const cartItems = ref(loadCart())

watch(cartItems, (val) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
}, { deep: true })

export function useCart() {
  const addToCart = (productId) => {
    if (!cartItems.value.includes(productId)) {
      cartItems.value.push(productId)
      return true
    }
    return false
  }

  const removeFromCart = (productId) => {
    const idx = cartItems.value.indexOf(productId)
    if (idx >= 0) {
      cartItems.value.splice(idx, 1)
    }
  }

  const isInCart = (productId) => cartItems.value.includes(productId)

  const cartCount = () => cartItems.value.length

  const clearCart = () => { cartItems.value = [] }

  return { cartItems, addToCart, removeFromCart, isInCart, cartCount, clearCart }
}
