<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { achievements } from '../data/achievements.js'
import CloudDivider from '../components/CloudDivider.vue'
import SectionHeader from '../components/SectionHeader.vue'

// 情绪折线图数据
const moodData = [
  { date: '6/1', score: 3 },
  { date: '6/2', score: 4 },
  { date: '6/3', score: 3 },
  { date: '6/4', score: 5 },
  { date: '6/5', score: 4 },
  { date: '6/6', score: 5 },
  { date: '6/7', score: 5 },
]

const chartRef = ref(null)

// 香方档案
const myRecipes = [
  { name: '竹影清风', date: '2026.06.01', status: 'using' },
  { name: '稻香归田', date: '2026.05.15', status: 'done' },
  { name: '听泉水生', date: '2026.05.01', status: 'review' },
]

const statusMap = {
  using: { text: '使用中', cls: 'status-using' },
  done: { text: '已完成', cls: 'status-done' },
  review: { text: '待评价', cls: 'status-review' },
}

// 菜单
const menuGroups = [
  [
    { icon: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z', label: '我的收藏', badge: null },
    { icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', label: '健康管理', badge: null },
  ],
  [
    { icon: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0', label: '消息通知', badge: '3' },
    { icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', label: '邀请好友', badge: null },
    { icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', label: '关于我们', badge: null },
  ],
  [
    { icon: 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z', label: '设置', badge: null },
  ],
]

// 绘制情绪折线图
const drawChart = () => {
  const canvas = chartRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx.scale(dpr, dpr)

  const w = rect.width
  const h = rect.height
  const padding = { top: 10, right: 20, bottom: 25, left: 10 }
  const chartW = w - padding.left - padding.right
  const chartH = h - padding.top - padding.bottom

  // 背景网格
  ctx.strokeStyle = 'rgba(212, 197, 176, 0.3)'
  ctx.lineWidth = 0.5
  for (let i = 1; i <= 5; i += 2) {
    const y = padding.top + chartH * (1 - i / 5)
    ctx.beginPath()
    ctx.moveTo(padding.left, y)
    ctx.lineTo(w - padding.right, y)
    ctx.stroke()
  }

  // 数据点
  const points = moodData.map((d, i) => ({
    x: padding.left + (chartW / (moodData.length - 1)) * i,
    y: padding.top + chartH * (1 - d.score / 5),
    score: d.score,
    date: d.date,
  }))

  // 渐变填充
  const gradient = ctx.createLinearGradient(0, padding.top, 0, h - padding.bottom)
  gradient.addColorStop(0, 'rgba(74, 124, 89, 0.2)')
  gradient.addColorStop(1, 'rgba(74, 124, 89, 0.02)')
  ctx.beginPath()
  ctx.moveTo(points[0].x, h - padding.bottom)
  points.forEach(p => ctx.lineTo(p.x, p.y))
  ctx.lineTo(points[points.length - 1].x, h - padding.bottom)
  ctx.closePath()
  ctx.fillStyle = gradient
  ctx.fill()

  // 折线
  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)
  for (let i = 1; i < points.length; i++) {
    const xc = (points[i - 1].x + points[i].x) / 2
    const yc = (points[i - 1].y + points[i].y) / 2
    ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc)
  }
  ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y)
  ctx.strokeStyle = '#4A7C59'
  ctx.lineWidth = 2
  ctx.stroke()

  // 数据点圆
  points.forEach(p => {
    ctx.beginPath()
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2)
    ctx.fillStyle = '#4A7C59'
    ctx.fill()
    ctx.beginPath()
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2)
    ctx.fillStyle = 'white'
    ctx.fill()
  })

  // 日期标签
  ctx.fillStyle = '#8B7E6E'
  ctx.font = '10px -apple-system, sans-serif'
  ctx.textAlign = 'center'
  points.forEach(p => {
    ctx.fillText(p.date, p.x, h - 5)
  })
}

onMounted(() => {
  nextTick(() => {
    drawChart()
  })
})
</script>

<template>
  <div class="page profile-page">
    <!-- Header -->
    <div class="profile-header">
      <div class="profile-avatar-wrap">
        <div class="profile-avatar">
          <svg viewBox="0 0 24 24" width="28" height="28" stroke="rgba(245,236,218,0.7)" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="7" r="4" />
            <path d="M5.5 21v-2a5.5 5.5 0 0 1 5.5-5.5h2a5.5 5.5 0 0 1 5.5 5.5v2" />
          </svg>
        </div>
        <div>
          <div class="profile-name brand">香友 · 小雅</div>
          <div class="profile-constitution">
            木型体质
            <span class="profile-tag">肝气偏盛</span>
          </div>
          <div class="profile-current">当前使用：竹影清风</div>
        </div>
      </div>
      <span class="profile-edit">编辑</span>
    </div>

    <!-- Mood Chart -->
    <div class="mood-card">
      <div class="mood-title brand">情绪变化趋势</div>
      <div class="mood-chart">
        <canvas ref="chartRef" />
      </div>
      <button class="mood-btn brand">记录今日心情</button>
    </div>

    <!-- My Recipes -->
    <SectionHeader title="香方档案" more="全部 ›" />
    <div class="recipe-list">
      <div v-for="recipe in myRecipes" :key="recipe.name" class="my-recipe">
        <div class="my-recipe-info">
          <div class="recipe-name brand">{{ recipe.name }}</div>
          <div class="recipe-date">{{ recipe.date }}</div>
        </div>
        <span class="recipe-status" :class="statusMap[recipe.status].cls">
          {{ statusMap[recipe.status].text }}
        </span>
      </div>
    </div>

    <CloudDivider />

    <!-- Achievements -->
    <SectionHeader title="成就收集" more="全部 ›" />
    <div class="achievement-scroll hide-scrollbar">
      <div v-for="ach in achievements" :key="ach.id" class="achievement-item">
        <div class="achievement-circle" :style="{ background: ach.color, opacity: ach.done ? 1 : 0.5 }">
          <span class="achievement-check">{{ ach.done ? '✓' : ach.progress.split('/')[0] }}</span>
        </div>
        <div class="achievement-name">{{ ach.name }}</div>
        <div class="achievement-progress">{{ ach.progress }}</div>
      </div>
    </div>

    <CloudDivider />

    <!-- Menu -->
    <div class="menu-section">
      <div v-for="(group, gi) in menuGroups" :key="gi" class="menu-group">
        <div v-for="item in group" :key="item.label" class="menu-item">
          <div class="menu-left">
            <span class="menu-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <path :d="item.icon" />
              </svg>
            </span>
            <span class="menu-label">{{ item.label }}</span>
            <span v-if="item.badge" class="menu-badge">{{ item.badge }}</span>
          </div>
          <span class="menu-arrow">›</span>
        </div>
      </div>
    </div>

    <div style="height: 20px" />
  </div>
</template>

<style scoped>
.page {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  background: var(--rp);
}
.page::-webkit-scrollbar { display: none; }

/* Header */
.profile-header {
  padding: 36px 20px 20px;
  background: linear-gradient(135deg, #1A0E05, var(--td));
  color: #F5ECDA;
  position: relative;
  overflow: hidden;
}
.profile-header::before {
  content: '';
  position: absolute;
  top: -30px;
  right: -30px;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(196, 169, 125, 0.12), transparent);
  border-radius: 50%;
}
.profile-avatar-wrap {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 12px;
}
.profile-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(184, 149, 85, 0.4);
}
.profile-name { font-size: 18px; font-weight: 600; margin-bottom: 4px; }
.profile-constitution {
  font-size: 12px;
  opacity: 0.85;
  display: flex;
  align-items: center;
  gap: 6px;
}
.profile-tag {
  font-size: 10px;
  background: rgba(184, 149, 85, 0.2);
  padding: 2px 8px;
  border-radius: 8px;
  color: var(--tl);
}
.profile-current { font-size: 11px; opacity: 0.7; margin-top: 6px; }
.profile-edit {
  position: absolute;
  top: 36px;
  right: 20px;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 14px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 11px;
  cursor: pointer;
}

/* Mood Card */
.mood-card {
  margin: 16px 20px;
  background: var(--pc);
  border-radius: 12px;
  padding: 16px;
  box-shadow: var(--sc);
  border: 1px solid rgba(180, 149, 85, 0.2);
  position: relative;
}
.mood-card::before {
  content: '';
  position: absolute;
  inset: 3px;
  border: 1px solid rgba(180, 149, 85, 0.1);
  border-radius: 9px;
  pointer-events: none;
}
.mood-title { font-size: 14px; font-weight: 600; color: var(--t1); margin-bottom: 12px; }
.mood-chart { height: 100px; position: relative; }
.mood-chart canvas { width: 100%; height: 100%; }
.mood-btn {
  width: 100%;
  padding: 10px;
  background: var(--rp);
  border: 1px solid var(--mg);
  border-radius: 12px;
  font-size: 12px;
  color: var(--tp);
  cursor: pointer;
  margin-top: 12px;
  font-family: 'Noto Serif SC', serif;
}

/* Recipes */
.recipe-list {
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.my-recipe {
  background: var(--pc);
  border-radius: 12px;
  padding: 14px;
  box-shadow: var(--sc);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgba(180, 149, 85, 0.15);
}
.recipe-name { font-size: 14px; font-weight: 600; color: var(--t1); }
.recipe-date { font-size: 11px; color: var(--t3); margin-top: 2px; }
.recipe-status {
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 12px;
}
.status-using { color: var(--hg); background: rgba(74, 124, 89, 0.08); }
.status-done { color: var(--e); background: rgba(201, 160, 80, 0.08); }
.status-review { color: var(--wt); background: rgba(74, 107, 138, 0.08); }

/* Achievements */
.achievement-scroll {
  display: flex;
  gap: 14px;
  padding: 0 20px;
  overflow-x: auto;
}
.achievement-item {
  min-width: 90px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}
.achievement-circle {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--sc);
}
.achievement-check {
  color: rgba(255, 255, 255, 0.85);
  font-size: 18px;
  font-weight: 600;
}
.achievement-name { font-size: 10px; color: var(--t2); text-align: center; }
.achievement-progress { font-size: 9px; color: var(--t3); }

/* Menu */
.menu-section { padding: 8px 20px; }
.menu-group { margin-bottom: 8px; }
.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: var(--pc);
  border-radius: 12px;
  margin-bottom: 2px;
  cursor: pointer;
  border: 1px solid rgba(180, 149, 85, 0.1);
}
.menu-item:active { background: rgba(78, 46, 30, 0.03); }
.menu-item:first-child { border-radius: 12px 12px 2px 2px; }
.menu-item:last-child { border-radius: 2px 2px 12px 12px; margin-bottom: 0; }
.menu-item:only-child { border-radius: 12px; }
.menu-left { display: flex; align-items: center; gap: 10px; }
.menu-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--tp);
  flex-shrink: 0;
}
.menu-label { font-size: 13px; color: var(--t1); }
.menu-badge {
  font-size: 10px;
  color: var(--f);
  background: rgba(199, 84, 80, 0.08);
  padding: 2px 8px;
  border-radius: 8px;
}
.menu-arrow { font-size: 14px; color: var(--t3); }
</style>
