"use client"

import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

type Props = {
  content: React.ReactNode;
  placement?: 'top' | 'bottom';
  offset?: number;
  children: React.ReactElement;
  id?: string;
};

export default function InfoTooltip({ content, placement = 'bottom', offset = 8, children, id }: Props) {
  const triggerRef = useRef<HTMLElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!visible) return;

    const updatePos = () => {
      const trigger = triggerRef.current;
      const tooltip = tooltipRef.current;
      if (!trigger || !tooltip) return;
      const rect = trigger.getBoundingClientRect();
      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.scrollY || window.pageYOffset;
      const centerX = rect.left + rect.width / 2 + scrollX;
      let top: number;
      if (placement === 'bottom') {
        top = rect.bottom + offset + scrollY;
      } else {
        top = rect.top - (tooltip.offsetHeight + offset) + scrollY;
      }
      setPos({ top, left: centerX });
    };

    updatePos();
    window.addEventListener('resize', updatePos);
    window.addEventListener('scroll', updatePos, true);
    return () => {
      window.removeEventListener('resize', updatePos);
      window.removeEventListener('scroll', updatePos, true);
    };
  }, [visible, placement, offset]);

  const handleShow = () => setVisible(true);
  const handleHide = () => setVisible(false);

  const trigger = (
    <span
      ref={(node) => { triggerRef.current = node; }}
      className="info-tooltip-trigger"
      onMouseEnter={handleShow}
      onMouseLeave={handleHide}
      onFocus={handleShow}
      onBlur={handleHide}
      tabIndex={0}
      aria-describedby={id ?? 'info-tooltip'}
    >
      {children}
    </span>
  );

  return (
    <>
      {trigger}
      {typeof document !== 'undefined' && createPortal(
        <div
          ref={tooltipRef}
          id={id ?? 'info-tooltip'}
          role="tooltip"
          className={`info-tooltip-portal ${visible ? 'visible' : ''} ${placement}`}
          style={{ top: pos.top, left: pos.left, position: 'absolute', transform: 'translateX(-50%)' }}
        >
          <div className="info-tooltip-content">{content}</div>
          <div className="info-tooltip-arrow" />
        </div>,
        document.body
      )}
    </>
  );
}
