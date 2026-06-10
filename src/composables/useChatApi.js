import { ref } from 'vue'

const API_URL = '/api/chat'

export function useChatApi() {
  const loading = ref(false)
  const error = ref(null)

  // 解析五行标签: [FiveElements:木=85,火=65,土=50,金=55,水=35]
  const parseFiveElements = (text) => {
    const match = text.match(/\[FiveElements:([^\]]+)\]/)
    if (!match) return null
    const pairs = match[1].split(',')
    const elements = pairs.map(p => {
      const [label, pct] = p.split('=')
      const organMap = { '木': '肝', '火': '心', '土': '脾', '金': '肺', '水': '肾' }
      const colorMap = { '木': '#4A7C59', '火': '#C75450', '土': '#C9A050', '金': '#B5AA90', '水': '#4A6B8A' }
      return { label, organ: organMap[label] || label, pct: parseInt(pct) || 50, color: colorMap[label] || '#999' }
    })
    const desc = elements.sort((a, b) => b.pct - a.pct)
      .slice(0, 2).map(e => `${e.label}${e.pct > 60 ? '旺' : '弱'}（${e.organ}气${e.pct > 60 ? '偏盛' : '不足'}）`).join(' · ')
    return { elements, desc }
  }

  // 解析香方标签: [Recipe:竹影清风]
  const parseRecipe = (text) => {
    const match = text.match(/\[Recipe:([^\]]+)\]/)
    return match ? match[1] : null
  }

  // 超长历史截断：保留开头 2 条 + 末尾 (max-4) 条，中间用摘要替代
  const summarizeHistory = (chatHistory, max = 20) => {
    if (chatHistory.length <= max) return chatHistory
    const head = chatHistory.slice(0, 2)
    const tail = chatHistory.slice(-(max - 3))
    const summary = {
      role: 'system',
      content: '[前情摘要] 用户之前已与AI讨论过情绪和体质问题，AI已进行过五行分析和香方推荐。以下是最近的对话。'
    }
    return [...head, summary, ...tail]
  }

  // 流式调用 DeepSeek API
  const sendMessage = async (messages, userContext, onChunk, onFiveElements, onRecipe) => {
    loading.value = true
    error.value = null
    let fullText = ''

    try {
      // 截断过长历史
      const trimmedMessages = summarizeHistory(messages)

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: trimmedMessages, userContext }),
      })

      if (!res.ok) {
        throw new Error(`API 返回 ${res.status}`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        // 解析 SSE data: 行
        const lines = chunk.split('\n')
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (data === '[DONE]') continue

          try {
            const json = JSON.parse(data)
            const content = json.choices?.[0]?.delta?.content
            if (content) {
              fullText += content
              onChunk(content, fullText)
            }
          } catch {
            // 忽略解析错误
          }
        }
      }

      // 检测特殊标签
      const fiveEl = parseFiveElements(fullText)
      if (fiveEl) onFiveElements(fiveEl)

      const recipeName = parseRecipe(fullText)
      if (recipeName) onRecipe(recipeName)

      // 清除文本中的标签
      let cleanText = fullText
        .replace(/\[FiveElements:[^\]]+\]/g, '')
        .replace(/\[Recipe:[^\]]+\]/g, '')
        .trim()
      if (!cleanText) cleanText = fullText // 如果标签被清空了就用原文

      loading.value = false
      return { text: cleanText, fiveElements: fiveEl, recipeName }
    } catch (e) {
      error.value = e.message
      loading.value = false
      throw e
    }
  }

  return { loading, error, sendMessage }
}
