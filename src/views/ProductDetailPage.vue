<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'
import { products } from '../data/products.js'

const route = useRoute()
const router = useRouter()
const productId = parseInt(route.params.id)
const product = computed(() => products.find(p => p.id === productId) || products[0])

const herbColor = { '君': '#4E2E1E', '臣': '#4A7C59', '佐': '#4A6B8A', '使': '#C9A050' }
const cartItems = ref(JSON.parse(localStorage.getItem('fuxin_cart') || '[]'))

const addToCart = () => {
  const id = product.value.id
  if (!cartItems.value.includes(id)) {
    cartItems.value.push(id)
    localStorage.setItem('fuxin_cart', JSON.stringify(cartItems.value))
    showToast('已加入香囊')
  } else {
    showToast('该香方已在香囊中')
  }
}

const handleShare = async () => {
  const p = product.value
  const shareData = {
    title: `${p.name} — 抚心合香`,
    text: `${p.name}：${p.effect}。以香入药，以心疗心。`,
    url: window.location.href,
  }
  if (navigator.share) {
    try {
      await navigator.share(shareData)
    } catch { /* user cancelled */ }
  } else if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(shareData.url)
      showToast('链接已复制，快去分享吧')
    } catch {
      showToast('分享链接：' + shareData.url)
    }
  } else {
    showToast('分享链接：' + shareData.url)
  }
}
</script>

<template>
  <div class="page product-detail-page">
    <!-- Header Image -->
    <div class="detail-hero" :style="{ background: product.color }">
      <img v-if="product.image?.detail" :src="product.image.detail" :alt="product.name"
        @error="$event.target.style.display='none'" loading="lazy" />
      <button class="hero-back" @click="router.back()">✕</button>
      <span class="hero-name brand">{{ product.name }}</span>
      <span class="hero-element">{{ product.element }}</span>
    </div>

    <!-- Body -->
    <div class="detail-body">
      <div class="detail-effect">{{ product.effect }}</div>
      <div class="detail-price brand">
        <span class="price-current">¥{{ product.price }}</span>
        <span class="price-orig">¥{{ product.origPrice }}</span>
      </div>

      <div class="detail-section">
        <div class="detail-section-title brand">配伍药材</div>
        <div class="herb-tags">
          <span v-for="herb in product.herbs" :key="herb.n" class="herb-tag"
            :style="{ color: herbColor[herb.r], borderColor: herbColor[herb.r] + '40', background: herbColor[herb.r] + '10' }">
            {{ herb.r }}·{{ herb.n }}
          </span>
        </div>
      </div>

      <div class="detail-section">
        <div class="detail-section-title brand">配伍原理</div>
        <div class="detail-text">{{ product.principle }}</div>
      </div>

      <div class="detail-section">
        <div class="detail-section-title brand">使用方法</div>
        <div class="detail-text">{{ product.usage }}</div>
      </div>

      <div class="detail-section" v-if="product.reviews?.length">
        <div class="detail-section-title brand">用户评价</div>
        <div v-for="review in product.reviews" :key="review.name" class="review-item">
          <div class="review-header">
            <span class="review-name">{{ review.name }}</span>
            <span class="review-stars">{{ '★'.repeat(review.rating) }}</span>
            <span class="review-time">{{ review.time }}</span>
          </div>
          <div class="review-text">{{ review.text }}</div>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="bottom-bar">
      <button class="bar-btn home-btn" @click="router.push('/home')">首页</button>
      <button class="bar-btn share-btn" @click="handleShare">分享</button>
      <button class="bar-btn buy-btn" @click="addToCart">加入香囊</button>
    </div>
  </div>
</template>

<style scoped>
.page { min-height: 100vh; background: var(--rp); padding-bottom: 60px; }

.detail-hero {
  height: 220px; position: relative; display: flex; align-items: center;
  justify-content: center; overflow: hidden;
}
.detail-hero img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.hero-back {
  position: absolute; top: 16px; left: 16px; width: 32px; height: 32px;
  background: rgba(255,255,255,0.3); border: none; border-radius: 50%; color: white;
  font-size: 14px; cursor: pointer; z-index: 2; backdrop-filter: blur(4px);
}
.hero-name {
  font-size: 40px; font-weight: 700; color: rgba(255,255,255,0.9);
  text-shadow: 0 2px 12px rgba(0,0,0,0.3); z-index: 1;
}
.hero-element {
  position: absolute; top: 16px; right: 16px; background: rgba(255,255,255,0.85);
  padding: 4px 12px; border-radius: 20px; font-size: 11px; color: var(--hg);
  font-weight: 500; backdrop-filter: blur(8px); z-index: 1;
}

.detail-body { padding: 20px; }
.detail-effect { font-size: 14px; color: var(--hg); margin-bottom: 8px; }
.detail-price { margin-bottom: 16px; }
.price-current { font-size: 24px; font-weight: 700; color: var(--tp); }
.price-orig { font-size: 13px; color: var(--t3); text-decoration: line-through; margin-left: 8px; }

.detail-section { margin-bottom: 16px; }
.detail-section-title {
  font-size: 14px; font-weight: 600; color: var(--t1); margin-bottom: 8px;
  padding-left: 8px; border-left: 3px solid var(--tl);
}
.herb-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.herb-tag { padding: 4px 12px; border-radius: 12px; font-size: 11px; border: 1px solid; }
.detail-text { font-size: 13px; color: var(--t2); line-height: 1.7; }

.review-item { padding: 10px 0; border-bottom: 1px solid rgba(212,197,176,0.3); }
.review-item:last-child { border-bottom: none; }
.review-header { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.review-name { font-size: 12px; color: var(--t1); font-weight: 500; }
.review-stars { font-size: 10px; color: var(--e); }
.review-time { font-size: 10px; color: var(--t3); margin-left: auto; }
.review-text { font-size: 12px; color: var(--t2); line-height: 1.5; }

.bottom-bar {
  position: fixed; bottom: 0; left: 0; right: 0; height: 56px;
  background: var(--pc); border-top: 1px solid var(--mg);
  display: flex; align-items: center; padding: 0 20px; gap: 10px;
}
.bar-btn { border: none; border-radius: 12px; font-size: 13px; cursor: pointer; font-family: 'Noto Serif SC', serif; }
.home-btn { padding: 10px 16px; background: var(--rp); color: var(--tp); }
.share-btn { padding: 10px 16px; background: var(--rp); color: var(--t2); }
.buy-btn { flex: 1; padding: 10px; background: var(--tp); color: white; font-weight: 600; letter-spacing: 2px; }
</style>
