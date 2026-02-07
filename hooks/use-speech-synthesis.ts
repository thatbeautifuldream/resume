import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for Web Speech API Text-to-Speech
 * Automatically selects the best available voice
 */
export function useSpeechSynthesis() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceQueueRef = useRef<SpeechSynthesisUtterance[]>([]);

  // Initialize and load voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
      }
    };

    // Try immediate load
    loadVoices();

    // Chrome requires waiting for voiceschanged event
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  /**
   * Select the best available voice
   * Priority: English > Natural/Premium > Default
   */
  const getBestVoice = useCallback((): SpeechSynthesisVoice | null => {
    if (voices.length === 0) return null;

    // Try to find a good English voice
    // Priority order:
    // 1. English voices with "natural" or "premium" in name
    // 2. English voices that are local (better performance)
    // 3. Any English voice
    // 4. Default voice

    const englishVoices = voices.filter((voice) =>
      voice.lang.startsWith('en')
    );

    // Look for high-quality English voices
    const naturalVoice = englishVoices.find((voice) =>
      /natural|premium|enhanced|google/i.test(voice.name)
    );
    if (naturalVoice) return naturalVoice;

    // Prefer local voices (faster, more reliable)
    const localEnglishVoice = englishVoices.find((voice) => voice.localService);
    if (localEnglishVoice) return localEnglishVoice;

    // Any English voice
    if (englishVoices.length > 0) return englishVoices[0];

    // Fallback to first available voice
    return voices[0];
  }, [voices]);

  /**
   * Split text into chunks to handle Chrome's 200-300 char limit
   */
  const chunkText = useCallback((text: string, maxLength: number = 250): string[] => {
    if (text.length <= maxLength) return [text];

    // Split by sentences
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const chunks: string[] = [];
    let currentChunk = '';

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length <= maxLength) {
        currentChunk += sentence;
      } else {
        if (currentChunk) chunks.push(currentChunk.trim());
        currentChunk = sentence;
      }
    }

    if (currentChunk) chunks.push(currentChunk.trim());

    return chunks;
  }, []);

  /**
   * Speak text using Web Speech API
   */
  const speak = useCallback((text: string) => {
    if (!isSupported || !text || text.trim().length === 0) {
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    utteranceQueueRef.current = [];

    const chunks = chunkText(text);
    const bestVoice = getBestVoice();

    chunks.forEach((chunk, index) => {
      const utterance = new SpeechSynthesisUtterance(chunk);

      // Configure utterance
      utterance.voice = bestVoice;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Handle events
      if (index === 0) {
        utterance.onstart = () => {
          setIsSpeaking(true);
        };
      }

      if (index === chunks.length - 1) {
        utterance.onend = () => {
          setIsSpeaking(false);
          utteranceQueueRef.current = [];
        };
      }

      utterance.onerror = (event) => {
        // Only log actual errors, not cancellations
        // When user clicks stop, browser fires 'canceled' or 'interrupted' error
        if (event.error && event.error !== 'canceled' && event.error !== 'interrupted') {
          console.error('Speech synthesis error:', event.error);
        }
        setIsSpeaking(false);
        utteranceQueueRef.current = [];
      };

      utteranceQueueRef.current.push(utterance);
      window.speechSynthesis.speak(utterance);
    });
  }, [isSupported, chunkText, getBestVoice]);

  /**
   * Cancel all speech
   */
  const cancel = useCallback(() => {
    if (!isSupported) return;

    window.speechSynthesis.cancel();
    utteranceQueueRef.current = [];
    setIsSpeaking(false);
  }, [isSupported]);

  /**
   * Pause speech
   */
  const pause = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.pause();
  }, [isSupported]);

  /**
   * Resume speech
   */
  const resume = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.resume();
  }, [isSupported]);

  return {
    speak,
    cancel,
    pause,
    resume,
    isSpeaking,
    isSupported,
    voices,
    selectedVoice: getBestVoice(),
  };
}
