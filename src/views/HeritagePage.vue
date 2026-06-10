<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showDialog } from 'vant'
import { knowledgeList } from '../data/knowledge.js'
import { videos } from '../data/videos.js'
import { workshops } from '../data/workshops.js'
import { communityPosts } from '../data/community.js'
import CloudDivider from '../components/CloudDivider.vue'
import SectionHeader from '../components/SectionHeader.vue'

const router = useRouter()
const communityTab = ref(0)
const likedPosts = ref(new Set())

const toggleLike = (id) => {
  if (likedPosts.value.has(id)) {
    likedPosts.value.delete(id)
  } else {
    likedPosts.value.add(id)
  }
}

// 工坊预约
const handleBooking = (slot, index) => {
  showDialog({
    title: '预约确认',
    message: `确认预约 ${slot.date} ${slot.time}？\n剩余 ${slot.remain} 位`,
    confirmButtonText: '确认预约',
    cancelButtonText: '取消',
  }).then(() => {
    workshops[index].remain = Math.max(0, workshops[index].remain - 1)
    showToast('预约成功！我们将通过微信通知您具体安排')
  }).catch(() => {})
}

// 知识卡片详情
const showKnowledge = ref(false)
const selectedKnowledge = ref(null)
const openKnowledge = (item) => {
  selectedKnowledge.value = item
  showKnowledge.value = true
}

// 社区帖子详情
const showPostDetail = ref(false)
const selectedPost = ref(null)
const openPost = (post) => {
  selectedPost.value = post
  showPostDetail.value = true
}

const knowledgeIcons = {
  fire: 'M12 12c0-3-2.5-6-2.5-6s-2.5 3-2.5 6a2.5 2.5 0 0 0 5 0zM14.5 12c0-2 1.5-4 1.5-4s1.5 2 1.5 4a1.5 1.5 0 0 1-3 0z',
  book: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z',
  leaf: 'M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 17 3.5s1 2 1 5a7 7 0 0 1-7 7z',
}
</script>

<template>
  <div class="page heritage-page">
    <!-- Hero -->
    <div class="heritage-hero">
      <img src="/images/hero/heritage-hero.jpg" alt="冷凝合香制作技艺" class="heritage-bg"
        @error="$event.target.style.display='none'" loading="lazy" />
      <div class="heritage-overlay"></div>
      <div class="heritage-content">
        <h2 class="brand">冷凝合香制作技艺</h2>
        <p>福州市非物质文化遗产 · 传承千年</p>
      </div>
      <div class="heritage-badge">
        <span class="heritage-badge-big brand">非遗</span>
        <span>福州</span>
      </div>
    </div>

    <!-- Knowledge Cards -->
    <SectionHeader title="香识百科" more="更多 ›" @more="showToast('更多知识即将推出')" />
    <div class="knowledge-cards">
      <div v-for="item in knowledgeList" :key="item.id" class="knowledge-card" @click="openKnowledge(item)">
        <div class="knowledge-icon" :style="{ background: item.color + '18' }">
          <svg viewBox="0 0 24 24" width="24" height="24" :stroke="item.color" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path :d="knowledgeIcons[item.icon]" />
          </svg>
        </div>
        <div class="knowledge-card-body">
          <div class="knowledge-title brand">{{ item.title }}</div>
          <div class="knowledge-text">{{ item.text }}</div>
        </div>
      </div>
    </div>

    <CloudDivider />

    <!-- Videos -->
    <SectionHeader title="制香学堂" more="全部 ›" @more="showToast('更多视频即将推出')" />
    <div class="video-scroll hide-scrollbar">
      <div v-for="video in videos" :key="video.id" class="video-card" @click="showToast('视频播放功能即将推出')">
        <div class="video-thumb" :style="{ background: video.thumb }">
          <img v-if="video.image" :src="video.image" :alt="video.title"
            @error="$event.target.style.display='none'" loading="lazy" />
          <div class="video-play">▶</div>
          <span class="video-duration">{{ video.duration }}</span>
        </div>
        <div class="video-info">
          <div class="video-title">{{ video.title }}</div>
          <div class="video-views">{{ video.views }}次播放</div>
        </div>
      </div>
    </div>

    <CloudDivider />

    <!-- Game Card -->
    <div class="game-card" @click="router.push('/heritage/game')">
      <img src="/images/hero/game-card.jpg" alt="配香游戏" class="game-bg"
        @error="$event.target.style.display='none'" loading="lazy" />
      <div class="game-overlay"></div>
      <h4 class="brand">配香游戏</h4>
      <p>选择药材，搭配君臣佐使，亲手调配属于你的香方</p>
      <span class="game-btn">开始体验</span>
    </div>

    <CloudDivider />

    <!-- Workshop -->
    <SectionHeader title="工坊预约" more="详情 ›" @more="showToast('更多详情请咨询客服')" />
    <div class="workshop-card">
      <div class="workshop-header">
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="var(--tp)" fill="none" stroke-width="1.5" stroke-linecap="round">
          <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
          <circle cx="12" cy="11" r="2" />
        </svg>
        <div>
          <div class="workshop-location brand">福州 · 桐南村工坊</div>
          <div class="workshop-sub">每期限8人 · 含材料费</div>
        </div>
      </div>
      <div class="workshop-slots">
        <div v-for="(slot, i) in workshops" :key="i" class="workshop-slot">
          <div>
            <div class="workslot-date">{{ slot.date }}</div>
            <div class="workslot-remain">余{{ slot.remain }}位</div>
          </div>
          <button class="workslot-btn" @click="handleBooking(slot, i)">预约</button>
        </div>
      </div>
    </div>

    <CloudDivider />

    <!-- Community -->
    <SectionHeader title="香气社区" more="发布 ›" @more="showToast('社区发帖功能即将推出')" />
    <div class="community-tabs">
      <div
        v-for="(tab, i) in ['最新', '热门', '精华']"
        :key="i"
        class="community-tab"
        :class="{ active: communityTab === i }"
        @click="communityTab = i"
      >
        {{ tab }}
      </div>
    </div>
    <div class="community-list">
      <div v-for="post in communityPosts" :key="post.id" class="community-post" @click="openPost(post)">
        <div class="community-user">
          <div class="community-avatar" :style="{ background: post.avatar.bg }">
            {{ post.avatar.emoji }}
          </div>
          <span class="community-username">{{ post.username }}</span>
          <span class="community-time">{{ post.time }}</span>
        </div>
        <div class="community-text">{{ post.text }}</div>
        <span v-if="post.recipe" class="community-recipe-tag">{{ post.recipe }}</span>
        <div class="community-actions">
          <span
            class="community-action"
            :class="{ liked: likedPosts.has(post.id) }"
            @click="toggleLike(post.id)"
          >
            {{ likedPosts.has(post.id) ? '❤️' : '🤍' }} {{ post.likes + (likedPosts.has(post.id) ? 1 : 0) }}
          </span>
          <span class="community-action">💬 {{ post.comments }}</span>
        </div>
      </div>
    </div>

    <div style="height: 20px" />

    <!-- Knowledge Detail Popup -->
    <van-popup v-model:show="showKnowledge" position="bottom" round :style="{ maxHeight: '65vh' }">
      <div v-if="selectedKnowledge" class="knowledge-detail">
        <div class="knowledge-detail-header" :style="{ background: selectedKnowledge.color + '18' }">
          <div class="knowledge-detail-icon" :style="{ background: selectedKnowledge.color }">
            <svg viewBox="0 0 24 24" width="28" height="28" :stroke="selectedKnowledge.color" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path :d="knowledgeIcons[selectedKnowledge.icon]" />
            </svg>
          </div>
          <div class="knowledge-detail-title brand">{{ selectedKnowledge.title }}</div>
        </div>
        <div class="knowledge-detail-text">{{ selectedKnowledge.text }}</div>
      </div>
    </van-popup>

    <!-- Post Detail Popup -->
    <van-popup v-model:show="showPostDetail" position="bottom" round :style="{ maxHeight: '70vh' }">
      <div v-if="selectedPost" class="post-detail">
        <div class="post-detail-user">
          <div class="community-avatar" :style="{ background: selectedPost.avatar.bg }">
            {{ selectedPost.avatar.emoji }}
          </div>
          <div>
            <div class="post-detail-name">{{ selectedPost.username }}</div>
            <div class="post-detail-time">{{ selectedPost.time }}</div>
          </div>
        </div>
        <div class="post-detail-text">{{ selectedPost.text }}</div>
        <span v-if="selectedPost.recipe" class="community-recipe-tag">{{ selectedPost.recipe }}</span>
        <div class="post-detail-stats">
          <span>❤️ {{ selectedPost.likes }} 喜欢</span>
          <span>💬 {{ selectedPost.comments }} 评论</span>
        </div>
        <div class="post-detail-comments">
          <div class="post-detail-comment-placeholder">评论区功能即将推出</div>
        </div>
      </div>
    </van-popup>
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

/* Hero */
.heritage-hero {
  position: relative;
  height: 180px;
  background: linear-gradient(135deg, #1A0E05, var(--td) 40%, #3A6449 100%);
  display: flex;
  align-items: flex-end;
  padding: 20px;
  overflow: hidden;
}

.heritage-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

.heritage-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(26,14,5,0.3) 0%, rgba(58,100,73,0.5) 100%);
  z-index: 0;
}
.heritage-hero::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 25px;
  background:
    radial-gradient(ellipse at 25% 100%, rgba(196, 169, 125, 0.2), transparent 50%),
    radial-gradient(ellipse at 50% 100%, rgba(196, 169, 125, 0.12), transparent 45%),
    radial-gradient(ellipse at 75% 100%, rgba(196, 169, 125, 0.18), transparent 50%);
}
.heritage-content { color: #F5ECDA; position: relative; z-index: 1; }
.heritage-content h2 { font-size: 20px; margin-bottom: 4px; }
.heritage-content p { font-size: 12px; opacity: 0.85; }
.heritage-badge {
  position: absolute;
  top: 50px;
  right: 16px;
  width: 60px;
  height: 60px;
  border: 2px solid rgba(201, 160, 80, 0.6);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  color: #C9A050;
  line-height: 1.3;
  text-align: center;
  background: rgba(44, 31, 18, 0.5);
  backdrop-filter: blur(4px);
}
.heritage-badge-big { font-size: 12px; font-weight: 700; }

/* Knowledge */
.knowledge-cards {
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.knowledge-card {
  display: flex;
  gap: 14px;
  padding: 14px;
  background: var(--pc);
  border-radius: 12px;
  box-shadow: var(--sc);
  border: 1px solid rgba(180, 149, 85, 0.2);
  cursor: pointer;
  transition: all 0.25s;
  position: relative;
}
.knowledge-card::before {
  content: '';
  position: absolute;
  inset: 3px;
  border: 1px solid rgba(180, 149, 85, 0.1);
  border-radius: 9px;
  pointer-events: none;
}
.knowledge-card:active { transform: scale(0.98); }
.knowledge-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.knowledge-card-body { flex: 1; }
.knowledge-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--t1);
  margin-bottom: 4px;
}
.knowledge-text {
  font-size: 11px;
  color: var(--t2);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Videos */
.video-scroll {
  display: flex;
  gap: 12px;
  padding: 0 20px;
  overflow-x: auto;
}
.video-card {
  min-width: 170px;
  border-radius: 14px;
  overflow: hidden;
  background: var(--pc);
  box-shadow: var(--sc);
  cursor: pointer;
  transition: all 0.25s;
  border: 1px solid rgba(180, 149, 85, 0.15);
  flex-shrink: 0;
}
.video-card:active { transform: scale(0.97); }
.video-thumb {
  height: 100px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.video-thumb img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.video-play {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: var(--tp);
}
.video-duration {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 10px;
}
.video-info { padding: 10px 12px; }
.video-title { font-size: 13px; font-weight: 500; color: var(--t1); }
.video-views { font-size: 10px; color: var(--t3); margin-top: 2px; }

/* Game */
.game-card {
  margin: 0 20px;
  background: linear-gradient(135deg, var(--hg), #3A6449);
  border-radius: 16px;
  padding: 24px 20px;
  color: white;
  text-align: center;
  cursor: pointer;
  transition: all 0.25s;
  position: relative;
  overflow: hidden;
}

.game-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

.game-overlay {
  position: absolute;
  inset: 0;
  background: rgba(58, 100, 73, 0.55);
  z-index: 0;
}

.game-card h4 { font-size: 18px; margin-bottom: 8px; position: relative; z-index: 1; }
.game-card p { font-size: 12px; opacity: 0.85; line-height: 1.6; margin-bottom: 16px; position: relative; z-index: 1; }
.game-card::before {
  content: '';
  position: absolute;
  top: -20px;
  right: -20px;
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1), transparent);
  border-radius: 50%;
}
.game-card:active { transform: scale(0.98); }
.game-btn {
  display: inline-block;
  padding: 10px 28px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 24px;
  color: white;
  font-size: 13px;
  font-family: 'Noto Serif SC', serif;
  position: relative;
  z-index: 1;
}

/* Workshop */
.workshop-card {
  margin: 0 20px;
  background: var(--pc);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--sc);
  border: 1px solid rgba(180, 149, 85, 0.2);
  position: relative;
}
.workshop-card::before {
  content: '';
  position: absolute;
  inset: 3px;
  border: 1px solid rgba(180, 149, 85, 0.1);
  border-radius: 13px;
  pointer-events: none;
}
.workshop-header {
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid var(--mg);
}
.workshop-location { font-size: 13px; color: var(--t1); font-weight: 500; }
.workshop-sub { font-size: 11px; color: var(--t3); }
.workshop-slots { padding: 12px 16px; }
.workshop-slot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(232, 221, 211, 0.5);
}
.workshop-slot:last-child { border-bottom: none; }
.workslot-date { font-size: 13px; color: var(--t1); }
.workslot-remain { font-size: 11px; color: var(--hg); }
.workslot-btn {
  padding: 5px 14px;
  background: var(--tp);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 11px;
  cursor: pointer;
  font-family: inherit;
}
.workslot-btn:active { background: var(--td); }

/* Community */
.community-tabs {
  display: flex;
  gap: 16px;
  padding: 8px 20px;
}
.community-tab {
  font-size: 12px;
  color: var(--t3);
  cursor: pointer;
  padding-bottom: 4px;
}
.community-tab.active {
  color: var(--tp);
  font-weight: 600;
  border-bottom: 2px solid var(--tp);
}
.community-list {
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.community-post {
  background: var(--pc);
  border-radius: 14px;
  padding: 14px;
  box-shadow: var(--sc);
  border: 1px solid rgba(180, 149, 85, 0.15);
}
.community-user {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.community-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}
.community-username { font-size: 12px; font-weight: 500; color: var(--t1); }
.community-time { font-size: 10px; color: var(--t3); margin-left: auto; }
.community-text { font-size: 12px; color: var(--t2); line-height: 1.6; }
.community-recipe-tag {
  display: inline-block;
  font-size: 10px;
  color: var(--tp);
  background: rgba(78, 46, 30, 0.08);
  padding: 2px 8px;
  border-radius: 8px;
  margin-top: 6px;
}
.community-actions {
  display: flex;
  gap: 20px;
  margin-top: 10px;
  font-size: 11px;
  color: var(--t3);
}
.community-action {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s;
}
.community-action.liked { color: var(--f); }

/* Knowledge Detail Popup */
.knowledge-detail { }
.knowledge-detail-header {
  padding: 24px 20px 16px; display: flex; flex-direction: column; align-items: center; gap: 12px;
}
.knowledge-detail-icon {
  width: 60px; height: 60px; border-radius: 16px;
  display: flex; align-items: center; justify-content: center;
}
.knowledge-detail-title { font-size: 18px; font-weight: 600; color: var(--t1); }
.knowledge-detail-text { padding: 16px 20px 24px; font-size: 14px; color: var(--t2); line-height: 1.8; }

/* Post Detail Popup */
.post-detail { padding: 20px; }
.post-detail-user { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
.post-detail-name { font-size: 14px; font-weight: 500; color: var(--t1); }
.post-detail-time { font-size: 11px; color: var(--t3); }
.post-detail-text { font-size: 14px; color: var(--t2); line-height: 1.7; margin-bottom: 10px; }
.post-detail-stats {
  display: flex; gap: 20px; font-size: 12px; color: var(--t3);
  padding: 12px 0; border-top: 1px solid var(--mg); margin-top: 8px;
}
.post-detail-comments { margin-top: 12px; }
.post-detail-comment-placeholder {
  text-align: center; font-size: 12px; color: var(--t3); padding: 20px 0;
}
</style>
