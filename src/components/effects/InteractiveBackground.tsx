
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

    // Reduced particle count for better performance
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < 12; i++) { // Reduced from 50 to 12
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3, // Reduced speed
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 1.5 + 0.5, // Smaller particles
          opacity: Math.random() * 0.3 + 0.1, // Lower opacity
          hue: Math.random() * 60 + 220, // Blue to purple range
        });
      }
    };

    initParticles();

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.02)'; // Much more subtle clearing
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, index) => {
        // Gentle movement
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Reduced mouse interaction
        const dx = mousePosition.x - particle.x;
        const dy = mousePosition.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 80) { // Reduced interaction range
          const force = (80 - distance) / 80;
          particle.vx += (dx / distance) * force * 0.005; // Much gentler force
          particle.vy += (dy / distance) * force * 0.005;
        }

        // Boundary checks
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Draw particle with reduced visual impact
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = `hsl(${particle.hue}, 50%, 50%)`; // Reduced saturation
        ctx.shadowBlur = 5; // Reduced glow
        ctx.shadowColor = `hsl(${particle.hue}, 50%, 50%)`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Simplified connections
        particlesRef.current.slice(index + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 60) { // Reduced connection distance
            ctx.save();
            ctx.globalAlpha = (60 - distance) / 60 * 0.1; // Much lower opacity
            ctx.strokeStyle = `hsl(${(particle.hue + otherParticle.hue) / 2}, 50%, 50%)`;
            ctx.lineWidth = 0.3; // Thinner lines
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
      style={{ opacity: 0.25 }} // Reduced overall opacity
    />
  );
};

export default InteractiveBackground;
