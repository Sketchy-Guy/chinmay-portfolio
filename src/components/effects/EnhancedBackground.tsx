import { useEffect, useRef } from 'react';

const EnhancedBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create enhanced floating elements
    const elements = [
      { color: '#3b82f6', size: '16px', top: '20%', left: '10%', delay: '0s' },
      { color: '#6366f1', size: '12px', top: '60%', left: '85%', delay: '2s' },
      { color: '#8b5cf6', size: '14px', top: '80%', left: '15%', delay: '4s' },
      { color: '#06b6d4', size: '10px', top: '30%', left: '70%', delay: '1s' },
      { color: '#10b981', size: '8px', top: '50%', left: '5%', delay: '3s' },
    ];

    elements.forEach((element, index) => {
      const div = document.createElement('div');
      div.style.cssText = `
        position: absolute;
        width: ${element.size};
        height: ${element.size};
        background: linear-gradient(45deg, ${element.color}, ${element.color}80);
        border-radius: 50%;
        top: ${element.top};
        left: ${element.left};
        opacity: 0.4;
        animation: enhanced-float-${index} 8s ease-in-out infinite;
        animation-delay: ${element.delay};
        box-shadow: 0 0 30px ${element.color}40;
      `;
      containerRef.current?.appendChild(div);
    });

    // Enhanced CSS animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes enhanced-float-0 {
        0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
        50% { transform: translateY(-30px) rotate(180deg) scale(1.2); }
      }
      @keyframes enhanced-float-1 {
        0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
        50% { transform: translateY(-25px) rotate(-180deg) scale(0.8); }
      }
      @keyframes enhanced-float-2 {
        0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
        50% { transform: translateY(-35px) rotate(180deg) scale(1.1); }
      }
      @keyframes enhanced-float-3 {
        0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
        50% { transform: translateY(-20px) rotate(-180deg) scale(0.9); }
      }
      @keyframes enhanced-float-4 {
        0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
        50% { transform: translateY(-28px) rotate(180deg) scale(1.15); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
};

export default EnhancedBackground;