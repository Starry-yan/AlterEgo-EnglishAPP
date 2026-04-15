import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      {/* Hero Section */}
      <div className="animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Alter Ego
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-4">
          英语口语实战 App
        </p>
        <p className="text-lg text-gray-400 mb-8 max-w-2xl">
          英语版的《模拟人生》—— 披着马甲的英语世界，允许犯错的乌托邦
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/avatar"
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
          >
            开始创建你的形象
          </Link>
          <Link
            to="/scenes"
            className="px-8 py-4 border-2 border-gray-600 rounded-full font-semibold text-lg hover:border-gray-400 hover:bg-gray-800 transition-all"
          >
            浏览场景
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl">
        <div className="p-6 bg-gray-800 rounded-xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="text-4xl mb-4">🎭</div>
          <h3 className="text-xl font-semibold mb-2">理想自我投射</h3>
          <p className="text-gray-400">创建你向往的形象，在安全的心理环境下练习</p>
        </div>
        <div className="p-6 bg-gray-800 rounded-xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="text-4xl mb-4">🌍</div>
          <h3 className="text-xl font-semibold mb-2">沉浸式场景</h3>
          <p className="text-gray-400">咖啡厅、机场、会议室，真实场景实战练习</p>
        </div>
        <div className="p-6 bg-gray-800 rounded-xl animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="text-4xl mb-4">🧠</div>
          <h3 className="text-xl font-semibold mb-2">思维矫正</h3>
          <p className="text-gray-400">切断中译英思维，建立英语直觉反应</p>
        </div>
      </div>
    </div>
  )
}