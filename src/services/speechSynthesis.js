// 语音合成服务 - 使用 Web Speech API
// 注意：此服务在 Chrome/Edge/Safari 浏览器中效果最佳

class SpeechSynthesisService {
  constructor() {
    this.synthesis = window.speechSynthesis
    this.currentUtterance = null
    this.isSpeaking = false
  }

  // 获取可用的语音列表
  getVoices() {
    return this.synthesis.getVoices().filter(voice => {
      // 优先选择英语语音
      return voice.lang.startsWith('en')
    })
  }

  // 选择最佳英语语音
  getBestVoice() {
    const voices = this.getVoices()
    
    // 优先选择高质量的英语语音
    const priorityVoices = [
      'Google US English',
      'Google UK English Male',
      'Google UK English Female',
      'Microsoft David',
      'Microsoft Zira'
    ]

    for (const name of priorityVoices) {
      const voice = voices.find(v => v.name.includes(name))
      if (voice) return voice
    }

    // 如果没有匹配的，返回第一个英语语音
    return voices[0] || null
  }

  // 说话
  speak(text, options = {}) {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Speech Synthesis not supported in this browser'))
        return
      }

      // 取消当前正在播放的语音
      this.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      const voice = this.getBestVoice()
      
      if (voice) {
        utterance.voice = voice
      }

      // 设置语音参数
      utterance.rate = options.rate || 1
      utterance.pitch = options.pitch || 1
      utterance.volume = options.volume !== undefined ? options.volume : 1

      // 设置语言
      utterance.lang = options.lang || 'en-US'

      utterance.onstart = () => {
        this.isSpeaking = true
        this.currentUtterance = utterance
      }

      utterance.onend = () => {
        this.isSpeaking = false
        this.currentUtterance = null
        resolve()
      }

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event)
        this.isSpeaking = false
        this.currentUtterance = null
        // 某些错误不应该 reject，比如用户取消
        if (event.error !== 'canceled') {
          reject(event)
        } else {
          resolve()
        }
      }

      this.synthesis.speak(utterance)
    })
  }

  // 取消当前说话
  cancel() {
    if (this.isSpeaking && this.synthesis) {
      this.synthesis.cancel()
      this.isSpeaking = false
      this.currentUtterance = null
    }
  }

  // 暂停
  pause() {
    if (this.isSpeaking && this.synthesis) {
      this.synthesis.pause()
    }
  }

  // 恢复
  resume() {
    if (this.synthesis && this.synthesis.paused) {
      this.synthesis.resume()
    }
  }

  // 是否正在说话
  isSpeaking() {
    return this.isSpeaking
  }

  // 检查是否支持
  isSupported() {
    return !!this.synthesis
  }
}

export default new SpeechSynthesisService()