import React from 'react';

const Avatar = ({ seed, size = 100 }) => {
    // Using dicebear pixel-art style
    const url = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${seed}`;

    return (
        <div style={{
            display: 'inline-block',
            border: '4px solid #000',
            background: '#fff',
            padding: '4px',
            margin: '10px'
        }}>
            <img src={url} alt="Avatar" width={size} height={size} style={{ display: 'block' }} />
        </div>
    );
};

export default Avatar;
