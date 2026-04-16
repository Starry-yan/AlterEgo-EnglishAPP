/**
 * Alter Ego - 主应用逻辑
 * Commit 1: 基础应用初始化
 */

// ========================================
// 应用状态管理
// ========================================
const AppState = {
    currentUser: null,
    currentScene: null,
    conversation: [],
    isRecording: false,
    recordingStartTime: null,
    hintLevel: 0,
    timerInterval: null,
    sessionStartTime: null,
    avatarStyle: 'adventurer',
    avatarColorIndex: 0,
    avatarSeed: 'default',
    
    // 用户统计数据
    stats: {
        totalMinutes: 0,
        totalSessions: 0,
        streakDays: 0,
        lastPracticeDate: null
    }
};

// ========================================
// 初始化应用
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // 加载用户数据
    loadUserData();
    
    // 初始化导航
    initializeNavigation();
    
    // 初始化头像编辑器
    initializeAvatarEditor();
    
    // 更新统计显示
    updateStatsDisplay();
    
    // 设置默认 AI 头像
    setDefaultAvatar();
}

// ========================================
// 用户数据管理
// ========================================
function loadUserData() {
    const savedData = localStorage.getItem('alterEgoUserData');
    if (savedData) {
        const data = JSON.parse(savedData);
        AppState.currentUser = data.currentUser;
        AppState.stats = data.stats || AppState.stats;
        AppState.avatarStyle = data.avatarStyle || 'adventurer';
        AppState.avatarColorIndex = data.avatarColorIndex || 0;
        AppState.avatarSeed = data.avatarSeed || 'default';
    } else {
        // 新用户
        AppState.currentUser = {
            name: '学习者',
            avatarUrl: getAvatarUrl('adventurer', 0, 'default')
        };
    }
    
    // 更新用户头像显示
    updateUserAvatar();
}

function saveUserData() {
    const data = {
        currentUser: AppState.currentUser,
        stats: AppState.stats,
        avatarStyle: AppState.avatarStyle,
        avatarColorIndex: AppState.avatarColorIndex,
        avatarSeed: AppState.avatarSeed
    };
    localStorage.setItem('alterEgoUserData', JSON.stringify(data));
}

function getAvatarUrl(style, colorIndex, seed) {
    if (style === 'adventurer') {
        return `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}&backgroundColor=b6e3f4`;
    } else if (style === 'avataaars') {
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=ffdfbf`;
    }
    return `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;
}

function updateUserAvatar() {
    const userAvatarImg = document.getElementById('user-avatar-img');
    if (userAvatarImg) {
        userAvatarImg.src = AppState.currentUser.avatarUrl;
    }
}

function setDefaultAvatar() {
    const aiAvatarImg = document.getElementById('ai-avatar-img');
    if (aiAvatarImg) {
        aiAvatarImg.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=AI&backgroundColor=c0aede';
    }
}

// ========================================
// 导航系统
// ========================================
function initializeNavigation() {
    // 导航链接点击事件
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = link.getAttribute('href').substring(1);
            navigateTo(targetPage);
        });
    });
}

function navigateTo(pageId) {
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // 显示目标页面
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // 更新导航链接状态
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${pageId}`) {
            link.classList.add('active');
        }
    });
    
    // 页面特定初始化
    if (pageId === 'avatar-editor') {
        initializePresetGrid();
    }
}

// ========================================
// 头像编辑器
// ========================================
function initializeAvatarEditor() {
    // 风格切换
    document.querySelectorAll('.style-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.style-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            AppState.avatarStyle = btn.dataset.style;
            updateAvatarPreview();
        });
    });
    
    // 颜色选择
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            AppState.avatarColorIndex = parseInt(btn.dataset.color);
            updateAvatarPreview();
        });
    });
}

function initializePresetGrid() {
    const presetGrid = document.getElementById('preset-grid');
    if (!presetGrid) return;
    
    presetGrid.innerHTML = '';
    
    // 生成预设形象
    const presets = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack', 'Kate', 'Leo', 'Mia', 'Noah', 'Olivia', 'Peter'];
    
    presets.forEach((name, index) => {
        const presetItem = document.createElement('div');
        presetItem.className = 'preset-item';
        if (AppState.avatarSeed === name.toLowerCase()) {
            presetItem.classList.add('selected');
        }
        
        const img = document.createElement('img');
        img.src = getAvatarUrl(AppState.avatarStyle, AppState.avatarColorIndex, name.toLowerCase());
        img.alt = name;
        
        presetItem.appendChild(img);
        presetItem.addEventListener('click', () => {
            document.querySelectorAll('.preset-item').forEach(p => p.classList.remove('selected'));
            presetItem.classList.add('selected');
            AppState.avatarSeed = name.toLowerCase();
            updateAvatarPreview();
        });
        
        presetGrid.appendChild(presetItem);
    });
    
    // 设置当前选中状态
    document.querySelectorAll('.color-btn')[AppState.avatarColorIndex]?.classList.add('selected');
}

function updateAvatarPreview() {
    const previewImg = document.getElementById('avatar-preview-img');
    if (previewImg) {
        previewImg.src = getAvatarUrl(AppState.avatarStyle, AppState.avatarColorIndex, AppState.avatarSeed);
    }
}

function editAvatar() {
    // 更新预览
    updateAvatarPreview();
    navigateTo('avatar-editor');
}

function saveAvatar() {
    AppState.currentUser.avatarUrl = getAvatarUrl(AppState.avatarStyle, AppState.avatarColorIndex, AppState.avatarSeed);
    saveUserData();
    updateUserAvatar();
    navigateTo('profile');
}

// ========================================
// 场景管理
// ========================================
function selectScene(sceneId) {
    const sceneCard = document.querySelector(`.scene-card[data-scene="${sceneId}"]`);
    if (sceneCard && sceneCard.classList.contains('locked')) {
        // 场景已锁定
        showNotification('请先完成前置场景解锁此场景', 'warning');
        return;
    }
    
    AppState.currentScene = sceneId;
    
    // 更新场景标题
    const sceneTitles = {
        'cafe': '☕ 咖啡厅',
        'airport': '✈️ 机场',
        'meeting': '💼 会议室'
    };
    document.getElementById('scene-title').textContent = sceneTitles[sceneId] || '场景';
    
    // 进入练习页面
    navigateTo('practice');
    
    // 初始化对话
    initializeConversation(sceneId);
}

// ========================================
// 对话系统
// ========================================
function initializeConversation(sceneId) {
    const conversationArea = document.getElementById('conversation');
    conversationArea.innerHTML = '';
    AppState.conversation = [];
    AppState.hintLevel = 0;
    
    // 场景引导语
    const sceneGreetings = {
        'cafe': "Hi there! Welcome to our cafe. What would you like to order today?",
        'airport': "Good morning! Can I see your passport and ticket, please?",
        'meeting': "Hello everyone, thanks for joining. Let's start the meeting."
    };
    
    addMessage('ai', sceneGreetings[sceneId] || "Hello! Let's start practicing.");
    
    // 开始计时
    startSessionTimer();
}

function addMessage(sender, text) {
    const conversationArea = document.getElementById('conversation');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';
    bubbleDiv.textContent = text;
    
    messageDiv.appendChild(bubbleDiv);
    conversationArea.appendChild(messageDiv);
    
    // 滚动到底部
    conversationArea.scrollTop = conversationArea.scrollHeight;
    
    // 记录对话
    AppState.conversation.push({ sender, text, timestamp: Date.now() });
    
    // 更新 AI 状态
    if (sender === 'ai') {
        updateAIStatus('speaking');
        setTimeout(() => updateAIStatus('ready'), 1000);
    }
}

function updateAIStatus(status) {
    const statusText = document.querySelector('.status-text');
    const statusDot = document.querySelector('.status-dot');
    
    if (statusText) {
        switch (status) {
            case 'ready':
                statusText.textContent = '准备就绪';
                statusDot.style.background = 'var(--color-success)';
                break;
            case 'listening':
                statusText.textContent = '正在聆听...';
                statusDot.style.background = 'var(--color-primary)';
                break;
            case 'speaking':
                statusText.textContent = 'AI 正在说话...';
                statusDot.style.background = 'var(--color-secondary)';
                break;
            case 'thinking':
                statusText.textContent = '思考中...';
                statusDot.style.background = 'var(--color-accent)';
                break;
        }
    }
}

// ========================================
// 录音功能
// ========================================
function startRecording() {
    AppState.isRecording = true;
    AppState.recordingStartTime = Date.now();
    
    const recordBtn = document.getElementById('record-btn');
    const recordingIndicator = document.getElementById('recording-indicator');
    
    recordBtn.style.transform = 'scale(1.1)';
    recordBtn.style.background = 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)';
    
    recordingIndicator.style.display = 'flex';
    
    updateAIStatus('listening');
}

function stopRecording() {
    if (!AppState.isRecording) return;
    
    AppState.isRecording = false;
    const recordingDuration = Date.now() - AppState.recordingStartTime;
    
    const recordBtn = document.getElementById('record-btn');
    const recordingIndicator = document.getElementById('recording-indicator');
    
    recordBtn.style.transform = '';
    recordBtn.style.background = '';
    recordingIndicator.style.display = 'none';
    
    // 检查录音时长
    if (recordingDuration < 500) {
        // 录音太短，忽略
        return;
    }
    
    // 模拟语音识别结果
    simulateSpeechRecognition(recordingDuration);
}

function simulateSpeechRecognition(duration) {
    updateAIStatus('thinking');
    
    // 模拟识别延迟
    setTimeout(() => {
        // 生成模拟的用户输入
        const sampleInputs = {
            'cafe': [
                "I would like a coffee please",
                "Can I get a latte?",
                "What do you recommend?",
                "I want a cappuccino",
                "How much is this?"
            ],
            'airport': [
                "Here is my passport",
                "I am flying to New York",
                "Where is my gate?",
                "Can I have a window seat?",
                "Is the flight on time?"
            ],
            'meeting': [
                "I have an idea to share",
                "Let me explain the project",
                "What is the timeline?",
                "I agree with that point",
                "Can we discuss this later?"
            ]
        };
        
        const sceneInputs = sampleInputs[AppState.currentScene] || sampleInputs['cafe'];
        const userText = sceneInputs[Math.floor(Math.random() * sceneInputs.length)];
        
        addMessage('user', userText);
        
        // 模拟 AI 响应
        setTimeout(() => {
            generateAIResponse(userText);
        }, 1000);
    }, 500);
}

function generateAIResponse(userText) {
    // 模拟 AI 响应（重述法）
    const responses = [
        `Oh, ${userText.toLowerCase()}? That's interesting! Tell me more.`,
        `I see! So you ${userText.toLowerCase()}. What else?`,
        `Great! ${userText.charAt(0).toUpperCase() + userText.slice(1)}. And then what happened?`,
        `That's wonderful! Let's continue. What do you think about this?`
    ];
    
    const aiResponse = responses[Math.floor(Math.random() * responses.length)];
    addMessage('ai', aiResponse);
    
    // 更新统计数据
    updateSessionStats();
}

// ========================================
// 提示系统
// ========================================
function showHint() {
    const hintOptions = document.getElementById('hint-options');
    hintOptions.style.display = hintOptions.style.display === 'none' ? 'flex' : 'none';
}

function getHint(level) {
    AppState.hintLevel = level;
    
    const hintMessages = {
        1: "🎤 试试说：'I would like...' 或 'Can I get...'",
        2: "🔤 关键词：order, coffee, please, menu",
        3: "📝 中文提示：我想要点一杯咖啡，请问有什么推荐吗？"
    };
    
    addMessage('ai', hintMessages[level]);
    
    // 隐藏提示选项
    document.getElementById('hint-options').style.display = 'none';
}

// ========================================
// 计时器功能
// ========================================
function startSessionTimer() {
    AppState.sessionStartTime = Date.now();
    
    if (AppState.timerInterval) {
        clearInterval(AppState.timerInterval);
    }
    
    AppState.timerInterval = setInterval(() => {
        const elapsed = Date.now() - AppState.sessionStartTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        
        const timerDisplay = document.querySelector('.practice-timer');
        if (timerDisplay) {
            timerDisplay.textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }, 1000);
}

function stopSessionTimer() {
    if (AppState.timerInterval) {
        clearInterval(AppState.timerInterval);
        AppState.timerInterval = null;
    }
}

function updateSessionStats() {
    if (AppState.sessionStartTime) {
        const elapsed = Math.floor((Date.now() - AppState.sessionStartTime) / 60000);
        if (elapsed > 0) {
            AppState.stats.totalMinutes += elapsed;
            AppState.stats.totalSessions += 1;
            
            // 更新打卡
            const today = new Date().toDateString();
            if (AppState.stats.lastPracticeDate !== today) {
                AppState.stats.streakDays += 1;
                AppState.stats.lastPracticeDate = today;
            }
            
            saveUserData();
            updateStatsDisplay();
        }
    }
}

// ========================================
// 统计显示
// ========================================
function updateStatsDisplay() {
    const minutesEl = document.getElementById('total-minutes');
    const sessionsEl = document.getElementById('total-sessions');
    const streakEl = document.getElementById('streak-days');
    
    if (minutesEl) minutesEl.textContent = AppState.stats.totalMinutes;
    if (sessionsEl) sessionsEl.textContent = AppState.stats.totalSessions;
    if (streakEl) streakEl.textContent = AppState.stats.streakDays;
    
    // 更新进度条
    const progress = Math.min(100, Math.floor((AppState.stats.totalSessions / 10) * 100));
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.getElementById('progress-text');
    
    if (progressFill) progressFill.style.width = `${progress}%`;
    if (progressText) progressText.textContent = `${progress}%`;
}

// ========================================
// 通知系统
// ========================================
function showNotification(message, type = 'info') {
    // 简单的 alert 替代
    alert(message);
}

// ========================================
// 场景卡片点击事件
// ========================================
document.addEventListener('click', (e) => {
    const sceneCard = e.target.closest('.scene-card');
    if (sceneCard) {
        const sceneId = sceneCard.dataset.scene;
        if (sceneId) {
            selectScene(sceneId);
        }
    }
});