// Configuration
const GEMINI_API_KEY = "AIzaSyAEAuYlnVcqUnhkK6h1EMfy_IvF4bcWZSg"; // Replace with your API key
const MODEL_NAME = "gemini-2.0-flash";

// Keyword responses configuration
const KEYWORD_RESPONSES = {
    "luyện tập": {
        response: "http://localhost:8080/Practice",
        message: "Bạn muốn luyện tập? Truy cập ngay: {link}"
    },
    "không muốn": {
        message: "Không muốn thì thôi, làm gì căng."
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
    "tra cứu": {
        response: "http://localhost:8080/lookUp",
        message: "Bạn muốn tra cứu? Truy cập ngay: {link}"
    },
    "look up": {
        response: "http://localhost:8080/lookUp",
        message: "Do you want to look up? Visit: {link}"
    }
};

// Global chat history with system role
let chatHistory = [
    {
        role: "system",
        parts: [{
            text: "Bạn là trợ lý tiếng Nhật. Chỉ trả lời các câu hỏi liên quan đến từ vựng, Kanji, JLPT, ngữ pháp, mẫu câu hoặc tra cứu. Nếu câu hỏi nằm ngoài lĩnh vực này, hãy từ chối trả lời một cách lịch sự."
        }]
    },
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
                text: config.message.replace('{link}', config.response || '#'),
                isKeyword: true
            };
        }
    }
    return null;
}

// Main chatbot functionality
document.addEventListener('DOMContentLoaded', function () {
    const elements = {
        logo: document.getElementById('chatbotLogo'),
        box: document.getElementById('chatBox'),
        closeBtn: document.getElementById('closeBtn'),
        input: document.getElementById('userInput'),
        sendBtn: document.getElementById('sendBtn'),
        messages: document.getElementById('chatMessages')
    };

    elements.logo.addEventListener('click', toggleChatBox);
    elements.closeBtn.addEventListener('click', closeChatBox);
    elements.sendBtn.addEventListener('click', processUserMessage);
    elements.input.addEventListener('keypress', (e) => e.key === 'Enter' && processUserMessage());

    displayChatHistory();

    async function processUserMessage() {
        const message = elements.input.value.trim();
        if (!message) return;

        displayMessage('user', message);
        chatHistory.push({ role: "user", parts: [{ text: message }] });
        elements.input.value = '';

        // Check for Kanji character
        const kanjiMatch = message.match(/[\u4e00-\u9faf]/);
        if (kanjiMatch) {
            const detectedKanji = kanjiMatch[0];
            transferWordToSearch(detectedKanji);
            const link = `http://localhost:8080/quizzInterface?search=${encodeURIComponent(detectedKanji)}`;
            const replyMessage = `Chữ "<strong>${detectedKanji}</strong>" bạn muốn biết có sẵn tại đây: ${link}`;
            displayMessage('model', replyMessage);
            chatHistory.push({ role: "model", parts: [{ text: replyMessage }] });
            return;
        }

        // Check for keyword responses
        const keywordResponse = checkKeywordResponse(message);
        if (keywordResponse) {
            displayMessage('model', keywordResponse.text);
            chatHistory.push({ role: "model", parts: [{ text: keywordResponse.text }] });
            return;
        }

        // Check for JSON response
        const jsonResponse = await fetchAnswerFromFile(message);
        if (jsonResponse) {
            displayMessage('model', jsonResponse);
            chatHistory.push({ role: "model", parts: [{ text: jsonResponse }] });
            return;
        }

        // Block non-Japanese-related questions
        const normalized = message.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (!normalized.match(/(kanji|tu vung|ngu phap|jlpt|tra cuu|look up|practice|test|thuc hanh|dich|translate)/i)) {
            const warning = "❗Xin lỗi, tôi chỉ hỗ trợ các nội dung liên quan đến tiếng Nhật như từ vựng, Kanji, JLPT hoặc ngữ pháp.";
            displayMessage('model', warning);
            chatHistory.push({ role: "model", parts: [{ text: warning }] });
            return;
        }

        // Fallback to Gemini
        fetchGeminiResponse();
    }

    async function fetchGeminiResponse() {
        showTypingIndicator();
        try {
            const filteredHistory = chatHistory.filter(msg => msg.role !== 'system');

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: filteredHistory,
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
                displayMessage('model', botReply);
                chatHistory.push({ role: "model", parts: [{ text: botReply }] });

                if (botReply.trim().split(/\s+/).length === 1) {
                    transferWordToSearch(botReply.trim());
                }
            } else {
                console.error("Raw Gemini response:", data);
                throw new Error("Phản hồi không hợp lệ từ Gemini");
            }
        } catch (error) {
            console.error("Error:", error);
            hideTypingIndicator();
            displayMessage('model', `⚠️ Lỗi khi gọi Gemini: ${error.message}`);
        }
    }

// Hàm lưu cache theo ID div
    function saveToCache(dateTaken, aiResponse, ttlMinutes = 60) {
        try {
            const cache = JSON.parse(localStorage.getItem('divCache') || '{}');
            cache[dateTaken] = {
                response: aiResponse,
            };
            localStorage.setItem('divCache', JSON.stringify(cache));
            console.log(`✅ Đã lưu cache cho div #${dateTaken}`);
        } catch (e) {
            console.error('❌ Lỗi khi lưu cache:', e);
        }
    }

// Hàm lấy cache theo ID div
    function getFromCache(dateTaken) {
        try {
            const cache = JSON.parse(localStorage.getItem('divCache') || '{}');
            const item = cache[dateTaken];

            if (!item) {
                console.log(`⚠️ Không tìm thấy cache cho div #${dateTaken}`);
                return null;
            }

            if (Date.now() > item.expiresAt) {
                console.log(`⌛ Cache đã hết hạn cho div #${dateTaken}`);
                delete cache[divId];
                localStorage.setItem('divCache', JSON.stringify(cache));
                return null;
            }

            console.log(`🎯 Trả về response từ cache cho div #${dateTaken}`);
            return item.response;
        } catch (e) {
            console.error('❌ Lỗi khi đọc cache:', e);
            return null;
        }
    }

    async function fetchGeminiResponse2() {
        showTypingIndicator();
        try {
            const filteredHistory = chatHistory.filter(msg => msg.role !== 'system');
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: filteredHistory,
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
                chatHistory.push({ role: "model", parts: [{ text: botReply }] });
                return botReply;
            } else {
                console.error("Raw Gemini response:", data);
                throw new Error("Phản hồi không hợp lệ từ Gemini");
            }
        } catch (error) {
            console.error("Error:", error);
            hideTypingIndicator();
            displayMessage('model', `⚠️ Lỗi khi gọi Gemini: ${error.message}`);
        }
    }

    function displayMessage(role, text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${role}-message`);
        messageDiv.innerHTML = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
        elements.messages.appendChild(messageDiv);
        elements.messages.scrollTop = elements.messages.scrollHeight;
    }

    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.classList.add('typing-indicator');
        indicator.textContent = "Gemini is typing...";
        indicator.id = 'typing-indicator';
        elements.messages.appendChild(indicator);
        elements.messages.scrollTop = elements.messages.scrollHeight;
    }

    function hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) elements.messages.removeChild(indicator);
    }

    function displayChatHistory() {
        elements.messages.innerHTML = '';
        chatHistory.forEach(msg => {
            if (msg.role === 'model' || msg.role === 'user') {
                displayMessage(msg.role, msg.parts[0].text);
            }
        });
    }

    function toggleChatBox() {
        elements.box.style.display = elements.box.style.display === 'flex' ? 'none' : 'flex';
    }

    function closeChatBox() {
        elements.box.style.display = 'none';
    }

    function createEvaluationPrompt(abc) {
        let prompt = `The test has user answers, question text and correct answers as follows:\n${passage.value}\n\n`;
        const hiddenUserAnswer = abc.querySelector("#userAnswersData");
        const userAnswers = JSON.parse(hiddenUserAnswer.value);

        userAnswers.forEach((item, index) => {
            prompt += `\nQuestion ${index + 1}:
        - Question text: ${item.testQuestion.question_text}
        - User answer: ${item.user_answer}
        - Correct answer: ${item.testQuestion.correct_answer}\n`;
        });


        prompt += "\nPlease give a general , overall, brief assessment of the test ( don't analyze detail each question and last 3 questions, the first 2 question and passage is for reading part,don't mention to question number ), point out confused grammar structure or vocabulary or reading, brief analysis of strengths and weaknesses and give specific study advice.( Don't add unnecessary words like okay, here's.... ) ( JUST IN 4-5 SENTENCES )";
        return prompt;
    }

    let vocab_height = null;
    let grammar_height = null;
    let reading_height = null;
    let listening_height = null;
    let passage = null;

    document.querySelectorAll('.history').forEach(abc => {
        abc.addEventListener('click', async (event) => {
            event.stopPropagation(); // Ngăn sự kiện nổi bọt

            try {
                console.log('1. Bắt đầu xử lý click'); // Debug
                vocab_height = abc.querySelector('.vocab-bar');
                grammar_height = abc.querySelector('.grammar-bar');
                reading_height = abc.querySelector('.reading-bar');
                listening_height = abc.querySelector('.listening-bar');
                passage = abc.querySelector('.readingPassage');

                if(abc.querySelector('.status').textContent.includes("Violated")) {
                    console.log('2. Bài test bị Violated - bỏ qua'); // Debug
                    return;
                }
                const dateTaken = abc.querySelector('.date-taken').textContent;
                console.log('3. date taken:', dateTaken); // Debug

                const cachedResponse = await getFromCache(dateTaken);
                console.log('4. Kết quả cache:', cachedResponse); // Debug

                if(cachedResponse) {
                    console.log('5. Dùng cache có sẵn'); // Debug
                    await getDataFromGemini(cachedResponse);
                    return;
                }

                const evaluationPrompt = createEvaluationPrompt(abc);
                console.log('6. Prompt tạo ra:', evaluationPrompt); // Debug

                chatHistory.push({
                    role: "user",
                    parts: [{ text: evaluationPrompt }]
                });

                const aiResponse = await fetchGeminiResponse2();
                console.log('7. Response từ API:', aiResponse); // Debug

                await saveToCache(dateTaken, aiResponse);
                await getDataFromGemini(aiResponse);


            } catch (error) {
                console.error('❌ Lỗi trong quá trình xử lý:', error);
            }
        });
    });

    function getDataFromGemini(response)
    {
        document.querySelector('.recommend-content').textContent = response;
        const vocabChart = document.getElementById('bar-vocab');
        const grammarChart = document.getElementById('bar-grammar');
        const readingChart = document.getElementById('bar-reading');
        const listeningChart = document.getElementById('bar-listening');
        const vocabRate = document.getElementById('rate-vocab');
        const grammarRate = document.getElementById('rate-grammar');
        const readingRate = document.getElementById('rate-reading');
        const listeningRate = document.getElementById('rate-listening');
        const resultDetail = document.querySelector('.result-detail');
        const overlay = document.querySelector('.overlay');
        vocabChart.style.height = vocab_height.value;
        grammarChart.style.height = grammar_height.value;
        readingChart.style.height = reading_height.value;
        listeningChart.style.height = listening_height.value;
        if (vocab_height.value !== "0%")
        {
            vocabRate.textContent = vocab_height.value;
        }
        else
        {
            vocabRate.textContent = "";

        }
        if (grammar_height.value !== "0%")
        {
            grammarRate.textContent = grammar_height.value;
        }
        else
        {
            grammarRate.textContent = "";
        }
        if (reading_height.value !== "0%")
        {
            readingRate.textContent = reading_height.value;
        }
        else
        {
            readingRate.textContent = "";
        }
        if (listening_height.value !== "0%")
        {
            listeningRate.textContent = listening_height.value;
        }
        else
        {
            listeningRate.textContent = "";
        }
        resultDetail.classList.remove('hidden');
        resultDetail.classList.add('active');
        overlay.classList.remove('hidden');
        overlay.classList.add('active');
    }



});

function transferWordToSearch(word) {
    const searchInput = document.querySelector(".search-bar.wordSearch");
    const kanjiRadio = document.querySelector("input[name='wordType'][value='kanji']");

    if (kanjiRadio && !kanjiRadio.checked) {
        kanjiRadio.checked = true;
        kanjiRadio.dispatchEvent(new Event("change"));
    }

    if (searchInput) {
        searchInput.value = word;
        setTimeout(() => {
            if (typeof filterData === "function") {
                filterData();
            }
        }, 300);
    }
}