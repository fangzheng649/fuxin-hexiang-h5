// 聊天历史持久化 — localStorage 存储对话记录

const STORAGE_KEY = 'fuxin_chat_history'
const MAX_CONVERSATIONS = 10
const MAX_MESSAGES_PER_CONV = 50

function loadAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function saveAll(conversations) {
  // 保留最近 MAX_CONVERSATIONS 条
  const trimmed = conversations.slice(-MAX_CONVERSATIONS)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
}

export function useChatHistory() {
  function saveConversation(id, messages, chatHistory) {
    const all = loadAll()
    const now = Date.now()

    // 生成摘要：取最后一条 AI 消息的前 30 字
    const lastAiMsg = [...messages].reverse().find(m => m.type === 'ai')
    const summary = lastAiMsg ? lastAiMsg.text.slice(0, 30) + '...' : '新对话'

    // 截断消息数量
    const trimmedMessages = messages.slice(-MAX_MESSAGES_PER_CONV)

    const existingIdx = all.findIndex(c => c.id === id)
    const conv = {
      id,
      startedAt: existingIdx >= 0 ? all[existingIdx].startedAt : now,
      lastMessage: now,
      summary,
      messages: trimmedMessages,
      chatHistory: chatHistory.slice(-30), // API 消息历史保留最近 30 条
    }

    if (existingIdx >= 0) {
      all[existingIdx] = conv
    } else {
      all.push(conv)
    }

    saveAll(all)
  }

  function loadConversation(id) {
    const all = loadAll()
    const conv = all.find(c => c.id === id)
    if (!conv) return null
    return { messages: conv.messages || [], chatHistory: conv.chatHistory || [] }
  }

  function loadLatestConversation() {
    const all = loadAll()
    if (all.length === 0) return null
    const latest = all[all.length - 1]
    // 只恢复 5 分钟内的对话
    if (Date.now() - latest.lastMessage > 5 * 60 * 1000) return null
    return {
      id: latest.id,
      messages: latest.messages || [],
      chatHistory: latest.chatHistory || [],
      summary: latest.summary,
    }
  }

  function deleteConversation(id) {
    const all = loadAll().filter(c => c.id !== id)
    saveAll(all)
  }

  function clearAll() {
    localStorage.removeItem(STORAGE_KEY)
  }

  return { saveConversation, loadConversation, loadLatestConversation, deleteConversation, clearAll }
}
