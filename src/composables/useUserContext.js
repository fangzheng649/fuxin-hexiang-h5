// 用户上下文组装 — 将 profile + 季节 + 情绪组合成 API 请求的 userContext

import { useProfile } from './useProfile.js'
import { getCurrentSeason } from './useSeason.js'

export function useUserContext() {
  const { profile, getRecentMoods } = useProfile()

  function buildUserContext() {
    const season = getCurrentSeason()
    const recentMoods = getRecentMoods(7)

    return {
      nickname: profile.value.nickname || '香友',
      constitution: profile.value.constitution || '',
      tag: profile.value.tag || '',
      currentRecipe: profile.value.currentRecipe || '',
      currentSeason: {
        season: season.season,
        element: season.element,
        organ: season.organ,
        healthTip: season.healthTip,
      },
      recentMoods: recentMoods.map(m => ({ date: m.date, score: m.score })),
    }
  }

  return { buildUserContext }
}
