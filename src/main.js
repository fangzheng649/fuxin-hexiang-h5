import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/global.css'

// Vant 组件按需引入由 unplugin-vue-components 自动处理
import { showToast, showDialog, showNotify } from 'vant'
import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import 'vant/es/notify/style'

const app = createApp(App)
app.use(router)
app.config.globalProperties.$toast = showToast
app.config.globalProperties.$dialog = showDialog
app.config.globalProperties.$notify = showNotify
app.mount('#app')
