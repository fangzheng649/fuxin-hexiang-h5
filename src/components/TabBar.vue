<script setup>
import { tabIcons } from '../icons/index.js'

defineProps({
  active: { type: Number, default: 0 },
})

const emit = defineEmits(['change'])

const tabs = [
  { label: '静', key: 'jing' },
  { label: '问', key: 'wen' },
  { label: '方', key: 'fang' },
  { label: '承', key: 'cheng' },
  { label: '安', key: 'an' },
]
</script>

<template>
  <div class="tab-bar safe-bottom">
    <div
      v-for="(tab, i) in tabs"
      :key="tab.key"
      class="tab-item"
      :class="{ active: active === i }"
      @click="emit('change', i)"
    >
      <span class="tab-icon">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <template v-for="(d, di) in tabIcons[tab.key].split('M').filter(Boolean)" :key="di">
            <path :d="'M' + d" />
          </template>
        </svg>
      </span>
      <span class="tab-label">{{ tab.label }}</span>
    </div>
  </div>
</template>

<style scoped>
.tab-bar {
  height: 60px;
  background: rgba(242, 232, 213, 0.96);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: flex-start;
  padding-top: 6px;
  border-top: 1px solid var(--mg);
  flex-shrink: 0;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  cursor: pointer;
  transition: all 0.25s;
  padding: 4px 0;
  -webkit-user-select: none;
  user-select: none;
}

.tab-item .tab-icon {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-item .tab-icon svg {
  width: 22px;
  height: 22px;
  stroke: var(--t3);
  fill: none;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: all 0.25s ease;
}

.tab-item .tab-label {
  font-size: 11px;
  color: var(--t3);
  font-family: 'Noto Serif SC', serif;
  font-weight: 500;
  transition: all 0.25s ease;
}

.tab-item.active .tab-icon svg {
  stroke: var(--hr);
  stroke-width: 1.8;
  transform: scale(1.05);
}

.tab-item.active .tab-label {
  color: var(--hr);
  font-weight: 700;
}
</style>
