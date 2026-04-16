import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import storage from '../services/storage'

const PRESET_AVATARS = [
  {
    id: 'business',
    name: '商务精英',
    description: '自信、专业的商务形象',
    emoji: '💼',
    color: 'from-blue-500 to-blue-700'
  },
  {
    id: 'casual',
    name: '休闲达人',
    description: '轻松、友好的日常形象',
    emoji: '😎',
    color: 'from-green-500 to-green-700'
  },
  {
    id: 'creative',
    name: '创意达人',
    description: '活泼、有创造力的形象',
    emoji: '🎨',
    color: 'from-purple-500 to-purple-700'
  }
]

const VOICE_OPTIONS = [
  { id: 'confident-male', name: '自信男声', gender: 'male' },
  { id: 'gentle-female', name: '温柔女声', gender: 'female' },
  { id: 'energetic-young', name: '活力青年', gender: 'any' }
]

export default function AvatarCreation() {
  const navigate = useNavigate()
  const [selectedAvatar, setSelectedAvatar] = useState(null)
  const [selectedVoice, setSelectedVoice] = useState(null)
  const [nickname, setNickname] = useState('')

  const handleCreate = () => {
    if (!selectedAvatar || !selectedVoice || !nickname.trim()) {
      alert('请完成所有设置')
      return
    }

    const profile = {
      nickname: nickname.trim(),
      avatarId: selectedAvatar.id,
      avatarName: selectedAvatar.name,
      voiceId: selectedVoice.id,
      createdAt: Date.now()
    }

    storage.saveUserProfile(profile)
    navigate('/scenes')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">创建你的理想形象</h1>

      {/* 选择形象 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">选择形象</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PRESET_AVATARS.map((avatar) => (
            <div
              key={avatar.id}
              onClick={() => setSelectedAvatar(avatar)}
              className={`p-6 rounded-xl cursor-pointer transition-all ${
                selectedAvatar?.id === avatar.id
                  ? `bg-gradient-to-r ${avatar.color} ring-2 ring-white`
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <div className="text-5xl mb-3 text-center">{avatar.emoji}</div>
              <h3 className="font-semibold text-center mb-1">{avatar.name}</h3>
              <p className="text-sm text-gray-300 text-center">{avatar.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 选择语音 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">选择语音</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {VOICE_OPTIONS.map((voice) => (
            <div
              key={voice.id}
              onClick={() => setSelectedVoice(voice)}
              className={`p-4 rounded-xl cursor-pointer transition-all text-center ${
                selectedVoice?.id === voice.id
                  ? 'bg-blue-600 ring-2 ring-white'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <span className="text-2xl mr-2">
                {voice.gender === 'male' ? '👨' : voice.gender === 'female' ? '👩' : '🎤'}
              </span>
              {voice.name}
            </div>
          ))}
        </div>
      </div>

      {/* 输入昵称 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">给你的形象起个名字</h2>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="输入你的形象昵称"
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          maxLength={20}
        />
      </div>

      {/* 创建按钮 */}
      <button
        onClick={handleCreate}
        disabled={!selectedAvatar || !selectedVoice || !nickname.trim()}
        className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        开始我的英语之旅
      </button>
    </div>
  )
}