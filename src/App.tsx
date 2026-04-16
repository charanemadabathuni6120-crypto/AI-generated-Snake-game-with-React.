/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div id="app-root" className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30 overflow-hidden relative font-sans">
      {/* Atmospheric Background */}
      <div id="background-fx" className="fixed inset-0 overflow-hidden pointer-events-none">
        <div id="glow-top-left" className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div id="glow-bottom-right" className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[150px]" />
        <div id="glow-center-right" className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-blue-500/5 blur-[100px]" />
        <div id="noise-overlay" className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <main id="main-content" className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center gap-12 max-w-7xl">
        <motion.div 
          id="hero-section"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center space-y-2"
        >
          <h1 id="app-title" className="text-6xl md:text-8xl font-heading font-black tracking-tighter uppercase italic bg-gradient-to-r from-white via-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]">
            Neon Beats
          </h1>
          <p id="app-subtitle" className="text-xs md:text-sm font-mono uppercase tracking-[0.5em] text-white/40">
            Slither to the Rhythm
          </p>
        </motion.div>

        <div id="app-grid" className="flex flex-col lg:flex-row items-center justify-center gap-8 w-full">
          <motion.div
            id="music-player-wrapper"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full lg:w-auto"
          >
            <MusicPlayer />
          </motion.div>

          <motion.div
            id="snake-game-wrapper"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full lg:w-auto"
          >
            <SnakeGame />
          </motion.div>

          <motion.div
            id="sidebar-info"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="hidden xl:flex flex-col gap-4 w-64"
          >
            <div id="controls-card" className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 space-y-4">
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-white/40">Controls</h4>
              <ul id="controls-list" className="space-y-3 text-xs font-mono text-white/60">
                <li className="flex justify-between">
                  <span>Move</span>
                  <span className="text-cyan-400">Arrows</span>
                </li>
                <li className="flex justify-between">
                  <span>Pause</span>
                  <span className="text-cyan-400">Space</span>
                </li>
                <li className="flex justify-between">
                  <span>Volume</span>
                  <span className="text-cyan-400">Slider</span>
                </li>
              </ul>
            </div>

            <div id="about-card" className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 space-y-4">
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-white/40">About</h4>
              <p className="text-[10px] leading-relaxed text-white/40 uppercase tracking-wider">
                A fusion of retro arcade mechanics and modern synthwave aesthetics. 
                Built for the digital nomad.
              </p>
            </div>
          </motion.div>
        </div>

        <footer id="app-footer" className="mt-auto pt-8 flex items-center gap-4 opacity-20 hover:opacity-100 transition-opacity duration-500">
          <div className="h-[1px] w-12 bg-white" />
          <span id="footer-text" className="text-[10px] font-mono uppercase tracking-[0.4em]">Est. 2026 // AIS Build</span>
          <div className="h-[1px] w-12 bg-white" />
        </footer>
      </main>
    </div>
  );
}

