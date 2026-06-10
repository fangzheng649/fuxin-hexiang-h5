<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { emotions } from '../data/emotions.js'
import { products } from '../data/products.js'

// ==================== 状态 ====================
const messages = ref([])
const step = ref(0)
const inputText = ref('')
const typing = ref(false)
const containerRef = ref(null)
let initialized = false
const timers = []

const scrollToBottom = () => {
  setTimeout(() => {
    if (containerRef.value) {
      containerRef.value.scrollTop = containerRef.value.scrollHeight
    }
  }, 60)
}

const addMsg = (msg) => {
  messages.value.push(msg)
  scrollToBottom()
}

const delay = (ms) => new Promise((r) => {
  const t = setTimeout(r, ms)
  timers.push(t)
})

// ==================== 离线对话流程 ====================
const offlineFlow = {
  // step 0→1: 欢迎语
  async welcome() {
    await delay(500)
    addMsg({ type: 'ai', text: '你好，我是你的AI配香助手 🪷\n\n在开始之前，先深呼吸三次……\n\n呼——吸——呼——\n感受到了吗？那一丝丝的宁静。\n\n那我们开始吧。' })
    await delay(1500)
    typing.value = true
    scrollToBottom()
    await delay(1500)
    typing.value = false
    addMsg({ type: 'ai', text: '你最近的心情怎么样？可以选下面的选项，也可以自己说 👇' })
    addMsg({ type: 'emotions', selectedIdx: -1 })
    step.value = 2
  },

  // step 2→3: 情绪选择后追问
  async afterEmotion() {
    await delay(800)
    typing.value = true
    scrollToBottom()
    await delay(1500)
    typing.value = false
    addMsg({ type: 'ai', text: '我理解你的感受。能再具体说说吗？\n\n比如——睡不着的时候，脑子里会不会想很多事情？还是身体有什么不舒服的地方？' })
    step.value = 3
  },

  // step 3→4: 用户回答后 → 五行分析
  async afterDetail() {
    await delay(800)
    typing.value = true
    scrollToBottom()
    await delay(1800)
    typing.value = false
    addMsg({ type: 'ai', text: '从你描述的情况看，这可能与肝气不舒有关。中医讲「肝主疏泄」，肝气郁结则情绪不畅、夜卧不安。\n\n让我帮你看看五行体质倾向——' })
    await delay(1200)
    typing.value = true
    scrollToBottom()
    await delay(1500)
    typing.value = false
    addMsg({
      type: 'fiveElements',
      elements: [
        { label: '木', organ: '肝', pct: 85, color: '#4A7C59' },
        { label: '火', organ: '心', pct: 65, color: '#C75450' },
        { label: '土', organ: '脾', pct: 50, color: '#C9A050' },
        { label: '金', organ: '肺', pct: 55, color: '#B5AA90' },
        { label: '水', organ: '肾', pct: 35, color: '#4A6B8A' },
      ],
      desc: '木旺（肝气偏盛）· 水弱（肾气不足）',
    })
    step.value = 5
    await delay(1200)
    typing.value = true
    scrollToBottom()
    await delay(1800)
    typing.value = false
    addMsg({ type: 'ai', text: '你的五行分析显示：木偏旺、水偏弱。\n\n木旺则肝气有余，易急躁失眠；水弱则肾气不足，难以藏精安神。\n\n我为你推荐一个香方 👇' })
    await delay(800)
    const recommendedName = '竹影清风'
    const recipe = products.find(p => p.name === recommendedName)
    addMsg({
      type: 'recipe',
      name: '竹影清风',
      effect: '清心降火 · 安神定志 · 交通心肾',
      color: 'linear-gradient(135deg,#8BAA86,#3A6345)',
      image: recipe?.image?.chat,
      herbs: [
        { n: '檀香', r: '君', c: '#4E2E1E' },
        { n: '柏木', r: '臣', c: '#4A7C59' },
        { n: '白芍', r: '佐', c: '#4A6B8A' },
        { n: '远志', r: '使', c: '#C9A050' },
      ],
      desc: '君药檀香温中理气，臣药柏木宁心安神，佐以白芍柔肝缓急，使药远志交通心肾。四药合伍，疏肝解郁、清心安神。',
    })
    step.value = 6
  },

  // step ≥5: 推荐后续
  async afterRecipe() {
    await delay(500)
    typing.value = true
    scrollToBottom()
    await delay(1500)
    typing.value = false
    addMsg({ type: 'ai', text: '感谢你的分享。香方会在3-5天内送到，使用一周后，记得回来告诉我你的感受 🪷\n\n我们可以根据你的变化来调整方案。' })
  },

  // step < 3: 未选情绪时的提示
  async pleaseSelectEmotion() {
    await delay(500)
    typing.value = true
    scrollToBottom()
    await delay(1200)
    typing.value = false
    addMsg({ type: 'ai', text: '谢谢你的分享，请先选择一个最符合你当前状态的选项，这样我可以更精准地为你推荐香方。' })
  },

  // step 3 未详细回答
  async pleaseDetail() {
    await delay(500)
    typing.value = true
    scrollToBottom()
    await delay(1200)
    typing.value = false
    addMsg({ type: 'ai', text: '我理解。请再多说一些，这样我能更好地为你分析体质。' })
  },
}

// ==================== 事件处理 ====================
const handleEmotionSelect = (emotion, idx) => {
  // 标记选中状态
  messages.value = messages.value.map((m) =>
    m.type === 'emotions' ? { ...m, selectedIdx: idx } : m
  )
  addMsg({ type: 'user', text: emotion.text })
  step.value = 3
  offlineFlow.afterEmotion()
}

const handleSend = async () => {
  const text = inputText.value.trim()
  if (!text) return
  addMsg({ type: 'user', text })
  inputText.value = ''

  if (step.value === 3) {
    step.value = 4
    offlineFlow.afterDetail()
  } else if (step.value >= 5) {
    offlineFlow.afterRecipe()
  } else if (step.value < 3) {
    offlineFlow.pleaseSelectEmotion()
  } else {
    offlineFlow.pleaseDetail()
  }
}

const handleReset = () => {
  // 清理定时器
  timers.forEach((t) => clearTimeout(t))
  timers.length = 0
  messages.value = []
  step.value = 0
  inputText.value = ''
  typing.value = false
  initialized = false
}

// 初始化
onMounted(() => {
  if (!initialized) {
    initialized = true
    offlineFlow.welcome()
  }
})
</script>

<template>
  <div class="chat-wrap">
    <!-- Header -->
    <div class="chat-header">
      <h3 class="brand">🪷 AI 配香助手</h3>
      <p>以千年合香之方，调理今日之情志</p>
      <button class="chat-reset" @click="handleReset" title="重新开始">
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="var(--t3)" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M1 4v6h6" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
        </svg>
      </button>
    </div>

    <!-- Messages -->
    <div class="chat-messages hide-scrollbar" ref="containerRef">
      <template v-for="(msg, i) in messages" :key="i">
        <!-- AI 消息 -->
        <div v-if="msg.type === 'ai'" class="chat-msg ai fade-in">
          <div class="chat-avatar-row">
            <div class="chat-avatar">
              <svg viewBox="0 0 24 24" width="12" height="12" stroke="white" fill="none" stroke-width="2">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <circle cx="9" cy="9" r="1" fill="currentColor" />
                <circle cx="15" cy="9" r="1" fill="currentColor" />
              </svg>
            </div>
            <span>AI配香助手</span>
          </div>
          <div class="chat-bubble ai-bubble">
            <template v-for="(line, j) in msg.text.split('\n')" :key="j">
              <br v-if="j > 0" />{{ line }}
            </template>
          </div>
        </div>

        <!-- 用户消息 -->
        <div v-else-if="msg.type === 'user'" class="chat-msg user fade-in">
          <div class="chat-avatar-row user-row">我</div>
          <div class="chat-bubble user-bubble">{{ msg.text }}</div>
        </div>

        <!-- 情绪选择 -->
        <div v-else-if="msg.type === 'emotions'" class="chat-msg ai fade-in" style="max-width: 85%">
          <div class="emotion-pills">
            <button
              v-for="(e, ei) in emotions"
              :key="ei"
              class="emotion-pill"
              :class="{ selected: msg.selectedIdx === ei }"
              :disabled="msg.selectedIdx >= 0"
              :style="msg.selectedIdx >= 0 && msg.selectedIdx !== ei ? { opacity: 0.4 } : {}"
              @click="handleEmotionSelect(e, ei)"
            >
              {{ e.emoji }} {{ e.label }}
            </button>
          </div>
        </div>

        <!-- 五行分析 -->
        <div v-else-if="msg.type === 'fiveElements'" class="chat-msg ai fade-in" style="max-width: 90%">
          <div class="five-elements-card">
            <div class="five-elements-title brand">五行体质分析</div>
            <div class="five-elements-row">
              <div v-for="el in msg.elements" :key="el.label" class="fe-item">
                <div class="fe-circle" :style="{ background: el.color }">{{ el.label }}</div>
                <div class="fe-label">{{ el.organ }}</div>
                <div class="fe-bar">
                  <div class="fe-bar-fill" :style="{ width: el.pct + '%', background: el.color }" />
                </div>
              </div>
            </div>
            <div class="fe-result">{{ msg.desc }}</div>
          </div>
        </div>

        <!-- 香方推荐 -->
        <div v-else-if="msg.type === 'recipe'" class="chat-msg ai fade-in" style="max-width: 90%">
          <div class="recipe-result">
            <div class="recipe-result-image" :style="{ background: msg.color }">
              <img
                v-if="msg.image"
                :src="msg.image"
                :alt="msg.name"
                loading="lazy"
                class="recipe-bg-img"
                @error="$event.target.style.display = 'none'"
              />
              <span class="brand">{{ msg.name }}</span>
            </div>
            <div class="recipe-result-body">
              <div class="recipe-result-name brand">{{ msg.name }}</div>
              <div class="recipe-result-effect">{{ msg.effect }}</div>
              <div class="herb-tags">
                <span
                  v-for="herb in msg.herbs"
                  :key="herb.n"
                  class="herb-tag"
                  :style="{ color: herb.c, borderColor: herb.c + '40', background: herb.c + '10' }"
                >
                  {{ herb.r }}·{{ herb.n }}
                </span>
              </div>
              <div class="recipe-desc">{{ msg.desc }}</div>
            </div>
          </div>
        </div>
      </template>

      <!-- Typing Indicator -->
      <div v-if="typing" class="chat-msg ai">
        <div class="chat-avatar-row">
          <div class="chat-avatar">
            <svg viewBox="0 0 24 24" width="12" height="12" stroke="white" fill="none" stroke-width="2">
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
              <circle cx="9" cy="9" r="1" fill="currentColor" />
              <circle cx="15" cy="9" r="1" fill="currentColor" />
            </svg>
          </div>
          <span>AI配香助手</span>
        </div>
        <div class="typing-indicator">
          <span class="typing-dot" />
          <span class="typing-dot" />
          <span class="typing-dot" />
        </div>
      </div>
    </div>

    <!-- Input -->
    <div class="chat-input-area">
      <input
        v-model="inputText"
        class="chat-input"
        placeholder="说说你的感受..."
        @keyup.enter="handleSend"
      />
      <button class="chat-send" @click="handleSend">
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="white" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 2L11 13" /><path d="M22 2L15 22l-4-9-9-4z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.chat-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--rp);
}

/* Header */
.chat-header {
  padding: 14px 20px;
  background: var(--rp);
  text-align: center;
  border-bottom: 0.5px solid var(--mg);
  position: relative;
  flex-shrink: 0;
}
.chat-header h3 {
  font-size: 16px;
  color: var(--t1);
  margin-bottom: 2px;
}
.chat-header p {
  font-size: 11px;
  color: var(--t3);
}
.chat-reset {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.chat-reset:active { opacity: 0.6; }

/* Messages */
.chat-messages {
  flex: 1;
  padding: 16px 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Message */
.chat-msg {
  max-width: 80%;
  animation: fadeIn 0.4s ease;
}
.chat-msg.ai { align-self: flex-start; }
.chat-msg.user { align-self: flex-end; }

/* Avatar Row */
.chat-avatar-row {
  font-size: 11px;
  color: var(--t3);
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.chat-avatar-row.user-row { justify-content: flex-end; }
.chat-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--hl), var(--hg));
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Bubble */
.chat-bubble {
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 13px;
  line-height: 1.6;
}
.ai-bubble {
  background: var(--pc);
  color: var(--t1);
  border-bottom-left-radius: 4px;
  box-shadow: var(--sc);
  border: 1px solid rgba(180, 149, 85, 0.2);
}
.user-bubble {
  background: var(--tp);
  color: #F7EED9;
  border-bottom-right-radius: 4px;
}

/* Emotion Pills */
.emotion-pills {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 4px;
}
.emotion-pill {
  background: var(--rp);
  border: 1.5px solid var(--mg);
  border-radius: 20px;
  padding: 6px 14px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}
.emotion-pill:hover { border-color: var(--tp); background: rgba(78, 46, 30, 0.05); }
.emotion-pill.selected {
  border-color: var(--tp);
  background: rgba(78, 46, 30, 0.1);
  color: var(--tp);
}
.emotion-pill:disabled { cursor: default; }

/* Typing Indicator */
.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 12px 16px;
  background: var(--pc);
  border-radius: 18px;
  border-bottom-left-radius: 4px;
  box-shadow: var(--sc);
  width: fit-content;
  border: 1px solid rgba(180, 149, 85, 0.2);
}
.typing-dot {
  width: 6px;
  height: 6px;
  background: var(--t3);
  border-radius: 50%;
  animation: typeBounce 1.4s ease-in-out infinite;
}
.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }

/* Five Elements Card */
.five-elements-card {
  padding: 16px;
  background: var(--pc);
  border-radius: 16px;
  box-shadow: var(--sc);
  border: 1px solid rgba(180, 149, 85, 0.2);
}
.five-elements-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--t1);
  margin-bottom: 12px;
  text-align: center;
}
.five-elements-row {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}
.fe-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.fe-circle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Noto Serif SC', serif;
  font-size: 14px;
  font-weight: 600;
  color: white;
}
.fe-label { font-size: 10px; color: var(--t2); }
.fe-bar {
  width: 44px;
  height: 4px;
  background: var(--mg);
  border-radius: 2px;
  overflow: hidden;
}
.fe-bar-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 1s ease;
}
.fe-result {
  text-align: center;
  font-size: 12px;
  color: var(--t2);
  margin-top: 4px;
}

/* Recipe Result */
.recipe-result {
  background: var(--pc);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--sc);
  border: 1px solid rgba(180, 149, 85, 0.2);
}
.recipe-result-image {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
.recipe-bg-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.6;
}
.recipe-result-image span {
  font-size: 32px;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
}
.recipe-result-body { padding: 16px; }
.recipe-result-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--t1);
  margin-bottom: 4px;
}
.recipe-result-effect {
  font-size: 12px;
  color: var(--hg);
  margin-bottom: 10px;
}
.herb-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}
.herb-tag {
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 10px;
  border: 1px solid;
}
.recipe-desc {
  font-size: 12px;
  color: var(--t2);
  line-height: 1.6;
}

/* Input Area */
.chat-input-area {
  padding: 10px 20px 8px;
  background: var(--rp);
  border-top: 0.5px solid var(--mg);
  display: flex;
  gap: 10px;
  align-items: center;
  flex-shrink: 0;
}
.chat-input {
  flex: 1;
  background: var(--pc);
  border: 1px solid var(--mg);
  border-radius: 22px;
  padding: 10px 16px;
  font-size: 13px;
  outline: none;
  color: var(--t1);
  font-family: inherit;
}
.chat-input::placeholder { color: var(--t3); }
.chat-input:focus { border-color: var(--tl); }
.chat-send {
  width: 38px;
  height: 38px;
  background: var(--tp);
  border-radius: 50%;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}
.chat-send:active { background: var(--td); }
</style>
