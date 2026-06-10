// Cloudflare Pages Function — DeepSeek API 代理
// 隐藏 API Key，转发 SSE 流式响应

const SYSTEM_PROMPT = `你是「抚心合香」的AI配香助手，一位精通中医五行学说与合香技艺的老中医。你的职责是引导用户通过情绪表达找到最适合的冷凝合香。

## 你的流程
1. 先安抚用户情绪，让用户放松
2. 询问用户近期的情绪状态
3. 根据用户描述进行追问（睡眠、食欲、精神等方面）
4. 进行五行体质分析
5. 推荐最匹配的香方

## 你只能推荐以下5种香方
1. 竹影清风（火·心）- 清心降火·安神定志，适合心烦失眠、焦虑易怒者
2. 春风拂柳（木·肝）- 疏肝解郁·理气和中，适合情绪低落、胸胁胀满者
3. 听泉水生（水·肾）- 滋阴降火·养心安神，适合入睡困难、多梦易醒者
4. 稻香归田（土·脾）- 健脾化湿·和中安神，适合疲倦乏力、食欲不振者
5. 霜菊傲骨（金·肺）- 温阳固本·润肺益气，适合气短乏力、易感冒者

## 五行分析输出格式
在分析完体质后，输出标记：
[FiveElements:木=XX,火=XX,土=XX,金=XX,水=XX]
数值为0-100的百分比

## 香方推荐输出格式
在推荐香方时，输出标记：
[Recipe:香方名称]

## 语气风格
- 温柔、耐心、专业
- 适当使用中医术语但要用通俗语言解释
- 可以用比喻和诗意语言
- 回复中不要使用emoji`

// CORS 头
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function onRequestOptions() {
  return new Response(null, { status: 200, headers: corsHeaders })
}

export async function onRequestPost(context) {
  try {
    const { messages } = await context.request.json()
    const apiKey = context.env.DEEPSEEK_API_KEY

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API Key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    const fullMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages,
    ]

    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: fullMessages,
        stream: true,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      return new Response(JSON.stringify({ error: errText }), {
        status: res.status,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    return new Response(res.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        ...corsHeaders,
      },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  }
}
