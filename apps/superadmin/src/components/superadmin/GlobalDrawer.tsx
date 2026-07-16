import React from 'react';
import './GlobalDrawer.css'; // Add basic styles if necessary

interface GlobalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
}

export function GlobalDrawer({ isOpen, onClose, title, children, width = '500px' }: GlobalDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="global-drawer-overlay" onClick={onClose} />
      <div className="global-drawer-container" style={{ width }}>
        <div className="global-drawer-header">
          <h3>{title}</h3>
          <button className="global-drawer-close" onClick={onClose}>✕</button>
        </div>
        <div className="global-drawer-content">
          {children}
        </div>
      </div>
    </>
  );
}
