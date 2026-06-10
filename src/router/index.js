import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/HomePage.vue'),
    meta: { title: '静' },
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('../views/ChatPage.vue'),
    meta: { title: '问' },
  },
  {
    path: '/shop',
    name: 'Shop',
    component: () => import('../views/ShopPage.vue'),
    meta: { title: '方' },
  },
  {
    path: '/shop/product/:id',
    name: 'ProductDetail',
    component: () => import('../views/ProductDetailPage.vue'),
    meta: { title: '香方详情' },
  },
  {
    path: '/heritage',
    name: 'Heritage',
    component: () => import('../views/HeritagePage.vue'),
    meta: { title: '承' },
  },
  {
    path: '/heritage/game',
    name: 'BlendingGame',
    component: () => import('../views/BlendingGamePage.vue'),
    meta: { title: '配香游戏' },
  },
  {
    path: '/heritage/video/:id',
    name: 'VideoPlayer',
    component: () => import('../views/VideoPlayerPage.vue'),
    meta: { title: '制香学堂' },
  },
  {
    path: '/heritage/knowledge/:id',
    name: 'KnowledgeDetail',
    component: () => import('../views/KnowledgeDetailPage.vue'),
    meta: { title: '香识百科' },
  },
  {
    path: '/notes',
    name: 'NotesList',
    component: () => import('../views/NotesListPage.vue'),
    meta: { title: '传承人手记' },
  },
  {
    path: '/profile/notifications',
    name: 'Notifications',
    component: () => import('../views/NotificationsPage.vue'),
    meta: { title: '消息通知' },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/ProfilePage.vue'),
    meta: { title: '安' },
  },
  {
    path: '/profile/favorites',
    name: 'Favorites',
    component: () => import('../views/FavoritesPage.vue'),
    meta: { title: '我的收藏' },
  },
  {
    path: '/profile/health',
    name: 'Health',
    component: () => import('../views/HealthPage.vue'),
    meta: { title: '健康管理' },
  },
  {
    path: '/profile/archive',
    name: 'Archive',
    component: () => import('../views/ArchivePage.vue'),
    meta: { title: '我的档案' },
  },
  {
    path: '/heritage/knowledge',
    name: 'KnowledgeList',
    component: () => import('../views/KnowledgeListPage.vue'),
    meta: { title: '香识百科' },
  },
  {
    path: '/heritage/videos',
    name: 'VideoList',
    component: () => import('../views/VideoListPage.vue'),
    meta: { title: '制香学堂' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
