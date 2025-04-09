// Configuration
const GEMINI_API_KEY = "AIzaSyAEAuYlnVcqUnhkK6h1EMfy_IvF4bcWZSg"; // Replace with your API key
const MODEL_NAME = "gemini-2.0-flash";

// Keyword responses configuration
const KEYWORD_RESPONSES = {
    "luyện tập": {
        response: "http://localhost:8080/Practice",
        message: "Bạn muốn luyện tập? Truy cập ngay: {link}"
    },
    "học từ vựng": {
        response: "http://localhost:8080/quizzInterface",
        message: "Bạn muốn học từ vựng? Truy cập ngay: {link}"
    },
    "practice": {
        response: "http://localhost:8080/Practice",
        message: "Want to practice? Click here: {link}"
    },
    "thực hành": {
        response: "http://localhost:8080/Practice",
        message: "Bạn cần thực hành? Truy cập tại: {link}"
    },
    "kiểm tra": {
        response: "http://localhost:8080/jlptTest",
        message: "Bạn muốn kiểm tra? Truy cập: {link}"
    },
    "test": {
        response: "http://localhost:8080/jlptTest",
        message: "Want to take a test? Visit: {link}"
    },
    "tra cứu":{
        response: "http://localhost:8080/lookUp",
        message: "Bạn muốn tra cứu? Truy cập ngay: {link}"
    },
    "look up":{
        response: "http://localhost:8080/lookUp",
        message: "Do you want to look up? Visit: {link}"
    }
};

// Global chat history
let chatHistory = [
    { role: "user", parts: [{ text: "Xin chào" }] },
    { role: "model", parts: [{ text: "Chào bạn! Tôi là Gemini AI, tôi có thể giúp gì cho bạn?" }] }
];

// Utility functions
async function fetchAnswerFromFile(userQuestion) {
    try {
        const response = await fetch('/data.json');
        const data = await response.json();
        return data[userQuestion] || null;
    } catch (error) {
        console.error("Error loading JSON file:", error);
        return null;
    }
}

function checkKeywordResponse(message) {
    const lowerCaseMsg = message.toLowerCase();

    for (const [keyword, config] of Object.entries(KEYWORD_RESPONSES)) {
        if (lowerCaseMsg.includes(keyword)) {
            return {
                text: config.message.replace('{link}', config.response),
                isKeyword: true
            };



        }
    }
    return null;
}

// Main chatbot functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const elements = {
        logo: document.getElementById('chatbotLogo'),
        box: document.getElementById('chatBox'),
        closeBtn: document.getElementById('closeBtn'),
        input: document.getElementById('userInput'),
        sendBtn: document.getElementById('sendBtn'),
        messages: document.getElementById('chatMessages')
    };

    // Event listeners
    elements.logo.addEventListener('click', toggleChatBox);
    elements.closeBtn.addEventListener('click', closeChatBox);
    elements.sendBtn.addEventListener('click', processUserMessage);
    elements.input.addEventListener('keypress', (e) => e.key === 'Enter' && processUserMessage());

    // Initial display
    displayChatHistory();

    // Core functions
    async function processUserMessage() {
        const message = elements.input.value.trim();
        if (!message) return;

        displayMessage('user', message);
        chatHistory.push({ role: "user", parts: [{ text: message }] });
        elements.input.value = '';

        // Check for keyword responses first
        const keywordResponse = checkKeywordResponse(message);
        if (keywordResponse) {
            displayMessage('model', keywordResponse.text);
            chatHistory.push({ role: "model", parts: [{ text: keywordResponse.text }] });
            return;
        }

        // Check JSON responses
        const jsonResponse = await fetchAnswerFromFile(message);
        if (jsonResponse) {
            displayMessage('model', jsonResponse);
            chatHistory.push({ role: "model", parts: [{ text: jsonResponse }] });
            return;
        }

        // Fall back to Gemini API
        fetchGeminiResponse();
    }

    async function fetchGeminiResponse() {
        showTypingIndicator();

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: chatHistory,
                        generationConfig: {
                            temperature: 0.9,
                            topK: 1,
                            topP: 1,
                            maxOutputTokens: 2048,
                            stopSequences: []
                        },
                        safetySettings: [
                            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
                        ]
                    })
                }
            );

            const data = await response.json();
            hideTypingIndicator();

            if (data.candidates?.[0]?.content) {
                const botReply = data.candidates[0].content.parts[0].text;
                displayMessage("model", botReply);
                chatHistory.push({ role: "model", parts: [{ text: botReply }] });
            } else {
                throw new Error("Invalid response from Gemini");
            }
        } catch (error) {
            console.error("Error:", error);
            hideTypingIndicator();
            displayMessage("model", `⚠️ Error: ${error.message}`);
        }
    }

// UI functions
    function displayMessage(role, text) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", `${role}-message`);
        messageDiv.innerHTML = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');

        if (!elements.messages) {
            console.error("Error: elements.messages is undefined.");
            return;
        }

        elements.messages.appendChild(messageDiv);
        elements.messages.scrollTop = elements.messages.scrollHeight;
    }

    function showTypingIndicator() {
        const indicator = document.createElement("div");
        indicator.classList.add("typing-indicator");
        indicator.textContent = "Gemini is typing...";
        indicator.id = "typing-indicator";

        if (!elements.messages) {
            console.error("Error: elements.messages is undefined.");
            return;
        }

        elements.messages.appendChild(indicator);
        elements.messages.scrollTop = elements.messages.scrollHeight;
    }

    function hideTypingIndicator() {
        const indicator = document.getElementById("typing-indicator");
        if (indicator && elements.messages) {
            elements.messages.removeChild(indicator);
        }
    }

    function displayChatHistory() {
        if (!elements.messages) {
            console.error("Error: elements.messages is undefined.");
            return;
        }

        elements.messages.innerHTML = "";
        chatHistory.forEach(msg => {
            if (msg.role === "model" || msg.role === "user") {
                displayMessage(msg.role, msg.parts[0].text);
            }
        });
    }

    function toggleChatBox() {
        if (!elements.box) {
            console.error("Error: elements.box is undefined.");
            return;
        }
        elements.box.style.display = elements.box.style.display === "flex" ? "none" : "flex";
    }

    function closeChatBox() {
        if (!elements.box) {
            console.error("Error: elements.box is undefined.");
            return;
        }
        elements.box.style.display = "none";
    }
});