<script setup>
import { useRouter } from 'vue-router'
import SubPageHeader from '../components/SubPageHeader.vue'
import { videos } from '../data/videos.js'

const router = useRouter()
</script>

<template>
  <div class="page">
    <SubPageHeader title="制香学堂" />

    <div class="video-list">
      <router-link
        v-for="v in videos" :key="v.id"
        :to="`/heritage/video/${v.id}`"
        class="video-card"
      >
        <div class="vc-thumb" :style="{ background: v.thumb }">
          <img v-if="v.image" :src="v.image" :alt="v.title"
            @error="$event.target.style.display='none'" loading="lazy" />
          <div class="vc-play">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="white"><polygon points="5,3 19,12 5,21" /></svg>
          </div>
          <span class="vc-duration">{{ v.duration }}</span>
        </div>
        <div class="vc-body">
          <div class="vc-title brand">{{ v.title }}</div>
          <div class="vc-meta">{{ v.views }}次播放</div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.page { min-height: 100vh; background: var(--rp); }

.video-list { padding: 16px 20px; display: flex; flex-direction: column; gap: 12px; }
.video-card {
  display: flex; gap: 14px; background: var(--pc); border-radius: 12px;
  overflow: hidden; box-shadow: var(--sc); border: 1px solid rgba(180,149,85,0.15);
  text-decoration: none; color: inherit; transition: transform 0.2s;
}
.video-card:active { transform: scale(0.98); }
.vc-thumb {
  width: 140px; height: 95px; position: relative; display: flex;
  align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden;
}
.vc-thumb img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.vc-play {
  width: 36px; height: 36px; background: rgba(0,0,0,0.45); border-radius: 50%;
  display: flex; align-items: center; justify-content: center; z-index: 1;
}
.vc-duration {
  position: absolute; bottom: 6px; right: 6px; background: rgba(0,0,0,0.6);
  color: white; padding: 1px 6px; border-radius: 3px; font-size: 9px;
}
.vc-body { padding: 14px 12px; display: flex; flex-direction: column; justify-content: center; }
.vc-title { font-size: 15px; color: var(--t1); margin-bottom: 4px; }
.vc-meta { font-size: 11px; color: var(--t3); }
</style>
