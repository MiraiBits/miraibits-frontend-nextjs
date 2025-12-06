'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from './ThemeProvider';

export default function Snowflakes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    class Particle {
      x: number;
      y: number;
      radius: number;
      speed: number;
      opacity: number;
      drift: number;

      constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.radius = Math.random() * 2 + 1;
        this.speed = Math.random() * 1 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.drift = Math.random() * 0.5 - 0.25;
      }

      update(canvasWidth: number, canvasHeight: number) {
        this.y += this.speed;
        this.x += this.drift;

        if (this.y > canvasHeight) {
          this.y = 0;
          this.x = Math.random() * canvasWidth;
        }

        if (this.x > canvasWidth) this.x = 0;
        if (this.x < 0) this.x = canvasWidth;
      }

      draw(ctx: CanvasRenderingContext2D, color: string) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = color.replace('ALPHA', this.opacity.toString());
        ctx.fill();
      }
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(Math.floor(window.innerWidth / 15), 100);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvas.width, canvas.height));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const color = theme === 'dark'
        ? 'rgba(255, 255, 255, ALPHA)'
        : 'rgba(100, 100, 100, ALPHA)';

      particles.forEach(p => {
        p.update(canvas.width, canvas.height);
        p.draw(ctx, color);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
