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
    path: '/heritage',
    name: 'Heritage',
    component: () => import('../views/HeritagePage.vue'),
    meta: { title: '承' },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/ProfilePage.vue'),
    meta: { title: '安' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
