import { ref, watch } from 'vue'

const STORAGE_KEY = 'fuxin_favorites'

const loadFavorites = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') }
  catch { return [] }
}

const favorites = ref(loadFavorites())

watch(favorites, (val) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
}, { deep: true })

export function useFavorites() {
  const toggleFavorite = (productId) => {
    const idx = favorites.value.indexOf(productId)
    if (idx >= 0) {
      favorites.value.splice(idx, 1)
    } else {
      favorites.value.push(productId)
    }
  }

  const isFavorite = (productId) => favorites.value.includes(productId)

  const favoriteCount = () => favorites.value.length

  return { favorites, toggleFavorite, isFavorite, favoriteCount }
}
