<script setup>
import { useRouter } from 'vue-router'

defineProps({
  title: { type: String, default: '' },
})

const router = useRouter()
</script>

<template>
  <div class="sub-header">
    <button class="back-btn" @click="router.back()">
      <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
    <span v-if="title" class="sub-title brand">{{ title }}</span>
    <slot />
  </div>
</template>

<style scoped>
.sub-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: var(--rp);
  border-bottom: 0.5px solid var(--mg);
  position: sticky;
  top: 0;
  z-index: 10;
  gap: 8px;
}
.back-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  color: var(--t1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s;
  flex-shrink: 0;
}
.back-btn:active {
  background: rgba(78, 46, 30, 0.08);
}
.sub-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--t1);
}
</style>
