/**
 * 测试环境设置
 */

// 模拟 localStorage
const localStorageMock = {
  store: {},
  getItem(key) {
    return this.store[key] || null;
  },
  setItem(key, value) {
    this.store[key] = value.toString();
  },
  removeItem(key) {
    delete this.store[key];
  },
  clear() {
    this.store = {};
  }
};

global.localStorage = localStorageMock;

// 模拟 fetch API
global.fetch = async (url, options) => {
  return {
    ok: true,
    status: 200,
    json: async () => ({}),
    text: async () => ''
  };
};

// 模拟 SpeechRecognition
class MockSpeechRecognition {
  constructor() {
    this.lang = 'en-US';
    this.continuous = false;
    this.interimResults = false;
  }
  
  start() {
    if (this.onstart) this.onstart();
  }
  
  stop() {
    if (this.onend) this.onend();
  }
}

global.SpeechRecognition = MockSpeechRecognition;
global.webkitSpeechRecognition = MockSpeechRecognition;

// 模拟 SpeechSynthesis
class MockSpeechSynthesisUtterance {
  constructor(text) {
    this.text = text;
  }
}

class MockSpeechSynthesis {
  constructor() {
    this.speaking = false;
    this.paused = false;
    this.voices = [];
  }
  
  speak(utterance) {
    this.speaking = true;
    if (utterance.onstart) utterance.onstart();
    setTimeout(() => {
      this.speaking = false;
      if (utterance.onend) utterance.onend();
    }, 1000);
  }
  
  cancel() {
    this.speaking = false;
  }
  
  pause() {
    this.paused = true;
  }
  
  resume() {
    this.paused = false;
  }
  
  getVoices() {
    return this.voices;
  }
}

global.SpeechSynthesisUtterance = MockSpeechSynthesisUtterance;
global.speechSynthesis = new MockSpeechSynthesis();