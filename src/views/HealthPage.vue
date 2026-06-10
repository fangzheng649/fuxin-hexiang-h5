<script setup>
import { ref, onMounted, computed } from 'vue'
import SubPageHeader from '../components/SubPageHeader.vue'
import { useProfile } from '../composables/useProfile.js'
import { getCurrentSeason } from '../composables/useSeason.js'

const { profile, getRecentMoods } = useProfile()

const season = getCurrentSeason()
const recentMoods = computed(() => getRecentMoods(7))

// 季节养生知识
const seasonTips = {
  '春': [
    { title: '疏肝理气', desc: '春季肝气旺盛，宜保持心情舒畅，避免愤怒郁结。可佩戴疏肝理气的香方，如春风拂柳。' },
    { title: '早睡早起', desc: '春三月，此谓发陈。应早睡早起，广步于庭，被发缓形，以使志生。' },
    { title: '饮食清淡', desc: '春季饮食宜清淡，多吃绿色蔬菜，少酸多甘，以养脾气。' },
  ],
  '夏': [
    { title: '清心降火', desc: '夏季心火旺盛，宜静心安神。可佩戴清心类香方，如竹影清风。避免暴怒。' },
    { title: '晚睡早起', desc: '夏三月，此谓蕃秀。可适当晚睡早起，中午小憩以养心。' },
    { title: '清热解暑', desc: '饮食宜清凉，多食瓜果。避免贪凉过度，损伤脾胃阳气。' },
  ],
  '长夏': [
    { title: '健脾化湿', desc: '长夏湿气重，宜健脾化湿。可佩戴健脾类香方，如稻香归田。' },
    { title: '饮食有节', desc: '不宜过食生冷，以免损伤脾胃。可食薏米、山药等健脾之品。' },
    { title: '适度运动', desc: '湿重则倦怠，宜适度运动出汗以祛湿，但不可大汗淋漓。' },
  ],
  '秋': [
    { title: '润肺养阴', desc: '秋季肺气当令，宜润燥养肺。可佩戴润肺类香方，如霜菊傲骨。' },
    { title: '早睡早起', desc: '秋三月，此谓容平。应早睡早起，与鸡俱兴，收敛神气。' },
    { title: '防燥护阴', desc: '秋季干燥，宜多食梨、百合等滋阴润肺之品。少辛多酸。' },
  ],
  '冬': [
    { title: '补肾藏精', desc: '冬季肾气主令，宜补肾藏精。可佩戴滋肾类香方，如听泉水生。' },
    { title: '早睡晚起', desc: '冬三月，此谓闭藏。应早睡晚起，必待日光，去寒就温。' },
    { title: '温补为主', desc: '冬季饮食宜温补，可食羊肉、栗子等温性食物。但不可过燥。' },
  ],
}

const tips = computed(() => seasonTips[season.season] || seasonTips['夏'])

// Canvas 心情趋势图
const canvasRef = ref(null)

onMounted(() => {
  drawMoodChart()
})

const drawMoodChart = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const dpr = window.devicePixelRatio || 1
  const w = canvas.offsetWidth
  const h = 140
  canvas.width = w * dpr
  canvas.height = h * dpr
  canvas.style.height = h + 'px'
  ctx.scale(dpr, dpr)

  const moods = recentMoods.value.slice(-7)
  if (moods.length === 0) {
    ctx.fillStyle = '#8B7E6E'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('暂无情绪记录', w / 2, h / 2)
    return
  }

  const padX = 30, padY = 20
  const chartW = w - padX * 2
  const chartH = h - padY * 2

  // 网格
  ctx.strokeStyle = 'rgba(212, 197, 176, 0.3)'
  ctx.lineWidth = 0.5
  for (let i = 1; i <= 5; i++) {
    const y = padY + chartH - (i / 5) * chartH
    ctx.beginPath(); ctx.moveTo(padX, y); ctx.lineTo(padX + chartW, y); ctx.stroke()
  }

  // 折线
  const points = moods.map((m, i) => ({
    x: padX + (moods.length === 1 ? chartW / 2 : (i / (moods.length - 1)) * chartW),
    y: padY + chartH - ((m.score || 3) / 5) * chartH,
    label: m.date,
    score: m.score,
  }))

  // 填充区域
  ctx.beginPath()
  ctx.moveTo(points[0].x, padY + chartH)
  points.forEach(p => ctx.lineTo(p.x, p.y))
  ctx.lineTo(points[points.length - 1].x, padY + chartH)
  ctx.closePath()
  const grad = ctx.createLinearGradient(0, padY, 0, padY + chartH)
  grad.addColorStop(0, 'rgba(74, 124, 89, 0.2)')
  grad.addColorStop(1, 'rgba(74, 124, 89, 0.02)')
  ctx.fillStyle = grad
  ctx.fill()

  // 线
  ctx.beginPath()
  ctx.strokeStyle = '#4A7C59'
  ctx.lineWidth = 2
  points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y))
  ctx.stroke()

  // 点和标签
  points.forEach(p => {
    ctx.beginPath()
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2)
    ctx.fillStyle = '#4A7C59'
    ctx.fill()
    ctx.fillStyle = '#8B7E6E'
    ctx.font = '9px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(p.label, p.x, padY + chartH + 14)
  })
}
</script>

<template>
  <div class="page health-page">
    <SubPageHeader title="健康管理" />

    <!-- 当前体质 -->
    <div class="section">
      <div class="constitution-card" :style="{ borderColor: season.element === '木' ? 'var(--w)' : season.element === '火' ? 'var(--f)' : season.element === '土' ? 'var(--e)' : season.element === '金' ? 'var(--m)' : 'var(--wt)' }">
        <div class="cc-header">
          <span class="cc-badge">{{ season.season }} · {{ season.element }}</span>
          <span class="cc-organ">{{ season.organ }}</span>
        </div>
        <div class="cc-body">
          <div class="cc-title brand">{{ profile.constitution || '木型体质' }}</div>
          <div class="cc-tag">{{ profile.tag || '肝气偏盛' }}</div>
        </div>
        <div class="cc-tip">{{ season.healthTip }}</div>
      </div>
    </div>

    <!-- 心情趋势 -->
    <div class="section">
      <div class="section-label brand">近 7 日心情趋势</div>
      <div class="chart-card">
        <canvas ref="canvasRef" style="width: 100%;" />
      </div>
    </div>

    <!-- 季节养生建议 -->
    <div class="section">
      <div class="section-label brand">{{ season.season }}季养生建议</div>
      <div class="tips-list">
        <div v-for="(tip, i) in tips" :key="i" class="tip-card">
          <div class="tip-num">{{ i + 1 }}</div>
          <div class="tip-content">
            <div class="tip-title">{{ tip.title }}</div>
            <div class="tip-desc">{{ tip.desc }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 每日养生贴士 -->
    <div class="section">
      <div class="section-label brand">养生小贴士</div>
      <div class="daily-tip">
        <div class="daily-tip-icon">🌿</div>
        <div class="daily-tip-text">
          「四季的香，不必点燃，放在身边就好。」—— 陈卫平
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page { min-height: 100vh; background: var(--rp); }
.section { padding: 0 20px; margin-bottom: 20px; }
.section-label { font-size: 15px; color: var(--t1); margin-bottom: 10px; padding-top: 12px; }

.constitution-card {
  background: var(--pc); border-radius: 14px; padding: 16px;
  border-left: 4px solid var(--hg); box-shadow: var(--sc);
}
.cc-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.cc-badge {
  font-size: 11px; padding: 3px 10px; border-radius: 12px;
  background: rgba(74, 124, 89, 0.1); color: var(--hg);
}
.cc-organ { font-size: 13px; color: var(--t2); font-weight: 500; }
.cc-title { font-size: 18px; color: var(--t1); margin-bottom: 2px; }
.cc-tag { font-size: 12px; color: var(--t3); }
.cc-tip { margin-top: 10px; font-size: 12px; color: var(--hg); background: rgba(74, 124, 89, 0.08); padding: 8px 12px; border-radius: 8px; }

.chart-card {
  background: var(--pc); border-radius: 12px; padding: 12px 8px;
  box-shadow: var(--sc); border: 1px solid rgba(180,149,85,0.15);
}

.tips-list { display: flex; flex-direction: column; gap: 10px; }
.tip-card {
  display: flex; gap: 12px; background: var(--pc); border-radius: 12px;
  padding: 14px; box-shadow: var(--sc); border: 1px solid rgba(180,149,85,0.15);
}
.tip-num {
  width: 28px; height: 28px; border-radius: 50%; background: var(--tp);
  color: #F7EED9; display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 600; flex-shrink: 0;
}
.tip-content { flex: 1; }
.tip-title { font-size: 14px; font-weight: 500; color: var(--t1); margin-bottom: 4px; }
.tip-desc { font-size: 12px; color: var(--t2); line-height: 1.6; }

.daily-tip {
  background: var(--pc); border-radius: 12px; padding: 20px;
  text-align: center; box-shadow: var(--sc); border: 1px solid rgba(180,149,85,0.15);
}
.daily-tip-icon { font-size: 32px; margin-bottom: 8px; }
.daily-tip-text { font-size: 13px; color: var(--t2); line-height: 1.7; font-style: italic; }
</style>
