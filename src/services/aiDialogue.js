// AI 对话服务 - 使用 GPT API 或模拟响应
// 支持两种模式：
// 1. 模拟模式（默认）：使用预设响应，无需 API Key
// 2. API 模式：使用 OpenAI GPT API

const SCENE_PROMPTS = {
  cafe: `You are a friendly barista at a cozy coffee shop. You're helping a customer practice English. 
- Keep responses natural and conversational (2-3 sentences)
- Use recast method: if they make a mistake, naturally repeat the correct version without explicitly correcting them
- Guide the conversation naturally, ask follow-up questions
- Be encouraging and patient`,

  office: `You are a professional colleague in a business meeting. You're helping someone practice workplace English.
- Keep responses professional but friendly (2-3 sentences)
- Use recast method for corrections
- Discuss typical office topics: projects, meetings, deadlines
- Be supportive and encouraging`,

  airport: `You are an airport staff member helping a traveler. You're assisting with English practice.
- Keep responses clear and helpful (2-3 sentences)
- Use recast method for corrections
- Topics: check-in, boarding, directions, luggage
- Be patient and clear`,

  hotel: `You are a hotel receptionist helping a guest check in. You're helping practice hotel English.
- Keep responses professional and welcoming (2-3 sentences)
- Use recast method for corrections
- Topics: reservation, room features, amenities, services
- Be friendly and helpful`,

  restaurant: `You are a restaurant server taking an order. You're helping practice restaurant English.
- Keep responses warm and attentive (2-3 sentences)
- Use recast method for corrections
- Topics: menu recommendations, dietary preferences, ordering
- Be friendly and accommodating`,

  hospital: `You are a doctor or nurse helping a patient. You're helping practice medical English.
- Keep responses caring and clear (2-3 sentences)
- Use recast method for corrections
- Topics: symptoms, treatment, medication, health advice
- Be empathetic and professional`
}

// 模拟响应库（用于无 API 模式）
const MOCK_RESPONSES = {
  cafe: [
    "Sure! What kind of coffee would you like? We have espresso, latte, cappuccino, and more.",
    "Great choice! Would you like anything else with that? Maybe some pastries?",
    "For here or to go?",
    "What size would you like? We have small, medium, and large.",
    "Would you like milk or sugar with your coffee?",
    "That'll be $5.50, please. Would you like to pay by card or cash?"
  ],
  office: [
    "Good morning! How's the project going?",
    "That sounds like a good plan. When do you think we can have it ready?",
    "I agree with your approach. Let's discuss it in the meeting.",
    "Do you need any help with that task?",
    "The deadline is next Friday. Can you make it?",
    "Great work on the presentation yesterday!"
  ],
  airport: [
    "Good morning! May I see your passport and ticket, please?",
    "Would you like a window seat or an aisle seat?",
    "Do you have any luggage to check in?",
    "Your gate is A12. Boarding starts at 3 PM.",
    "Please have your boarding pass ready for security check.",
    "Is this your first time flying with us?"
  ],
  hotel: [
    "Welcome! Do you have a reservation?",
    "How many nights will you be staying with us?",
    "Would you like a single room or a double room?",
    "Breakfast is served from 6 AM to 10 AM in the restaurant.",
    "Here's your key card. Your room is on the 5th floor.",
    "Is there anything else I can help you with?"
  ],
  restaurant: [
    "Welcome! How many people are in your party?",
    "Here's the menu. Would you like to hear today's specials?",
    "Are you ready to order, or do you need more time?",
    "Would you like to start with some appetizers?",
    "How would you like your steak? Rare, medium, or well-done?",
    "Can I get you anything else? Dessert or coffee?"
  ],
  hospital: [
    "Hello, I'm Dr. Smith. What brings you in today?",
    "How long have you been feeling this way?",
    "Do you have any allergies I should know about?",
    "Let me check your vital signs. Please sit here.",
    "I think you have a mild infection. I'll prescribe some medication.",
    "Make sure to get plenty of rest and drink lots of water."
  ]
}

class AIDialogueService {
  constructor() {
    this.currentScene = null
    this.conversationHistory = []
    this.apiKey = null
    this.useMockMode = true // 默认使用模拟模式
  }

  // 设置场景上下文
  setSceneContext(scene) {
    this.currentScene = scene.id
    this.conversationHistory = []
    
    const systemPrompt = SCENE_PROMPTS[scene.id] || SCENE_PROMPTS.cafe
    this.conversationHistory.push({
      role: 'system',
      content: systemPrompt
    })
  }

  // 设置 API Key（可选）
  setApiKey(key) {
    this.apiKey = key
    if (key) {
      this.useMockMode = false
    }
  }

  // 发送消息并获取 AI 响应
  async sendMessage(userText) {
    // 添加到历史记录
    this.conversationHistory.push({
      role: 'user',
      content: userText
    })

    if (this.useMockMode) {
      return this.getMockResponse()
    }

    return this.getAPIResponse()
  }

  // 模拟响应（无需 API）
  getMockResponse() {
    return new Promise((resolve) => {
      // 模拟网络延迟
      const delay = Math.random() * 1000 + 500
      
      setTimeout(() => {
        const sceneResponses = MOCK_RESPONSES[this.currentScene] || MOCK_RESPONSES.cafe
        const randomResponse = sceneResponses[
          Math.floor(Math.random() * sceneResponses.length)
        ]
        
        // 添加到历史记录
        this.conversationHistory.push({
          role: 'assistant',
          content: randomResponse
        })
        
        // 保持历史记录不过长
        if (this.conversationHistory.length > 10) {
          this.conversationHistory = [
            this.conversationHistory[0], // 保留 system prompt
            ...this.conversationHistory.slice(-8)
          ]
        }
        
        resolve(randomResponse)
      }, delay)
    })
  }

  // API 响应（需要 OpenAI API Key）
  async getAPIResponse() {
    if (!this.apiKey) {
      return this.getMockResponse()
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: this.conversationHistory,
          max_tokens: 150,
          temperature: 0.7
        })
      })

      if (!response.ok) {
        throw new Error('API request failed')
      }

      const data = await response.json()
      const aiResponse = data.choices[0].message.content

      // 添加到历史记录
      this.conversationHistory.push({
        role: 'assistant',
        content: aiResponse
      })

      // 保持历史记录不过长
      if (this.conversationHistory.length > 10) {
        this.conversationHistory = [
          this.conversationHistory[0],
          ...this.conversationHistory.slice(-8)
        ]
      }

      return aiResponse
    } catch (error) {
      console.error('API error:', error)
      return this.getMockResponse()
    }
  }

  // 重置对话
  reset() {
    this.conversationHistory = []
    this.currentScene = null
  }

  // 获取对话历史
  getHistory() {
    return this.conversationHistory
  }
}

export default new AIDialogueService()