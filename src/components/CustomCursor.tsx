import React, { useEffect, useState } from 'react';

/**
 * Premium Custom Cursor for desktop devices.
 * - Circular inner dot with electric blue / teal accent.
 * - Smooth outer trailing ring with magnetic expansion on interactive items.
 * - Automatically disabled on touch screens or when user prefers reduced motion.
 */
export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [ringPos, setRingPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch device or reduced motion
    const touchCheck =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (touchCheck || reducedMotion) {
      setIsTouchDevice(true);
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      // Check if hovering interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest(
          'a, button, input, select, textarea, [role="button"], label, .interactive-cursor'
        );
        setIsHovered(!!interactive);
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  // Smooth trailing ring physics
  useEffect(() => {
    if (isTouchDevice) return;

    let animId: number;
    const follow = () => {
      setRingPos((prev) => {
        const dx = pos.x - prev.x;
        const dy = pos.y - prev.y;
        return {
          x: prev.x + dx * 0.18,
          y: prev.y + dy * 0.18,
        };
      });
      animId = requestAnimationFrame(follow);
    };

    animId = requestAnimationFrame(follow);
    return () => cancelAnimationFrame(animId);
  }, [pos, isTouchDevice]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden transition-opacity duration-300">
      {/* Outer Smooth Trailing Ring */}
      <div
        className="fixed rounded-full pointer-events-none transition-transform ease-out will-change-transform"
        style={{
          left: `${ringPos.x}px`,
          top: `${ringPos.y}px`,
          width: isHovered ? '46px' : '28px',
          height: isHovered ? '46px' : '28px',
          transform: `translate(-50%, -50%) scale(${isClicking ? 0.85 : 1})`,
          border: isHovered
            ? '1.5px solid rgba(25, 184, 165, 0.75)'
            : '1.5px solid rgba(49, 92, 253, 0.45)',
          backgroundColor: isHovered ? 'rgba(49, 92, 253, 0.08)' : 'transparent',
          transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease, background-color 0.2s ease',
        }}
      />

      {/* Inner Central Micro Dot */}
      <div
        className="fixed rounded-full pointer-events-none will-change-transform"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: isHovered ? '8px' : '5px',
          height: isHovered ? '8px' : '5px',
          transform: 'translate(-50%, -50%)',
          backgroundColor: isHovered ? '#19B8A5' : '#315CFD',
          boxShadow: isHovered
            ? '0 0 10px rgba(25, 184, 165, 0.6)'
            : '0 0 8px rgba(49, 92, 253, 0.5)',
          transition: 'width 0.15s ease, height 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease',
        }}
      />
    </div>
  );
};
