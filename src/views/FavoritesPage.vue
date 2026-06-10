<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import SubPageHeader from '../components/SubPageHeader.vue'
import EmptyState from '../components/EmptyState.vue'
import { useFavorites } from '../composables/useFavorites.js'
import { useCart } from '../composables/useCart.js'
import { products } from '../data/products.js'
import { ROLE_COLORS } from '../utils/constants.js'

const router = useRouter()
const { favorites, toggleFavorite, isFavorite } = useFavorites()
const { addToCart, isInCart } = useCart()

const favoriteProducts = computed(() =>
  favorites.value.map(id => products.find(p => p.id === id)).filter(Boolean)
)
</script>

<template>
  <div class="page">
    <SubPageHeader title="我的收藏" />

    <EmptyState
      v-if="favoriteProducts.length === 0"
      icon="💝"
      text="还没有收藏的香方"
      action="去逛逛"
      @action="router.push('/shop')"
    />

    <div v-else class="fav-list">
      <div v-for="p in favoriteProducts" :key="p.id" class="fav-card"
        @click="router.push(`/shop/product/${p.id}`)">
        <div class="fav-card-image" :style="{ background: p.color }">
          <img v-if="p.image?.card" :src="p.image.card" :alt="p.name"
            @error="$event.target.style.display='none'" loading="lazy" />
          <span class="fav-card-name brand">{{ p.name }}</span>
        </div>
        <div class="fav-card-body">
          <div class="fav-card-element">{{ p.element }}</div>
          <div class="fav-card-effect">{{ p.effect }}</div>
          <div class="fav-card-herbs">
            <span v-for="h in p.herbs.slice(0,3)" :key="h.n"
              class="fav-herb-tag"
              :style="{ color: ROLE_COLORS[h.r], borderColor: ROLE_COLORS[h.r] + '40' }">
              {{ h.n }}
            </span>
          </div>
          <div class="fav-card-price">
            <span class="price-now">¥{{ p.price }}</span>
            <span class="price-orig">¥{{ p.origPrice }}</span>
          </div>
        </div>
        <button class="fav-remove" @click.stop="toggleFavorite(p.id)">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="var(--f)" stroke="none">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page { min-height: 100vh; background: var(--rp); }
.fav-list { padding: 16px 20px; display: flex; flex-direction: column; gap: 12px; }

.fav-card {
  display: flex; gap: 12px; background: var(--pc); border-radius: 12px;
  overflow: hidden; border: 1px solid rgba(180,149,85,0.15); box-shadow: var(--sc);
  cursor: pointer; position: relative; transition: transform 0.2s;
}
.fav-card:active { transform: scale(0.98); }
.fav-card-image {
  width: 100px; min-height: 100px; display: flex; align-items: center;
  justify-content: center; position: relative; overflow: hidden; flex-shrink: 0;
}
.fav-card-image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.5; }
.fav-card-name { position: relative; z-index: 1; font-size: 16px; color: rgba(255,255,255,0.9); writing-mode: vertical-rl; }

.fav-card-body { padding: 12px; flex: 1; display: flex; flex-direction: column; gap: 4px; }
.fav-card-element { font-size: 10px; color: var(--hg); font-weight: 500; }
.fav-card-effect { font-size: 13px; font-weight: 500; color: var(--t1); }
.fav-card-herbs { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 2px; }
.fav-herb-tag { font-size: 9px; padding: 1px 6px; border-radius: 8px; border: 1px solid; }
.fav-card-price { margin-top: auto; display: flex; gap: 6px; align-items: baseline; }
.price-now { font-size: 15px; font-weight: 600; color: var(--tp); }
.price-orig { font-size: 11px; color: var(--t3); text-decoration: line-through; }

.fav-remove {
  position: absolute; top: 8px; right: 8px; width: 28px; height: 28px;
  border: none; background: rgba(255,255,255,0.9); border-radius: 50%;
  display: flex; align-items: center; justify-content: center; cursor: pointer;
}
</style>
