<script setup>
import { useRouter } from 'vue-router'
import SubPageHeader from '../components/SubPageHeader.vue'
import { knowledgeList } from '../data/knowledge.js'

const router = useRouter()
</script>

<template>
  <div class="page">
    <SubPageHeader title="香识百科" />

    <div class="knowledge-list">
      <router-link
        v-for="item in knowledgeList" :key="item.id"
        :to="`/heritage/knowledge/${item.id}`"
        class="knowledge-card"
      >
        <div class="kc-icon" :style="{ background: item.color + '15', color: item.color }">
          <svg v-if="item.icon === 'fire'" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M12 23c-3.866 0-7-2.686-7-6 0-2.934 2.122-5.587 3.963-7.334a1 1 0 0 1 1.66.694C10.852 12.56 12 15.027 12 15.027s1.148-2.467 1.377-4.667a1 1 0 0 1 1.66-.694C16.878 11.413 19 14.066 19 17c0 3.314-3.134 6-7 6z"/>
          </svg>
          <svg v-else-if="item.icon === 'book'" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" fill="none" stroke="currentColor" stroke-width="2"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75"/>
          </svg>
        </div>
        <div class="kc-body">
          <div class="kc-title brand">{{ item.title }}</div>
          <div class="kc-text">{{ item.text }}</div>
        </div>
        <div class="kc-arrow">›</div>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.page { min-height: 100vh; background: var(--rp); }

.knowledge-list { padding: 16px 20px; display: flex; flex-direction: column; gap: 12px; }
.knowledge-card {
  display: flex; align-items: center; gap: 14px; background: var(--pc);
  border-radius: 12px; padding: 16px; box-shadow: var(--sc);
  border: 1px solid rgba(180,149,85,0.15); cursor: pointer;
  text-decoration: none; color: inherit; transition: transform 0.2s;
}
.knowledge-card:active { transform: scale(0.98); }
.kc-icon {
  width: 48px; height: 48px; border-radius: 12px; display: flex;
  align-items: center; justify-content: center; flex-shrink: 0;
}
.kc-body { flex: 1; }
.kc-title { font-size: 15px; color: var(--t1); margin-bottom: 4px; }
.kc-text { font-size: 12px; color: var(--t2); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.kc-arrow { font-size: 18px; color: var(--t3); }
</style>
