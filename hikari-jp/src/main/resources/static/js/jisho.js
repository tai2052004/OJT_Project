// Khai báo các API key
const UNSPLASH_API_KEY = '0h5JCQWWS58FnIIbcRRDOohn75o-xl-0rbdtEEAFCkU';
const TEXT_TO_SPEECH_KEY = "AIzaSyBoDBmFoXR8QcqFiGIp7oZ3QniEzoA-OrY";

// Biến toàn cục
let translatedText = '';

// Hàm khởi tạo khi trang web tải xong
document.addEventListener('DOMContentLoaded', function() {
    // Lấy các phần tử DOM
    const searchInput = document.getElementById('query');
    const imageResults = document.getElementById('image-results');
    const audioPlayer = document.getElementById('audioPlayer');
    const playAudioBtn = document.getElementById('play-audio-btn');

    // Thêm sự kiện cho các nút
    document.getElementById('search-button').addEventListener('click', performSearch);
    document.getElementById('play-audio-btn').addEventListener('click', playAudio);
    document.getElementById("voice-button").addEventListener("click", voiceSearch);

    // Hàm thực hiện tìm kiếm
    async function performSearch() {
        const query = searchInput.value.trim();
        if (!query) return;

        const loadingElement = document.getElementById('loading');
        const resultsElement = document.getElementById('results');

        loadingElement.style.display = 'block';
        resultsElement.innerHTML = '<div class="translation-status">Đang xử lý...</div>';
        imageResults.innerHTML = '';
        playAudioBtn.style.display = 'none';

        try {
            translatedText = await translateToJapanese(query);
            resultsElement.innerHTML = `<div class="translation-status">Đã dịch: "${query}" → "${translatedText}"</div>`;

            const searchResults = await searchJisho(translatedText);
            displayResults(searchResults);
            await fetchImages(translatedText);
            await convertTextToSpeech(translatedText);
        } catch (error) {
            console.error('Lỗi:', error);
            resultsElement.innerHTML = '<div class="error">Có lỗi xảy ra: ' + error.message + '</div>';
        } finally {
            loadingElement.style.display = 'none';
        }
    }

    // Hàm hiển thị kết quả tìm kiếm
    function displayResults(results) {
        const container = document.getElementById('results');
        container.style.display = 'block';
        container.innerHTML = "";

        if (!results || results.length === 0) {
            container.innerHTML += '<p class="text-center text-danger">Không tìm thấy kết quả</p>';
            return;
        }

        // Hiển thị kết quả đầu tiên
        const firstResult = results[0];
        const japanese = firstResult.japanese?.[0] || {};
        const senses = firstResult.senses || [];

        const word = japanese.word || japanese.reading || 'N/A';
        const reading = japanese.reading && japanese.reading !== word ? japanese.reading : '';

        let html = `
        <div class="card shadow-lg p-4 mb-4">
            <div class="d-flex justify-content-between align-items-start">
                <div class="word-info flex-grow-1">
                    <h2 class="word-title text-primary mb-2">${word}</h2>
                    ${reading ? `<p class="reading text-muted"><em>${reading}</em></p>` : ''}
        `;

        senses.forEach((sense, index) => {
            const meaning = sense.english_definitions?.join(', ') || 'Không có thông tin';
            let additionalInfo = sense.info?.length
                ? sense.info.map(info => `<div class="badge bg-info text-white me-1">${info}</div>`).join('')
                : '';

            let examplesHtml = '';
            if (sense.examples?.length) {
                examplesHtml = '<ul class="list-group mt-2">';
                sense.examples.forEach(example => {
                    examplesHtml += `<li class="list-group-item"><strong>${example.japanese}</strong> - ${example.english}</li>`;
                });
                examplesHtml += '</ul>';
            }

            html += `
                <div class="alert alert-light mt-3">
                    <p class="fw-bold">Ý nghĩa ${index + 1}: <span class="text-success">${meaning}</span></p>
                    ${additionalInfo}
                    ${examplesHtml}
                </div>
            `;
        });

        html += `
                </div>
                <div id="image-results" class="ms-3" style="width: 300px; height: 200px;"></div>
            </div>
            <div class="mt-3 text-center">
                <button id="play-audio-btn" class="btn btn-primary">🔊</button>
                <audio id="audioPlayer" style="display: none;"></audio>
            </div>
        </div>
        <h3 class="text-primary mt-4">🔍 Các kết quả khác</h3>
        <div class="other-results">
        `;

        // Hiển thị các kết quả khác
        for (let i = 1; i < results.length; i++) {
            const result = results[i];
            const japanese = result.japanese?.[0] || {};
            const senses = result.senses || [];

            const word = japanese.word || japanese.reading || 'N/A';
            const reading = japanese.reading && japanese.reading !== word ? japanese.reading : '';

            const firstSense = senses.length > 0 ? senses[0] : null;
            const meaning = firstSense ? firstSense.english_definitions?.join(', ') : 'Không có thông tin';

            html += `
            <div class="border-bottom py-2 clickable-word" data-word="${word}" style="cursor: pointer;">
                <h4 class="text-dark d-inline-block">${word}</h4> 
                <p class="text-muted small d-inline ms-2"><strong>Ý nghĩa:</strong> ${meaning}</p>
                ${reading ? `<p class="text-muted small"><em>${reading}</em></p>` : ''}
            </div>`;
        }

        html += `</div>`;
        container.innerHTML = html;

        // Thêm sự kiện click cho các từ trong "Các kết quả khác"
        document.querySelectorAll('.clickable-word').forEach(element => {
            element.addEventListener('click', function() {
                const wordToSearch = this.getAttribute('data-word');
                searchInput.value = wordToSearch;
                performSearch();
            });
        });
    }
});

// Các hàm utility

// Hàm dịch sang tiếng Nhật
async function translateToJapanese(text) {
    try {
        const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ja&dt=t&q=${encodeURIComponent(text)}`);
        const data = await response.json();
        return data[0].map(item => item[0]).join('');
    } catch (error) {
        console.error('Lỗi dịch:', error);
        throw new Error('Không thể dịch từ khóa');
    }
}

// Hàm tìm kiếm trên Jisho
async function searchJisho(query) {
    const proxyUrl = 'https://api.allorigins.win/get?url=';
    const jishoUrl = encodeURIComponent(`https://jisho.org/api/v1/search/words?keyword=${query}`);

    const response = await fetch(proxyUrl + jishoUrl);
    const data = await response.json();

    if (!response.ok) throw new Error(data.message || 'Lỗi API');
    if (!data.contents) throw new Error('Không có dữ liệu trả về');

    return JSON.parse(data.contents).data;
}

// Hàm tìm kiếm ảnh từ Unsplash
async function fetchImages(query) {
    try {
        const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${query}&client_id=${UNSPLASH_API_KEY}&per_page=1`
        );
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            displayImages(data.results[0]);
        } else {
            document.getElementById('image-results').innerHTML = '<p>Không tìm thấy ảnh phù hợp</p>';
        }
    } catch (error) {
        console.error('Lỗi khi tải ảnh:', error);
        document.getElementById('image-results').innerHTML = '<p>Không thể tải ảnh</p>';
    }
}

// Hàm hiển thị ảnh
function displayImages(image) {
    const imageContainer = document.getElementById('image-results');
    imageContainer.innerHTML = '';

    if (!image) return;

    const imgElement = document.createElement('img');
    imgElement.src = image.urls.regular;
    imgElement.alt = image.alt_description || 'Ảnh minh họa';
    imgElement.style.maxWidth = '450px';
    imgElement.style.maxHeight = '300px';
    imgElement.style.borderRadius = '8px';
    imgElement.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    imgElement.style.objectFit = 'cover';

    imageContainer.appendChild(imgElement);
}

// Hàm phát âm thanh
function playAudio() {
    const audioPlayer = document.getElementById('audioPlayer');
    if (audioPlayer.src) {
        audioPlayer.currentTime = 0;
        audioPlayer.play();
    }
}

// Hàm chuyển văn bản thành giọng nói
async function convertTextToSpeech(text) {
    if (!text) {
        document.getElementById('play-audio-btn').style.display = 'none';
        return;
    }

    const request = {
        input: { text: text },
        voice: { languageCode: "ja-JP", ssmlGender: "NEUTRAL" },
        audioConfig: { audioEncoding: "MP3" }
    };

    try {
        const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${TEXT_TO_SPEECH_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request)
        });

        const data = await response.json();
        if (data.audioContent) {
            const audioPlayer = document.getElementById('audioPlayer');
            audioPlayer.src = `data:audio/mp3;base64,${data.audioContent}`;
            audioPlayer.style.display = 'block';
            document.getElementById('play-audio-btn').onclick = function() {
                audioPlayer.currentTime = 0;
                audioPlayer.play();
            };
        }
    } catch (error) {
        console.error("Lỗi:", error);
    }
}

// Hàm nhận diện giọng nói
async function voiceSearch() {
    try {
        document.getElementById("query").value = "";
        await navigator.mediaDevices.getUserMedia({ audio: true });

        let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "vi-VN";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.continuous = false;

        recognition.onresult = (event) => {
            let transcript = event.results[0][0].transcript.trim();
            document.getElementById("query").value = transcript;
        };

        recognition.onerror = (event) => {
            console.error("Lỗi nhận diện giọng nói:", event.error);
            alert("Lỗi nhận diện giọng nói: " + event.error);
        };

        recognition.onend = () => {
            console.log("Dừng ghi âm do người dùng im lặng.");
            document.getElementById("voice-button").disabled = false;
        };

        recognition.start();
        document.getElementById("voice-button").disabled = true;
    } catch (error) {
        console.error("Không thể sử dụng microphone:", error);
        alert("Vui lòng cấp quyền truy cập microphone.");
    }
}
// Hàm hiển thị 3 gợi ý gần nhất
function showRecentSuggestions(input) {
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];

    // Lọc và giới hạn 3 kết quả gần nhất
    const suggestions = history
        .filter(item => item.toLowerCase().includes(input.toLowerCase()))
        .slice(0, 3); // Chỉ lấy 3 kết quả

    const dropdown = document.getElementById('suggestions-dropdown');
    dropdown.innerHTML = '';

    if (suggestions.length > 0 && input.length > 0) {
        dropdown.style.display = 'block';

        suggestions.forEach(item => {
            const suggestionItem = document.createElement('div');
            suggestionItem.textContent = item;

            suggestionItem.addEventListener('click', () => {
                document.getElementById('query').value = item;
                dropdown.style.display = 'none';
            });

            dropdown.appendChild(suggestionItem);
        });
    } else {
        dropdown.style.display = 'none';
    }
}

// Khi focus vào ô input
document.getElementById('query').addEventListener('focus', (e) => {
    showRecentSuggestions(e.target.value);
});

// Khi nhập nội dung (có debounce)
let timeout;
document.getElementById('query').addEventListener('input', (e) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        showRecentSuggestions(e.target.value);
    }, 300);
});

// Ẩn dropdown khi click ra ngoài
document.addEventListener('click', (e) => {
    if (!e.target.closest('#query') && !e.target.closest('#suggestions-dropdown')) {
        document.getElementById('suggestions-dropdown').style.display = 'none';
    }
});

// Lưu lịch sử khi bấm nút tìm kiếm
document.getElementById('search-button').addEventListener('click', () => {
    const keyword = document.getElementById('query').value.trim();
    if (keyword) {
        let history = JSON.parse(localStorage.getItem('searchHistory')) || [];

        // Xóa nếu đã tồn tại để tránh trùng lặp
        history = history.filter(item => item !== keyword);

        // Thêm vào đầu mảng và giới hạn 10 mục
        history.unshift(keyword);
        if (history.length > 10) history = history.slice(0, 10);

        localStorage.setItem('searchHistory', JSON.stringify(history));
    }
});
let selectedIndex = -1;

document.getElementById('query').addEventListener('keydown', (e) => {
    const dropdown = document.getElementById('suggestions-dropdown');
    const items = dropdown.querySelectorAll('div');

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
        highlightItem(items, selectedIndex);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, -1);
        highlightItem(items, selectedIndex);
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault();
        document.getElementById('query').value = items[selectedIndex].textContent;
        dropdown.style.display = 'none';
    }
});

function highlightItem(items, index) {
    items.forEach((item, i) => {
        item.style.backgroundColor = i === index ? '#f8f9fa' : 'white';
    });
}