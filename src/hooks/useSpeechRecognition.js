import { useState, useCallback, useEffect } from 'react';

/**
 * 语音识别 Hook
 * 封装浏览器 Web Speech API 的语音识别功能
 */
export function useSpeechRecognition(options = {}) {
  const {
    lang = 'en-US',
    continuous = true,
    interimResults = true,
    onResult,
    onError,
    onStart,
    onEnd
  } = options;

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSupported(!!SpeechRecognition);
  }, []);

  const startRecording = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('浏览器不支持语音识别');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;

    recognition.onstart = () => {
      setIsRecording(true);
      setError(null);
      onStart?.();
    };

    recognition.onresult = (event) => {
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

      if (finalTranscript) {
        setTranscript(prev => prev + finalTranscript);
        onResult?.(finalTranscript, 'final');
      }
      if (interimTranscript) {
        onResult?.(interimTranscript, 'interim');
      }
    };

    recognition.onerror = (event) => {
      setError(event.error);
      setIsRecording(false);
      onError?.(event.error);
    };

    recognition.onend = () => {
      setIsRecording(false);
      onEnd?.();
    };

    recognition.start();
  }, [lang, continuous, interimResults, onStart, onError, onEnd, onResult]);

  const stopRecording = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition && isRecording) {
      // 注意：Web Speech API 没有直接的 stop 方法
      // 通常通过重新创建 recognition 实例来停止
      setIsRecording(false);
    }
  }, [isRecording]);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  return {
    isRecording,
    transcript,
    error,
    supported,
    startRecording,
    stopRecording,
    clearTranscript
  };
}

export default useSpeechRecognition;