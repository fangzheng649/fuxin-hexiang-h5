<script setup>
defineProps({
  icon: { type: String, default: '' },
  text: { type: String, default: '暂无内容' },
  action: { type: String, default: '' },
})
defineEmits(['action'])
</script>

<template>
  <div class="empty-state">
    <div v-if="icon" class="empty-icon">{{ icon }}</div>
    <p class="empty-text">{{ text }}</p>
    <button v-if="action" class="empty-action" @click="$emit('action')">{{ action }}</button>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 12px;
}
.empty-icon {
  font-size: 48px;
  margin-bottom: 8px;
}
.empty-text {
  font-size: 14px;
  color: var(--t3);
  text-align: center;
}
.empty-action {
  margin-top: 8px;
  padding: 8px 24px;
  border-radius: 20px;
  border: 1px solid var(--tp);
  background: none;
  color: var(--tp);
  font-size: 13px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}
.empty-action:active {
  background: var(--tp);
  color: #F7EED9;
}
</style>
