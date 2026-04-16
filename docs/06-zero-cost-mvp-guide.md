# Alter Ego 零成本 MVP 实现指南

> **版本：** v1.0  
> **日期：** 2026 年 4 月 15 日  
> **目标：** 使用完全免费的技术栈，4 周内完成 MVP 原型开发

---

## 一、零成本技术栈总览

### 1.1 成本对比表

| 项目 | 传统方案 | 零成本方案 | 月节省 |
|------|----------|------------|--------|
| 语音识别 | Azure/Google ($0.006/分钟) | **Web Speech API** | $50+ |
| 语音合成 | ElevenLabs ($5/月) | **Web Speech API** | $5+ |
| AI 对话 | GPT-4 ($0.03/1K tokens) | **Google Gemini API** | $30+ |
| 后端服务 | AWS/阿里云 ($50+/月) | **无后端设计** | $50+ |
| 部署托管 | VPS ($5-20/月) | **Vercel/GitHub Pages** | $10+ |
| **月成本** | **$150+** | **$0** | **$150+** |

### 1.2 核心技术选型

```
┌─────────────────────────────────────────────────────┐
│                   用户终端层                         │
│  (Web 浏览器 - Chrome/Edge/Safari)                   │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│                   前端应用层                         │
│  • React 18 + Vite (免费开源)                       │
│  • Web Speech API (浏览器原生，免费)                │
│  • Tailwind CSS (免费开源)                          │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│                   AI 服务层                          │
│  • Google Gemini API (免费 60 次/分钟)               │
│  • Web Speech STT (浏览器原生，免费)                │
│  • Web Speech TTS (浏览器原生，免费)                │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│                   数据存储层                         │
│  • localStorage (浏览器本地，免费)                  │
│  • Supabase (可选，免费额度 500MB)                   │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│                   部署托管层                         │
│  • Vercel (免费无限部署)                            │
│  • GitHub Pages (免费)                              │
└─────────────────────────────────────────────────────┘
```

---

## 二、MVP 功能清单（4 周完成）

### 2.1 核心功能（必须实现）

| 功能 | 优先级 | 实现方式 | 预计时间 |
|------|--------|----------|----------|
| **用户界面** | P0 | React + Tailwind CSS | 3 天 |
| **语音识别** | P0 | Web Speech API | 2 天 |
| **语音合成** | P0 | Web Speech API | 1 天 |
| **AI 对话** | P0 | Google Gemini API | 2 天 |
| **本地存储** | P0 | localStorage | 1 天 |
| **场景选择** | P1 | 2D 背景图 + 交互 | 2 天 |
| **虚拟形象** | P1 | DiceBear API | 1 天 |
| **进度追踪** | P1 | localStorage + 图表 | 2 天 |

### 2.2 增强功能（可选）

| 功能 | 优先级 | 实现方式 | 预计时间 |
|------|--------|----------|----------|
| 视觉提示系统 | P2 | CSS 动画 + 高亮 | 2 天 |
| 多场景支持 | P2 | 更多背景图 | 2 天 |
| 数据云端同步 | P2 | Supabase | 3 天 |
| PWA 支持 | P2 | Service Worker | 2 天 |

---

## 三、详细实现步骤

### 3.1 环境准备（第 1 天）

#### 步骤 1：安装 Node.js
```bash
# 访问 https://nodejs.org/ 下载并安装 LTS 版本
# 验证安装
node --version  # 应显示 v18+
npm --version   # 应显示 9+
```

#### 步骤 2：创建项目
```bash
# 使用 Vite 创建 React 项目
npm create vite@latest alter-ego -- --template react

# 进入项目目录
cd alter-ego

# 安装依赖
npm install

# 安装路由
npm install react-router-dom

# 安装 Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### 步骤 3：配置 Tailwind CSS
```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',
        secondary: '#10B981',
      },
    },
  },
  plugins: [],
}
```

### 3.2 核心服务实现（第 2-5 天）

#### 语音识别服务
```javascript
// src/services/speechRecognition.js

class SpeechRecognitionService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.onResult = null;
    this.onError = null;
    
    // 检查浏览器支持
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      this._setupListeners();
    }
  }
  
  _setupListeners() {
    this.recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      
      if (this.onResult) {
        this.onResult({ finalTranscript, interimTranscript });
      }
    };
    
    this.recognition.onerror = (event) => {
      if (this.onError) {
        this.onError(event.error);
      }
    };
    
    this.recognition.onend = () => {
      this.isListening = false;
    };
  }
  
  start() {
    if (!this.recognition) {
      throw new Error('Web Speech API not supported - 请使用 Chrome/Edge 浏览器');
    }
    this.recognition.start();
    this.isListening = true;
  }
  
  stop() {
    if (this.recognition) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
  
  setOnResult(callback) {
    this.onResult = callback;
  }
  
  setOnError(callback) {
    this.onError = callback;
  }
}

export default new SpeechRecognitionService();
```

#### 语音合成服务
```javascript
// src/services/speechSynthesis.js

class SpeechSynthesisService {
  constructor() {
    this.synthesis = window.speechSynthesis;
    this.voices = [];
    this.currentVoice = null;
    this._loadVoices();
  }
  
  _loadVoices() {
    this.voices = this.synthesis.getVoices();
    
    // 优先选择英文语音
    const englishVoices = this.voices.filter(voice => 
      voice.lang.startsWith('en')
    );
    
    if (englishVoices.length > 0) {
      this.currentVoice = englishVoices.find(voice => 
        voice.name.includes('Google') || voice.name.includes('Microsoft')
      ) || englishVoices[0];
    }
  }
  
  speak(text, options = {}) {
    return new Promise((resolve, reject) => {
      if (!text || !text.trim()) {
        resolve();
        return;
      }
      
      if (this.voices.length === 0) {
        this._loadVoices();
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      if (this.currentVoice) {
        utterance.voice = this.currentVoice;
      }
      if (options.rate) utterance.rate = options.rate;
      if (options.pitch) utterance.pitch = options.pitch;
      if (options.volume) utterance.volume = options.volume;
      
      utterance.onend = () => resolve();
      utterance.onerror = (error) => reject(error);
      
      this.synthesis.speak(utterance);
    });
  }
  
  cancel() {
    this.synthesis.cancel();
  }
  
  getVoices() {
    return this.voices;
  }
}

export default new SpeechSynthesisService();
```

#### AI 对话服务
```javascript
// src/services/aiDialogue.js

// 从环境变量获取 API Key
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

class AIDialogueService {
  constructor() {
    this.conversationHistory = [];
    this.sceneContext = null;
  }
  
  setSceneContext(scene) {
    this.sceneContext = scene;
    this._initializeSystemPrompt();
  }
  
  _initializeSystemPrompt() {
    const systemPrompt = this._buildSystemPrompt();
    this.conversationHistory = [
      {
        role: 'user',
        parts: [{ text: systemPrompt }]
      },
      {
        role: 'model',
        parts: [{ text: 'Understood. I am ready to help you practice English.' }]
      }
    ];
  }
  
  _buildSystemPrompt() {
    return `
You are an English conversation partner helping users practice speaking English.
Current scene: ${this.sceneContext?.name || 'General Conversation'}
Scene description: ${this.sceneContext?.description || 'A casual conversation'}

IMPORTANT RULES:
1. Use the "Recast Method" (重述法): If the user makes a mistake, naturally repeat with the correct form without explicitly saying "you are wrong".
   - User: "I go store yesterday"
   - You: "Oh, you went to the store? What did you buy?"

2. Keep your responses natural and conversational, not too long (2-3 sentences max).

3. Ask follow-up questions to keep the conversation going.

4. Be encouraging and supportive. Never criticize or make the user feel bad about mistakes.

5. Respond only in English.

6. If the user seems stuck, provide gentle hints or ask simpler questions.

Let's start the conversation naturally!
    `.trim();
  }
  
  async sendMessage(userMessage) {
    // 添加用户消息到历史
    this.conversationHistory.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });
    
    // 限制历史长度
    if (this.conversationHistory.length > 20) {
      this.conversationHistory = this.conversationHistory.slice(-20);
    }
    
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: this.conversationHistory,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (aiResponse) {
        this.conversationHistory.push({
          role: 'model',
          parts: [{ text: aiResponse }]
        });
      }
      
      return aiResponse;
    } catch (error) {
      console.error('AI dialogue error:', error);
      throw error;
    }
  }
  
  resetConversation() {
    this.conversationHistory = [];
    this._initializeSystemPrompt();
  }
  
  getHistory() {
    return this.conversationHistory;
  }
}

export default new AIDialogueService();
```

### 3.3 获取 Google Gemini API Key（免费）

```bash
# 步骤 1: 访问 Google AI Studio
# https://aistudio.google.com/

# 步骤 2: 登录 Google 账号

# 步骤 3: 创建 API Key
# - 点击 "Get API Key"
# - 选择 "Create API Key"
# - 复制 API Key

# 步骤 4: 创建 .env 文件
# 在项目根目录创建 .env 文件
VITE_GEMINI_API_KEY=your_api_key_here
```

**免费额度说明：**
- 60 次请求/分钟
- 1500 次请求/天
- MVP 测试阶段完全够用

### 3.4 页面组件实现（第 6-10 天）

#### 首页
```jsx
// src/pages/Home.jsx
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
      <div className="text-center text-white p-8">
        <h1 className="text-5xl font-bold mb-4">Alter Ego</h1>
        <p className="text-xl mb-8">英语版的《模拟人生》——披着马甲的英语世界</p>
        <Link 
          to="/avatar"
          className="bg-white text-indigo-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-opacity-90 transition"
        >
          开始你的旅程
        </Link>
      </div>
    </div>
  );
}
```

#### 虚拟形象创建
```jsx
// src/pages/AvatarCreation.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveUserProfile } from '../services/storage';

const AVATAR_PRESETS = [
  { id: 'professional', name: '商务精英', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=professional&style=avataaars' },
  { id: 'casual', name: '休闲达人', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=casual&style=avataaars' },
  { id: 'creative', name: '创意先锋', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=creative&style=avataaars' },
];

export default function AvatarCreation() {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [name, setName] = useState('');
  const navigate = useNavigate();
  
  const handleStart = () => {
    if (selectedAvatar && name) {
      saveUserProfile({ name, avatar: selectedAvatar });
      navigate('/scenes');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">创建你的虚拟形象</h1>
        
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            你的名字
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="输入你的名字"
          />
        </div>
        
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            选择形象
          </label>
          <div className="grid grid-cols-3 gap-4">
            {AVATAR_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setSelectedAvatar(preset)}
                className={`p-4 border-2 rounded-lg ${
                  selectedAvatar?.id === preset.id ? 'border-indigo-500' : 'border-gray-200'
                }`}
              >
                <img src={preset.url} alt={preset.name} className="w-24 h-24 mx-auto mb-2" />
                <p className="text-sm">{preset.name}</p>
              </button>
            ))}
          </div>
        </div>
        
        <button
          onClick={handleStart}
          disabled={!selectedAvatar || !name}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
        >
          开始练习