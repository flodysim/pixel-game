import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PixelButton from '../components/PixelButton';

const Home = () => {
    const [id, setId] = useState('');
    const navigate = useNavigate();

    const handleStart = () => {
        if (!id.trim()) return alert('Please enter an ID');
        // Save ID to local storage or state
        localStorage.setItem('pixel_game_id', id);
        navigate('/game');
    };

    return (
        <div className="container">
            <div className="pixel-box" style={{ textAlign: 'center' }}>
                <h1>PIXEL QUIZ</h1>
                <p>ENTER YOUR ID TO START</p>
                <input
                    type="text"
                    className="pixel-input"
                    placeholder="PLAYER ID"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                />
                <PixelButton onClick={handleStart}>INSERT COIN (START)</PixelButton>
            </div>
        </div>
    );
};

export default Home;
