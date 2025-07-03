import { useEffect, useRef } from 'react';

const Simple3DBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create simple floating elements using CSS animations
    const elements = [
      { color: '#3b82f6', size: '12px', top: '20%', left: '10%', delay: '0s' },
      { color: '#6366f1', size: '8px', top: '60%', left: '85%', delay: '2s' },
      { color: '#8b5cf6', size: '10px', top: '80%', left: '15%', delay: '4s' },
      { color: '#06b6d4', size: '6px', top: '30%', left: '70%', delay: '1s' },
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
        opacity: 0.6;
        animation: float-${index} 6s ease-in-out infinite;
        animation-delay: ${element.delay};
        box-shadow: 0 0 20px ${element.color}40;
      `;
      containerRef.current?.appendChild(div);
    });

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float-0 {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
      }
      @keyframes float-1 {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-15px) rotate(-180deg); }
      }
      @keyframes float-2 {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-25px) rotate(180deg); }
      }
      @keyframes float-3 {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-18px) rotate(-180deg); }
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
      style={{ opacity: 0.3 }}
    />
  );
};

export default Simple3DBackground;