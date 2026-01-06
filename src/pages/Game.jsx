import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchQuestions } from '../utils/api';
import PixelButton from '../components/PixelButton';
import Avatar from '../components/Avatar';

const Game = () => {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const QUESTION_COUNT = import.meta.env.VITE_QUESTION_COUNT || 5;

    useEffect(() => {
        const loadGame = async () => {
            const qs = await fetchQuestions(Number(QUESTION_COUNT));
            setQuestions(qs);
            setLoading(false);
        };
        loadGame();
    }, []);

    const handleAnswer = (optionKey) => {
        // Note: In real app, we might check correctness here if we had the answer.
        // The requirement says: "Transmit results to GAS to calculate score".
        // BUT later it says "Fetch N questions (not including answer field)".
        // This creates a paradox: Client can't calculate score if it doesn't know the answer.
        // However, usually for these games, we might want immediate feedback.
        // Given the constraints: 
        // 1. Questions sheet has Answer.
        // 2. Client fetches questions WITHOUT Answer.
        // 3. Client sends "results" to GAS to calculate score.

        // IF we are sending "A", "B" etc to backend at the end, we don't know the score yet.
        // BUT the UI logic usually wants to show "Score".
        // Let's assume for this MVP, since strict client-side security isn't the top prio vs UX,
        // I will actually fetch the answers included in my Mock/GAS for now so I can show the score immediately?
        // OR, I just track the selected answers and send them all at the end to a "calculate" endpoint.
        // The Prompt says: "成績計算：將作答結果傳送到 Google Apps Script 計算成績" -> This strongly implies Server Side Calculation.
        // AND "Records to Google Sheets". 
        // And "Result Screen: Show score". implies we get the score BACK from the server after submission.

        // So flow:
        // 1. User answers all questions.
        // 2. Submit { id, answers: {q1: 'A', q2: 'B'} }
        // 3. Server returns { score: 80, passed: true }
        // 4. Show Result.

        // Wait, my `api.js` `submitScore` takes `score` as input currently. 
        // "將作答結果傳送到 Google Apps Script 計算成績" -> Transmit answers, receive score.
        // I need to update my logic. 
        // However, I can't easily change the GAS script provided in the plan without users deploying it.
        // The GAS script I wrote: `doPost` takes `score` directly.
        // Mismatch in my plan vs interpretation.
        // User Requirement: "將作答結果傳送到 Google Apps Script 計算成績" (Transmit results to GAS to calculate score).
        // My GAS script: Expects `score`. 
        // I should probably fix my GAS script or my Client logic.
        // Since I already gave the GAS script which expects `score`, maybe I should stick to Client Side Scoring for now to avoid confusion, 
        // OR I assume the GAS script I gave was just a draft and I can update the client to match a "better" GAS script?
        // Actually, I can just include the "Answer" in the fetched data for now (simulating "insecure" client) to calculate score locally, 
        // OR I assume the `questions` endpoint returns a hash or I just blindly trust the client for now.
        // Let's go with: Client calculates score (Cheatable, but easy UX). 
        // Why? Because otherwise I need a second roundtrip `calculateScore` endpoint.
        // Let's assume the `fetchQuestions` actually returns the answer for now (or I Mock it).
        // My Mock Data HAS the answer implicitly? No, my mock data had `options`. I forgot `answer` key in mock data!
        // I will update Mock Data to have `answer`.

        // Let's implement Client-side scoring for simplicity and immediate UX.
        // I'll assume the API returns the correct answer (hidden field) or I'll just random guess for testing if missing.
        // Real-world: don't expose answers.

        const currentQ = questions[currentIndex];
        // Check answer - assuming currentQ has 'answer' field. 
        // If not, we can't score locally.
        // I will add `answer` to my Mock Data in `api.js` later or assume it's there.

        // For now, let's assume `answer` is present in the question object for validation.
        // Note: The GAS `getQuestions` helper I wrote REMOVED the answer. 
        // "We DON'T send the answer to client".
        // So I MUST send the answers to the server to get the score.
        // Okay, I will implement that flow: Collect Answers -> Submit Answers -> Get Score.

        const newAnswers = { ...answers, [currentQ.id]: optionKey };
        setAnswers(newAnswers);

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            // Game Over
            navigate('/result', { state: { answers: newAnswers, questions } });
        }
    };

    const [answers, setAnswers] = useState({});

    if (loading) return <div className="container"><h1>LOADING...</h1></div>;

    const currentQ = questions[currentIndex];
    // Generate a consistent seed based on question ID to satisfy "Pre-load 100 images" vibe (unique avatar per question)
    const avatarSeed = `pixel-avatar-${currentQ.id}`;

    return (
        <div className="container">
            <div className="pixel-box">
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <p>LEVEL {currentIndex + 1} / {questions.length}</p>
                    <Avatar seed={avatarSeed} />
                </div>

                <h2 style={{ fontSize: '1.2rem', minHeight: '3em' }}>{currentQ.question}</h2>

                <div style={{ display: 'grid', gap: '10px' }}>
                    {Object.entries(currentQ.options).map(([key, value]) => (
                        <PixelButton key={key} onClick={() => handleAnswer(key)}>
                            {key}. {value}
                        </PixelButton>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Game;
