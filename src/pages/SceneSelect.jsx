import { Link } from 'react-router-dom'
import storage from '../services/storage'

const SCENES = [
  {
    id: 'cafe',
    name: '咖啡厅',
    description: '在温馨的咖啡厅练习点单和日常对话',
    emoji: '☕',
    difficulty: 2,
    icon: '🏪'
  },
  {
    id: 'office',
    name: '办公室',
    description: '商务场景，练习工作会议和同事交流',
    emoji: '💼',
    difficulty: 3,
    icon: '🏢'
  },
  {
    id: 'airport',
    name: '机场',
    description: '旅行场景，练习问路和办理手续',
    emoji: '✈️',
    difficulty: 4,
    icon: '🛫'
  },
  {
    id: 'hotel',
    name: '酒店',
    description: '入住酒店，练习前台沟通和房间服务',
    emoji: '🏨',
    difficulty: 3,
    icon: '🛎️'
  },
  {
    id: 'restaurant',
    name: '餐厅',
    description: '点餐和用餐交流',
    emoji: '🍽️',
    difficulty: 2,
    icon: '🍴'
  },
  {
    id: 'hospital',
    name: '医院',
    description: '就医场景，练习描述症状和问诊',
    emoji: '🏥',
    difficulty: 5,
    icon: '🩺'
  }
]

export default function SceneSelect() {
  const sceneProgress = storage.getSceneProgress()

  const getDifficultyStars = (level) => {
    return '★'.repeat(level) + '☆'.repeat(5 - level)
  }

  const getProgress = (sceneId) => {
    return sceneProgress[sceneId]?.completion || 0
  }

  const isLocked = (sceneId) => {
    // 简单解锁逻辑：咖啡厅和餐厅始终可用，其他需要完成前一个场景
    const unlockOrder = ['cafe', 'restaurant', 'office', 'hotel', 'airport', 'hospital']
    const currentIndex = unlockOrder.indexOf(sceneId)
    if (currentIndex <= 1) return false // 前两个场景始终可用
    
    // 检查前一个场景是否完成
    const prevScene = unlockOrder[currentIndex - 1]
    return getProgress(prevScene) < 50
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">选择练习场景</h1>
      <p className="text-gray-400 text-center mb-8">
        选择一个场景开始你的英语实战练习
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SCENES.map((scene) => {
          const progress = getProgress(scene.id)
          const locked = isLocked(scene.id)

          return (
            <div
              key={scene.id}
              className={`relative p-6 rounded-xl transition-all ${
                locked
                  ? 'bg-gray-800 opacity-60'
                  : 'bg-gray-800 hover:bg-gray-750 hover:scale-105 cursor-pointer'
              }`}
            >
              {locked && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 rounded-xl z-10">
                  <span className="text-4xl">🔒</span>
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div className="text-5xl">{scene.icon}</div>
                {progress > 0 && (
                  <div className="text-sm text-gray-400">
                    {progress}% 完成
                  </div>
                )}
              </div>

              <h3 className="text-xl font-semibold mb-2">{scene.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{scene.description}</p>

              <div className="flex items-center justify-between">
                <span className="text-yellow-400 text-sm">
                  {getDifficultyStars(scene.difficulty)}
                </span>
                
                {!locked && progress >= 100 && (
                  <span className="text-green-400 text-sm">✓ 已完成</span>
                )}
              </div>

              {!locked && (
                <Link
                  to={`/practice/${scene.id}`}
                  className="mt-4 block w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-center transition-colors"
                >
                  {progress > 0 ? '继续练习' : '开始练习'}
                </Link>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}