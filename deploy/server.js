// 轻量级 DeepSeek API 代理 — Node.js v20 兼容
const http = require('http')
const https = require('https')

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || ''
const PORT = process.env.PROXY_PORT || 3001

const SYSTEM_PROMPT = `你是「抚心合香」的AI配香助手，一位精通中医五行学说与合香技艺的老中医。你的职责是引导用户通过情绪表达找到最适合的冷凝合香。

## 你的流程
1. 先安抚用户情绪，让用户放松
2. 询问用户近期的情绪状态
3. 根据用户描述进行追问（睡眠、食欲、精神等方面）
4. 进行五行体质分析
5. 推荐最匹配的香方

## 你只能推荐以下15种香方
1. 竹影清风（火·心）- 清心降火·安神定志
2. 二苏旧局（火·心）- 安神宁心·舒缓情绪
3. 鹅梨帐香（火·心）- 安神助眠·温雅舒缓
4. 春风拂柳（木·肝）- 疏肝解郁·理气和中
5. 雪中春信（木·肝）- 清心提神·疏肝理气
6. 翠竹幽兰（木·肝）- 养血柔肝·和中缓急
7. 稻香归田（土·脾）- 健脾化湿·和中安神
8. 荷风送爽（土·脾）- 清暑化湿·健脾开胃
9. 金菊凝露（土·脾）- 消食化郁·开胃除痞
10. 霜菊傲骨（金·肺）- 温阳固本·润肺益气
11. 松风听涛（金·肺）- 润肺养阴·宣肺利咽
12. 闻思静心（金·肺）- 宣肺开窍·醒神益智
13. 听泉水生（水·肾）- 滋阴降火·养心安神
14. 梅雪争春（水·肾）- 补肾固精·滋阴养血
15. 碧潭秋月（水·肾）- 益智强识·交通心肾

## 五行分析输出格式
[FiveElements:木=XX,火=XX,土=XX,金=XX,水=XX]

## 香方推荐输出格式
[Recipe:香方名称]

## 语气风格
- 温柔、耐心、专业
- 适当使用中医术语但要用通俗语言解释
- 可以用比喻和诗意语言
- 回复中不要使用emoji`

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function streamDeepSeek(messages, res) {
  const fullMessages = [{ role: 'system', content: SYSTEM_PROMPT }, ...messages]
  const body = JSON.stringify({
    model: 'deepseek-chat',
    messages: fullMessages,
    stream: true,
    temperature: 0.7,
    max_tokens: 1024,
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
        const { messages } = JSON.parse(data)
        if (!DEEPSEEK_API_KEY) {
          res.writeHead(500, { 'Content-Type': 'application/json', ...CORS })
          res.end(JSON.stringify({ error: 'API Key not configured' }))
          return
        }
        streamDeepSeek(messages, res)
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
