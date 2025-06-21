
import { useEffect, useRef } from 'react';

interface InteractiveBackgroundProps {
  mousePosition: { x: number; y: number };
}

const InteractiveBackground = ({ mousePosition }: InteractiveBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Significantly reduced particle count for professional appearance
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < 8; i++) { // Reduced from 50+ to 8
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.2, // Much slower movement
          vy: (Math.random() - 0.5) * 0.2,
          size: Math.random() * 1 + 0.5, // Smaller particles
          opacity: Math.random() * 0.15 + 0.05, // Much lower opacity
          hue: Math.random() * 40 + 200, // Blue range only
        });
      }
    };

    initParticles();

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.01)'; // Much more subtle clearing
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, index) => {
        // Very gentle movement
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Minimal mouse interaction
        const dx = mousePosition.x - particle.x;
        const dy = mousePosition.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 60) { // Reduced interaction range
          const force = (60 - distance) / 60;
          particle.vx += (dx / distance) * force * 0.002; // Much gentler force
          particle.vy += (dy / distance) * force * 0.002;
        }

        // Boundary checks
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Draw particle with minimal visual impact
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = `hsl(${particle.hue}, 30%, 60%)`; // Very muted colors
        ctx.shadowBlur = 2; // Minimal glow
        ctx.shadowColor = `hsl(${particle.hue}, 30%, 60%)`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Minimal connections
        particlesRef.current.slice(index + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 80) { // Reduced connection distance
            ctx.save();
            ctx.globalAlpha = (80 - distance) / 80 * 0.05; // Very low opacity
            ctx.strokeStyle = `hsl(${(particle.hue + otherParticle.hue) / 2}, 30%, 60%)`;
            ctx.lineWidth = 0.2; // Very thin lines
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
            ctx.restore();
          }
        });
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mousePosition]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.15 }} // Much reduced overall opacity
    />
  );
};

export default InteractiveBackground;
