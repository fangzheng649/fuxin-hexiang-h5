<div align="center">

# 🪷 抚心合香

### 以香入药 · 以心疗心

**福州非遗冷凝合香制作技艺 — 数字化传承平台**

<br />

[![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?style=flat-square&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Vant 4](https://img.shields.io/badge/Vant-4-FF6034?style=flat-square)](https://vant-ui.github.io/vant/)
[![DeepSeek AI](https://img.shields.io/badge/AI-DeepSeek-4D6BFE?style=flat-square)](https://www.deepseek.com/)

🌐 **在线访问：[fuxin-hexiang.xyz](https://fuxin-hexiang.xyz)**

</div>

---

## ✨ 项目简介

**抚心合香**是一款面向福州非遗「冷凝合香」制作技艺的移动端 H5 应用，将传统香道文化与现代数字体验融为一体。用户可以与 AI 香学顾问对话、体验君臣佐使配香、浏览香方商城、学习非遗知识、参与社区互动。

> 冷凝合香，不用火烧，以香药研磨合香，自然凝香。是福州独有的非遗制香技艺。

<br />

## 🏠 五大核心模块

| 模块 | 入口 | 核心功能 |
|:---:|:---:|:---|
| 🪷 **静** | 首页 | 品牌展示、季节推荐、每日香语、快捷入口 |
| 💬 **问** | AI 对话 | DeepSeek 驱动的香学顾问，体质辨识、香方推荐、历史记录 |
| 🎁 **方** | 香方商城 | 15 款香方产品、购物车、收藏、详情页、场景推荐 |
| 📜 **承** | 非遗传承 | 制香学堂视频、香识百科、君臣佐使配香游戏、社区互动 |
| 👤 **安** | 个人中心 | 健康管理、体质档案、成就系统、收藏列表、消息通知 |

<br />

## 🎯 特色功能

### 🧠 AI 香学顾问
- 基于 DeepSeek 大模型的智能对话系统
- 精心设计的系统提示词：涵盖香学理论、中医体质、君臣佐使配伍
- 多轮对话上下文记忆 + 用户画像感知
- 自动推荐匹配体质的香方

### 🎮 君臣佐使配香游戏
- 沉浸式交互体验，模拟真实配香流程
- 君（主香）、臣（辅香）、佐（调和）、使（引导）四步配伍
- 配方结果评价系统

### 🏪 香方商城
- 15 款精心设计的香方产品卡片
- 按场景分类（安神助眠 · 净化空气 · 提神醒脑 · 养生保健 · 礼佛禅修）
- 购物车 + 收藏 + 产品详情
- 香礼定制入口

### 📚 非遗知识库
- 制香工艺视频学堂
- 香药百科知识体系
- 传承人手记
- 社区发帖与评论互动

### 🌿 健康管理
- 中医九种体质辨识
- 七日心情趋势追踪
- 四季养生建议
- 个人成就系统

<br />

## 🛠️ 技术栈

| 类别 | 技术 | 说明 |
|:---|:---|:---|
| **框架** | Vue 3 + Composition API | 响应式组件化开发 |
| **构建** | Vite 8 | 极速热更新与构建 |
| **UI 库** | Vant 4 | 移动端组件库（Popup、Toast、Swipe 等） |
| **路由** | Vue Router 4 | SPA 路由管理（replace 模式防止历史堆栈） |
| **AI 引擎** | DeepSeek API | 智能对话、香方推荐 |
| **字体** | Noto Serif SC | 衬线中文字体，契合古典香道气质 |
| **部署** | Nginx + Node.js Proxy | 阿里云 ECS，HTTPS，API 反向代理 |

<br />

## 📂 项目结构

```
fuxin-hexiang-h5/
├── public/
│   └── images/              # 图片资源（已压缩优化）
│       ├── gifts/            # 香礼图片
│       ├── hero/             # 首页/页面横幅
│       ├── notes/            # 手记配图
│       ├── products/         # 产品卡片 & 场景图
│       └── videos/           # 视频封面
├── src/
│   ├── components/          # 公共组件
│   │   ├── TabBar.vue        # 底部导航栏（静/问/方/承/安）
│   │   ├── SubPageHeader.vue # 子页面统一头部
│   │   └── EmptyState.vue    # 空状态组件
│   ├── composables/          # 组合式函数
│   │   ├── useChatApi.js     # DeepSeek AI 对话接口
│   │   ├── useChatHistory.js # 对话历史管理
│   │   ├── useCart.js        # 购物车逻辑
│   │   ├── useFavorites.js   # 收藏管理
│   │   ├── useProfile.js     # 用户档案
│   │   ├── useSeason.js      # 季节感知
│   │   └── useUserContext.js  # 用户上下文
│   ├── data/                 # 静态数据
│   │   ├── products.js       # 15 款香方产品
│   │   ├── knowledge.js      # 香识百科
│   │   ├── videos.js         # 制香视频
│   │   ├── emotions.js       # 情绪数据
│   │   ├── achievements.js   # 成就系统
│   │   └── ...
│   ├── icons/                # SVG 图标
│   ├── router/               # 路由配置（16 条路由）
│   ├── styles/               # 全局样式 & CSS 变量
│   ├── utils/                # 工具函数
│   ├── views/                # 16 个页面组件
│   │   ├── HomePage.vue
│   │   ├── ChatPage.vue
│   │   ├── ShopPage.vue
│   │   ├── HeritagePage.vue
│   │   ├── ProfilePage.vue
│   │   ├── BlendingGamePage.vue
│   │   ├── ProductDetailPage.vue
│   │   ├── VideoPlayerPage.vue
│   │   └── ...
│   ├── App.vue               # 根组件（路由 + TabBar + 返回键）
│   └── main.js               # 入口文件
├── index.html
├── vite.config.js
└── package.json
```

<br />

## 🚀 快速开始

```bash
# 克隆项目
git clone https://github.com/fangzheng649/fuxin-hexiang-h5.git
cd fuxin-hexiang-h5

# 安装依赖
npm install

# 本地开发
npm run dev

# 构建生产版本
npm run build
```

<br />

## 🎨 设计理念

- **色彩体系**：以暖棕、米黄、墨绿为主色调，营造古朴典雅的香道氛围
- **字体选择**：Noto Serif SC 衬线字体，传递传统书卷气
- **交互风格**：轻量级动效，沉浸式浏览，符合移动端操作习惯
- **信息架构**：五字导航（静/问/方/承/安），简练而有禅意

<br />

## 📜 关于冷凝合香

冷凝合香是一种不借助火力燃烧、通过香药研磨后自然凝固成型的制香技艺，是福建省福州市的地方传统技艺，属于非物质文化遗产。其特点是**香韵悠长、温和不燥**，适合品茗、读书、禅修等场景。

<br />

---

<div align="center">

**抚心合香** · 福州非遗冷凝合香制作技艺

以香入药 · 以心疗心 🪷

</div>
