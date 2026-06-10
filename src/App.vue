<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import TabBar from './components/TabBar.vue'

const router = useRouter()
const route = useRoute()

const currentTab = computed(() => {
  const map = { Home: 0, Chat: 1, Shop: 2, Heritage: 3, Profile: 4 }
  return map[route.name] ?? 0
})

const handleTabChange = (index) => {
  const routes = ['/home', '/chat', '/shop', '/heritage', '/profile']
  router.push(routes[index])
}
</script>

<template>
  <div class="app-container">
    <div class="app-content">
      <router-view />
    </div>
    <TabBar :active="currentTab" @change="handleTabChange" />
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  background: var(--rp);
  overflow: hidden;
}

.app-content {
  flex: 1;
  overflow: hidden;
}
</style>
