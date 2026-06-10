<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showImagePreview, showToast } from 'vant'
import { products } from '../data/products.js'
import { notes } from '../data/notes.js'
import { quickIcons, noteIcons } from '../icons/index.js'
import CloudDivider from '../components/CloudDivider.vue'
import SectionHeader from '../components/SectionHeader.vue'

const router = useRouter()

// 每日推荐 — 支持"换一换"
const shuffleSeed = ref(0)
const dailyProduct = computed(() => {
  const idx = (new Date().getDate() + shuffleSeed.value) % products.length
  return products[idx]
})
const handleShuffle = () => { shuffleSeed.value++ }

const seasonProduct = computed(() => {
  const m = new Date().getMonth() + 1
  let element = '土·脾'
  if (m >= 3 && m <= 5) element = '木·肝'
  else if (m >= 6 && m <= 7) element = '火·心'
  else if (m === 8) element = '土·脾'
  else if (m >= 9 && m <= 10) element = '金·肺'
  else element = '水·肾'
  const filtered = products.filter(p => p.element === element)
  return filtered.length > 0 ? filtered[0] : products[0]
})

const quickEntries = [
  { key: 'ai', title: 'AI调香师', desc: '说说你的心', tab: 1 },
  { key: 'shop', title: '香方选购', desc: '找到适合你的', tab: 2 },
  { key: 'school', title: '非遗学堂', desc: '千年匠心技艺', tab: 3 },
  { key: 'workshop', title: '工坊预约', desc: '亲手制香', tab: 3 },
  { key: 'community', title: '香气社区', desc: '分享用香体验', tab: 3 },
  { key: 'mine', title: '我的香囊', desc: '购香档案', tab: 4 },
]

const handleQuickEntry = (tab) => {
  const routes = ['/home', '/chat', '/shop', '/heritage', '/profile']
  router.push(routes[tab])
}

const handleWorkshop = () => {
  router.push('/heritage')
}

// 手记详情弹窗
const showNoteDetail = ref(false)
const selectedNote = ref(null)
const openNote = (note) => {
  selectedNote.value = note
  showNoteDetail.value = true
}
</script>

<template>
  <div class="page home-page">
    <!-- Hero -->
    <div class="hero">
      <img src="/images/hero/home-hero.jpg" alt="抚心合香" class="hero-bg"
        @error="$event.target.style.display='none'" loading="lazy" />
      <div class="hero-overlay"></div>
      <div class="hero-brand brand">抚心合香</div>
      <div class="hero-slogan brand">以香入药，以心疗心</div>
      <div class="hero-quote brand">「四季的香，不必点燃，<br/>放在身边就好。」</div>
      <div class="hero-author">—— 陈卫平</div>
      <div class="hero-cloud" />
    </div>

    <!-- 6 Quick Entries -->
    <div class="quick-entries">
      <div class="quick-row">
        <div
          v-for="item in quickEntries.slice(0, 3)"
          :key="item.key"
          class="quick-entry"
          @click="handleQuickEntry(item.tab)"
        >
          <span class="qe-icon">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none">
              <path
                :d="quickIcons[item.key].path"
                stroke="var(--hg)"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                v-if="quickIcons[item.key].circle"
                :d="quickIcons[item.key].circle"
                stroke="var(--hg)"
                stroke-width="1.5"
              />
            </svg>
          </span>
          <div class="qe-title">{{ item.title }}</div>
          <div class="qe-desc">{{ item.desc }}</div>
        </div>
      </div>
      <div class="quick-row">
        <div
          v-for="item in quickEntries.slice(3, 6)"
          :key="item.key"
          class="quick-entry"
          @click="handleQuickEntry(item.tab)"
        >
          <span class="qe-icon">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none">
              <path
                :d="quickIcons[item.key].path"
                stroke="var(--hg)"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                v-if="quickIcons[item.key].circle"
                :d="quickIcons[item.key].circle"
                stroke="var(--hg)"
                stroke-width="1.5"
              />
            </svg>
          </span>
          <div class="qe-title">{{ item.title }}</div>
          <div class="qe-desc">{{ item.desc }}</div>
        </div>
      </div>
    </div>

    <CloudDivider />

    <!-- Daily Recommendation -->
    <SectionHeader title="每日一香" more="换一换 ›" @more="handleShuffle" />
    <div class="card" @click="router.push('/shop')">
      <div class="daily-herb-image" :style="{ background: dailyProduct.color }">
        <img v-if="dailyProduct.image?.banner" :src="dailyProduct.image.banner" :alt="dailyProduct.name"
          @error="$event.target.style.display='none'" loading="lazy" />
        <span class="daily-herb-name brand">{{ dailyProduct.name }}</span>
        <span class="daily-herb-tag">五行·火</span>
      </div>
      <div class="daily-herb-body">
        <div class="daily-herb-title brand">「{{ dailyProduct.name }}」香牌</div>
        <div class="daily-herb-wuxing">五行属火 · 对应心经</div>
        <div class="daily-herb-desc">{{ dailyProduct.desc }}{{ dailyProduct.principle.slice(0, 1) === '君' ? '' : '。' }}{{ dailyProduct.principle }}</div>
      </div>
    </div>

    <CloudDivider />

    <!-- Seasonal Recommendation -->
    <SectionHeader title="芒种 · 节气推荐" more="更多 ›" :to="'/shop'" />
    <div class="card" @click="router.push('/shop')">
      <div class="season-image" :style="{ background: seasonProduct.color }">
        <img v-if="seasonProduct.image?.banner" :src="seasonProduct.image.banner" :alt="seasonProduct.name"
          @error="$event.target.style.display='none'" loading="lazy" />
        <span class="season-name brand">{{ seasonProduct.name }}</span>
        <span class="season-tag">🌾 芒种时节</span>
      </div>
      <div class="season-body">
        <div class="season-title brand">「{{ seasonProduct.name }}」香牌</div>
        <div class="season-effect">{{ seasonProduct.effect }}</div>
        <div class="season-desc">{{ seasonProduct.desc }}芒种时节，湿气渐重，易犯困倦。此方以健脾化湿为主旨，配伍苍术、茯苓、白术等道地药材，佩戴于身，淡淡药香自然散逸。</div>
      </div>
    </div>

    <CloudDivider />

    <!-- Craftsman Notes -->
    <SectionHeader title="传承人手记" more="全部 ›" :to="'/notes'" />
    <div class="notes-scroll hide-scrollbar">
      <div v-for="note in notes" :key="note.id" class="note-card" @click="openNote(note)">
        <div class="note-card-image" :style="{ background: note.bg }">
          <img v-if="note.image" :src="note.image" :alt="note.title"
            @error="$event.target.style.display='none'" loading="lazy" />
        </div>
        <div class="note-card-body">
          <div class="note-card-title">{{ note.title }}</div>
          <div class="note-card-date">{{ note.date }}</div>
        </div>
      </div>
    </div>

    <CloudDivider />

    <!-- Workshop Banner -->
    <SectionHeader title="线下工坊" more="详情 ›" />
    <div class="workshop-banner" @click="handleWorkshop">
      <img src="/images/hero/workshop-banner.jpg" alt="桐南村工坊" class="workshop-bg"
        @error="$event.target.style.display='none'" loading="lazy" />
      <div class="workshop-info">
        <h4>📍 福州 · 桐南村工坊</h4>
        <p>亲手制作属于你的冷凝合香，体验千年匠心</p>
      </div>
      <span class="workshop-btn">预约体验</span>
    </div>

    <div style="height: 20px" />

    <!-- Note Detail Popup -->
    <van-popup v-model:show="showNoteDetail" position="bottom" round :style="{ maxHeight: '75vh' }">
      <div v-if="selectedNote" class="note-detail">
        <div class="note-detail-header">
          <span class="note-detail-title brand">{{ selectedNote.title }}</span>
          <span class="note-detail-date">{{ selectedNote.date }}</span>
        </div>
        <div class="note-detail-image" :style="{ background: selectedNote.bg }">
          <img v-if="selectedNote.image" :src="selectedNote.image" :alt="selectedNote.title"
            @error="$event.target.style.display='none'" loading="lazy" />
        </div>
        <div class="note-detail-text">{{ selectedNote.full }}</div>
        <div class="note-detail-footer">
          <span class="note-detail-author brand">陈卫平 · 传承人手记</span>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<style scoped>
/* Page */
.page {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  background: var(--rp);
}
.page::-webkit-scrollbar { display: none; }

/* Hero */
.hero {
  position: relative;
  padding: 32px 28px 28px;
  min-height: 220px;
  background: linear-gradient(160deg, #E8DCC8, #D9CCAE 50%, #C8B898);
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(232,220,200,0.45) 0%, rgba(200,184,152,0.6) 100%);
  z-index: 0;
}

.hero::before {
  content: '';
  position: absolute;
  top: -60px;
  right: -40px;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(184, 149, 85, 0.2), transparent 70%);
  border-radius: 50%;
  animation: heroGlow 8s ease-in-out infinite;
}

.hero::after {
  content: '';
  position: absolute;
  bottom: -30px;
  left: 20px;
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(74, 124, 89, 0.12), transparent 70%);
  border-radius: 50%;
  animation: heroGlow 10s ease-in-out infinite reverse;
}

.hero-brand {
  font-size: 32px;
  font-weight: 700;
  color: var(--t1);
  letter-spacing: 12px;
  margin-bottom: 10px;
  position: relative;
  z-index: 1;
  text-indent: 12px;
}

.hero-slogan {
  font-size: 14px;
  color: var(--t2);
  letter-spacing: 4px;
  margin-bottom: 18px;
  position: relative;
  z-index: 1;
}

.hero-quote {
  font-size: 15px;
  color: var(--t1);
  line-height: 1.9;
  position: relative;
  z-index: 1;
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.hero-author {
  font-size: 12px;
  color: var(--t3);
  position: relative;
  z-index: 1;
  text-align: right;
}

.hero-cloud {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 20px;
  background:
    radial-gradient(ellipse at 20% 100%, rgba(184, 149, 85, 0.2), transparent 50%),
    radial-gradient(ellipse at 50% 100%, rgba(184, 149, 85, 0.12), transparent 40%),
    radial-gradient(ellipse at 80% 100%, rgba(184, 149, 85, 0.2), transparent 50%);
}

/* Quick Entries */
.quick-entries {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px 20px 0;
}

.quick-row {
  display: flex;
  gap: 12px;
}

.quick-entry {
  flex: 1;
  background: linear-gradient(135deg, var(--pc), #F5EDE0);
  padding: 18px 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.25s;
  box-shadow: var(--sc);
  border-radius: 12px;
  border: 1px solid rgba(180, 149, 85, 0.25);
  position: relative;
}

.quick-entry::before {
  content: '';
  position: absolute;
  inset: 3px;
  border: 1px solid rgba(180, 149, 85, 0.12);
  border-radius: 9px;
  pointer-events: none;
}

.quick-entry:active {
  transform: scale(0.97);
}

.qe-icon {
  width: 36px;
  height: 36px;
  margin: 0 auto 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qe-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--t1);
  margin-bottom: 3px;
}

.qe-desc {
  font-size: 10px;
  color: var(--t3);
}

/* Double-border Card */
.card {
  margin: 0 20px;
  overflow: hidden;
  box-shadow: var(--sc);
  cursor: pointer;
  transition: all 0.25s;
  border-radius: 12px;
  border: 1px solid rgba(180, 149, 85, 0.25);
  background: var(--pc);
  position: relative;
}

.card::before {
  content: '';
  position: absolute;
  inset: 3px;
  border: 1px solid rgba(180, 149, 85, 0.12);
  border-radius: 9px;
  pointer-events: none;
  z-index: 2;
}

.card:active {
  transform: scale(0.98);
}

/* Daily Herb */
.daily-herb-image {
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.daily-herb-image img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.daily-herb-name {
  font-size: 42px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.daily-herb-tag {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.85);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 10px;
  color: var(--hg);
  font-weight: 500;
  backdrop-filter: blur(8px);
}

.daily-herb-body {
  padding: 16px;
}

.daily-herb-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--t1);
  margin-bottom: 4px;
}

.daily-herb-wuxing {
  font-size: 12px;
  color: var(--e);
  margin-bottom: 8px;
}

.daily-herb-desc {
  font-size: 12px;
  color: var(--t2);
  line-height: 1.7;
}

/* Season Card */
.season-image {
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.season-image img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.season-name {
  font-size: 42px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.season-tag {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.85);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 10px;
  color: var(--hg);
  font-weight: 500;
  backdrop-filter: blur(8px);
}

.season-body {
  padding: 16px;
}

.season-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--t1);
  margin-bottom: 4px;
}

.season-effect {
  font-size: 12px;
  color: var(--hg);
  margin-bottom: 8px;
}

.season-desc {
  font-size: 12px;
  color: var(--t2);
  line-height: 1.7;
}

/* Notes Scroll */
.notes-scroll {
  display: flex;
  gap: 12px;
  padding: 0 20px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

.note-card {
  min-width: 200px;
  overflow: hidden;
  box-shadow: var(--sc);
  scroll-snap-align: start;
  cursor: pointer;
  transition: all 0.25s;
  background: var(--pc);
  border-radius: 12px;
  border: 1px solid rgba(180, 149, 85, 0.2);
  flex-shrink: 0;
}

.note-card:active {
  transform: scale(0.97);
}

.note-card-image {
  height: 100px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.note-card-image img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.note-card-body {
  padding: 12px;
}

.note-card-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--t1);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.note-card-date {
  font-size: 10px;
  color: var(--t3);
  margin-top: 4px;
}

/* Workshop Banner */
.workshop-banner {
  margin: 0 20px;
  background: linear-gradient(135deg, #1A0E05, var(--td));
  border-radius: 16px;
  padding: 20px;
  color: var(--tl);
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.25s;
  position: relative;
  overflow: hidden;
}

.workshop-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

.workshop-banner::before {
  content: '';
  position: absolute;
  top: -20px;
  right: -20px;
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, rgba(201, 160, 80, 0.15), transparent 70%);
  border-radius: 50%;
}

.workshop-banner:active {
  transform: scale(0.98);
}

.workshop-info h4 {
  font-family: 'Noto Serif SC', serif;
  font-size: 15px;
  margin-bottom: 4px;
  color: #D4C5B0;
  position: relative;
  z-index: 1;
}

.workshop-info p {
  font-size: 11px;
  opacity: 0.7;
  position: relative;
  z-index: 1;
}

.workshop-btn {
  background: rgba(201, 160, 80, 0.2);
  border: 1px solid rgba(201, 160, 80, 0.4);
  padding: 8px 16px;
  border-radius: 20px;
  color: #C9A050;
  font-size: 12px;
  white-space: nowrap;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

/* Note Detail Popup */
.note-detail { padding: 20px; }
.note-detail-header { margin-bottom: 16px; }
.note-detail-title { font-size: 18px; font-weight: 600; color: var(--t1); display: block; margin-bottom: 4px; }
.note-detail-date { font-size: 12px; color: var(--t3); }
.note-detail-image {
  height: 180px; border-radius: 12px; overflow: hidden; margin-bottom: 16px;
  display: flex; align-items: center; justify-content: center; position: relative;
}
.note-detail-image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.note-detail-text { font-size: 14px; color: var(--t2); line-height: 1.8; margin-bottom: 16px; }
.note-detail-footer { padding-top: 12px; border-top: 1px solid var(--mg); }
.note-detail-author { font-size: 12px; color: var(--hg); }
</style>
