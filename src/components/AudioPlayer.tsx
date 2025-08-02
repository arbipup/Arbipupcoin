"use client";
import { useEffect, useRef, useState } from "react";

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      audioRef.current.loop = true;
      const playAudio = async () => {
        try {
          await audioRef.current?.play();
        } catch {
          setIsPlaying(false);
        }
      };
      playAudio();
    }
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={toggleAudio}
        className="bg-black/70 text-white px-4 py-2 rounded-full shadow-lg border border-blue-400 hover:bg-blue-500 hover:text-black transition"
      >
        {isPlaying ? "🔊 Mute" : "🔇 Unmute"}
      </button>
      <audio
        ref={audioRef}
        src="https://files.catbox.moe/ok25pf.mp3"
        autoPlay
      />
    </div>
  );
}
