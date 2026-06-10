<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import SubPageHeader from '../components/SubPageHeader.vue'
import { useChatHistory } from '../composables/useChatHistory.js'
import { products } from '../data/products.js'
import { achievements } from '../data/achievements.js'

const router = useRouter()
const chatMgr = useChatHistory()
const activeTab = ref('archive')

// 从聊天历史中提取使用过的香方
const archivedRecipes = computed(() => {
  // 从 localStorage 加载所有对话
  const all = JSON.parse(localStorage.getItem('fuxin_chat_history') || '[]')
  const recipeNames = new Set()
  all.forEach(conv => {
    (conv.messages || []).forEach(msg => {
      if (msg.type === 'recipe' && msg.name) {
        recipeNames.add(msg.name)
      }
    })
  })
  return recipeNames.size > 0
    ? [...recipeNames].map(name => products.find(p => p.name === name)).filter(Boolean)
    : products.slice(0, 3) // fallback: 展示前3个
})

// 扩展成就数据
const allAchievements = computed(() => [
  { id: 1, name: '初次识香', desc: '首次进入抚心合香', progress: '1/1', color: 'var(--w)', done: true, icon: '🌱' },
  { id: 2, name: 'AI配香', desc: '完成AI配香对话5次', progress: '3/5', color: 'var(--f)', done: false, icon: '🤖' },
  { id: 3, name: '五行收集', desc: '收集齐五行属性香方', progress: '2/5', color: 'var(--e)', done: false, icon: '☸' },
  { id: 4, name: '连续打卡', desc: '连续30天记录心情', progress: '7/30', color: 'var(--wt)', done: false, icon: '🔥' },
  { id: 5, name: '香道入门', desc: '阅读完所有知识百科', progress: '0/3', color: 'var(--m)', done: false, icon: '📖' },
  { id: 6, name: '传人弟子', desc: '完成工坊体验预约', progress: '0/1', color: 'var(--tp)', done: false, icon: '🏛' },
])
</script>

<template>
  <div class="page archive-page">
    <SubPageHeader title="我的档案" />

    <!-- Tab 切换 -->
    <div class="tab-bar">
      <button class="tab-btn" :class="{ active: activeTab === 'archive' }" @click="activeTab = 'archive'">香方档案</button>
      <button class="tab-btn" :class="{ active: activeTab === 'achieve' }" @click="activeTab = 'achieve'">成就收集</button>
    </div>

    <!-- 香方档案 -->
    <div v-if="activeTab === 'archive'" class="tab-content">
      <div class="archive-list">
        <div v-for="p in archivedRecipes" :key="p.id" class="archive-card"
          @click="router.push(`/shop/product/${p.id}`)">
          <div class="archive-card-image" :style="{ background: p.color }">
            <img v-if="p.image?.card" :src="p.image.card" :alt="p.name"
              @error="$event.target.style.display='none'" loading="lazy" />
          </div>
          <div class="archive-card-body">
            <div class="archive-name brand">{{ p.name }}</div>
            <div class="archive-element">{{ p.element }}</div>
            <div class="archive-effect">{{ p.effect }}</div>
          </div>
          <div class="archive-arrow">›</div>
        </div>
      </div>
    </div>

    <!-- 成就收集 -->
    <div v-else class="tab-content">
      <div class="achieve-grid">
        <div v-for="a in allAchievements" :key="a.id" class="achieve-card" :class="{ done: a.done }">
          <div class="achieve-icon" :style="{ borderColor: a.color }">{{ a.icon }}</div>
          <div class="achieve-name">{{ a.name }}</div>
          <div class="achieve-desc">{{ a.desc }}</div>
          <div class="achieve-bar">
            <div class="achieve-bar-fill" :style="{ background: a.color, width: a.done ? '100%' : '40%' }" />
          </div>
          <div class="achieve-progress">{{ a.progress }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page { min-height: 100vh; background: var(--rp); }

.tab-bar {
  display: flex; padding: 12px 20px; gap: 0;
  border-bottom: 0.5px solid var(--mg); background: var(--rp);
}
.tab-btn {
  flex: 1; padding: 10px 0; border: none; background: none;
  font-size: 14px; color: var(--t3); cursor: pointer; font-family: inherit;
  position: relative; transition: color 0.2s;
}
.tab-btn.active { color: var(--tp); font-weight: 600; }
.tab-btn.active::after {
  content: ''; position: absolute; bottom: 0; left: 30%; right: 30%;
  height: 2px; background: var(--tp); border-radius: 1px;
}

.tab-content { padding: 16px 20px; }

/* 档案卡片 */
.archive-list { display: flex; flex-direction: column; gap: 10px; }
.archive-card {
  display: flex; align-items: center; gap: 12px; background: var(--pc);
  border-radius: 12px; padding: 12px; box-shadow: var(--sc);
  border: 1px solid rgba(180,149,85,0.15); cursor: pointer;
  transition: transform 0.2s;
}
.archive-card:active { transform: scale(0.98); }
.archive-card-image {
  width: 56px; height: 56px; border-radius: 10px; overflow: hidden;
  flex-shrink: 0; display: flex; align-items: center; justify-content: center;
}
.archive-card-image img { width: 100%; height: 100%; object-fit: cover; }
.archive-card-body { flex: 1; }
.archive-name { font-size: 15px; color: var(--t1); margin-bottom: 2px; }
.archive-element { font-size: 10px; color: var(--hg); margin-bottom: 2px; }
.archive-effect { font-size: 12px; color: var(--t2); }
.archive-arrow { font-size: 18px; color: var(--t3); }

/* 成就网格 */
.achieve-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.achieve-card {
  background: var(--pc); border-radius: 12px; padding: 16px;
  text-align: center; box-shadow: var(--sc); border: 1px solid rgba(180,149,85,0.15);
}
.achieve-card.done { border-color: rgba(74, 124, 89, 0.3); }
.achieve-icon {
  width: 48px; height: 48px; border-radius: 50%; border: 2px solid;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; margin: 0 auto 8px;
}
.achieve-name { font-size: 13px; font-weight: 600; color: var(--t1); margin-bottom: 2px; }
.achieve-desc { font-size: 10px; color: var(--t3); margin-bottom: 8px; line-height: 1.4; }
.achieve-bar { height: 4px; background: var(--mg); border-radius: 2px; overflow: hidden; margin-bottom: 4px; }
.achieve-bar-fill { height: 100%; border-radius: 2px; transition: width 0.5s; }
.achieve-progress { font-size: 10px; color: var(--t3); }
</style>
