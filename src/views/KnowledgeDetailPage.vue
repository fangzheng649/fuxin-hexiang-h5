<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { knowledgeList } from '../data/knowledge.js'

const route = useRoute()
const router = useRouter()
const itemId = parseInt(route.params.id)
const item = computed(() => knowledgeList.find(k => k.id === itemId) || knowledgeList[0])

const knowledgeIcons = {
  fire: 'M12 12c0-3-2.5-6-2.5-6s-2.5 3-2.5 6a2.5 2.5 0 0 0 5 0zM14.5 12c0-2 1.5-4 1.5-4s1.5 2 1.5 4a1.5 1.5 0 0 1-3 0z',
  book: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z',
  leaf: 'M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 17 3.5s1 2 1 5a7 7 0 0 1-7 7z',
}

const knowledgeDetail = {
  1: {
    fullText: '冷凝合香，又称"冷香"，是福州独有的非物质文化遗产制香技艺。与传统的燃烧型香料不同，冷凝合香无需点燃，而是利用天然药材研磨调香后，借助人体体温缓慢散逸药力。\n\n这种技艺源自宋代，至今已有近千年历史。其核心理念是"以香入药"——将中药君臣佐使的配伍原则融入香方设计，使佩戴者在日常生活中自然受到药香调理。\n\n制作过程包括：选材、净制、切制、炮制（九蒸九晒）、研磨、合香、成型、阴干等十余道工序，每一步都需严格把控。成品多为香牌、香珠等形态，可随身佩戴。',
  },
  2: {
    fullText: '君臣佐使，源自《黄帝内经》的中药配伍理论，是冷凝合香最核心的组方原则。\n\n君药：方中主药，针对主要症状起决定性治疗作用。如檀香温中理气，为安神方之君。\n\n臣药：辅助君药，加强治疗效力。如柏木宁心安神，助檀香之力。\n\n佐药：制约君臣的偏性，或兼顾次要症状。如白芍柔肝缓急，佐制檀香之温燥。\n\n使药：引药归经，调和诸药。如远志交通心肾，引诸药直达病所。\n\n四药合伍，君臣有序，佐使得当，共奏调理身心之效。每一方冷凝合香都遵循这一古老而科学的配伍原则。',
  },
  3: {
    fullText: '中医认为，人与天地相应，四季变化直接影响五脏功能。顺应四时调养，是中医养生的核心智慧。\n\n春养肝（木）：春季万物生发，肝气旺盛。宜用疏肝理气之香方，如"春风拂柳"、"翠竹幽兰"。\n\n夏养心（火）：夏季炎热，心火易亢。宜用清心降火之香方，如"竹影清风"、"鹅梨帐香"。\n\n长夏养脾（土）：湿气偏重，脾胃易伤。宜用健脾化湿之香方，如"稻香归田"、"荷风送爽"。\n\n秋养肺（金）：秋燥伤肺，宜润燥益气。推荐"松风听涛"、"闻思静心"。\n\n冬养肾（水）：寒冬藏精，宜补肾固本。推荐"听泉水生"、"碧潭秋月"。\n\n顺时而用香，方能事半功倍，身心和合。',
  },
}
</script>

<template>
  <div class="page knowledge-detail-page">
    <div class="detail-header">
      <button class="back-btn" @click="router.back()">‹ 返回</button>
      <h3 class="brand">香识百科</h3>
      <span />
    </div>

    <!-- Hero -->
    <div class="detail-hero" :style="{ background: item.color + '18' }">
      <div class="detail-icon" :style="{ background: item.color }">
        <svg viewBox="0 0 24 24" width="32" height="32" :stroke="item.color" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path :d="knowledgeIcons[item.icon]" />
        </svg>
      </div>
      <h2 class="brand">{{ item.title }}</h2>
    </div>

    <!-- Content -->
    <div class="detail-content">
      <template v-for="(p, i) in (knowledgeDetail[item.id]?.fullText || item.text).split('\n\n')" :key="i">
        <p class="detail-paragraph">{{ p }}</p>
      </template>
    </div>

    <!-- Actions -->
    <div class="detail-actions">
      <button class="action-btn" @click="navigator.clipboard?.writeText(window.location.href); showToast('链接已复制')">
        📤 分享
      </button>
    </div>
  </div>
</template>

<style scoped>
.page { min-height: 100vh; background: var(--rp); }
.detail-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px; background: var(--pc); border-bottom: 1px solid var(--mg);
}
.detail-header h3 { font-size: 16px; color: var(--t1); }
.back-btn { background: none; border: none; font-size: 18px; color: var(--tp); cursor: pointer; }

.detail-hero {
  padding: 32px 20px; display: flex; flex-direction: column; align-items: center; gap: 12px;
}
.detail-icon {
  width: 72px; height: 72px; border-radius: 20px;
  display: flex; align-items: center; justify-content: center;
}
.detail-hero h2 { font-size: 20px; color: var(--t1); }

.detail-content { padding: 0 20px 20px; }
.detail-paragraph { font-size: 14px; color: var(--t2); line-height: 1.9; margin-bottom: 16px; text-indent: 2em; }

.detail-actions { padding: 0 20px 30px; display: flex; justify-content: center; }
.action-btn {
  padding: 10px 28px; background: var(--pc); border: 1px solid var(--mg);
  border-radius: 20px; font-size: 13px; color: var(--tp); cursor: pointer; font-family: inherit;
}
</style>
