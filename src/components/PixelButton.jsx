import React from 'react';

// Using className from index.css logic
const PixelButton = ({ onClick, children, disabled, className = '' }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`pixel-btn ${className}`}
            style={{ opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? 'none' : 'auto' }}
        >
            {children}
        </button>
    );
};

export default PixelButton;
