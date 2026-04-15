// 语音识别服务 - 使用 Web Speech API
// 注意：此服务在 Chrome/Edge 浏览器中效果最佳

class SpeechRecognitionService {
  constructor() {
    this.recognition = null
    this.onResultCallback = null
    this.onErrorCallback = null
    this.isListening = false

    // 检查浏览器支持
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      this.recognition = new SpeechRecognition()
      this.recognition.continuous = true
      this.recognition.interimResults = true
      this.recognition.lang = 'en-US'

      this.recognition.onresult = (event) => {
        let finalTranscript = ''
        let interimTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        if (this.onResultCallback) {
          this.onResultCallback({ finalTranscript, interimTranscript })
        }
      }

      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        this.isListening = false
        if (this.onErrorCallback) {
          this.onErrorCallback(event.error)
        }
      }

      this.recognition.onend = () => {
        this.isListening = false
      }
    }
  }

  setOnResult(callback) {
    this.onResultCallback = callback
  }

  setOnError(callback) {
    this.onErrorCallback = callback
  }

  start() {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech Recognition not supported in this browser'))
        return
      }

      if (this.isListening) {
        resolve()
        return
      }

      try {
        this.recognition.start()
        this.isListening = true
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }

  stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
      this.isListening = false
    }
  }

  isSupported() {
    return !!this.recognition
  }
}

export default new SpeechRecognitionService()