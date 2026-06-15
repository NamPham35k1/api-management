import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%',
        maxWidth: '500px',
        padding: '0',
        overflow: 'hidden',
        background: 'var(--bg-surface)'
      }}>
        <div style={{
          padding: '20px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ fontSize: '1.2rem', margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ color: 'var(--text-secondary)' }}>
            <X size={20} />
          </button>
        </div>
        
        <div style={{ padding: '20px' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
