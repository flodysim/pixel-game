const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;

// Mock data includes 'answer' property now for local validation
const MOCK_QUESTIONS = [
    { id: 1, question: "What is the capital of 8-bit?", options: { A: "Byte City", B: "Pixel Town", C: "Vector Valley", D: "Sprite Hill" }, answer: "A" },
    { id: 2, question: "Which game features a plumber?", options: { A: "Sonic", B: "Mario", C: "Zelda", D: "Metroid" }, answer: "B" },
    { id: 3, question: "What color is Pac-Man?", options: { A: "Red", B: "Yellow", C: "Blue", D: "Pink" }, answer: "B" },
    { id: 4, question: "What represents a pixel?", options: { A: "A dot", B: "A square", C: "A triangle", D: "A circle" }, answer: "B" },
    { id: 5, question: "Konami Code starts with?", options: { A: "Up Up", B: "Down Down", C: "Left Right", D: "B A" }, answer: "A" },
];

export const fetchQuestions = async (count = 5) => {
    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes("YOUR_SCRIPT_ID")) {
        console.warn("Using Mock Questions");
        await new Promise(r => setTimeout(r, 500));
        return MOCK_QUESTIONS.slice(0, count);
    }

    try {
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getQuestions&count=${count}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch questions:", error);
        return MOCK_QUESTIONS.slice(0, count);
    }
};

export const submitScore = async (data) => {
    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes("YOUR_SCRIPT_ID")) {
        console.log("Mock Submit:", data);
        return { status: "success", mock: true };
    }

    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "text/plain",
            },
            body: JSON.stringify(data),
        });
        return { status: "success" };
    } catch (error) {
        console.error("Submit error:", error);
        return { status: "error" };
    }
};
