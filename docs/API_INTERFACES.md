# 抚心合香 H5 — 前后端接口文档

> 自动生成于 2026-06-11，基于代码库全量扫描

---

## 一、已实现的 API 端点

### 1.1 AI 聊天接口

**URL**: `POST /api/chat`
**说明**: 代理到 DeepSeek API，返回 SSE 流式响应
**部署方式**: Vercel Edge Function (`api/chat.js`) + Node.js 独立代理 (`deploy/server.js:3001`)

#### 请求体

```json
{
  "messages": [
    { "role": "user", "content": "最近失眠焦虑" },
    { "role": "assistant", "content": "..." }
  ],
  "userContext": {
    "nickname": "香友 · 小雅",
    "constitution": "木型体质",
    "tag": "肝气偏盛",
    "currentRecipe": "竹影清风",
    "currentSeason": {
      "season": "夏",
      "element": "火",
      "organ": "心",
      "healthTip": "夏养心——宜清心降火，安神定志"
    },
    "recentMoods": [
      { "date": "6/10", "score": 3 },
      { "date": "6/11", "score": 4 }
    ]
  }
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| messages | Array<{role, content}> | 是 | 对话历史，role 为 user/assistant |
| userContext | Object | 否 | 用户上下文，用于动态系统提示词 |
| userContext.nickname | string | 否 | 用户昵称 |
| userContext.constitution | string | 否 | 体质类型（如"木型体质"） |
| userContext.tag | string | 否 | 体质标签（如"肝气偏盛"） |
| userContext.currentRecipe | string | 否 | 当前使用香方 |
| userContext.currentSeason | Object | 否 | 当前季节信息 |
| userContext.recentMoods | Array | 否 | 近期情绪记录（score 1-5） |

#### 响应

**Content-Type**: `text/event-stream`
**格式**: SSE 流

```
data: {"choices":[{"delta":{"content":"你好"}}]}

data: {"choices":[{"delta":{"content":"，我是"}}]}

data: [DONE]
```

#### 特殊标签（AI 输出中嵌入，前端解析）

| 标签 | 格式 | 说明 |
|------|------|------|
| 五行分析 | `[FiveElements:木=85,火=65,土=50,金=55,水=35]` | 数值 20-95，总和 250-350 |
| 香方推荐 | `[Recipe:竹影清风]` | 必须精确匹配 15 种香方之一 |

#### 前端调用位置

- `src/composables/useChatApi.js:sendMessage()` — 核心 fetch 调用
- `src/views/ChatPage.vue:handleSendOnline()` — 在线模式调用
- `src/views/ChatPage.vue:handleEmotionSelect()` — 情绪选择后的 API 调用

#### 服务端处理流程

1. 解析 `{ messages, userContext }`
2. `buildSystemPrompt(userContext)` 构建动态系统提示词（含 15 种香方知识库）
3. 组装 `[{ role: 'system', content: prompt }, ...messages]`
4. POST 到 `https://api.deepseek.com/chat/completions`
5. SSE 流式转发到客户端

#### 环境变量

| 变量名 | 用途 | 部署位置 |
|--------|------|----------|
| `DEEPSEEK_API_KEY` | DeepSeek API 密钥 | Vercel 环境变量 / 服务器 .env |
| `PROXY_PORT` | Node.js 代理端口（默认 3001） | 服务器环境变量 |

---

## 二、localStorage 存储接口

### 2.1 聊天历史 — `fuxin_chat_history`

**Composable**: `src/composables/useChatHistory.js`
**调用位置**: `src/views/ChatPage.vue`

```json
[
  {
    "id": "conv_1718000000000",
    "startedAt": 1718000000000,
    "lastMessage": 1718000060000,
    "summary": "讨论焦虑情绪，推荐竹影清风...",
    "messages": [
      { "type": "ai", "text": "你好..." },
      { "type": "user", "text": "最近压力大" },
      { "type": "fiveElements", "elements": [...], "desc": "..." },
      { "type": "recipe", "name": "竹影清风", "effect": "...", ... }
    ],
    "chatHistory": [
      { "role": "user", "content": "最近压力大" },
      { "role": "assistant", "content": "..." }
    ]
  }
]
```

**限制**: 最多 10 条对话，每条最多 50 条消息

### 2.2 购物车 — `fuxin_cart`

**Composable**: `src/composables/useCart.js`
**调用位置**: `ShopPage.vue`, `ProductDetailPage.vue`, `ProfilePage.vue`

```json
[1, 3, 5]
```

简单产品 ID 数组。

### 2.3 收藏 — `fuxin_favorites`

**Composable**: `src/composables/useFavorites.js`
**调用位置**: `ProfilePage.vue`

```json
[1, 2, 7]
```

简单产品 ID 数组。

### 2.4 用户资料 — `fuxin_profile`

**Composable**: `src/composables/useProfile.js`
**调用位置**: `ProfilePage.vue`, `useUserContext.js`

```json
{
  "nickname": "香友 · 小雅",
  "constitution": "木型体质",
  "tag": "肝气偏盛",
  "currentRecipe": "竹影清风"
}
```

### 2.5 情绪记录 — `fuxin_moods`

**Composable**: `src/composables/useProfile.js`
**调用位置**: `ProfilePage.vue`, `useUserContext.js`

```json
[
  { "date": "6/10", "score": 3, "note": "有点累" },
  { "date": "6/11", "score": 4, "note": "" }
]
```

**限制**: 最多 30 条记录
**score**: 1-5（1=很差，5=很好）

---

## 三、预留但未实现的 API 接口

> 以下接口前端已留好入口（Toast 提示"即将推出"），需要后端支持后对接。

### 3.1 用户认证（微信登录）

```
POST /api/auth/login
  Body: { code: string }  // 微信登录 code
  Response: { token: string, user: { id, nickname, avatar, constitution } }
```

**用途**: 替代当前 localStorage 的用户数据
**对应前端**: ProfilePage 编辑资料、跨设备数据同步

### 3.2 产品目录（当前静态）

```
GET /api/products?element=火·心&search=安神
  Response: { list: Product[], total: number }

GET /api/products/:id
  Response: Product
```

**用途**: 当前 `src/data/products.js` 为静态数据，未来可 API 化
**对应前端**: ShopPage 产品列表、ProductDetailPage 产品详情

### 3.3 购物车

```
GET /api/cart
  Response: { items: [{ productId, quantity, addedAt }] }

POST /api/cart
  Body: { productId: number, quantity: number }
  Response: { items: [...] }

DELETE /api/cart/:productId
  Response: { items: [...] }
```

**用途**: 替代 localStorage 的购物车
**对应前端**: ShopPage "加入香囊"、ProfilePage 购物车数量

### 3.4 订单

```
POST /api/orders
  Body: { items: [{ productId, quantity }], addressId: string, note?: string }
  Response: { orderId: string, status: string, total: number }

GET /api/orders
  Response: { list: Order[] }
```

**用途**: 用户下单、订单管理
**对应前端**: ShopPage 购买流程

### 3.5 工坊预约

```
GET /api/workshops
  Response: { list: [{ id, date, time, remain, price, location }] }

POST /api/workshops/:id/book
  Body: { name: string, phone: string, note?: string }
  Response: { bookingId: string, status: string }
```

**用途**: 替代当前前端静态扣减余位
**对应前端**: HeritagePage 工坊预约按钮

### 3.6 社区

```
GET /api/community/posts?tab=latest&limit=20&offset=0
  Response: { list: Post[], total: number }

POST /api/community/posts
  Body: { text: string, recipeId?: number, images?: string[] }
  Response: { post: Post }

POST /api/community/posts/:id/like
  Response: { liked: boolean, likes: number }

POST /api/community/posts/:id/comments
  Body: { text: string }
  Response: { comment: Comment }
```

**用途**: 社区帖子、点赞、评论
**对应前端**: HeritagePage 社区区域（当前 Toast "即将推出"）

### 3.7 心情 & 成就

```
POST /api/mood
  Body: { score: number, note?: string, date: string }
  Response: { id: string, score: number, note: string, date: string }

GET /api/mood?days=7
  Response: { list: [{ date, score, note }] }

GET /api/achievements
  Response: { list: Achievement[] }
```

**用途**: 替代 localStorage 的情绪记录和成就系统
**对应前端**: ProfilePage 心情记录、成就收集

### 3.8 通知

```
GET /api/notifications?limit=20
  Response: { list: [{ id, type, title, body, read, createdAt }] }

PUT /api/notifications/:id/read
  Response: { success: boolean }
```

**用途**: 替代当前 Mock 通知数据
**对应前端**: NotificationsPage（当前为 Mock 数据）

### 3.9 知识 & 视频

```
GET /api/knowledge
  Response: { list: KnowledgeItem[] }

GET /api/knowledge/:id
  Response: { ...KnowledgeItem, fullContent: string }

GET /api/videos/:id
  Response: { ...VideoItem, url: string, relatedVideos: VideoItem[] }
```

**用途**: 替代当前静态数据，支持 CMS 管理
**对应前端**: HeritagePage 知识卡片、VideoPlayerPage

### 3.10 分享

```
POST /api/share
  Body: { type: 'product'|'recipe'|'post', id: number }
  Response: { shareUrl: string, qrCode?: string }
```

**用途**: 生成分享链接/二维码
**对应前端**: ProductDetailPage 分享按钮（当前 Toast "即将推出"）

### 3.11 订阅

```
POST /api/subscribe
  Body: { plan: 'monthly'|'quarterly'|'yearly' }
  Response: { subscriptionId: string, status: string }
```

**用途**: 定期配送香方订阅
**对应前端**: ShopPage 订阅卡片（当前 showDialog 展示方案信息）

---

## 四、配置文件

### 4.1 vercel.json — 路由配置

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/$1" },
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

### 4.2 vite.config.js — 开发代理

```javascript
proxy: {
  '/api/chat': {
    target: 'https://api.deepseek.com',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ''),
  },
}
```

### 4.3 package.json — 构建命令

```bash
npm run dev     # 开发服务器 (port 3000)
npm run build   # 生产构建 → dist/
npm run preview # 预览生产构建
```

---

## 五、部署架构

### 5.1 Vercel 部署（主方案）

```
用户 → Vercel CDN
  → /api/chat → api/chat.js (Edge Function)
    → DeepSeek API
  → /* → dist/index.html (SPA)
```

### 5.2 独立服务器部署（阿里云）

```
用户 → Nginx (47.237.113.80)
  → /api/chat → PM2: server.js (port 3001)
    → DeepSeek API
  → /* → dist/ (静态文件)
```

**服务器信息**:
- IP: 47.237.113.80
- Node.js: v20.20.2 (/www/server/nodejs/v20.20.2/bin/)
- PM2 进程名: fuxin-proxy
- 部署目录: /www/wwwroot/fuxin-hexiang-h5/

---

## 六、数据文件清单（静态数据）

| 文件 | 内容 | 使用位置 |
|------|------|----------|
| `src/data/products.js` | 15 种产品（id 1-15） | ShopPage, ChatPage, ProductDetailPage, HomePage |
| `src/data/emotions.js` | 5 种情绪选项 | ChatPage |
| `src/data/knowledge.js` | 3 条知识条目 | HeritagePage, KnowledgeDetailPage |
| `src/data/videos.js` | 4 条视频条目 | HeritagePage, VideoPlayerPage |
| `src/data/notes.js` | 4 条传承人手记 | HomePage, NotesListPage |
| `src/data/community.js` | 社区帖子 | HeritagePage |
| `src/data/achievements.js` | 4 项成就 | ProfilePage |
| `src/data/workshops.js` | 工坊预约时段 | HeritagePage |
