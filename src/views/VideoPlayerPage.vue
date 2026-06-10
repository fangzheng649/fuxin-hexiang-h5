<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { videos } from '../data/videos.js'

const route = useRoute()
const router = useRouter()
const videoId = parseInt(route.params.id)
const video = computed(() => videos.find(v => v.id === videoId) || videos[0])
const relatedVideos = computed(() => videos.filter(v => v.id !== videoId).slice(0, 3))
</script>

<template>
  <div class="page video-page">
    <div class="video-page-header">
      <button class="back-btn" @click="router.back()">‹ 返回</button>
      <h3 class="brand">制香学堂</h3>
      <span />
    </div>

    <!-- Video Player Area -->
    <div class="player-area" :style="{ background: video.thumb }">
      <img v-if="video.image" :src="video.image" :alt="video.title"
        @error="$event.target.style.display='none'" loading="lazy" />
      <div class="player-overlay">
        <div class="play-icon">▶</div>
        <span class="play-hint">视频功能即将推出</span>
      </div>
      <span class="video-badge">{{ video.duration }}</span>
    </div>

    <!-- Video Info -->
    <div class="video-info-section">
      <h2 class="video-title brand">{{ video.title }}</h2>
      <div class="video-meta">
        <span>{{ video.views }}次播放</span>
        <span>制香学堂</span>
      </div>
      <div class="video-desc">
        本期视频带您深入了解「{{ video.title }}」的完整制作过程。从选材到成品，每一步都凝聚着匠人的心血与智慧。
      </div>
    </div>

    <!-- Related -->
    <div class="related-section">
      <div class="related-title brand">相关视频</div>
      <div class="related-list">
        <div v-for="rv in relatedVideos" :key="rv.id" class="related-item"
          @click="router.push(`/heritage/video/${rv.id}`)">
          <div class="related-thumb" :style="{ background: rv.thumb }">
            <img v-if="rv.image" :src="rv.image" :alt="rv.title"
              @error="$event.target.style.display='none'" loading="lazy" />
            <div class="related-play">▶</div>
            <span class="related-duration">{{ rv.duration }}</span>
          </div>
          <div class="related-info">
            <div class="related-name">{{ rv.title }}</div>
            <div class="related-views">{{ rv.views }}次播放</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page { min-height: 100vh; background: var(--rp); }
.video-page-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px; background: var(--pc); border-bottom: 1px solid var(--mg);
}
.video-page-header h3 { font-size: 16px; color: var(--t1); }
.back-btn { background: none; border: none; font-size: 18px; color: var(--tp); cursor: pointer; }

.player-area {
  height: 220px; position: relative; display: flex; align-items: center;
  justify-content: center; overflow: hidden; background: #1A0E05;
}
.player-area img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.7; }
.player-overlay {
  position: relative; z-index: 1; display: flex; flex-direction: column;
  align-items: center; gap: 8px;
}
.play-icon {
  width: 56px; height: 56px; background: rgba(255,255,255,0.9); border-radius: 50%;
  display: flex; align-items: center; justify-content: center; font-size: 20px; color: var(--tp);
}
.play-hint { font-size: 11px; color: rgba(255,255,255,0.7); }
.video-badge {
  position: absolute; bottom: 10px; right: 10px; background: rgba(0,0,0,0.5);
  color: white; padding: 2px 8px; border-radius: 4px; font-size: 10px;
}

.video-info-section { padding: 20px; }
.video-title { font-size: 18px; font-weight: 600; color: var(--t1); margin-bottom: 8px; }
.video-meta { display: flex; gap: 16px; font-size: 12px; color: var(--t3); margin-bottom: 12px; }
.video-desc { font-size: 13px; color: var(--t2); line-height: 1.7; }

.related-section { padding: 0 20px 20px; }
.related-title { font-size: 15px; color: var(--t1); margin-bottom: 12px; }
.related-list { display: flex; flex-direction: column; gap: 12px; }
.related-item {
  display: flex; gap: 12px; cursor: pointer; background: var(--pc);
  border-radius: 12px; overflow: hidden; border: 1px solid rgba(180, 149, 85, 0.15);
}
.related-item:active { transform: scale(0.98); }
.related-thumb {
  width: 120px; height: 80px; position: relative; display: flex;
  align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden;
}
.related-thumb img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.related-play {
  width: 28px; height: 28px; background: rgba(255,255,255,0.85); border-radius: 50%;
  display: flex; align-items: center; justify-content: center; font-size: 10px; color: var(--tp); z-index: 1;
}
.related-duration {
  position: absolute; bottom: 4px; right: 4px; background: rgba(0,0,0,0.5);
  color: white; padding: 1px 6px; border-radius: 3px; font-size: 9px;
}
.related-info { padding: 10px 12px; display: flex; flex-direction: column; justify-content: center; }
.related-name { font-size: 13px; font-weight: 500; color: var(--t1); margin-bottom: 2px; }
.related-views { font-size: 10px; color: var(--t3); }
</style>
