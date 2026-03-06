/**
 * Воспроизведение термина: аудиофайл по audioUrl или TTS (Web Speech API).
 */

const TTS_LANG = 'en-GB';

let audioInstance: HTMLAudioElement | null = null;

function getAudio(): HTMLAudioElement {
  if (!audioInstance) audioInstance = new Audio();
  return audioInstance;
}

export function playFromUrl(url: string): Promise<void> {
  const audio = getAudio();
  audio.src = url;
  return new Promise((resolve, reject) => {
    audio.onended = () => resolve();
    audio.onerror = () => reject(new Error('Audio failed'));
    audio.play().then(() => {}).catch(reject);
  });
}

export function speakWithTTS(text: string): Promise<void> {
  if (!('speechSynthesis' in window)) {
    return Promise.reject(new Error('Speech synthesis not supported'));
  }
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = TTS_LANG;
    u.rate = 0.9;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  });
}

/** Воспроизвести термин: сначала audioUrl, иначе TTS */
export function playTerm(term: string, audioUrl?: string): Promise<void> {
  if (audioUrl) return playFromUrl(audioUrl);
  return speakWithTTS(term);
}

export function stopPlayback(): void {
  if (audioInstance) {
    audioInstance.pause();
    audioInstance.currentTime = 0;
    audioInstance.src = '';
  }
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}
