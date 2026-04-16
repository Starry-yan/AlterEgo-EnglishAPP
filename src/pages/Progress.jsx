import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import storage from '../services/storage'

export default function Progress() {
  const [profile, setProfile] = useState(null)
  const [sceneProgress, setSceneProgress] = useState({})
  const [stuckEchoes, setStuckEchoes] = useState([])

  useEffect(() => {
    const userProfile = storage.getUserProfile()
    const progress = storage.getSceneProgress()
    const echoes = storage.getStuckEchoes()

    setProfile(userProfile)
    setSceneProgress(progress)
    setStuckEchoes(echoes)
  }, [])

  const totalMessages = Object.values(sceneProgress).reduce(
    (sum, p) => sum + (p.messageCount || 0),
    0
  )

  const totalEchoes = stuckEchoes.length

  const completedScenes = Object.entries(sceneProgress).filter(
    ([_, p]) => p.completion >= 100
  ).length

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">学习进度</h1>

      {/* 用户信息 */}
      {profile && (
        <div className="mb-8 p-6 bg-gray-800 rounded-xl">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-3xl">
              {profile.avatarName === '商务精英' ? '💼' : 
               profile.avatarName === '休闲达人' ? '😎' : '🎨'}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{profile.nickname}</h2>
              <p className="text-gray-400">{profile.avatarName}</p>
            </div>
          </div>
        </div>
      )}

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-gray-800 rounded-xl text-center">
          <div className="text-4xl mb-2">💬</div>
          <div className="text-3xl font-bold text-blue-400">{totalMessages}</div>
          <div className="text-gray-400">总对话数</div>
        </div>
        <div className="p-6 bg-gray-800 rounded-xl text-center">
          <div className="text-4xl mb-2">✅</div>
          <div className="text-3xl font-bold text-green-400">{completedScenes}</div>
          <div className="text-gray-400">已完成场景</div>
        </div>
        <div className="p-6 bg-gray-800 rounded-xl text-center">
          <div className="text-4xl mb-2">🧠</div>
          <div className="text-3xl font-bold text-purple-400">{totalEchoes}</div>
          <div className="text-gray-400">卡顿遗迹</div>
        </div>
      </div>

      {/* 场景进度 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">场景进度</h2>
        <div className="space-y-4">
          {Object.entries(sceneProgress).map(([sceneId, progress]) => (
            <div key={sceneId} className="p-4 bg-gray-800 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold capitalize">{sceneId}</span>
                <span className="text-gray-400">{progress.completion || 0}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${progress.completion || 0}%` }}
                />
              </div>
              <div className="mt-2 text-sm text-gray-400">
                {progress.messageCount || 0} 次对话
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 卡顿遗迹 */}
      {stuckEchoes.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">卡顿遗迹（需要复习）</h2>
          <div className="space-y-2">
            {stuckEchoes.slice(-10).reverse().map((echo, index) => (
              <div key={index} className="p-3 bg-gray-800 rounded-lg">
                <div className="text-sm text-gray-400">
                  {new Date(echo.timestamp).toLocaleString()}
                </div>
                <div className="mt-1">{echo.context || '无上下文'}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 继续学习 */}
      <Link
        to="/scenes"
        className="block w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-center font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
      >
        继续学习
      </Link>
    </div>
  )
}