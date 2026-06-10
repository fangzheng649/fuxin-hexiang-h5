<script setup>
// 云纹分隔符
</script>

<template>
  <div class="cloud-divider">
    <span class="cloud-left" />
    <span class="cloud-icon">☁</span>
    <span class="cloud-right" />
  </div>
</template>

<style scoped>
.cloud-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px 4px;
  color: var(--tl);
  font-size: 12px;
  opacity: 0.5;
}

.cloud-left,
.cloud-right {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--tl), transparent);
}
</style>
