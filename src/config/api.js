/**
 * API 配置
 */

export const API_CONFIG = {
  // API 基础地址
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  
  // 请求超时时间（毫秒）
  timeout: 30000,
  
  // 重试次数
  retries: 3,
  
  // 重试延迟（毫秒）
  retryDelay: 1000
};

// API 端点
export const API_ENDPOINTS = {
  // 用户相关
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/update',
    AVATAR: '/user/avatar'
  },
  
  // 场景相关
  SCENE: {
    LIST: '/scenes',
    DETAIL: '/scenes/:id',
    PROGRESS: '/scenes/:id/progress'
  },
  
  // 对话相关
  DIALOGUE: {
    START: '/dialogue/start',
    MESSAGE: '/dialogue/message',
    END: '/dialogue/end',
    HISTORY: '/dialogue/history'
  },
  
  // 进度相关
  PROGRESS: {
    DAILY: '/progress/daily',
    WEEKLY: '/progress/weekly',
    TOTAL: '/progress/total'
  },
  
  // AI 服务
  AI: {
    SPEECH_RECOGNITION: '/ai/speech/recognition',
    SPEECH_SYNTHESIS: '/ai/speech/synthesis',
    TEXT_GENERATION: '/ai/text/generation'
  }
};

export default {
  API_CONFIG,
  API_ENDPOINTS
};