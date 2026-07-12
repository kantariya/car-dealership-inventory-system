import { useEffect, useRef } from 'react';
import audioSrc from '../../assets/audiobgm.mp3';

export default function BackgroundAudio() {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set very low background volume (between 0.05 and 0.08)
    audio.volume = 0.06;

    const playAudio = () => {
      audio.play().catch((err) => {
        // Log warning but don't crash
        console.warn('Background playback failed to start:', err);
      });
      removeListeners();
    };

    const addListeners = () => {
      document.addEventListener('click', playAudio);
      document.addEventListener('keydown', playAudio);
      document.addEventListener('touchstart', playAudio);
      document.addEventListener('mousedown', playAudio);
    };

    const removeListeners = () => {
      document.removeEventListener('click', playAudio);
      document.removeEventListener('keydown', playAudio);
      document.removeEventListener('touchstart', playAudio);
      document.removeEventListener('mousedown', playAudio);
    };

    addListeners();

    return () => {
      removeListeners();
    };
  }, []);

  return (
    <audio
      ref={audioRef}
      data-testid="bg-audio"
      src={audioSrc}
      loop
      style={{ display: 'none' }}
    />
  );
}
