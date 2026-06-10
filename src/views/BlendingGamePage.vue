<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { products } from '../data/products.js'

const router = useRouter()

// 药材库
const herbLibrary = [
  { id: 'tanxiang', name: '檀香', category: '木' },
  { id: 'bomu', name: '柏木', category: '木' },
  { id: 'baishao', name: '白芍', category: '木' },
  { id: 'yuanzhi', name: '远志', category: '木' },
  { id: 'chaihu', name: '柴胡', category: '木' },
  { id: 'bohe', name: '薄荷', category: '木' },
  { id: 'cangzhu', name: '苍术', category: '土' },
  { id: 'fuling', name: '茯苓', category: '土' },
  { id: 'huangqi', name: '黄芪', category: '土' },
  { id: 'juhua', name: '菊花', category: '金' },
  { id: 'gancao', name: '甘草', category: '土' },
  { id: 'danggui', name: '当归', category: '木' },
]

const roles = ['君', '臣', '佐', '使']
const roleColors = { '君': '#4E2E1E', '臣': '#4A7C59', '佐': '#4A6B8A', '使': '#C9A050' }

// 状态
const slots = ref({ '君': null, '臣': null, '佐': null, '使': null })
const selectedHerb = ref(null)
const showRolePicker = ref(false)
const result = ref(null)
const attempts = ref(0)

const selectHerb = (herb) => {
  // 检查是否已放入某个槽位
  const inSlot = Object.values(slots.value).find(s => s && s.id === herb.id)
  if (inSlot) { showToast('该药材已放入槽位'); return }
  selectedHerb.value = herb
  showRolePicker.value = true
}

const assignRole = (role) => {
  slots.value[role] = selectedHerb.value
  showRolePicker.value = false
  selectedHerb.value = null
}

const removeFromSlot = (role) => {
  slots.value[role] = null
  result.value = null
}

const allFilled = computed(() => Object.values(slots.value).every(s => s !== null))

// 检查配方
const checkRecipe = () => {
  attempts.value++
  const slotHerbNames = Object.values(slots.value).map(s => s.name)

  // 遍历所有产品，检查是否有完全匹配的配方
  for (const product of products) {
    const recipeHerbNames = product.herbs.map(h => h.n)
    const matchCount = slotHerbNames.filter(h => recipeHerbNames.includes(h)).length
    if (matchCount >= 3) {
      result.value = { type: 'success', product, matchCount }
      return
    }
  }
  result.value = { type: 'encourage', message: '这个搭配很有创意！继续尝试不同的组合吧 🪷' }
}

const reset = () => {
  slots.value = { '君': null, '臣': null, '佐': null, '使': null }
  result.value = null
  selectedHerb.value = null
}
</script>

<template>
  <div class="page game-page">
    <!-- Header -->
    <div class="game-page-header">
      <button class="back-btn" @click="router.back()">‹ 返回</button>
      <h3 class="brand">配香游戏</h3>
      <span class="game-attempts">第 {{ attempts + 1 }} 次尝试</span>
    </div>

    <!-- Slots -->
    <div class="slots-section">
      <div class="slots-title brand">君臣佐使 · 配伍之道</div>
      <div class="slots-grid">
        <div v-for="role in roles" :key="role" class="slot-item" @click="slots[role] && removeFromSlot(role)">
          <div class="slot-role" :style="{ color: roleColors[role] }">{{ role }}</div>
          <div class="slot-herb" :class="{ filled: slots[role] }" :style="slots[role] ? { borderColor: roleColors[role] } : {}">
            <template v-if="slots[role]">
              <span class="slot-herb-name">{{ slots[role].name }}</span>
              <span class="slot-remove">✕</span>
            </template>
            <template v-else>
              <span class="slot-placeholder">选药材</span>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Submit -->
    <button v-if="allFilled && !result" class="check-btn brand" @click="checkRecipe">查看配方</button>

    <!-- Result -->
    <div v-if="result" class="result-card" :class="result.type">
      <template v-if="result.type === 'success'">
        <div class="result-title brand">🎉 配方匹配成功！</div>
        <div class="result-product">{{ result.product.name }}</div>
        <div class="result-effect">{{ result.product.effect }}</div>
        <div class="result-match">匹配了 {{ result.matchCount }} 味药材</div>
        <button class="result-btn" @click="router.push(`/shop/product/${result.product.id}`)">查看详情</button>
      </template>
      <template v-else>
        <div class="result-title brand">继续探索</div>
        <div class="result-message">{{ result.message }}</div>
      </template>
      <button class="retry-btn" @click="reset">重新配伍</button>
    </div>

    <!-- Herb Library -->
    <div class="herb-section">
      <div class="herb-section-title brand">药材库</div>
      <div class="herb-grid">
        <div v-for="herb in herbLibrary" :key="herb.id"
          class="herb-item" @click="selectHerb(herb)">
          {{ herb.name }}
        </div>
      </div>
    </div>

    <!-- Role Picker -->
    <van-popup v-model:show="showRolePicker" position="bottom" round :style="{ maxHeight: '40vh' }">
      <div class="role-picker">
        <div class="role-picker-title brand">选择「{{ selectedHerb?.name }}」的角色</div>
        <div class="role-options">
          <div v-for="role in roles" :key="role" class="role-option"
            :style="{ borderColor: roleColors[role], color: roleColors[role] }"
            @click="assignRole(role)">
            <span class="role-option-char">{{ role }}</span>
            <span class="role-option-label">{{ { '君': '主药', '臣': '辅药', '佐': '协药', '使': '引药' }[role] }}</span>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--rp);
  padding-bottom: 30px;
}
.game-page-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px; background: var(--pc); border-bottom: 1px solid var(--mg);
}
.game-page-header h3 { font-size: 16px; color: var(--t1); }
.back-btn { background: none; border: none; font-size: 18px; color: var(--tp); cursor: pointer; font-family: inherit; }
.game-attempts { font-size: 11px; color: var(--t3); }

/* Slots */
.slots-section { padding: 24px 20px; }
.slots-title { font-size: 15px; color: var(--t1); text-align: center; margin-bottom: 16px; }
.slots-grid { display: flex; gap: 12px; justify-content: center; }
.slot-item { text-align: center; flex: 1; cursor: pointer; }
.slot-role { font-size: 14px; font-weight: 600; margin-bottom: 8px; font-family: 'Noto Serif SC', serif; }
.slot-herb {
  height: 70px; border: 2px dashed var(--mg); border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  position: relative; transition: all 0.2s; background: var(--pc);
}
.slot-herb.filled { border-style: solid; background: white; }
.slot-herb-name { font-size: 15px; font-weight: 600; color: var(--t1); }
.slot-remove { position: absolute; top: 4px; right: 6px; font-size: 10px; color: var(--t3); }
.slot-placeholder { font-size: 11px; color: var(--t3); }

/* Submit */
.check-btn {
  display: block; margin: 0 auto 20px; padding: 12px 40px;
  background: var(--tp); color: white; border: none; border-radius: 24px;
  font-size: 15px; cursor: pointer; letter-spacing: 2px;
}
.check-btn:active { background: var(--td); }

/* Result */
.result-card {
  margin: 0 20px 20px; padding: 20px; border-radius: 16px; text-align: center;
  background: var(--pc); box-shadow: var(--sc); border: 1px solid rgba(180, 149, 85, 0.2);
}
.result-title { font-size: 18px; margin-bottom: 8px; }
.result-product { font-size: 16px; font-weight: 600; color: var(--tp); margin-bottom: 4px; }
.result-effect { font-size: 13px; color: var(--hg); margin-bottom: 8px; }
.result-match { font-size: 12px; color: var(--t3); margin-bottom: 16px; }
.result-btn {
  padding: 10px 28px; background: var(--tp); color: white; border: none;
  border-radius: 20px; font-size: 13px; cursor: pointer; margin-right: 8px; font-family: inherit;
}
.retry-btn {
  padding: 10px 28px; background: var(--rp); color: var(--tp); border: 1px solid var(--tp);
  border-radius: 20px; font-size: 13px; cursor: pointer; font-family: inherit;
}
.result-message { font-size: 14px; color: var(--t2); margin-bottom: 16px; line-height: 1.6; }

/* Herb Library */
.herb-section { padding: 0 20px; }
.herb-section-title { font-size: 15px; color: var(--t1); margin-bottom: 12px; text-align: center; }
.herb-grid { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
.herb-item {
  padding: 8px 16px; background: var(--pc); border: 1px solid rgba(180, 149, 85, 0.2);
  border-radius: 20px; font-size: 13px; color: var(--t1); cursor: pointer;
  transition: all 0.2s; font-family: 'Noto Serif SC', serif;
}
.herb-item:active { background: rgba(78, 46, 30, 0.05); border-color: var(--tp); }

/* Role Picker */
.role-picker { padding: 24px 20px; }
.role-picker-title { font-size: 16px; text-align: center; margin-bottom: 16px; }
.role-options { display: flex; gap: 12px; justify-content: center; }
.role-option {
  width: 70px; padding: 14px 0; border: 2px solid; border-radius: 12px;
  text-align: center; cursor: pointer; transition: all 0.2s;
}
.role-option:active { transform: scale(0.95); }
.role-option-char { display: block; font-size: 22px; font-weight: 700; font-family: 'Noto Serif SC', serif; }
.role-option-label { display: block; font-size: 10px; margin-top: 4px; }
</style>
