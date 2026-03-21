import { useEffect, useRef, useState, useCallback } from 'react';
import * as Speech from 'expo-speech';

export interface SpeechOptions {
  rate: number;      // 0.1 – 2.0  (1.0 = normal)
  pitch: number;     // 0.5 – 2.0  (1.0 = normal)
  language: string;  // BCP-47 tag, e.g. 'en-US'
}

export const DEFAULT_SPEECH_OPTIONS: SpeechOptions = {
  rate: 0.9,
  pitch: 1.0,
  language: 'hi-IN',
};

export interface UseSpeechReturn {
  isSpeaking: boolean;
  isEnabled: boolean;
  options: SpeechOptions;
  speak: (text: string) => void;
  stop: () => void;
  setEnabled: (v: boolean) => void;
  setOptions: (o: Partial<SpeechOptions>) => void;
}

/**
 * useSpeech — wraps expo-speech.
 *
 * When `autoText` changes AND `isEnabled` is true, speech fires automatically.
 * Call `speak(text)` manually for on-demand TTS.
 */
export function useSpeech(autoText?: string): UseSpeechReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isEnabled, setEnabled] = useState(true);
  const [options, setOptionsState] = useState<SpeechOptions>(DEFAULT_SPEECH_OPTIONS);
  const prevAutoText = useRef<string | undefined>(undefined);

  // Auto-speak when autoText changes
  useEffect(() => {
    if (!autoText || autoText === prevAutoText.current) return;
    prevAutoText.current = autoText;
    if (isEnabled) {
      triggerSpeak(autoText);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoText, isEnabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const triggerSpeak = useCallback(
    (text: string) => {
      Speech.stop();
      setIsSpeaking(true);
      Speech.speak(text.trim(), {
        rate: options.rate,
        pitch: options.pitch,
        language: options.language,
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    },
    [options]
  );

  const speak = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      triggerSpeak(text);
    },
    [triggerSpeak]
  );

  const stop = useCallback(() => {
    Speech.stop();
    setIsSpeaking(false);
  }, []);

  const setOptions = useCallback((partial: Partial<SpeechOptions>) => {
    setOptionsState((prev) => ({ ...prev, ...partial }));
  }, []);

  return { isSpeaking, isEnabled, options, speak, stop, setEnabled, setOptions };
}
