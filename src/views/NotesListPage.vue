<script setup>
import { useRouter } from 'vue-router'
import { notes } from '../data/notes.js'
import SectionHeader from '../components/SectionHeader.vue'

const router = useRouter()

const noteDetail = {
  1: '今天收到一位客人的来信，她说自从用了「竹影清风」，每晚都能安然入睡。这让我想起当初研制这个方子时，为了找到最合适的檀香产地，跑遍了印度、澳洲和海南，最终选定了海南的的老山檀。好药材才有好香效，这是祖辈传下来的道理。',
  2: '黄柏的炮制需要经过九蒸九晒，这是冷凝合香制作中最耗时的工序之一。每次蒸制需要2小时，晒制需要一整天。九次循环下来，往往需要大半个月。但只有经过这样的炮制，黄柏的寒性才能被温和地转化，药效才能更好地被人体吸收。',
  3: '试验了一个新的「漆香」工艺，将传统漆器技艺与合香结合。用大漆调香，在香牌表面形成一层温润的薄膜，既能保护香牌，又能让香气更持久。目前还在反复试验阶段，期待最终的效果。',
  4: '远志，始载于《神农本草经》，列为上品。其名取"益智强识，使人志向高远"之意。远志根入药，味苦辛性温，归心、肾、肺经。在合香中常作使药，能交通心肾、安神益智。配入"竹影清风"中，正取其引药入心、通达上下之功。',
}
</script>

<template>
  <div class="page notes-page">
    <div class="notes-header">
      <button class="back-btn" @click="router.back()">‹ 返回</button>
      <h3 class="brand">传承人手记</h3>
      <span class="notes-sub">陈卫平</span>
    </div>

    <div class="notes-list">
      <div v-for="note in notes" :key="note.id" class="note-full-card">
        <div class="note-full-image" :style="{ background: note.bg }">
          <img v-if="note.image" :src="note.image" :alt="note.title"
            @error="$event.target.style.display='none'" loading="lazy" />
        </div>
        <div class="note-full-body">
          <div class="note-full-title brand">{{ note.title }}</div>
          <div class="note-full-date">{{ note.date }}</div>
          <div class="note-full-text">{{ noteDetail[note.id] || note.full }}</div>
        </div>
      </div>
    </div>

    <div style="height: 30px" />
  </div>
</template>

<style scoped>
.page { min-height: 100vh; background: var(--rp); }
.notes-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px; background: var(--pc); border-bottom: 1px solid var(--mg);
}
.notes-header h3 { font-size: 16px; color: var(--t1); }
.back-btn { background: none; border: none; font-size: 18px; color: var(--tp); cursor: pointer; }
.notes-sub { font-size: 12px; color: var(--t3); }

.notes-list { padding: 16px 20px; display: flex; flex-direction: column; gap: 14px; }
.note-full-card {
  background: var(--pc); border-radius: 14px; overflow: hidden;
  box-shadow: var(--sc); border: 1px solid rgba(180, 149, 85, 0.2);
}
.note-full-image {
  height: 140px; position: relative; overflow: hidden;
}
.note-full-image img { width: 100%; height: 100%; object-fit: cover; }
.note-full-body { padding: 16px; }
.note-full-title { font-size: 16px; font-weight: 600; color: var(--t1); margin-bottom: 4px; }
.note-full-date { font-size: 11px; color: var(--t3); margin-bottom: 10px; }
.note-full-text { font-size: 13px; color: var(--t2); line-height: 1.8; }
</style>
