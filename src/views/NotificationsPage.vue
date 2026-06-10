<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const notifications = [
  { id: 1, type: 'order', title: '发货通知', body: '您的「竹影清风」已发货，预计3天内送达。', time: '2小时前', read: false },
  { id: 2, type: 'workshop', title: '工坊提醒', body: '您预约的6月14日工坊体验即将到来，请准时参加。', time: '1天前', read: false },
  { id: 3, type: 'achievement', title: '成就达成', body: '恭喜获得「初次识香」成就！继续探索更多香方吧。', time: '3天前', read: true },
]

const typeIcons = {
  order: '📦',
  workshop: '🏠',
  achievement: '🏆',
}
</script>

<template>
  <div class="page notifications-page">
    <div class="notif-header">
      <button class="back-btn" @click="router.back()">‹ 返回</button>
      <h3 class="brand">消息通知</h3>
      <span class="notif-count">{{ notifications.filter(n => !n.read).length }}条未读</span>
    </div>

    <div class="notif-list">
      <div v-for="notif in notifications" :key="notif.id" class="notif-item" :class="{ unread: !notif.read }">
        <div class="notif-icon">{{ typeIcons[notif.type] }}</div>
        <div class="notif-content">
          <div class="notif-title">{{ notif.title }}</div>
          <div class="notif-body">{{ notif.body }}</div>
          <div class="notif-time">{{ notif.time }}</div>
        </div>
        <div v-if="!notif.read" class="notif-dot" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.page { min-height: 100vh; background: var(--rp); }
.notif-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px; background: var(--pc); border-bottom: 1px solid var(--mg);
}
.notif-header h3 { font-size: 16px; color: var(--t1); }
.back-btn { background: none; border: none; font-size: 18px; color: var(--tp); cursor: pointer; }
.notif-count { font-size: 12px; color: var(--f); }

.notif-list { padding: 12px 20px; display: flex; flex-direction: column; gap: 10px; }
.notif-item {
  display: flex; gap: 12px; padding: 14px; background: var(--pc);
  border-radius: 12px; border: 1px solid rgba(180, 149, 85, 0.15);
  position: relative; align-items: flex-start;
}
.notif-item.unread { border-left: 3px solid var(--tp); }
.notif-icon { font-size: 24px; flex-shrink: 0; }
.notif-content { flex: 1; }
.notif-title { font-size: 14px; font-weight: 600; color: var(--t1); margin-bottom: 4px; }
.notif-body { font-size: 12px; color: var(--t2); line-height: 1.5; margin-bottom: 4px; }
.notif-time { font-size: 10px; color: var(--t3); }
.notif-dot {
  width: 8px; height: 8px; background: var(--f); border-radius: 50%;
  position: absolute; top: 14px; right: 14px; flex-shrink: 0;
}
</style>
