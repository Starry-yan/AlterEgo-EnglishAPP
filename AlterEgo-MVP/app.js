/**
 * Alter Ego - 主应用逻辑
 * Commit 4: 首页游戏化 redesign - 添加 XP 系统、成就、每日任务
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
        lastPracticeDate: null,
        // 游戏化数据
        level: 1,
        currentXP: 0,
        totalXP: 0,
        dailyQuests: [],
        completedQuests: [],
        achievements: []
    }
};

// XP 等级表
const XP_LEVELS = {
    1: { threshold: 0, title: '新手' },
    2: { threshold: 100, title: '初学者' },
    3: { threshold: 250, title: '进阶者' },
    4: { threshold: 500, title: '熟练工' },
    5: { threshold: 850, title: '高手' },
    6: { threshold: 1300, title: '专家' },
    7: { threshold: 1850, title: '大师' },
    8: { threshold: 2500, title: '宗师' },
    9: { threshold: 3250, title: '传奇' },
    10: { threshold: 4100, title: '传奇+' }
};

// 每日任务配置
const DAILY_QUESTS_CONFIG = [
    {
        id: 'practice_10min',
        icon: '⏱️',
        title: '练习 10 分钟',
        desc: '完成一次 10 分钟的口语练习',
        type: 'time',
        target: 10,
        rewardXP: 50
    },
    {
        id: 'complete_scene',
        icon: '🎯',
        title: '完成一个场景',
        desc: '完成任意场景的练习',
        type: 'scene',
        target: 1,
        rewardXP: 30
    },
    {
        id: 'speak_5times',
        icon: '🗣️',
        title: '开口 5 次',
        desc: '在对话中发言 5 次以上',
        type: 'speaks',
        target: 5,
        rewardXP: 25
    },
    {
        id: 'no_hint',
        icon: '💪',
        title: '无提示挑战',
        desc: '完成一次不使用提示的对话',
        type: 'noHint',
        target: 1,
        rewardXP: 40
    }
];

// 成就配置
const ACHIEVEMENTS_CONFIG = [
    {
        id: 'first_blood',
        icon: '🎉',
        name: '初次开口',
        desc: '完成第一次对话',
        condition: (stats) => stats.totalSessions >= 1
    },
    {
        id: 'streak_3',
        icon: '🔥',
        name: '三日连击',
        desc: '连续练习 3 天',
        condition: (stats) => stats.streakDays >= 3
    },
    {
        id: 'practice_1hour',
        icon: '⏰',
        name: '一小时达人',
        desc: '累计练习 1 小时',
        condition: (stats) => stats.totalMinutes >= 60
    },
    {
        id: 'level_5',
        icon: '⭐',
        name: '五级高手',
        desc: '达到 5 级',
        condition: (stats) => stats.level >= 5
    },
    {
        id: 'scenes_3',
        icon: '🌍',
        name: '场景探索者',
        desc: '体验 3 个不同场景',
        condition: (stats) => stats.totalSessions >= 3
    },
    {
        id: 'perfect_10',
        icon: '🏆',
        name: '完美十次',
        desc: '完成 10 次对话',
        condition: (stats) => stats.totalSessions >= 10
    }
];

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
    
    // 初始化游戏化系统
    initializeDailyQuests();
    updateUserStatus();
    updateQuestDisplay();
    updateAchievementDisplay();
    checkAchievements();
    
    // 启动每日任务计时器
    startQuestTimer();
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

// 已解锁场景列表
function getUnlockedScenes() {
    const unlocked = localStorage.getItem('alterEgoUnlockedScenes');
    if (unlocked) {
        return JSON.parse(unlocked);
    }
    // 新用户默认解锁新手教程和咖啡厅
    return ['tutorial', 'cafe'];
}

function unlockScene(sceneId) {
    const unlocked = getUnlockedScenes();
    if (!unlocked.includes(sceneId)) {
        unlocked.push(sceneId);
        localStorage.setItem('alterEgoUnlockedScenes', JSON.stringify(unlocked));
        updateSceneLockStatus();
    }
}

function updateSceneLockStatus() {
    const unlocked = getUnlockedScenes();
    document.querySelectorAll('.scene-card').forEach(card => {
        const sceneId = card.dataset.scene;
        const statusEl = card.querySelector('.scene-status');
        const lockIcon = card.querySelector('.lock-icon');
        
        if (unlocked.includes(sceneId)) {
            card.classList.remove('locked');
            if (statusEl) {
                statusEl.innerHTML = '<span class="check-icon">✓</span><span>已解锁</span>';
            }
        } else {
            card.classList.add('locked');
            // 更新锁定提示
            const nextScene = getNextSceneName(sceneId);
            if (statusEl) {
                statusEl.innerHTML = `<span class="lock-icon">🔒</span><span>${nextScene}</span>`;
            }
        }
    });
}

function getNextSceneName(currentScene) {
    const sceneNames = {
        'tutorial': '完成新手教程',
        'cafe': '完成咖啡厅解锁',
        'airport': '完成机场解锁',
        'meeting': '完成会议室解锁'
    };
    return sceneNames[currentScene] || '锁定';
}

function selectScene(sceneId) {
    const unlocked = getUnlockedScenes();
    if (!unlocked.includes(sceneId)) {
        // 场景已锁定，显示解锁提示
        const nextScene = getNextSceneName(sceneId);
        showNotification(nextScene, 'warning');
        return;
    }
    
    AppState.currentScene = sceneId;
    
    // 更新场景标题
    const sceneTitles = {
        'tutorial': '🎓 新手教程',
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
        'tutorial': "Hello! I'm your AI partner. Let's practice some basic English together. Try saying 'Hello' or 'Hi' to start!",
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
// 游戏化系统
// ========================================

// 初始化每日任务
function initializeDailyQuests() {
    const today = new Date().toDateString();
    const lastQuestDate = AppState.stats.lastQuestDate;
    
    // 如果是新的一天，重置每日任务
    if (lastQuestDate !== today) {
        AppState.stats.dailyQuests = DAILY_QUESTS_CONFIG.map(quest => ({
            ...quest,
            progress: 0,
            completed: false
        }));
        AppState.stats.lastQuestDate = today;
        AppState.stats.completedQuests = [];
        saveUserData();
    }
    
    // 检查是否有未领取的奖励
    checkCompletedQuests();
}

// 检查并领取已完成的每日任务
function checkCompletedQuests() {
    let hasNewCompletion = false;
    
    AppState.stats.dailyQuests.forEach(quest => {
        if (!quest.completed && quest.progress >= quest.target) {
            quest.completed = true;
            hasNewCompletion = true;
            
            // 领取奖励
            addXP(quest.rewardXP, `完成每日任务：${quest.title}`);
            
            // 记录已完成的任务
            if (!AppState.stats.completedQuests.includes(quest.id)) {
                AppState.stats.completedQuests.push(quest.id);
            }
        }
    });
    
    if (hasNewCompletion) {
        saveUserData();
        updateQuestDisplay();
    }
}

// 更新每日任务进度
function updateQuestProgress(questType, amount = 1) {
    const quest = AppState.stats.dailyQuests.find(q => q.type === questType);
    if (quest && !quest.completed) {
        quest.progress = Math.min(quest.progress + amount, quest.target);
        
        if (quest.progress >= quest.target) {
            quest.completed = true;
            addXP(quest.rewardXP, `完成每日任务：${quest.title}`);
            
            if (!AppState.stats.completedQuests.includes(quest.id)) {
                AppState.stats.completedQuests.push(quest.id);
            }
        }
        
        saveUserData();
        updateQuestDisplay();
    }
}

// 添加 XP 经验值
function addXP(amount, source = '') {
    const oldLevel = AppState.stats.level;
    AppState.stats.currentXP += amount;
    AppState.stats.totalXP += amount;
    
    // 检查是否升级
    const nextLevel = oldLevel + 1;
    if (XP_LEVELS[nextLevel] && AppState.stats.currentXP >= XP_LEVELS[nextLevel].threshold) {
        AppState.stats.level = nextLevel;
        showLevelUpNotification(oldLevel, nextLevel);
    }
    
    saveUserData();
    updateUserStatus();
}

// 显示升级通知
function showLevelUpNotification(oldLevel, newLevel) {
    const levelInfo = XP_LEVELS[newLevel];
    const message = `🎉 恭喜升级！\n从 Lv.${oldLevel} 升级到 Lv.${newLevel} - ${levelInfo.title}！`;
    
    // 创建升级通知元素
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #FF6B6B 0%, #6B5B95 100%);
        color: white;
        padding: 20px 40px;
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        z-index: 10000;
        text-align: center;
        animation: slideDown 0.5s ease, bounce 0.5s ease 0.5s;
    `;
    notification.innerHTML = `
        <div style="font-size: 2rem; margin-bottom: 10px;">🎉</div>
        <div style="font-size: 1.25rem; font-weight: 700;">Level Up!</div>
        <div style="font-size: 0.9rem; margin-top: 5px;">Lv.${oldLevel} → Lv.${newLevel}</div>
        <div style="font-size: 0.85rem; opacity: 0.9; margin-top: 5px;">${levelInfo.title}</div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// 检查成就
function checkAchievements() {
    const newAchievements = [];
    
    ACHIEVEMENTS_CONFIG.forEach(achievement => {
        if (!AppState.stats.achievements.includes(achievement.id)) {
            if (achievement.condition(AppState.stats)) {
                AppState.stats.achievements.push(achievement.id);
                newAchievements.push(achievement);
                addXP(20, `解锁成就：${achievement.name}`);
            }
        }
    });
    
    if (newAchievements.length > 0) {
        saveUserData();
        showAchievementNotifications(newAchievements);
    }
}

// 显示成就通知
function showAchievementNotifications(achievements) {
    achievements.forEach((achievement, index) => {
        setTimeout(() => {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: white;
                padding: 16px 20px;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.15);
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 12px;
                animation: slideInRight 0.5s ease;
                max-width: 300px;
            `;
            notification.innerHTML = `
                <div style="font-size: 2rem;">${achievement.icon}</div>
                <div>
                    <div style="font-size: 0.75rem; color: #6B7280;">Achievement Unlocked</div>
                    <div style="font-size: 0.9rem; font-weight: 600; color: #1F2937;">${achievement.name}</div>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideOutRight 0.5s ease';
                setTimeout(() => notification.remove(), 500);
            }, 3000);
        }, index * 500);
    });
}

// 更新用户状态栏显示
function updateUserStatus() {
    const levelBadge = document.getElementById('user-level-badge');
    const levelName = document.getElementById('user-level-name');
    const xpFill = document.getElementById('xp-fill');
    const xpText = document.getElementById('xp-text');
    const streakCount = document.getElementById('streak-count');
    
    // 更新首页状态栏
    const homeLevelNum = document.getElementById('user-level-num');
    const homeXPFill = document.getElementById('home-xp-fill');
    const currentXP = document.getElementById('current-xp');
    const nextLevelXP = document.getElementById('next-level-xp');
    const homeStreak = document.getElementById('home-streak');
    
    const currentLevel = AppState.stats.level;
    const nextLevel = currentLevel + 1;
    const currentThreshold = XP_LEVELS[currentLevel]?.threshold || 0;
    const nextThreshold = XP_LEVELS[nextLevel]?.threshold || XP_LEVELS[currentLevel].threshold + 500;
    
    // 计算当前等级的进度
    const levelProgress = Math.min(100, ((AppState.stats.currentXP - currentThreshold) / (nextThreshold - currentThreshold)) * 100);
    
    // 更新所有相关元素
    if (levelBadge) levelBadge.textContent = `Lv.${currentLevel}`;
    if (levelName) levelName.textContent = XP_LEVELS[currentLevel]?.title || '未知';
    if (xpFill) xpFill.style.width = `${levelProgress}%`;
    if (xpText) xpText.textContent = `${Math.floor(AppState.stats.currentXP)} / ${nextThreshold} XP`;
    if (streakCount) streakCount.textContent = AppState.stats.streakDays;
    
    // 更新首页状态栏
    if (homeLevelNum) homeLevelNum.textContent = currentLevel;
    if (homeLevelName) homeLevelName.textContent = XP_LEVELS[currentLevel]?.title || '新手';
    if (homeXPFill) homeXPFill.style.width = `${levelProgress}%`;
    if (currentXP) currentXP.textContent = Math.floor(AppState.stats.currentXP);
    if (nextLevelXP) nextLevelXP.textContent = nextThreshold;
    if (homeStreak) homeStreak.textContent = AppState.stats.streakDays;
}

// 更新每日任务显示
function updateQuestDisplay() {
    const questList = document.getElementById('quest-list');
    if (!questList) return;
    
    questList.innerHTML = '';
    
    AppState.stats.dailyQuests.forEach(quest => {
        const questItem = document.createElement('div');
        questItem.className = 'quest-item';
        if (quest.completed) {
            questItem.classList.add('completed');
        }
        
        const progressPercent = (quest.progress / quest.target) * 100;
        
        questItem.innerHTML = `
            <div class="quest-icon">${quest.icon}</div>
            <div class="quest-info">
                <div class="quest-title">${quest.title}</div>
                <div class="quest-desc">${quest.desc}</div>
            </div>
            <div class="quest-progress">
                <div class="quest-bar">
                    <div class="quest-fill" style="width: ${progressPercent}%"></div>
                </div>
                <div class="quest-count">${quest.progress}/${quest.target}</div>
            </div>
            <div class="quest-reward">
                <div class="reward-icon">⚡</div>
                <div class="reward-xp">+${quest.rewardXP}</div>
            </div>
        `;
        
        questList.appendChild(questItem);
    });
}

// 更新成就显示
function updateAchievementDisplay() {
    const achievementsGrid = document.getElementById('achievements-grid');
    if (!achievementsGrid) return;
    
    achievementsGrid.innerHTML = '';
    
    ACHIEVEMENTS_CONFIG.forEach(achievement => {
        const isUnlocked = AppState.stats.achievements.includes(achievement.id);
        
        const achievementCard = document.createElement('div');
        achievementCard.className = 'achievement-card';
        if (isUnlocked) {
            achievementCard.classList.add('unlocked');
        }
        
        achievementCard.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <span class="achievement-name">${achievement.name}</span>
            <span class="achievement-desc">${achievement.desc}</span>
        `;
        
        achievementsGrid.appendChild(achievementCard);
    });
}

// 每日任务计时器
function startQuestTimer() {
    setInterval(() => {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const remaining = tomorrow - now;
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
        
        const timerEl = document.getElementById('quest-timer');
        if (timerEl) {
            timerEl.textContent = `重置：${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }, 1000);
}

// 成就和排行榜辅助函数
function showAchievements() {
    navigateTo('profile');
    showNotification('成就系统即将在完整版本中开放！', 'info');
}

function showLeaderboard() {
    showNotification('排行榜功能即将在联机版本中开放！', 'info');
}

function showDailyBonus() {
    const today = new Date().toDateString();
    const lastBonus = AppState.stats.lastBonusDate;
    
    if (lastBonus === today) {
        showNotification('你今天已经领取过每日奖励了！明天再来吧~', 'info');
        return;
    }
    
    // 模拟每日奖励
    const bonusXP = 30;
    addXP(bonusXP, '每日签到奖励');
    
    AppState.stats.lastBonusDate = today;
    saveUserData();
    
    showNotification(`🎁 每日奖励！\n你获得了 ${bonusXP} XP！`, 'success');
}

// 通知系统
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'success' ? '#10B981' : type === 'warning' ? '#F59E0B' : '#3B82F6'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 320px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
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

// ========================================
// 对话完成时更新任务进度
// ========================================
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
            
            // 更新每日任务进度
            updateQuestProgress('time', elapsed);
            updateQuestProgress('scene', 1);
            updateQuestProgress('speaks', AppState.conversation.filter(m => m.sender === 'user').length);
            if (AppState.hintLevel === 0) {
                updateQuestProgress('noHint', 1);
            }
            
            saveUserData();
            updateStatsDisplay();
            checkAchievements();
        }
    }
}

