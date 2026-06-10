// 轻量级 DeepSeek API 代理 — Node.js v20 兼容
// 动态系统提示词 + 用户上下文注入
const http = require('http')
const https = require('https')
const { buildSystemPrompt } = require('./systemPrompt.cjs')

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || ''
const PORT = process.env.PROXY_PORT || 3001

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function streamDeepSeek(messages, res) {
  const fullMessages = [{ role: 'system', content: messages._systemPrompt }, ...messages._apiMessages]

  const body = JSON.stringify({
    model: 'deepseek-chat',
    messages: fullMessages,
    stream: true,
    temperature: 0.7,
    max_tokens: 1500,
  })

  const req = https.request('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
    },
  }, (apiRes) => {
    if (apiRes.statusCode !== 200) {
      let errData = ''
      apiRes.on('data', c => errData += c)
      apiRes.on('end', () => {
        res.writeHead(apiRes.statusCode, { 'Content-Type': 'application/json', ...CORS })
        res.end(JSON.stringify({ error: errData }))
      })
      return
    }
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      ...CORS,
    })
    apiRes.pipe(res)
  })
  req.on('error', err => {
    res.writeHead(500, { 'Content-Type': 'application/json', ...CORS })
    res.end(JSON.stringify({ error: err.message }))
  })
  req.write(body)
  req.end()
}

http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(200, CORS)
    res.end()
    return
  }
  if (req.method === 'POST' && req.url === '/api/chat') {
    let data = ''
    req.on('data', c => data += c)
    req.on('end', () => {
      try {
        const { messages, userContext } = JSON.parse(data)
        if (!DEEPSEEK_API_KEY) {
          res.writeHead(500, { 'Content-Type': 'application/json', ...CORS })
          res.end(JSON.stringify({ error: 'API Key not configured' }))
          return
        }
        // 构建动态系统提示词
        const systemPrompt = buildSystemPrompt(userContext || {})
        streamDeepSeek({ _systemPrompt: systemPrompt, _apiMessages: messages }, res)
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json', ...CORS })
        res.end(JSON.stringify({ error: e.message }))
      }
    })
    return
  }
  res.writeHead(404)
  res.end('Not Found')
}).listen(PORT, () => {
  console.log(`DeepSeek API proxy running on port ${PORT}`)
})
