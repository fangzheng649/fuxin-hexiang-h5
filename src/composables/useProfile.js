import { ref, watch } from 'vue'

const PROFILE_KEY = 'fuxin_profile'
const MOOD_KEY = 'fuxin_moods'

const loadProfile = () => {
  try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}') }
  catch { return {} }
}

const loadMoods = () => {
  try { return JSON.parse(localStorage.getItem(MOOD_KEY) || '[]') }
  catch { return [] }
}

const savedProfile = loadProfile()
const profile = ref({
  nickname: savedProfile.nickname || '香友 · 小雅',
  constitution: savedProfile.constitution || '木型体质',
  tag: savedProfile.tag || '肝气偏盛',
  currentRecipe: savedProfile.currentRecipe || '竹影清风',
})

const moodHistory = ref(loadMoods())

watch(profile, (val) => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(val))
}, { deep: true })

watch(moodHistory, (val) => {
  localStorage.setItem(MOOD_KEY, JSON.stringify(val))
}, { deep: true })

export function useProfile() {
  const updateProfile = (updates) => {
    Object.assign(profile.value, updates)
  }

  const addMood = (score, note = '') => {
    const today = new Date()
    const dateStr = `${today.getMonth() + 1}/${today.getDate()}`
    moodHistory.value.push({ date: dateStr, score, note })
    if (moodHistory.value.length > 30) {
      moodHistory.value = moodHistory.value.slice(-30)
    }
  }

  const getRecentMoods = (days = 7) => {
    return moodHistory.value.slice(-days)
  }

  return { profile, moodHistory, updateProfile, addMood, getRecentMoods }
}
