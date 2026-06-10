<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import SubPageHeader from '../components/SubPageHeader.vue'
import { videos } from '../data/videos.js'

const route = useRoute()
const videoId = parseInt(route.params.id)
const video = computed(() => videos.find(v => v.id === videoId) || videos[0])
const relatedVideos = computed(() => videos.filter(v => v.id !== videoId).slice(0, 3))

const isPlaying = ref(false)
const videoRef = ref(null)

const togglePlay = () => {
  isPlaying.value = !isPlaying.value
  // 视频播放逻辑 — 暂用图片封面模拟
}
</script>

<template>
  <div class="page video-page">
    <SubPageHeader title="制香学堂" />

    <!-- Video Player Area -->
    <div class="player-area" :style="{ background: video.thumb }">
      <img v-if="video.image" :src="video.image" :alt="video.title"
        @error="$event.target.style.display='none'" loading="lazy" />
      <div v-if="!isPlaying" class="player-overlay" @click="togglePlay">
        <div class="play-icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="var(--tp)"><polygon points="5,3 19,12 5,21" /></svg>
        </div>
        <span class="play-hint">点击播放</span>
      </div>
      <div v-else class="player-playing" @click="togglePlay">
        <div class="playing-pulse">
          <div class="pulse-ring" />
          <span class="playing-text">播放中...</span>
        </div>
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
      <p class="video-desc">
        本期视频带您深入了解「{{ video.title }}」的完整制作过程。从选材到成品，每一步都凝聚着匠人的心血与智慧。冷凝合香传承近千年，不点燃，借体温缓慢散逸药力，以香入药，以心疗心。
      </p>
    </div>

    <!-- Related -->
    <div class="related-section">
      <div class="related-title brand">相关视频</div>
      <div class="related-list">
        <router-link
          v-for="rv in relatedVideos" :key="rv.id"
          :to="`/heritage/video/${rv.id}`"
          class="related-item"
        >
          <div class="related-thumb" :style="{ background: rv.thumb }">
            <img v-if="rv.image" :src="rv.image" :alt="rv.title"
              @error="$event.target.style.display='none'" loading="lazy" />
            <div class="related-play">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="var(--tp)"><polygon points="5,3 19,12 5,21" /></svg>
            </div>
            <span class="related-duration">{{ rv.duration }}</span>
          </div>
          <div class="related-info">
            <div class="related-name">{{ rv.title }}</div>
            <div class="related-views">{{ rv.views }}次播放</div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page { min-height: 100vh; background: var(--rp); }

.player-area {
  height: 220px; position: relative; display: flex; align-items: center;
  justify-content: center; overflow: hidden; background: #1A0E05;
}
.player-area img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.7; }
.player-overlay, .player-playing {
  position: relative; z-index: 1; display: flex; flex-direction: column;
  align-items: center; gap: 8px; cursor: pointer;
}
.play-icon {
  width: 56px; height: 56px; background: rgba(255,255,255,0.92); border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3); transition: transform 0.2s;
}
.player-overlay:active .play-icon { transform: scale(0.9); }
.play-hint { font-size: 11px; color: rgba(255,255,255,0.7); }
.playing-pulse { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.pulse-ring {
  width: 56px; height: 56px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.6);
  display: flex; align-items: center; justify-content: center;
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.15); opacity: 0.6; } }
.playing-text { font-size: 11px; color: rgba(255,255,255,0.7); }
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
  display: flex; gap: 12px; background: var(--pc);
  border-radius: 12px; overflow: hidden; border: 1px solid rgba(180, 149, 85, 0.15);
  text-decoration: none; color: inherit;
}
.related-item:active { transform: scale(0.98); }
.related-thumb {
  width: 120px; height: 80px; position: relative; display: flex;
  align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden;
}
.related-thumb img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.related-play {
  width: 28px; height: 28px; background: rgba(255,255,255,0.85); border-radius: 50%;
  display: flex; align-items: center; justify-content: center; z-index: 1;
}
.related-duration {
  position: absolute; bottom: 4px; right: 4px; background: rgba(0,0,0,0.5);
  color: white; padding: 1px 6px; border-radius: 3px; font-size: 9px;
}
.related-info { padding: 10px 12px; display: flex; flex-direction: column; justify-content: center; }
.related-name { font-size: 13px; font-weight: 500; color: var(--t1); margin-bottom: 2px; }
.related-views { font-size: 10px; color: var(--t3); }
</style>
