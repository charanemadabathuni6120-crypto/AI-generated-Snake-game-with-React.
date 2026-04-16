import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, ListMusic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Track } from '@/src/types';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Horizon',
    artist: 'CyberSynth AI',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/neon1/400/400',
  },
  {
    id: '2',
    title: 'Midnight Pulse',
    artist: 'Digital Dreamer',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/neon2/400/400',
  },
  {
    id: '3',
    title: 'Electric Rain',
    artist: 'SynthWave Bot',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/neon3/400/400',
  },
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.log('Playback blocked', e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setCurrentTime(current);
      setDuration(total);
      setProgress((current / total) * 100);
    }
  };

  const handleTrackEnd = () => {
    handleNext();
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current) {
      const newTime = (value[0] / 100) * duration;
      audioRef.current.currentTime = newTime;
      setProgress(value[0]);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div id="music-player-container" className="w-full max-w-md bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl flex flex-col gap-6">
      <div id="player-header" className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Music className="w-4 h-4 text-cyan-400" />
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40">Now Playing</span>
        </div>
        <ListMusic id="playlist-toggle" className="w-4 h-4 text-white/20 cursor-pointer hover:text-white/60 transition-colors" />
      </div>

      <div id="album-art-container" className="relative aspect-square w-full overflow-hidden rounded-2xl border border-white/5 shadow-inner group">
        <AnimatePresence mode="wait">
          <motion.img
            id={`track-cover-${currentTrack.id}`}
            key={currentTrack.id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            src={currentTrack.cover}
            alt={currentTrack.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        <div className="absolute bottom-4 left-4 right-4">
          <motion.h3 
            id="current-track-title"
            key={`title-${currentTrack.id}`}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-xl font-heading font-bold text-white tracking-tight"
          >
            {currentTrack.title}
          </motion.h3>
          <motion.p 
            id="current-track-artist"
            key={`artist-${currentTrack.id}`}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm text-cyan-400/80 font-medium"
          >
            {currentTrack.artist}
          </motion.p>
        </div>
      </div>

      <div id="playback-controls-container" className="space-y-4">
        <div id="progress-container" className="space-y-2">
          <Slider
            id="track-progress-slider"
            value={[progress]}
            max={100}
            step={0.1}
            onValueChange={handleProgressChange}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-white/40 uppercase tracking-widest">
            <span id="current-time">{formatTime(currentTime)}</span>
            <span id="total-duration">{formatTime(duration)}</span>
          </div>
        </div>

        <div id="main-controls" className="flex items-center justify-center gap-8">
          <Button
            id="prev-track-btn"
            variant="ghost"
            size="icon"
            onClick={handlePrev}
            className="text-white/60 hover:text-white hover:bg-white/5 rounded-full"
          >
            <SkipBack className="w-6 h-6 fill-current" />
          </Button>
          
          <Button
            id="play-pause-btn"
            size="icon"
            onClick={handlePlayPause}
            className="w-16 h-16 rounded-full bg-white text-black hover:bg-cyan-400 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 fill-current" />
            ) : (
              <Play className="w-8 h-8 fill-current ml-1" />
            )}
          </Button>

          <Button
            id="next-track-btn"
            variant="ghost"
            size="icon"
            onClick={handleNext}
            className="text-white/60 hover:text-white hover:bg-white/5 rounded-full"
          >
            <SkipForward className="w-6 h-6 fill-current" />
          </Button>
        </div>

        <div id="volume-controls" className="flex items-center gap-4 px-2">
          <Volume2 className="w-4 h-4 text-white/40" />
          <Slider
            id="volume-slider"
            value={[volume]}
            max={100}
            onValueChange={(v) => setVolume(v[0])}
            className="w-full cursor-pointer"
          />
        </div>
      </div>

      <audio
        id="audio-element"
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
        onLoadedMetadata={handleTimeUpdate}
      />
    </div>
  );
};
