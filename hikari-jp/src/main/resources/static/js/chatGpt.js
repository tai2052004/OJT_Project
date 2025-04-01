// Khai báo API key và model
const GEMINI_API_KEY = "AIzaSyAEAuYlnVcqUnhkK6h1EMfy_IvF4bcWZSg";
const MODEL_NAME = "gemini-2.0-flash";

// Biến toàn cục
let chatHistory = [
    {
        role: "user",
        parts: [{ text: "Xin chào" }]
    },
    {
        role: "model",
        parts: [{ text: "Chào bạn! Tôi là Gemini AI, tôi có thể giúp gì cho bạn?" }]
    }
];

// Khởi tạo chatbot khi DOM tải xong
document.addEventListener('DOMContentLoaded', function() {
    // Lấy các phần tử DOM
    const chatbotLogo = document.getElementById('chatbotLogo');
    const chatBox = document.getElementById('chatBox');
    const closeBtn = document.getElementById('closeBtn');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatMessages = document.getElementById('chatMessages');

    // Thêm sự kiện
    chatbotLogo.addEventListener('click', toggleChatBox);
    closeBtn.addEventListener('click', closeChatBox);
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });

    // Hiển thị lịch sử chat ban đầu
    displayChatHistory();

    // Hàm gửi tin nhắn
    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        // Thêm tin nhắn người dùng vào lịch sử
        chatHistory.push({
            role: "user",
            parts: [{ text: message }]
        });
        displayMessage('user', message);
        userInput.value = '';

        // Hiển thị "đang nhập..."
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('typing-indicator');
        typingIndicator.textContent = "Gemini đang nhập...";
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            // Gọi API Gemini
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
                            {
                                category: "HARM_CATEGORY_HARASSMENT",
                                threshold: "BLOCK_MEDIUM_AND_ABOVE"
                            },
                            {
                                category: "HARM_CATEGORY_HATE_SPEECH",
                                threshold: "BLOCK_MEDIUM_AND_ABOVE"
                            },
                            {
                                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                                threshold: "BLOCK_MEDIUM_AND_ABOVE"
                            },
                            {
                                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                                threshold: "BLOCK_MEDIUM_AND_ABOVE"
                            }
                        ]
                    })
                }
            );

            const data = await response.json();
            chatMessages.removeChild(typingIndicator);

            if (data.candidates && data.candidates[0].content) {
                const botReply = data.candidates[0].content.parts[0].text;
                chatHistory.push({
                    role: "model",
                    parts: [{ text: botReply }]
                });
                displayMessage('model', botReply);
            } else {
                throw new Error("Không nhận được phản hồi hợp lệ từ Gemini");
            }
        } catch (error) {
            console.error("Lỗi:", error);
            chatMessages.removeChild(typingIndicator);
            displayMessage('model', `⚠️ Lỗi: ${error.message}`);
        }
    }

    // Hàm hiển thị tin nhắn
    function displayMessage(role, text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${role}-message`);
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Hàm hiển thị lịch sử chat
    function displayChatHistory() {
        chatMessages.innerHTML = '';
        chatHistory.forEach(msg => {
            if (msg.role === 'model' || msg.role === 'user') {
                displayMessage(msg.role, msg.parts[0].text);
            }
        });
    }

    // Hàm toggle chat box
    function toggleChatBox() {
        chatBox.style.display = chatBox.style.display === 'flex' ? 'none' : 'flex';
    }

    // Hàm đóng chat box
    function closeChatBox() {
        chatBox.style.display = 'none';
    }
});