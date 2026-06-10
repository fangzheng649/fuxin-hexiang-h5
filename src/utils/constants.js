// 共享颜色常量 — 全局统一，避免硬编码散布在各组件中

// 君臣佐使角色颜色
export const ROLE_COLORS = {
  '君': '#4E2E1E',
  '臣': '#4A7C59',
  '佐': '#4A6B8A',
  '使': '#C9A050',
}

// 五行颜色
export const ELEMENT_COLORS = {
  '木': '#4A7C59',
  '火': '#C75450',
  '土': '#C9A050',
  '金': '#B5AA90',
  '水': '#4A6B8A',
}

// 五行→脏腑映射
export const ELEMENT_ORGANS = {
  '木': '肝',
  '火': '心',
  '土': '脾',
  '金': '肺',
  '水': '肾',
}

// 情绪→五行→产品映射（离线模式用）
export const EMOTION_MAP = {
  '焦虑': { element: '火', organ: '心', fiveElements: [45, 85, 45, 50, 35], recipe: '竹影清风' },
  '低落': { element: '木', organ: '肝', fiveElements: [85, 55, 50, 45, 40], recipe: '春风拂柳' },
  '疲惫': { element: '土', organ: '脾', fiveElements: [45, 50, 85, 55, 40], recipe: '稻香归田' },
  '烦躁': { element: '金', organ: '肺', fiveElements: [50, 55, 45, 85, 40], recipe: '霜菊傲骨' },
  '还好': { element: '水', organ: '肾', fiveElements: [40, 45, 50, 55, 85], recipe: '听泉水生' },
}
