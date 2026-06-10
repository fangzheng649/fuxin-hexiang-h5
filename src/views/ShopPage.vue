<script setup>
import { ref, computed } from 'vue'
import { products } from '../data/products.js'
import CloudDivider from '../components/CloudDivider.vue'
import SectionHeader from '../components/SectionHeader.vue'

const activeTab = ref(0)
const tabs = ['全部', '木·肝', '火·心', '土·脾', '金·肺', '水·肾']
const selectedProduct = ref(null)
const showDetail = ref(false)

const filteredProducts = computed(() => {
  if (activeTab.value === 0) return products
  return products.filter(p => p.element === tabs[activeTab.value])
})

const openDetail = (product) => {
  selectedProduct.value = product
  showDetail.value = true
}

const closeDetail = () => {
  showDetail.value = false
  selectedProduct.value = null
}

const herbColor = { '君': '#4E2E1E', '臣': '#4A7C59', '佐': '#4A6B8A', '使': '#C9A050' }

// 礼盒数据
const gifts = [
  { name: '四季安宁·礼盒', info: '春夏秋冬各一方，四季安康', price: 588, color: 'linear-gradient(135deg,#C8B898,#8B7355)', image: '/images/gifts/gift-1.jpg' },
  { name: '五行调和·礼盒', info: '金木水火土五方齐全', price: 698, color: 'linear-gradient(135deg,#B89555,#6B4E35)', image: '/images/gifts/gift-2.jpg' },
]
</script>

<template>
  <div class="page shop-page">
    <!-- Search -->
    <div class="shop-search">
      <svg viewBox="0 0 24 24" width="16" height="16" stroke="var(--t3)" fill="none" stroke-width="2" stroke-linecap="round">
        <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
      </svg>
      <input type="text" placeholder="搜索香方、药材、功效..." />
    </div>

    <!-- Category Tabs -->
    <div class="shop-tabs">
      <div
        v-for="(tab, i) in tabs"
        :key="i"
        class="shop-tab"
        :class="{ active: activeTab === i }"
        @click="activeTab = i"
      >
        {{ tab }}
      </div>
    </div>

    <!-- Product List -->
    <div class="shop-grid">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="shop-card"
        @click="openDetail(product)"
      >
        <div class="shop-card-image" :style="{ background: product.color }">
          <img v-if="product.image?.card" :src="product.image.card" :alt="product.name"
            @error="$event.target.style.display='none'" loading="lazy" />
          <span class="vertical-name brand">{{ product.name }}</span>
        </div>
        <div class="shop-card-body">
          <div class="shop-card-name brand">{{ product.name }}</div>
          <div class="shop-card-effect">{{ product.effect }}</div>
          <div class="shop-card-desc">{{ product.desc }}</div>
          <div class="shop-card-bottom">
            <span class="shop-card-price">{{ product.price }}</span>
            <button class="shop-card-btn">查看详情</button>
          </div>
        </div>
      </div>
    </div>

    <CloudDivider />

    <!-- Custom -->
    <div class="shop-custom" @click="showDetail = true">
      <div class="shop-custom-title brand">定制专属香方</div>
      <div class="shop-custom-desc">AI分析体质，传承人手工调制，独一无二的香方</div>
      <span class="shop-custom-btn">开始定制</span>
    </div>

    <CloudDivider />

    <!-- Subscribe -->
    <div class="shop-subscribe">
      <div class="shop-subscribe-title brand">按月订阅 · 香伴四季</div>
      <div class="shop-subscribe-desc">
        每月一方节气香，顺应四时调养身心
        <span class="shop-subscribe-tag">首月半价</span>
      </div>
    </div>

    <CloudDivider />

    <!-- Gift -->
    <SectionHeader title="香礼 · 赠礼优选" more="更多 ›" />
    <div class="gift-scroll hide-scrollbar">
      <div v-for="gift in gifts" :key="gift.name" class="gift-card">
        <div class="gift-card-image" :style="{ background: gift.color }">
          <img v-if="gift.image" :src="gift.image" :alt="gift.name"
            @error="$event.target.style.display='none'" loading="lazy" />
          <span class="brand">{{ gift.name.split('·')[0] }}</span>
        </div>
        <div class="gift-card-body">
          <div class="gift-card-name brand">{{ gift.name }}</div>
          <div class="gift-card-info">{{ gift.info }}</div>
          <div class="gift-card-price">{{ gift.price }}</div>
        </div>
      </div>
    </div>

    <div style="height: 20px" />

    <!-- Product Detail Popup -->
    <Transition name="popup">
      <div v-if="showDetail && selectedProduct" class="detail-overlay" @click.self="closeDetail">
        <div class="detail-popup">
          <div class="detail-header" :style="{ background: selectedProduct.color }">
            <img v-if="selectedProduct.image?.detail" :src="selectedProduct.image.detail" :alt="selectedProduct.name"
              @error="$event.target.style.display='none'" />
            <div class="detail-header-overlay"></div>
            <span class="detail-name brand">{{ selectedProduct.name }}</span>
            <span class="detail-element">{{ selectedProduct.element }}</span>
            <button class="detail-close" @click="closeDetail">✕</button>
          </div>
          <div class="detail-body">
            <div class="detail-effect">{{ selectedProduct.effect }}</div>
            <div class="detail-price brand">
              <span class="price-current">¥{{ selectedProduct.price }}</span>
              <span class="price-orig">¥{{ selectedProduct.origPrice }}</span>
            </div>

            <div class="detail-section">
              <div class="detail-section-title brand">配伍药材</div>
              <div class="herb-tags">
                <span
                  v-for="herb in selectedProduct.herbs"
                  :key="herb.n"
                  class="herb-tag"
                  :style="{ color: herbColor[herb.r], borderColor: herbColor[herb.r] + '40', background: herbColor[herb.r] + '10' }"
                >
                  {{ herb.r }}·{{ herb.n }}
                </span>
              </div>
            </div>

            <div class="detail-section">
              <div class="detail-section-title brand">配伍原理</div>
              <div class="detail-text">{{ selectedProduct.principle }}</div>
            </div>

            <div class="detail-section">
              <div class="detail-section-title brand">使用方法</div>
              <div class="detail-text">{{ selectedProduct.usage }}</div>
            </div>

            <div class="detail-section" v-if="selectedProduct.reviews.length">
              <div class="detail-section-title brand">用户评价</div>
              <div v-for="review in selectedProduct.reviews" :key="review.name" class="review-item">
                <div class="review-header">
                  <span class="review-name">{{ review.name }}</span>
                  <span class="review-stars">{{ '★'.repeat(review.rating) }}</span>
                  <span class="review-time">{{ review.time }}</span>
                </div>
                <div class="review-text">{{ review.text }}</div>
              </div>
            </div>

            <div class="detail-actions">
              <button class="btn-primary" @click="closeDetail">加入香囊</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.page {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  background: var(--rp);
}
.page::-webkit-scrollbar { display: none; }

/* Search */
.shop-search {
  margin: 12px 20px 0;
  position: relative;
}
.shop-search svg {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
}
.shop-search input {
  width: 100%;
  padding: 10px 16px 10px 36px;
  border: 1px solid var(--mg);
  border-radius: 24px;
  background: var(--pc);
  font-size: 13px;
  color: var(--t1);
  outline: none;
  font-family: inherit;
}
.shop-search input::placeholder { color: var(--t3); }
.shop-search input:focus { border-color: var(--tl); }

/* Tabs */
.shop-tabs {
  display: flex;
  padding: 0 20px;
  border-bottom: 1px solid var(--mg);
  margin-top: 12px;
  overflow-x: auto;
}
.shop-tabs::-webkit-scrollbar { display: none; }
.shop-tab {
  padding: 12px 0;
  margin-right: 24px;
  font-size: 13px;
  color: var(--t3);
  cursor: pointer;
  position: relative;
  font-family: 'Noto Serif SC', serif;
  transition: all 0.2s;
  white-space: nowrap;
  flex-shrink: 0;
}
.shop-tab.active { color: var(--tp); font-weight: 600; }
.shop-tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 15%;
  right: 15%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--tp), transparent);
}

/* Product Grid */
.shop-grid {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.shop-card {
  background: var(--pc);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--sc);
  display: flex;
  cursor: pointer;
  transition: all 0.25s;
  border: 1px solid rgba(180, 149, 85, 0.2);
  position: relative;
}
.shop-card::before {
  content: '';
  position: absolute;
  inset: 3px;
  border: 1px solid rgba(180, 149, 85, 0.12);
  border-radius: 9px;
  pointer-events: none;
  z-index: 0;
}
.shop-card:active { transform: scale(0.98); }
.shop-card-image {
  width: 120px;
  min-height: 130px;
  position: relative;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.shop-card-image img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.vertical-name {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  z-index: 1;
  writing-mode: vertical-rl;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}
.shop-card-body {
  padding: 14px;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.shop-card-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--t1);
  margin-bottom: 2px;
}
.shop-card-effect {
  font-size: 11px;
  color: var(--hg);
  margin-bottom: 6px;
}
.shop-card-desc {
  font-size: 11px;
  color: var(--t2);
  line-height: 1.5;
  flex: 1;
}
.shop-card-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}
.shop-card-price {
  font-family: 'Noto Serif SC', serif;
  font-size: 18px;
  font-weight: 700;
  color: var(--tp);
}
.shop-card-price::before { content: '¥'; font-size: 12px; }
.shop-card-btn {
  padding: 6px 14px;
  background: var(--tp);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 11px;
  font-family: 'Noto Serif SC', serif;
  cursor: pointer;
}

/* Custom */
.shop-custom {
  margin: 0 20px;
  padding: 20px;
  background: linear-gradient(135deg, #1A0E05, var(--td));
  border-radius: 16px;
  color: var(--tl);
  position: relative;
  overflow: hidden;
  cursor: pointer;
}
.shop-custom::before {
  content: '';
  position: absolute;
  top: -30px;
  right: -20px;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(201, 160, 80, 0.12), transparent 70%);
  border-radius: 50%;
}
.shop-custom-title {
  font-size: 16px;
  font-weight: 600;
  color: #C9A050;
  margin-bottom: 4px;
}
.shop-custom-desc {
  font-size: 12px;
  color: rgba(232, 221, 211, 0.7);
  margin-bottom: 10px;
}
.shop-custom-btn {
  display: inline-block;
  padding: 8px 20px;
  background: rgba(201, 160, 80, 0.2);
  border: 1px solid rgba(201, 160, 80, 0.4);
  border-radius: 20px;
  color: #C9A050;
  font-size: 12px;
}

/* Subscribe */
.shop-subscribe {
  margin: 0 20px;
  padding: 16px;
  background: linear-gradient(135deg, rgba(78, 46, 30, 0.06), rgba(74, 124, 89, 0.06));
  border-radius: 14px;
  border: 1px dashed var(--tl);
}
.shop-subscribe-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--t1);
  margin-bottom: 4px;
}
.shop-subscribe-desc {
  font-size: 11px;
  color: var(--t2);
  line-height: 1.5;
}
.shop-subscribe-tag {
  display: inline-block;
  font-size: 10px;
  color: var(--f);
  background: rgba(199, 84, 80, 0.08);
  padding: 2px 8px;
  border-radius: 8px;
  margin-left: 6px;
}

/* Gift */
.gift-scroll {
  display: flex;
  gap: 12px;
  padding: 0 20px;
  overflow-x: auto;
}
.gift-card {
  min-width: 220px;
  background: var(--pc);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: var(--sc);
  border: 1px solid rgba(180, 149, 85, 0.2);
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.25s;
}
.gift-card:active { transform: scale(0.97); }
.gift-card-image {
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
.gift-card-image img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.gift-card-image span {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  z-index: 1;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}
.gift-card-body { padding: 12px; }
.gift-card-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--t1);
  margin-bottom: 2px;
}
.gift-card-info {
  font-size: 10px;
  color: var(--t3);
  margin-bottom: 6px;
  line-height: 1.4;
}
.gift-card-price {
  font-size: 14px;
  font-weight: 700;
  color: var(--tp);
}
.gift-card-price::before { content: '¥'; font-size: 10px; }

/* Detail Popup */
.detail-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 999;
  display: flex;
  align-items: flex-end;
}
.detail-popup {
  width: 100%;
  max-height: 85vh;
  background: var(--rp);
  border-radius: 20px 20px 0 0;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}
.detail-header {
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
.detail-header img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.detail-header-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.4));
  z-index: 1;
}
.detail-name {
  font-size: 36px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  z-index: 2;
}
.detail-element {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.85);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  color: var(--hg);
  font-weight: 500;
  backdrop-filter: blur(8px);
  z-index: 2;
}
.detail-close {
  position: absolute;
  top: 16px;
  left: 16px;
  width: 30px;
  height: 30px;
  background: rgba(255, 255, 255, 0.3);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
  z-index: 2;
}
.detail-body {
  padding: 20px;
  overflow-y: auto;
  max-height: calc(85vh - 140px);
}
.detail-effect {
  font-size: 14px;
  color: var(--hg);
  margin-bottom: 8px;
}
.detail-price {
  margin-bottom: 16px;
}
.price-current {
  font-size: 24px;
  font-weight: 700;
  color: var(--tp);
}
.price-orig {
  font-size: 13px;
  color: var(--t3);
  text-decoration: line-through;
  margin-left: 8px;
}
.detail-section {
  margin-bottom: 16px;
}
.detail-section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--t1);
  margin-bottom: 8px;
  padding-left: 8px;
  border-left: 3px solid var(--tl);
}
.herb-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.herb-tag {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  border: 1px solid;
}
.detail-text {
  font-size: 13px;
  color: var(--t2);
  line-height: 1.7;
}
.review-item {
  padding: 10px 0;
  border-bottom: 1px solid rgba(212, 197, 176, 0.3);
}
.review-item:last-child { border-bottom: none; }
.review-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}
.review-name { font-size: 12px; color: var(--t1); font-weight: 500; }
.review-stars { font-size: 10px; color: var(--e); }
.review-time { font-size: 10px; color: var(--t3); margin-left: auto; }
.review-text { font-size: 12px; color: var(--t2); line-height: 1.5; }

.detail-actions {
  padding: 16px 0 8px;
}
.btn-primary {
  width: 100%;
  padding: 14px;
  background: var(--tp);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 15px;
  font-family: 'Noto Serif SC', serif;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 4px;
}
.btn-primary:active { background: var(--td); }

/* Transition */
.popup-enter-active { animation: fadeIn 0.2s ease; }
.popup-leave-active { animation: fadeIn 0.2s ease reverse; }
</style>
