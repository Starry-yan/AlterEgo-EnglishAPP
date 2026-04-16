# 技术架构文档

## Alter Ego 技术实现方案

---

## 一、技术选型

### 1.1 前端技术栈（MVP 阶段 - 完全免费）

| 技术 | 用途 | 说明 |
|------|------|------|
| **React 18** | UI 框架 | 组件化开发，生态丰富 |
| **Vite** | 构建工具 | 快速开发，热更新 |
| **Tailwind CSS** | 样式方案 | 原子化 CSS，快速开发 |
| **Web Speech API** | 语音服务 | 浏览器原生支持，完全免费 |

### 1.2 AI 服务（MVP 阶段 - 完全免费）

| 服务 | 用途 | 免费额度 |
|------|------|----------|
| **Google Gemini API** | AI 对话 | 60 次/分钟，免费 |
| **Web Speech API (STT)** | 语音识别 | 浏览器原生，免费 |
| **Web Speech API (TTS)** | 语音合成 | 浏览器原生，免费 |

### 1.3 数据存储（MVP 阶段）

| 方案 | 用途 | 说明 |
|------|------|------|
| **localStorage** | 本地存储 | MVP 阶段，无需后端 |
| **Supabase** | 云端存储 | 未来扩展，免费额度充足 |

### 1.4 部署方案（完全免费）

| 平台 | 用途 | 免费额度 |
|------|------|----------|
| **Vercel** | 静态网站托管 | 无限免费部署 |
| **GitHub Pages** | 备用托管 | 完全免费 |

---

## 二、系统架构

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────────┐
│                   用户终端层                         │
│  (Web / iOS / Android)                              │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│                   前端应用层                         │
│  • React 18 + Vite                                   │
│  • Web Speech API (STT/TTS)                         │
│  • Tailwind CSS                                      │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│                   AI 服务层                          │
│  • Google Gemini API (对话)                         │
│  • Web Speech API (语音识别)                        │
│  • Web Speech API (语音合成)                        │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│                   数据存储层                         │
│  • localStorage (MVP)                               │
│  • Supabase (未来扩展)                              │
└─────────────────────────────────────────────────────┘
```

### 2.2 核心模块设计

#### 模块 1：语音识别模块 (Speech Recognition)

```javascript
// src/services/speechRecognition.js

class SpeechRecognitionService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.onResult = null;
    this.onError = null;
    
    // 初始化 Web Speech API
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
      throw new Error('Web Speech API not supported');
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

#### 模块 2：语音合成模块 (Text-to-Speech)

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
      // 选择质量较好的语音
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
      
      // 加载最新语音列表
      if (this.voices.length === 0) {
        this._loadVoices();
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // 应用选项
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
  
  pause() {
    this.synthesis.pause();
  }
  
  resume() {
    this.synthesis.resume();
  }
  
  getVoices() {
    return this.voices;
  }
}

export default new SpeechSynthesisService();
```

#### 模块 3：AI 对话模块 (Gemini API)

```javascript
// src/services/aiDialogue.js

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

class AIDialogueService {
  constructor() {
    this.conversationHistory = [];
    this.sceneContext = null;
  }
  
  /**
   * 设置场景上下文
   */
  setSceneContext(scene) {
    this.sceneContext = scene;
    this._initializeSystemPrompt();
  }
  
  /**
   * 初始化系统提示词
   */
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
  
  /**
   * 构建系统提示词
   */
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
  
  /**
   * 发送消息并获取回复
   */
  async sendMessage(userMessage) {
    // 添加用户消息到历史
    this.conversationHistory.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });
    
    // 限制历史长度（保持最近 10 轮对话）
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
        // 添加 AI 回复到历史
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
  
  /**
   * 重置对话历史
   */
  resetConversation() {
    this.conversationHistory = [];
    this._initializeSystemPrompt();
  }
  
  /**
   * 获取对话历史
   */
  getHistory() {
    return this.conversationHistory;
  }
}

export default new AIDialogueService();
```

#### 模块 4：本地存储模块

```javascript
// src/services/storage.js

const STORAGE_KEYS = {
  USER_PROFILE: 'alterEgo_userProfile',
  CONVERSATION_HISTORY: 'alterEgo_conversationHistory',
  SCENE_PROGRESS: 'alterEgo_sceneProgress',
  SETTINGS: 'alterEgo_settings',
  STUCK_ECHOES: 'alterEgo_stuckEchoes', // 卡顿遗迹
};

class StorageService {
  /**
   * 保存用户资料
   */
  saveUserProfile(profile) {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  }
  
  /**
   * 获取用户资料
   */
  getUserProfile() {
    const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return data ? JSON.parse(data) : null;
  }
  
  /**
   * 保存对话历史
   */
  saveConversationHistory(sceneId, history) {
    const allHistory = this.getConversationHistory();
    allHistory[sceneId] = history;
    localStorage.setItem(STORAGE_KEYS.CONVERSATION_HISTORY, JSON.stringify(allHistory));
  }
  
  /**
   * 获取对话历史
   */
  getConversationHistory() {
    const data = localStorage.getItem(STORAGE_KEYS.CONVERSATION_HISTORY);
    return data ? JSON.parse(data) : {};
  }
  
  /**
   * 获取特定场景的对话历史
   */
  getSceneHistory(sceneId) {
    const allHistory = this.getConversationHistory();
    return allHistory[sceneId] || [];
  }
  
  /**
   * 保存场景进度
   */
  saveSceneProgress(sceneId, progress) {
    const allProgress = this.getSceneProgress();
    allProgress[sceneId] = progress;
    localStorage.setItem(STORAGE_KEYS.SCENE_PROGRESS, JSON.stringify(allProgress));
  }
  
  /**
   * 获取场景进度
   */
  getSceneProgress() {
    const data = localStorage.getItem(STORAGE_KEYS.SCENE_PROGRESS);
    return data ? JSON.parse(data) : {};
  }
  
  /**
   * 保存设置
   */
  saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }
  
  /**
   * 获取设置
   */
  getSettings() {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : {
      hintMode: 'quick', // 'quick' or 'deep'
      autoPlayAI: true,
      showTranscript: false,
    };
  }
  
  /**
   * 添加卡顿遗迹（记录用户卡住的地方）
   */
  addStuckEcho(echo) {
    const allEchoes = this.getStuckEchoes();
    allEchoes.push({
      ...echo,
      timestamp: Date.now(),
    });
    localStorage.setItem(STORAGE_KEYS.STUCK_ECHOES, JSON.stringify(allEchoes));
  }
  
  /**
   * 获取卡顿遗迹
   */
  getStuckEchoes() {
    const data = localStorage.getItem(STORAGE_KEYS.STUCK_ECHOES);
    return data ? JSON.parse(data) : [];
  }
  
  /**
   * 清除所有数据
   */
  clearAll() {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

export default new StorageService();
```

---

## 三、核心组件设计

### 3.1 组件结构

```
src/
├── components/
│   ├── Avatar/              # 虚拟形象组件
│   │   ├── Avatar.jsx       # 主组件
│   │   ├── AvatarSelector.jsx  # 形象选择器
│   │   └── Avatar.css
│   ├── Scene/               # 场景组件
│   │   ├── Scene.jsx        # 主场景
│   │   ├── SceneSelector.jsx  # 场景选择器
│   │   └── Scene.css
│   ├── Dialogue/            # 对话组件
│   │   ├── DialogueBox.jsx  # 对话框
│   │   ├── MessageBubble.jsx  # 消息气泡
│   │   └── Dialogue.css
│   ├── Speech/              # 语音组件
│   │   ├── RecordButton.jsx  # 录音按钮
│   │   ├── Transcript.jsx    # 转录文本
│   │   └── Speech.css
│   ├── Hint/                # 提示组件
│   │   ├── HintButton.jsx    # 提示按钮
│   │   ├── VisualHint.jsx    # 视觉提示
│   │   └── Hint.css
│   └── Progress/            # 进度组件
│       ├── ProgressBar.jsx   # 进度条
│       ├── StatsCard.jsx     # 统计卡片
│       └── Progress.css
├── pages/
│   ├── Home.jsx             # 首页
│   ├── AvatarCreation.jsx   # 形象创建
│   ├── SceneSelect.jsx      # 场景选择
│   ├── Practice.jsx         # 练习页面
│   └── Progress.jsx         # 进度页面
├── hooks/
│   ├── useSpeechRecognition.js
│   ├── useSpeechSynthesis.js
│   ├── useDialogue.js
│   └── useScene.js
├── services/
│   ├── speechRecognition.js
│   ├── speechSynthesis.js
│   ├── aiDialogue.js
│   └── storage.js
├── utils/
│   ├── constants.js
│   ├── helpers.js
│   └── prompts.js
└── App.jsx
```

### 3.2 核心 Hook 示例

```javascript
// src/hooks/useDialogue.js

import { useState, useCallback, useEffect } from 'react';
import aiDialogue from '../services/aiDialogue';
import speechSynthesis from '../services/speechSynthesis';
import storage from '../services/storage';

export function useDialogue(sceneId) {
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  
  // 加载历史对话
  useEffect(() => {
    const history = storage.getSceneHistory(sceneId);
    setMessages(history);
  }, [sceneId]);
  
  // 发送消息
  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isProcessing) return;
    
    setIsProcessing(true);
    setError(null);
    
    // 添加用户消息
    const userMessage = {
      role: 'user',
      text,
      timestamp: Date.now(),
    };
    
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    
    try {
      // 调用 AI
      const aiResponse = await aiDialogue.sendMessage(text);
      
      const aiMessage = {
        role: 'ai',
        text: aiResponse,
        timestamp: Date.now(),
      };
      
      const finalMessages = [...newMessages, aiMessage];
      setMessages(finalMessages);
      
      // 保存历史
      storage.saveSceneProgress(sceneId, { lastMessage: Date.now(), messageCount: finalMessages.length });
      
      // 播放 AI 语音
      const settings = storage.getSettings();
      if (settings.autoPlayAI) {
        await speechSynthesis.speak(aiResponse);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  }, [messages, isProcessing, sceneId]);
  
  // 重置对话
  const resetDialogue = useCallback(() => {
    aiDialogue.resetConversation();
    setMessages([]);
    storage.saveSceneHistory(sceneId, []);
  }, [sceneId]);
  
  return {
    messages,
    isProcessing,
    error,
    sendMessage,
    resetDialogue,
  };
}
```

---

## 四、API 文档

### 4.1 Google Gemini API

**端点：** `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`

**请求方法：** POST

**请求头：**
```
Content-Type: application/json
```

**请求体：**
```json
{
  "contents": [
    {
      "role": "user",
      "parts": [{"text": "Hello, how are you?"}]
    },
    {
      "role": "model",
      "parts": [{"text": "I'm doing well, thank you! How can I help you today?"}]
    }
  ]
}
```

**响应：**
```json
{
  "candidates": [
    {
      "content": {
        "parts": [{"text": "I'm doing well, thank you! How can I help you today?"}],
        "role": "model"
      }
    }
  ],
  "usageMetadata": {
    "promptTokenCount": 10,
    "candidatesTokenCount": 15,
    "totalTokenCount": 25
  }
}
```

### 4.2 Web Speech API

#### SpeechRecognition (语音识别)

```javascript
// 创建实例
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

// 配置
recognition.continuous = true;    // 持续识别
recognition.interimResults = true; // 返回中间结果
recognition.lang = 'en-US';       // 语言

// 事件
recognition.onresult = (event) => { /* 处理结果 */ };
recognition.onerror = (event) => { /* 处理错误 */ };
recognition.onend = () => { /* 识别结束 */ };

// 方法
recognition.start();
recognition.stop();
```

#### SpeechSynthesis (语音合成)

```javascript
// 创建语音
const utterance = new SpeechSynthesisUtterance('Hello, world!');

// 配置
utterance.rate = 1;      // 语速 (0.1-10)
utterance.pitch = 1;     // 音调 (0-2)
utterance.volume = 1;    // 音量 (0-1)
utterance.lang = 'en-US'; // 语言

// 事件
utterance.onstart = () => { /* 开始播放 */ };
utterance.onend = () => { /* 播放结束 */ };
utterance.onerror = (event) => { /* 处理错误 */ };

// 播放
window.speechSynthesis.speak(utterance);

// 其他方法
window.speechSynthesis.cancel();  // 取消
window.speechSynthesis.pause();   // 暂停
window.speechSynthesis.resume();  // 恢复
```

---

## 五、环境变量配置

### 5.1 .env.example

```env
# Google Gemini API
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# 应用配置
VITE_APP_NAME=Alter Ego
VITE_APP_VERSION=0.1.0

# 场景配置
VITE_DEFAULT_SCENE=cafe
VITE_MAX_HISTORY_LENGTH=20

# 提示配置
VITE_HINT_DELAY_SHORT=5000
VITE_HINT_DELAY_MEDIUM=10000
VITE_HINT_DELAY_LONG=15000
```

### 5.2 获取 API Key

1. 访问 [Google AI Studio](https://aistudio.google.com/)
2. 登录 Google 账号
3. 创建 API Key
4. 将 Key 添加到 `.env` 文件

---

## 六、部署指南

### 6.1 本地开发

```bash
# 克隆项目
git clone https://github.com/Starry-yan/Alter-Ego.git
cd Alter-Ego

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入 API Key

# 启动开发服务器
npm run dev
```

### 6.2 构建生产版本

```bash
# 构建
npm run build

# 预览构建结果
npm run preview
```

### 6.3 部署到 Vercel

```bash
# 安装 Vercel CLI
npm install -g vercel

# 部署
vercel

# 部署到生产
vercel --prod
```

### 6.4 部署到 GitHub Pages

```bash
# 安装 gh-pages
npm install -D gh-pages

# 添加脚本到 package.json
# "deploy": "npm run build && gh-pages -d dist"

# 部署
npm run deploy
```

---

## 七、性能优化

### 7.1 代码分割

```javascript
// 懒加载路由组件
const Practice = lazy(() => import('./pages/Practice'));
const Progress = lazy(() => import('./pages/Progress'));
```

### 7.2 图片优化

```javascript
// 使用 WebP 格式
<img src="scene-cafe.webp" alt="Cafe Scene" />

// 响应式图片
<picture>
  <source srcset="scene-cafe.webp" type="image/webp" />
  <img src="scene-cafe.jpg" alt="Cafe Scene" />
</picture>
```

### 7.3 缓存策略

```javascript
// Service Worker 缓存
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

---

## 八、安全考虑

### 8.1 API Key 保护

- 不要将 API Key 提交到 Git
- 使用环境变量管理
- 考虑使用后端代理 API 请求

### 8.2 用户数据保护

- 本地存储数据加密
- 敏感数据不上传
- 遵守隐私政策

### 8.3 输入验证

```javascript
// 验证用户输入
function validateInput(text) {
  if (!text || typeof text !== 'string') return false;
  if (text.length > 1000) return false;
  // 过滤特殊字符
  return text.replace(/[<>]/g, '').trim().length > 0;
}
```

---

## 参考文档

- [产品概念](./01-product-concept.md)
- [MVP 规格说明书](./02-mvp-specification.md)
- [产品评估报告](./03-product-evaluation.md)
