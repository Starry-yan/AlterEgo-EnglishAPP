import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import AvatarCreation from './pages/AvatarCreation'
import SceneSelect from './pages/SceneSelect'
import Practice from './pages/Practice'
import Progress from './pages/Progress'
import Navbar from './components/Navbar'

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/avatar" element={<AvatarCreation />} />
          <Route path="/scenes" element={<SceneSelect />} />
          <Route path="/practice/:sceneId" element={<Practice />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App