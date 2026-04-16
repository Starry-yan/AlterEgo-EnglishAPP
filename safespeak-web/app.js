/**
 * Alter Ego - English Life Simulator
 * Main Application JavaScript
 * 
 * Features:
 * - Avatar creation and selection
 * - Scene selection and navigation
 * - Voice recording and playback
 * - AI-powered conversation
 * - Progressive hint system
 * - Progress tracking
 */

// ============================================
// Global State Management
// ============================================
const AppState = {
    // User data
    avatar: {
        persona: 'confident',
        voice: 'male-deep',
        confidence: 3,
        speed: 3,
        face: '😊',
        name: 'Your English Self'
    },
    
    // Current scene
    currentScene: null,
    
    // Conversation history
    conversation: [],
    
    // User stats
    stats: {
        totalMinutes: 0,
        totalSentences: 0,
        streakDays: 5,
        currency: 150,
        level: 5,
        xp: 650,
        maxXp: 1000
    },
    
    // Recording state
    isRecording: false,
    recognition: null,
    
    // Hint system
    hintLevel: 0,
    hintTimer: null,
    
    // AI API configuration
    aiConfig: {
        // 使用浏览器内置的 Web Speech API（免费）
        useBrowserSpeech: true,
        // 可选：使用外部 API（需要配置）
        externalApi: {
            enabled: false,
            apiUrl: '',
            apiKey: ''
        }
    }
};

// ============================================
// Scene Data
// ============================================
const Scenes = {
    cafe: {
        id: 'cafe',
        name: 'Cafe Lounge',
        icon: '☕',
        difficulty: 2,
        progress: 45,
        task: 'Order a drink',
        unlocked: true,
        background: 'linear-gradient(180deg, #87ceeb 0%, #98d4e8 50%, #c4e5d9 100%)',
        npc: {
            name: 'Barista Alex',
            face: '👨‍💼',
            emotion: '😊'
        },
        interactables: [
            { id: 'menu', icon: '📋', label: 'Menu', action: 'look' },
            { id: 'coffee', icon: '☕', label: 'Coffee', action: 'use' },
            { id: 'counter', icon: '🏪', label: 'Counter', action: 'talk' }
        ],
        dialogue: {
            start: "Good morning! Welcome to our cafe. What can I get for you today?",
            responses: {
                coffee: "Great choice! What size would you like - small, medium, or large?",
                tea: "We have green tea, black tea, and herbal tea. Which one do you prefer?",
                water: "Sure! Would you like hot water or cold water?",
                default: "I'm not sure I understand. Could you try saying it again?"
            },
            hints: [
                "Try saying: 'I'd like a coffee please'",
                "You could say: 'Can I get a tea?'",
                "How about: 'I want some water'"
            ]
        }
    },
    office: {
        id: 'office',
        name: 'Office Meeting',
        icon: '🏢',
        difficulty: 3,
        progress: 30,
        task: 'Share project update',
        unlocked: true,
        background: 'linear-gradient(180deg, #e8e8e8 0%, #d0d0d0 50%, #b8b8b8 100%)',
        npc: {
            name: 'Manager Sarah',
            face: '👩‍💼',
            emotion: '🙂'
        },
        interactables: [
            { id: 'laptop', icon: '💻', label: 'Laptop', action: 'look' },
            { id: 'whiteboard', icon: '📋', label: 'Whiteboard', action: 'look' },
            { id: 'manager', icon: '👩‍💼', label: 'Manager', action: 'talk' }
        ],
        dialogue: {
            start: "Hi! Thanks for joining the meeting. Can you give us a quick update on your project?",
            responses: {
                progress: "That's great progress! What are your next steps?",
                done: "Excellent work! Let's discuss the timeline for the next phase.",
                help: "I understand. What kind of support do you need?",
                default: "Could you elaborate on that?"
            },
            hints: [
                "Try saying: 'I've made good progress'",
                "You could say: 'I need some help with...'",
                "How about: 'The next step is...'"
            ]
        }
    },
    airport: {
        id: 'airport',
        name: 'Airport',
        icon: '✈️',
        difficulty: 3,
        progress: 0,
        task: 'Check in luggage',
        unlocked: true,
        background: 'linear-gradient(180deg, #a8d4e8 0%, #8bc4d8 50%, #70b4c8 100%)',
        npc: {
            name: 'Agent Mike',
            face: '👨‍✈️',
            emotion: '🙂'
        },
        interactables: [
            { id: 'counter', icon: '🏪', label: 'Check-in', action: 'talk' },
            { id: 'luggage', icon: '🧳', label: 'Luggage', action: 'use' },
            { id: 'boarding', icon: '🎫', label: 'Boarding Pass', action: 'look' }
        ],
        dialogue: {
            start: "Good morning! Where are you flying today?",
            responses: {
                luggage: "How many bags would you like to check in?",
                seat: "Would you prefer an aisle seat or a window seat?",
                pass: "May I see your passport and ticket please?",
                default: "I'm sorry, could you repeat that?"
            },
            hints: [
                "Try saying: 'I'm flying to...'",
                "You could say: 'I have two bags to check'",
                "How about: 'I'd like a window seat'"
            ]
        }
    },
    hotel: {
        id: 'hotel',
        name: 'Hotel',
        icon: '🏨',
        difficulty: 4,
        progress: 0,
        task: 'Check in',
        unlocked: false,
        background: 'linear-gradient(180deg, #f5e6d3 0%, #e8d4c0 50%, #d4c0a8 100%)',
        npc: {
            name: 'Receptionist',
            face: '👨‍💼',
            emotion: '😊'
        },
        interactables: [],
        dialogue: {
            start: "Welcome to our hotel! Do you have a reservation?",
            responses: {},
            hints: []
        }
    }
};

// ============================================
// DOM Elements Cache
// ============================================
const Elements = {
    // Pages
    pages: {
        avatar: document.getElementById('avatar-creation'),
        sceneSelection: document.getElementById('scene-selection'),
        sceneTraining: document.getElementById('scene-training'),
        progress: document.getElementById('progress-report')
    },
    
    // Avatar creation
    personaCards: document.querySelectorAll('.persona-card'),
    confidenceSlider: document.getElementById('confidence-slider'),
    speedSlider: document.getElementById('speed-slider'),
    characterDisplay: document.getElementById('character-display'),
    startJourneyBtn: document.getElementById('start-journey-btn'),
    
    // Scene selection
    sceneCards: document.querySelectorAll('.scene-card'),
    backHomeBtn: document.getElementById('back-home-btn'),
    backHomeBtn2: document.getElementById('back-home-btn-2'),
    
    // Scene training
    gameScene: document.getElementById('game-scene'),
    sceneBackground: document.getElementById('scene-background'),
    sceneInteractables: document.getElementById('scene-interactables'),
    npcCharacter: document.getElementById('npc-character'),
    npcAvatar: document.getElementById('npc-avatar'),
    speechBubble: document.getElementById('speech-bubble'),
    aiText: document.getElementById('ai-text'),
    npcEmotion: document.getElementById('npc-emotion'),
    thoughtBubble: document.getElementById('thought-bubble'),
    thoughtContent: document.getElementById('thought-content'),
    recordBtn: document.getElementById('record-btn'),
    recordingAnimation: document.getElementById('recording-animation'),
    hintBtn: document.getElementById('hint-btn'),
    chatHistoryBtn: document.getElementById('chat-history-btn'),
    closeChat: document.getElementById('close-chat'),
    chatPanel: document.getElementById('chat-panel'),
    chatContent: document.getElementById('chat-content'),
    backScenesBtn: document.getElementById('back-scenes-btn'),
    
    // Navigation
    navItems: document.querySelectorAll('.nav-item'),
    
    // Stats
    continuePracticeBtn: document.getElementById('continue-practice-btn'),
    
    // HUD
    hudAvatar: document.getElementById('hud-avatar'),
    currentSceneName: document.getElementById('current-scene-name'),
    currentTask: document.getElementById('current-task'),
    sceneCurrency: document.getElementById('scene-currency'),
    currencyAmount: document.getElementById('currency-amount'),
    
    // Toast
    toast: document.getElementById('toast')
};

// ============================================
// Page Navigation
// ============================================
function showPage(pageName) {
    // Hide all pages
    Object.values(Elements.pages).forEach(page => {
        if (page) page.classList.remove('active');
    });
    
    // Show target page
    const targetPage = Elements.pages[pageName];
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update navigation
    Elements.navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageName) {
            item.classList.add('active');
        }
    });
}

// ============================================
// Avatar Creation
// ============================================
function initAvatarCreation() {
    // Persona card selection
    Elements.personaCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove selected from all
            Elements.personaCards.forEach(c => c.classList.remove('selected'));
            // Add to clicked
            card.classList.add('selected');
            
            // Update state
            const persona = card.dataset.persona;
            AppState.avatar.persona = persona;
            
            // Update face based on persona
            const faces = {
                confident: '😎',
                friendly: '😊',
                energetic: '🤩'
            };
            AppState.avatar.face = faces[persona] || '😊';
            updateCharacterDisplay();
        });
    });
    
    // Voice selection
    document.querySelectorAll('input[name="voice"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            AppState.avatar.voice = e.target.value;
        });
    });
    
    // Sliders
    if (Elements.confidenceSlider) {
        Elements.confidenceSlider.addEventListener('input', (e) => {
            AppState.avatar.confidence = parseInt(e.target.value);
        });
    }
    
    if (Elements.speedSlider) {
        Elements.speedSlider.addEventListener('input', (e) => {
            AppState.avatar.speed = parseInt(e.target.value);
        });
    }
    
    // Start journey button
    if (Elements.startJourneyBtn) {
        Elements.startJourneyBtn.addEventListener('click', () => {
            saveAvatar();
            showPage('sceneSelection');
            showToast('Welcome to your English World! 🌍');
        });
    }
}

function updateCharacterDisplay() {
    const faceEl = document.getElementById('character-avatar');
    if (faceEl) {
        faceEl.textContent = AppState.avatar.face;
    }
}

function saveAvatar() {
    // Save to localStorage
    localStorage.setItem('alterEgo_avatar', JSON.stringify(AppState.avatar));
}

function loadAvatar() {
    const saved = localStorage.getItem('alterEgo_avatar');
    if (saved) {
        AppState.avatar = JSON.parse(saved);
        updateCharacterDisplay();
    }
}

// ============================================
// Scene Selection
// ============================================
function initSceneSelection() {
    // Scene card clicks
    Elements.sceneCards.forEach(card => {
        card.addEventListener('click', () => {
            const sceneId = card.dataset.scene;
            const unlocked = card.dataset.unlocked === 'true';
            
            if (unlocked) {
                enterScene(sceneId);
            } else {
                showToast('🔒 Complete other scenes to unlock!');
            }
        });
    });
    
    // Back buttons
    const backBtns = [Elements.backHomeBtn, Elements.backHomeBtn2];
    backBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                showPage('avatar-creation');
            });
        }
    });
}

// ============================================
// Scene Training
// ============================================
function enterScene(sceneId) {
    const scene = Scenes[sceneId];
    if (!scene) return;
    
    AppState.currentScene = scene;
    
    // Update UI
    if (Elements.currentSceneName) {
        Elements.currentSceneName.textContent = scene.name;
    }
    if (Elements.currentTask) {
        Elements.currentTask.textContent = scene.task;
    }
    if (Elements.sceneBackground) {
        Elements.sceneBackground.style.background = scene.background;
    }
    
    // Update NPC
    if (Elements.npcAvatar) {
        Elements.npcAvatar.querySelector('.npc-face').textContent = scene.npc.face;
        document.getElementById('npc-name-tag').textContent = scene.npc.name;
    }
    if (Elements.npcEmotion) {
        Elements.npcEmotion.textContent = scene.npc.emotion;
    }
    
    // Update interactables
    updateInteractables(scene.interactables);
    
    // Show scene
    showPage('sceneTraining');
    
    // Start dialogue
    startDialogue();
    
    // Initialize hint timer
    initHintTimer();
}

function updateInteractables(interactables) {
    if (!Elements.sceneInteractables) return;
    
    Elements.sceneInteractables.innerHTML = '';
    
    interactables.forEach(item => {
        const el = document.createElement('div');
        el.className = 'interactable';
        el.dataset.object = item.id;
        el.dataset.action = item.action;
        el.innerHTML = `
            <div class="interactable-icon">${item.icon}</div>
            <div class="interactable-label">${item.label}</div>
            <div class="interaction-ring"></div>
        `;
        
        el.addEventListener('click', () => handleInteractableClick(item));
        Elements.sceneInteractables.appendChild(el);
    });
}

function handleInteractableClick(item) {
    // Visual feedback
    showToast(`👀 You looked at: ${item.label}`);
    
    // Add to conversation
    addMessage('user', `*looked at ${item.label}*`);
}

function startDialogue() {
    const scene = AppState.currentScene;
    if (!scene) return;
    
    // Reset conversation
    AppState.conversation = [];
    Elements.chatContent.innerHTML = '';
    
    // AI starts
    setTimeout(() => {
        speakText(scene.dialogue.start);
        addMessage('ai', scene.dialogue.start);
    }, 500);
}

// ============================================
// Voice Recording & Speech Recognition
// ============================================
function initSpeechRecognition() {
    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        console.warn('Speech Recognition not supported in this browser');
        return;
    }
    
    AppState.recognition = new SpeechRecognition();
    AppState.recognition.lang = 'en-US';
    AppState.recognition.interimResults = false;
    AppState.recognition.maxAlternatives = 1;
    
    AppState.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleUserSpeech(transcript);
    };
    
    AppState.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        showToast('🎤 Speech recognition error. Please try again.');
        stopRecording();
    };
    
    AppState.recognition.onend = () => {
        if (AppState.isRecording) {
            stopRecording();
        }
    };
}

function startRecording() {
    if (!AppState.recognition) {
        initSpeechRecognition();
    }
    
    if (AppState.isRecording || !AppState.recognition) return;
    
    AppState.isRecording = true;
    Elements.recordBtn.classList.add('recording');
    Elements.recordingAnimation.classList.add('active');
    
    try {
        AppState.recognition.start();
    } catch (e) {
        console.error('Failed to start recognition:', e);
    }
}

function stopRecording() {
    AppState.isRecording = false;
    Elements.recordBtn.classList.remove('recording');
    Elements.recordingAnimation.classList.remove('active');
    
    if (AppState.recognition) {
        try {
            AppState.recognition.stop();
        } catch (e) {
            // Ignore
        }
    }
}

function handleUserSpeech(text) {
    // Add user message
    addMessage('user', text);
    
    // Update stats
    AppState.stats.totalSentences++;
    
    // Reset hint timer
    resetHintTimer();
    
    // Get AI response
    setTimeout(() => {
        const response = getAIResponse(text);
        speakText(response);
        addMessage('ai', response);
    }, 500);
}

// ============================================
// AI Response Generation
// ============================================
function getAIResponse(userText) {
    const scene = AppState.currentScene;
    if (!scene) return "I'm not sure what you mean.";
    
    const text = userText.toLowerCase();
    const responses = scene.dialogue.responses;
    
    // Simple keyword matching (can be replaced with API call)
    if (text.includes('coffee') || text.includes('drink')) {
        return responses.coffee || "Great choice! What size would you like?";
    }
    if (text.includes('tea')) {
        return responses.tea || "We have green tea, black tea, and herbal tea.";
    }
    if (text.includes('water')) {
        return responses.water || "Sure! Hot or cold?";
    }
    if (text.includes('progress') || text.includes('done')) {
        return responses.progress || "That's great! What's next?";
    }
    if (text.includes('help') || text.includes('need')) {
        return responses.help || "What kind of support do you need?";
    }
    
    // Recast method - repeat back correctly (隐性纠错)
    return recastText(text) || responses.default || "Could you tell me more?";
}

// Recast method - 重述法：correctly repeat without explicit correction
function recastText(text) {
    // Simple recast examples
    const recasts = {
        'i want': "Oh, you want...",
        'i go': "Oh, you went...",
        'i have': "So you have...",
        'me want': "Oh, you want...",
        'no have': "Oh, you don't have...",
        'i no': "Oh, you don't...",
        'i not': "Oh, you don't..."
    };
    
    for (const [pattern, recast] of Object.entries(recasts)) {
        if (text.includes(pattern)) {
            return `${recast} Could you elaborate?`;
        }
    }
    
    return null;
}

// ============================================
// Text-to-Speech
// ============================================
function speakText(text) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = AppState.avatar.speed / 3; // Adjust based on user preference
    
    // Try to get a good English voice
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.includes('en') && !v.lang.includes('GB')) || voices[0];
    if (englishVoice) {
        utterance.voice = englishVoice;
    }
    
    window.speechSynthesis.speak(utterance);
}

// Ensure voices are loaded
window.speechSynthesis.getVoices();

// ============================================
// Chat Panel
// ============================================
function addMessage(role, text) {
    if (!Elements.chatContent) return;
    
    const messageEl = document.createElement('div');
    messageEl.className = `message ${role}`;
    messageEl.innerHTML = `
        <div class="message-bubble">
            ${text}
        </div>
    `;
    
    Elements.chatContent.appendChild(messageEl);
    Elements.chatContent.scrollTop = Elements.chatContent.scrollHeight;
    
    // Store in conversation
    AppState.conversation.push({ role, text, timestamp: Date.now() });
}

function toggleChatPanel() {
    Elements.chatPanel.classList.toggle('active');
}

// ============================================
// Hint System
// ============================================
function initHintTimer() {
    // Clear any existing timer
    if (AppState.hintTimer) {
        clearTimeout(AppState.hintTimer);
    }
    
    // Start new timer for progressive hints
    AppState.hintLevel = 0;
    
    // Level 1: After 5 seconds -语音锚点提示
    AppState.hintTimer = setTimeout(() => {
        showHintLevel1();
    }, 5000);
}

function resetHintTimer() {
    initHintTimer();
}

function showHintLevel1() {
    // 语音锚点：slow down and repeat key words
    const scene = AppState.currentScene;
    if (!scene) return;
    
    // Get last AI message
    const lastAiMessage = AppState.conversation
        .filter(m => m.role === 'ai')
        .pop();
    
    if (lastAiMessage) {
        // Extract key words (simplified)
        const words = lastAiMessage.text.split(' ');
        const keyWord = words[words.length - 2] || words[0];
        
        showToast(`💡 Hint: "${keyWord}..."`);
    }
    
    // Level 2: After 10 more seconds
    AppState.hintTimer = setTimeout(() => {
        showHintLevel2();
    }, 10000);
}

function showHintLevel2() {
    // 单词级视觉暗示：show first letter or highlight
    const scene = AppState.currentScene;
    if (!scene) return;
    
    const hint = scene.dialogue.hints[0] || "Try rephrasing your sentence";
    showToast(`💡 Try: "${hint}"`);
    
    // Level 3: After 15 more seconds
    AppState.hintTimer = setTimeout(() => {
        showHintLevel3();
    }, 15000);
}

function showHintLevel3() {
    // 中文翻译：show full hint
    const scene = AppState.currentScene;
    if (!scene) return;
    
    const hint = scene.dialogue.hints[1] || scene.dialogue.hints[0] || "Keep trying!";
    showToast(`💡 💡 Hint: "${hint}"`);
    
    // Record as "卡顿遗迹"
    recordStuckInstance();
}

function recordStuckInstance() {
    // Track stuck instances for analytics
    let stuckCount = parseInt(localStorage.getItem('alterEgo_stuckCount') || '0');
    stuckCount++;
    localStorage.setItem('alterEgo_stuckCount', stuckCount.toString());
}

// Manual hint button
if (Elements.hintBtn) {
    Elements.hintBtn.addEventListener('click', () => {
        // Skip to next hint level
        AppState.hintLevel++;
        if (AppState.hintLevel === 1) showHintLevel1();
        else if (AppState.hintLevel === 2) showHintLevel2();
        else if (AppState.hintLevel >= 3) showHintLevel3();
    });
}

// ============================================
// Toast Notifications
// ============================================
function showToast(message, duration = 3000) {
    if (!Elements.toast) return;
    
    Elements.toast.textContent = message;
    Elements.toast.classList.add('show');
    
    setTimeout(() => {
        Elements.toast.classList.remove('show');
    }, duration);
}

// ============================================
// Stats & Progress
// ============================================
function updateStats() {
    // Update display
    document.getElementById('total-minutes').textContent = AppState.stats.totalMinutes;
    document.getElementById('total-sentences').textContent = AppState.stats.totalSentences;
    document.getElementById('streak-days').textContent = AppState.stats.streakDays;
    document.getElementById('currency-amount').textContent = AppState.stats.currency;
    document.getElementById('scene-currency').textContent = '+' + AppState.stats.currency;
    document.getElementById('user-level').textContent = AppState.stats.level;
}

function saveStats() {
    localStorage.setItem('alterEgo_stats', JSON.stringify(AppState.stats));
}

function loadStats() {
    const saved = localStorage.getItem('alterEgo_stats');
    if (saved) {
        AppState.stats = JSON.parse(saved);
    }
    updateStats();
}

// ============================================
// Event Listeners
// ============================================
function initEventListeners() {
    // Record button
    if (Elements.recordBtn) {
        Elements.recordBtn.addEventListener('mousedown', startRecording);
        Elements.recordBtn.addEventListener('mouseup', stopRecording);
        Elements.recordBtn.addEventListener('touchstart', (e) => { e.preventDefault(); startRecording(); });
        Elements.recordBtn.addEventListener('touchend', (e) => { e.preventDefault(); stopRecording(); });
    }
    
    // Chat history button
    if (Elements.chatHistoryBtn) {
        Elements.chatHistoryBtn.addEventListener('click', toggleChatPanel);
    }
    
    // Close chat
    if (Elements.closeChat) {
        Elements.closeChat.addEventListener('click', () => {
            Elements.chatPanel.classList.remove('active');
        });
    }
    
    // Back to scenes
    if (Elements.backScenesBtn) {
        Elements.backScenesBtn.addEventListener('click', () => {
            showPage('sceneSelection');
        });
    }
    
    // Continue practice
    if (Elements.continuePracticeBtn) {
        Elements.continuePracticeBtn.addEventListener('click', () => {
            showPage('sceneSelection');
        });
    }
    
    // Navigation
    Elements.navItems.forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            if (page) showPage(page);
        });
    });
}

// ============================================
// Initialization
// ============================================
function init() {
    console.log('🚀 Alter Ego - Initializing...');
    
    // Load saved data
    loadAvatar();
    loadStats();
    
    // Initialize modules
    initAvatarCreation();
    initSceneSelection();
    initEventListeners();
    
    // Initialize speech recognition
    initSpeechRecognition();
    
    // Update UI
    updateStats();
    
    console.log('✅ Alter Ego - Ready!');
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}