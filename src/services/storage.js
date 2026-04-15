const STORAGE_KEYS = {
  PROFILE: 'alterEgo_profile',
  SCENE_PROGRESS: 'alterEgo_sceneProgress',
  SCENE_HISTORY: 'alterEgo_sceneHistory_',
  STUCK_ECHOES: 'alterEgo_stuckEchoes',
  SETTINGS: 'alterEgo_settings'
}

const defaultSettings = {
  autoPlayAI: true,
  hintMode: 'quick',
  language: 'zh-CN'
}

export default {
  // 用户资料
  getUserProfile() {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILE)
    return data ? JSON.parse(data) : null
  },

  saveUserProfile(profile) {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile))
  },

  // 场景进度
  getSceneProgress() {
    const data = localStorage.getItem(STORAGE_KEYS.SCENE_PROGRESS)
    return data ? JSON.parse(data) : {}
  },

  saveSceneProgress(sceneId, progress) {
    const progressData = this.getSceneProgress()
    progressData[sceneId] = progress
    localStorage.setItem(STORAGE_KEYS.SCENE_PROGRESS, JSON.stringify(progressData))
  },

  // 场景历史对话
  getSceneHistory(sceneId) {
    const data = localStorage.getItem(STORAGE_KEYS.SCENE_HISTORY + sceneId)
    return data ? JSON.parse(data) : []
  },

  saveSceneHistory(sceneId, messages) {
    localStorage.setItem(
      STORAGE_KEYS.SCENE_HISTORY + sceneId,
      JSON.stringify(messages)
    )
  },

  // 卡顿遗迹
  getStuckEchoes() {
    const data = localStorage.getItem(STORAGE_KEYS.STUCK_ECHOES)
    return data ? JSON.parse(data) : []
  },

  saveStuckEcho(echo) {
    const echoes = this.getStuckEchoes()
    echoes.push({
      ...echo,
      timestamp: Date.now()
    })
    localStorage.setItem(STORAGE_KEYS.STUCK_ECHOES, JSON.stringify(echoes))
  },

  // 设置
  getSettings() {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS)
    return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings
  },

  saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
  },

  // 清除所有数据
  clearAll() {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
  }
}