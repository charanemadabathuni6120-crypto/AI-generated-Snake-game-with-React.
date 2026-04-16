import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 150;

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  
  const lastUpdateTime = useRef<number>(0);
  const requestRef = useRef<number>(null);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food is on snake
      const onSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    setFood(newFood);
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    generateFood();
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    const newHead = {
      x: (snake[0].x + direction.x + GRID_SIZE) % GRID_SIZE,
      y: (snake[0].y + direction.y + GRID_SIZE) % GRID_SIZE,
    };

    // Check collision with self
    if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
      setIsGameOver(true);
      if (score > highScore) setHighScore(score);
      return;
    }

    const newSnake = [newHead, ...snake];

    // Check food collision
    if (newHead.x === food.x && newHead.y === food.y) {
      setScore(s => s + 10);
      generateFood();
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, food, isGameOver, isPaused, score, highScore, generateFood]);

  const gameLoop = useCallback((time: number) => {
    if (lastUpdateTime.current === 0) lastUpdateTime.current = time;
    const deltaTime = time - lastUpdateTime.current;

    if (deltaTime > GAME_SPEED) {
      moveSnake();
      lastUpdateTime.current = time;
    }

    requestRef.current = requestAnimationFrame(gameLoop);
  }, [moveSnake]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameLoop]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid (subtle)
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw food
    ctx.fillStyle = '#ff0055';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff0055';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#00f2ff' : '#0066ff';
      ctx.shadowBlur = isHead ? 20 : 0;
      ctx.shadowColor = '#00f2ff';
      
      const padding = 2;
      ctx.fillRect(
        segment.x * cellSize + padding,
        segment.y * cellSize + padding,
        cellSize - padding * 2,
        cellSize - padding * 2
      );
      ctx.shadowBlur = 0;
    });
  }, [snake, food]);

  return (
    <div id="snake-game-container" className="flex flex-col items-center gap-6 p-6 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
      <div id="game-stats-header" className="flex justify-between w-full items-center px-4">
        <div id="score-display" className="flex flex-col">
          <span className="text-xs uppercase tracking-widest text-white/40 font-mono">Score</span>
          <span id="current-score" className="text-3xl font-bold text-cyan-400 font-mono drop-shadow-[0_0_10px_rgba(0,242,255,0.5)]">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div id="high-score-display" className="flex flex-col items-end">
          <span className="text-xs uppercase tracking-widest text-white/40 font-mono">Best</span>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span id="best-score" className="text-xl font-bold text-white/80 font-mono">
              {highScore.toString().padStart(4, '0')}
            </span>
          </div>
        </div>
      </div>

      <div id="canvas-wrapper" className="relative group">
        <canvas
          id="snake-canvas"
          ref={canvasRef}
          width={400}
          height={400}
          className="rounded-xl border-2 border-cyan-500/30 shadow-[0_0_30px_rgba(0,242,255,0.1)] transition-all duration-500 group-hover:border-cyan-500/50"
        />
        
        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div
              id="game-overlay"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-xl"
            >
              {isGameOver ? (
                <>
                  <h2 id="game-over-title" className="text-4xl font-heading font-black text-red-500 mb-2 tracking-tighter uppercase italic">Game Over</h2>
                  <p id="final-score-text" className="text-white/60 mb-6 font-mono">Final Score: {score}</p>
                  <Button 
                    id="restart-game-btn"
                    onClick={resetGame}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-full px-8 py-6 text-lg font-bold shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                  >
                    <RotateCcw className="mr-2 w-5 h-5" /> Try Again
                  </Button>
                </>
              ) : (
                <>
                  <h2 id="paused-title" className="text-4xl font-heading font-black text-cyan-400 mb-6 tracking-tighter uppercase italic drop-shadow-[0_0_15px_rgba(0,242,255,0.5)]">Paused</h2>
                  <Button 
                    id="resume-game-btn"
                    onClick={() => setIsPaused(false)}
                    className="bg-cyan-500 hover:bg-cyan-600 text-black rounded-full px-10 py-8 text-xl font-black shadow-[0_0_30px_rgba(6,182,212,0.5)]"
                  >
                    <Play className="mr-2 w-6 h-6 fill-current" /> Resume
                  </Button>
                  <p id="pause-hint" className="mt-4 text-white/40 text-sm font-mono uppercase tracking-widest">Press Space to Start</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div id="game-legend" className="flex gap-4 text-white/40 text-[10px] font-mono uppercase tracking-[0.2em]">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_5px_rgba(6,182,212,1)]" />
          Snake
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,1)]" />
          Food
        </div>
        <div className="flex items-center gap-1">
          <kbd id="pause-key-hint" className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-white/60">SPACE</kbd>
          Pause
        </div>
      </div>
    </div>
  );
};
