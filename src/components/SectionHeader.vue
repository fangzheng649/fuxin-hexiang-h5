<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  title: { type: String, required: true },
  more: { type: String, default: '更多 ›' },
  to: { type: [String, Object], default: '' },
})
const emit = defineEmits(['more'])
const router = useRouter()

const handleClick = () => {
  if (props.to) {
    router.push(props.to)
  } else {
    emit('more')
  }
}
</script>

<template>
  <div class="section-header">
    <span class="section-title">{{ title }}</span>
    <span class="section-more" @click="handleClick">{{ more }}</span>
  </div>
</template>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 20px 12px;
}

.section-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 16px;
  font-weight: 600;
  color: var(--t1);
  display: flex;
  align-items: center;
  gap: 6px;
}

.section-title::before {
  content: '';
  width: 3px;
  height: 14px;
  background: var(--tl);
  border-radius: 2px;
}

.section-more {
  font-size: 12px;
  color: var(--t3);
  cursor: pointer;
}
</style>
