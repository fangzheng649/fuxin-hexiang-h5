<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'
import TabBar from './components/TabBar.vue'

const router = useRouter()
const route = useRoute()

// 主 Tab 页面名称
const mainTabNames = new Set(['Home', 'Chat', 'Shop', 'Heritage', 'Profile'])
// 是否显示底部 TabBar（主 Tab 页面才显示）
const showTabBar = computed(() => mainTabNames.has(route.name))

const currentTab = computed(() => {
  const map = { Home: 0, Chat: 1, Shop: 2, Heritage: 3, Profile: 4 }
  return map[route.name] ?? 0
})

// Tab 切换使用 replace，不堆积历史记录
const handleTabChange = (index) => {
  const routes = ['/home', '/chat', '/shop', '/heritage', '/profile']
  const target = routes[index]
  if (route.path !== target) {
    router.replace(target)
  }
}

// 在主Tab页面双击返回键退出应用
let lastBackTime = 0
const handleBackButton = () => {
  // 子页面：正常返回上一页
  if (!mainTabNames.has(route.name)) {
    router.back()
    return
  }
  // 主Tab首页：双击退出
  const now = Date.now()
  if (now - lastBackTime < 2000) {
    // 尝试关闭窗口（微信浏览器中可能不生效，但H5中标准行为）
    window.history.back()
  } else {
    lastBackTime = now
    showToast('再按一次退出')
  }
}

// 监听物理返回键（popstate 事件）
let popstateHandler = null
onMounted(() => {
  // 在首页插入一个历史记录锚点，确保返回时能被捕获
  if (mainTabNames.has(route.name)) {
    window.history.pushState({ tab: route.name }, '')
  }

  popstateHandler = () => {
    // popstate 触发后，如果当前仍在主Tab，说明用户在首页按了返回
    if (mainTabNames.has(route.name)) {
      handleBackButton()
      // 重新推入锚点防止直接退出
      window.history.pushState({ tab: route.name }, '')
    }
  }
  window.addEventListener('popstate', popstateHandler)
})

onUnmounted(() => {
  if (popstateHandler) {
    window.removeEventListener('popstate', popstateHandler)
  }
})
</script>

<template>
  <div class="app-container">
    <div class="app-content">
      <router-view />
    </div>
    <TabBar v-if="showTabBar" :active="currentTab" @change="handleTabChange" />
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
