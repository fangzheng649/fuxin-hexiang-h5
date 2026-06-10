// 季节工具 — 根据日期判断当前节气、对应五行和脏腑

const SEASON_MAP = [
  { startMonth: 2, startDay: 3, endMonth: 5, endDay: 5, season: '春', element: '木', organ: '肝', healthTip: '春养肝——宜疏肝助阳，调畅情志' },
  { startMonth: 5, startDay: 6, endMonth: 8, endDay: 7, season: '夏', element: '火', organ: '心', healthTip: '夏养心——宜清心降火，安神定志' },
  { startMonth: 8, startDay: 8, endMonth: 9, endDay: 22, season: '长夏', element: '土', organ: '脾', healthTip: '长夏养脾——宜健脾化湿，和中安神' },
  { startMonth: 9, startDay: 23, endMonth: 11, endDay: 21, season: '秋', element: '金', organ: '肺', healthTip: '秋养肺——宜润肺养阴，宣肺益气' },
  { startMonth: 11, startDay: 22, endMonth: 2, endDay: 2, season: '冬', element: '水', organ: '肾', healthTip: '冬养肾——宜补肾藏精，滋阴降火' },
]

function dateInRange(month, day, startMonth, startDay, endMonth, endDay) {
  // 处理跨年（冬：11/22 - 2/2）
  if (startMonth > endMonth) {
    return (month > startMonth || (month === startMonth && day >= startDay)) ||
           (month < endMonth || (month === endMonth && day <= endDay))
  }
  return (month > startMonth || (month === startMonth && day >= startDay)) &&
         (month < endMonth || (month === endMonth && day <= endDay))
}

export function getCurrentSeason(date = new Date()) {
  const month = date.getMonth() + 1
  const day = date.getDate()

  for (const s of SEASON_MAP) {
    if (dateInRange(month, day, s.startMonth, s.startDay, s.endMonth, s.endDay)) {
      return { season: s.season, element: s.element, organ: s.organ, healthTip: s.healthTip }
    }
  }

  // fallback
  return { season: '夏', element: '火', organ: '心', healthTip: '夏养心——宜清心降火，安神定志' }
}

// 季节问候语
export function getSeasonGreeting(season) {
  const greetings = {
    '春': '春日已至，万物生发。春天是肝气最活跃的时节，你的心情也如这季节一般，需要舒展和释放。',
    '夏': '夏至将至，心火渐旺。炎炎夏日容易扰动心神，不妨让我们一起找到属于你的那份清凉。',
    '长夏': '长夏时节，湿气缠绵。这段时日人容易困倦乏力，脾胃需要格外呵护。',
    '秋': '秋风送爽，金气肃降。秋季肺气当令，天高气爽却也易生悲凉之感。',
    '冬': '冬日已深，万物闭藏。寒意中肾气潜藏，正是养精蓄锐的好时节。',
  }
  return greetings[season] || greetings['夏']
}
