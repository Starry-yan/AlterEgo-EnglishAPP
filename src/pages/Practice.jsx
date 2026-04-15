import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import speechRecognition from '../services/speechRecognition'
import speechSynthesis from '../services/speechSynthesis'
import aiDialogue from '../services/aiDialogue'
import storage from '../services/storage'

const SCENE_CONFIGS = {
  cafe: {
    name: '咖啡厅',
    description: '在咖啡厅练习点单',
    background: 'bg-gradient-to-b from-amber-900 to-amber-950'
  },
  office: {
    name: '办公室',
    description: '商务会议场景',
    background: 'bg-gradient-to-b from-slate-800 to-slate-950'
  },
  airport: {
    name: '机场',
    description: '办理登机手续',
    background: 'bg-gradient-to-b from-blue-900 to-blue-950'
  },
  hotel: {
    name: '酒店',
    description: '前台入住',
    background: 'bg-gradient-to-b from-amber-800 to-amber-950'
  },
  restaurant: {
    name: '餐厅',
    description: '点餐交流',
    background: 'bg-gradient-to-b from-orange-800 to-orange-950'
  },
  hospital: {
    name: '医院',
    description: '就医问诊',
    background: 'bg-gradient-to-b from-teal-800 to-teal-950'
  }
}

export default function Practice() {
  const { sceneId } = useParams()
  const navigate = useNavigate()
  const sceneConfig = SCENE_CONFIGS[sceneId] || SCENE_CONFIGS.cafe

  const [messages, setMessages] = useState([])
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [hintMode, setHintMode] = useState('quick') // 'quick' or 'deep'
  const [showHint, setShowHint] = useState(false)
  const [hintLevel, setHintLevel] = useState(0) // 0: none, 1: audio, 2: visual, 3: text
  const [silenceTimer, setSilenceTimer] = useState(null)
  const [aiResponse, setAiResponse] = useState('')

  const messagesEndRef = useRef(null)
  const silenceTimeoutRef = useRef(null)

  // 初始化场景
  useEffect(() => {
    const scene = {
      id: sceneId,
      name: sceneConfig.name,
      description: sceneConfig.description
    }
    aiDialogue.setSceneContext(scene)

    // 加载历史对话
    const history = storage.getSceneHistory(sceneId)
    if (history.length > 0) {
      setMessages(history)
      setAiResponse(history[history.length - 1]?.aiResponse || '')
    } else {
      // 开始新对话，AI 先打招呼
      startAiGreeting(scene)
    }

    // 设置语音识别回调
    speechRecognition.setOnResult(handleSpeechResult)
    speechRecognition.setOnError(handleSpeechError)

    return () => {
      clearTimeout(silenceTimeoutRef.current)
      speechRecognition.stop()
    }
  }, [sceneId])

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const startAiGreeting = async (scene) => {
    setIsProcessing(true)
    try {
      const greeting = await aiDialogue.sendMessage(`Start a natural conversation in ${scene.name} scene. You are the AI partner, say hello first.`)
      setAiResponse(greeting)
      setMessages([{
        role: 'ai',
        text: greeting,
        timestamp: Date.now()
      }])
      storage.saveSceneHistory(sceneId, [{
        role: 'ai',
        text: greeting,
        timestamp: Date.now()
      }])
      
      // 播放 AI 语音
      const settings = storage.getSettings()
      if (settings.autoPlayAI) {
        await speechSynthesis.speak(greeting)
      }
    } catch (error) {
      console.error('Greeting error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSpeechResult = ({ finalTranscript, interimTranscript }) => {
    if (finalTranscript) {
      setTranscript(finalTranscript)
      resetSilenceTimer()
    }
    setTranscript(interimTranscript || finalTranscript)
  }

  const handleSpeechError = (error) => {
    console.error('Speech recognition error:', error)
    setIsListening(false)
  }

  const resetSilenceTimer = () => {
    clearTimeout(silenceTimeoutRef.current)
    setHintLevel(0)
    setShowHint(false)

    // 设置新的沉默计时器
    silenceTimeoutRef.current = setTimeout(() => {
      handleSilence()
    }, hintMode === 'quick' ? 5000 : 10000)
  }

  const handleSilence = () => {
    setShowHint(true)
    setHintLevel(1)
    
    // 提示用户继续
    const hint = "Still thinking? Try to continue..."
    speechSynthesis.speak(hint, { rate: 0.8 })
  }

  const handleRecordToggle = async () => {
    if (isListening) {
      speechRecognition.stop()
      setIsListening(false)
      
      // 发送转录的文本
      if (transcript.trim()) {
        await sendMessage(transcript)
        setTranscript('')
      }
    } else {
      try {
        speechRecognition.start()
        setIsListening(true)
        resetSilenceTimer()
      } catch (error) {
        console.error('Failed to start speech recognition:', error)
      }
    }
  }

  const sendMessage = async (text) => {
    if (!text.trim() || isProcessing) return

    setIsProcessing(true)
    setShowHint(false)
    setHintLevel(0)

    // 添加用户消息
    const userMessage = {
      role: 'user',
      text,
      timestamp: Date.now()
    }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)

    try {
      // 调用 AI
      const response = await aiDialogue.sendMessage(text)
      setAiResponse(response)

      const aiMessage = {
        role: 'ai',
        text: response,
        timestamp: Date.now()
      }
      const finalMessages = [...newMessages, aiMessage]
      setMessages(finalMessages)

      // 保存历史
      storage.saveSceneHistory(sceneId, finalMessages)
      
      // 更新进度
      const progress = storage.getSceneProgress()[sceneId] || { completion: 0, messageCount: 0 }
      const newProgress = {
        ...progress,
        messageCount: progress.messageCount + 2,
        completion: Math.min(100, Math.floor((progress.messageCount + 2) / 20 * 100))
      }
      storage.saveSceneProgress(sceneId, newProgress)

      // 播放 AI 语音
      const settings = storage.getSettings()
      if (settings.autoPlayAI) {
        await speechSynthesis.speak(response)
      }
    } catch (error) {
      console.error('Send message error:', error)
    } finally {
      setIsProcessing(false)
      setTranscript('')
    }
  }

  const handleNextHintLevel = () => {
    setHintLevel(prev => {
      const newLevel = prev + 1
      if (newLevel === 1) {
        speechSynthesis.speak("Try to say something...", { rate: 0.7 })
      } else if (newLevel === 2) {
        setShowHint(true)
      } else if (newLevel >= 3) {
        setShowHint(false)
      }
      return newLevel
    })
  }

  const handleExit = () => {
    speechRecognition.stop()
    speechSynthesis.cancel()
    navigate('/scenes')
  }

  return (
    <div className={`min-h-screen ${sceneConfig.background}`}>
      {/* 顶部导航 */}
      <div className="flex items-center justify-between p-4 bg-black bg-opacity-30">
        <button
          onClick={handleExit}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
        >
          ← 返回
        </button>
        <div className="text-center">
          <h2 className="text-xl font-semibold">{sceneConfig.name}</h2>
          <p className="text-sm text-gray-400">{sceneConfig.description}</p>
        </div>
        <button
          onClick={() => setHintMode(hintMode === 'quick' ? 'deep' : 'quick')}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
        >
          {hintMode === 'quick' ? '快捷模式' : '深度模式'}
        </button>
      </div>

      {/* 消息区域 */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-100'
                }`}
              >
                <p className="text-sm mb-1">
                  {msg.role === 'user' ? 'You' : 'AI Partner'}
                </p>
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
          
          {/* 正在输入 */}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-gray-800 p-4 rounded-2xl">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          {/* 转录中 */}
          {transcript && (
            <div className="flex justify-end">
              <div className="max-w-[80%] p-4 rounded-2xl bg-blue-600 bg-opacity-50 text-white">
                <p className="text-sm mb-1">You (typing...)</p>
                <p className="italic">{transcript}</p>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 提示区域 */}
      {showHint && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-gray-800 p-6 rounded-xl shadow-2xl text-center">
            <p className="text-lg mb-4">卡住了？试试这些提示：</p>
            <button
              onClick={handleNextHintLevel}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              {hintLevel === 0 && '获取提示'}
              {hintLevel === 1 && '显示关键词'}
              {hintLevel === 2 && '显示翻译'}
              {hintLevel >= 3 && '继续对话'}
            </button>
          </div>
        </div>
      )}

      {/* 底部控制栏 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
        <div className="max-w-3xl mx-auto flex items-center justify-center space-x-4">
          {/* 录音按钮 */}
          <button
            onClick={handleRecordToggle}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
              isListening
                ? 'bg-red-500 animate-pulse'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isListening ? (
              <div className="w-6 h-6 bg-white rounded" />
            ) : (
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )}
          </button>
          
          <span className="text-white text-sm">
            {isListening ? '正在录音...' : '长按说话'}
          </span>
        </div>
      </div>
    </div>
  )
}