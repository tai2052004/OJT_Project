const API_KEY = '0h5JCQWWS58FnIIbcRRDOohn75o-xl-0rbdtEEAFCkU'; // Thay bằng key của bạn
const searchInput = document.getElementById('query');
const imageResults = document.getElementById('image-results');
const audioPlayer = document.getElementById('audioPlayer');
const playAudioBtn = document.getElementById('play-audio-btn');
let translatedText = ''; // Lưu trữ văn bản đã dịch
const MAX_LOOKUPS = 21;
const todayKey = `lookupCount_${new Date().toISOString().slice(0, 10)}`;
let lookupCount = parseInt(localStorage.getItem(todayKey)) || 0;

const searchButton = document.getElementById('search-button');

function isUserPremium() {
    return localStorage.getItem('userPremium') === 'true';
}

function updateRemaining() {
    if (!isUserPremium()) {
        const remaining = Math.max(0, MAX_LOOKUPS - lookupCount);
        const remainingEl = document.getElementById("remaining");
        if (remainingEl) {
            remainingEl.textContent = remaining;
        }
    }
}

function disableSearch() {
    if (searchButton) searchButton.disabled = true;
    if (searchInput) searchInput.disabled = true;
}

window.addEventListener("DOMContentLoaded", () => {
    const premiumInput = document.getElementById("userPremium");
    if (premiumInput) {
        localStorage.setItem('userPremium', premiumInput.value === 'true' ? 'true' : 'false');
    } else {
        localStorage.setItem('userPremium', 'false');
    }

    if (!isUserPremium()) {
        updateRemaining();
        if (lookupCount >= MAX_LOOKUPS) {
            disableSearch();
            const message = "You have used up all your free searches today. Please upgrade to Premium for unlimited searches.";

            Swal.fire({
                title: 'Notification',
                text: message,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Premium Upgrade',
                cancelButtonText: 'Later',
            }).then((result) => {
                if (result.isConfirmed) {
                    // Chuyển hướng tới trang Premium
                    window.location.href = "/premium"; // Thay bằng URL của trang Premium của bạn
                } else {
                    // Nếu người dùng bấm 'Để sau', không làm gì
                }
            });
        }
    } else {
        const alertBox = document.getElementById("free-alert");
        if (alertBox) alertBox.style.display = "none";
    }
});

// Gắn sự kiện sau khi DOM đã load
searchButton.addEventListener("click", function (e) {
    if (!isUserPremium()) {
        if (lookupCount >= MAX_LOOKUPS) {
            const message = "You have used up all your free searches today. Please upgrade to Premium for unlimited searches.";

            Swal.fire({
                title: 'Notification',
                text: message,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Premium Upgrade',
                cancelButtonText: 'Later',
            }).then((result) => {
                if (result.isConfirmed) {
                    // Chuyển hướng tới trang Premium
                    window.location.href = "/premium"; // Thay bằng URL của trang Premium của bạn
                } else {
                    // Nếu người dùng bấm 'Để sau', không làm gì
                }
            });
            disableSearch();
            e.preventDefault();
            return;
        }

        lookupCount++;
        localStorage.setItem(todayKey, lookupCount);
        updateRemaining();
    }

    performSearch();
});

if (playAudioBtn) {
    playAudioBtn.addEventListener("click", playAudio);
}

// Hàm kiểm tra ký tự kanji
function isKanji(character) {
    if (!character) return false;
    const code = character.charCodeAt(0);
    return (code >= 0x4E00 && code <= 0x9FBF) ||   // CJK Unified Ideographs
        (code >= 0x3400 && code <= 0x4DBF);    // CJK Unified Ideographs Extension A
}

// Hàm lấy kanji đầu tiên trong chuỗi
function getFirstKanji(text) {
    if (!text) return null;
    for (let char of text) {
        if (isKanji(char)) {
            return char;
        }
    }
    return null;
}

async function performSearch() {
    // Kiểm tra nếu người dùng đã hết lượt tra miễn phí và không phải Premium
    // if (lookupCount >= MAX_LOOKUPS && !isPremium) {
    //     return;  // Ngừng việc thực hiện tìm kiếm
    // }

    const query = searchInput.value.trim();
    if (!query) return;

    const loadingElement = document.getElementById('loading');
    const resultsElement = document.getElementById('results');
    const imageResults = document.getElementById('image-results'); // Đảm bảo có phần tử để hiển thị ảnh
    const playAudioBtn = document.getElementById('play-audio-btn'); // Đảm bảo có phần tử phát âm

    loadingElement.style.display = 'block';
    resultsElement.innerHTML = '<div class="translation-status">Đang xử lý...</div>';
    imageResults.innerHTML = ''; // Xóa ảnh cũ
    playAudioBtn.style.display = 'none'; // Ẩn nút phát âm

    try {
        // Bước 1: Dịch sang tiếng Nhật
        const translatedText = await translateToJapanese(query);
        resultsElement.innerHTML = `<div class="translation-status">Đã dịch: "${query}" → "${translatedText}"</div>`;

        // Bước 2: Tìm kiếm trên Jisho
        const searchResults = await searchJisho(translatedText);
        displayResults(searchResults);

        // Bước 3: Tìm kiếm ảnh từ Unsplash
        await fetchImages(translatedText);

        // Bước 4: Tạo âm thanh từ văn bản đã dịch
        await convertTextToSpeech(translatedText);

    } catch (error) {
        console.error('Lỗi:', error);
        resultsElement.innerHTML = '<div class="error">Có lỗi xảy ra: ' + error.message + '</div>';
    } finally {
        loadingElement.style.display = 'none';
    }
}

// Hàm dịch sang tiếng Nhật
async function translateToJapanese(text) {
    try {
        const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ja&dt=t&q=${encodeURIComponent(text)}`);
        const data = await response.json();
        return data[0].map(item => item[0]).join('');
    } catch (error) {
        console.error('Translation error:', error);
        throw new Error('Keyword cannot be translated');
    }
}

// Hàm tìm kiếm trên Jisho
async function searchJisho(query) {
    const proxyUrl = 'https://api.allorigins.win/get?url=';
    const jishoUrl = encodeURIComponent(`https://jisho.org/api/v1/search/words?keyword=${query}`);

    const response = await fetch(proxyUrl + jishoUrl);
    const data = await response.json();

    if (!response.ok) throw new Error(data.message || '\n' +
        'API error');
    if (!data.contents) throw new Error('No data returned');

    return JSON.parse(data.contents).data;
}

// Hiển thị kết quả
function displayResults(results) {
    const container = document.getElementById('results');
    container.style.display = 'block';
    container.innerHTML = "";

    if (!results || results.length === 0) {
        container.innerHTML += '<p class="text-center text-danger">No results found</p>';
        return;
    }

    // Hiển thị kết quả đầu tiên chi tiết
    const firstResult = results[0];
    const japanese = firstResult.japanese?.[0] || {};
    const senses = firstResult.senses || [];

    const word = japanese.word || japanese.reading || 'N/A';
    const reading = japanese.reading && japanese.reading !== word ? japanese.reading : '';
    const firstKanji = getFirstKanji(word);

    let html = `
    <div class="card shadow-lg p-4 mb-4">
        <div class="d-flex justify-content-between align-items-start flex-wrap">
            <div class="word-info flex-grow-1" style="min-width: 300px;">
                <h2 class="word-title text-primary mb-2">${word}</h2>
                ${reading ? `<p class="reading text-muted"><em>${reading}</em></p>` : ''}
               
                <div class="word-details mt-3">
    `;

    // Thêm thông tin JLPT nếu có
    if (firstResult.jlpt) {
        html += `<div class="mb-2"><span class="badge bg-warning text-dark">JLPT: ${firstResult.jlpt.join(', ')}</span></div>`;
    }

    // Hiển thị các nghĩa
    senses.forEach((sense, index) => {
        const meaning = sense.english_definitions?.join(', ') || 'Không có thông tin';
        let additionalInfo = '';

        // Thêm các tag thông tin
        if (sense.parts_of_speech?.length) {
            additionalInfo += sense.parts_of_speech.map(pos =>
                `<span class="badge bg-secondary me-1">${pos}</span>`
            ).join('');
        }

        if (sense.tags?.length) {
            additionalInfo += sense.tags.map(tag =>
                `<span class="badge bg-info text-white me-1">${tag}</span>`
            ).join('');
        }

        // Thêm ví dụ
        let examplesHtml = '';
        if (sense.examples?.length) {
            examplesHtml = '<div class="mt-2"><strong>For example:</strong><ul class="list-group mt-2">';
            sense.examples.forEach(example => {
                examplesHtml += `
                <li class="list-group-item">
                    <div class="d-flex justify-content-between">
                        <span><strong>${example.japanese}</strong></span>
                        <small class="text-muted">${example.english}</small>
                    </div>
                </li>`;
            });
            examplesHtml += '</ul></div>';
        }

        html += `
            <div class="meaning-card p-3 mb-3 border rounded">
                <p class="fw-bold mb-2">Meaning ${index + 1}: <span class="text-success">${meaning}</span></p>
                ${additionalInfo ? `<div class="tags mt-2">${additionalInfo}</div>` : ''}
                ${examplesHtml}
            </div>
        `;
    });

    html += `
                </div>
            </div>
            
            <div class="visual-section ms-3" style="min-width: 300px;">
                <div id="image-results" style="width: 100%; height: 200px; margin-bottom: 20px;"></div>
    `;

    // Thêm nút xem cách viết kanji nếu có
    if (firstKanji) {
        html += `
            <div class="text-center">
                <button id="show-kanji-btn" class="btn btn-outline-primary mb-2 me-2">
                    <i class="fas fa-pen"></i> See how to write
                </button>
            <button id="practice-kanji-btn" class="btn btn-outline-success mb-2">
                    <i class="fas fa-pencil-alt"></i> Practice writing
            </button>
    
            <div id="kanji-animation-container" style="display: none; margin-top: 20px;">
                <div id="kanji" style="width: 120px; height: 120px; margin: 0 auto;"></div>
            </div>
    
            <div id="kanji-practice-container" style="display: none; margin-top: 20px;">
                <div id="kanji-practice" style="width: 200px; height: 200px; margin: 0 auto;"></div>
            <p class="text-muted mt-2">Draw letters in the boxes and you will be scored according to accuracy.</p>
                </div>
            </div>
        `;

    }

    html += `
            </div>
        </div>
        
        <div class="audio-section text-center mt-3">
            <button id="play-audio-btn" class="btn btn-primary">
                <i class="fas fa-volume-up"></i> Listen to pronunciation
            </button>
            <audio id="audioPlayer" style="display: none;"></audio>
        </div>
    </div>
    
    <h3 class="text-primary mt-4 mb-3"><i class="fas fa-search"></i>Other results</h3>
    <div class="other-results row">
    `;

    // Hiển thị các kết quả khác dưới dạng thẻ (card)
    for (let i = 1; i < Math.min(results.length, 6); i++) {
        const result = results[i];
        const japanese = result.japanese?.[0] || {};
        const senses = result.senses || [];

        const word = japanese.word || japanese.reading || 'N/A';
        const reading = japanese.reading && japanese.reading !== word ? japanese.reading : '';
        const firstSense = senses.length > 0 ? senses[0] : null;
        const meaning = firstSense ? firstSense.english_definitions?.join(', ') : 'No information available';

        html += `
        <div class="col-md-6 col-lg-4 mb-3">
            <div class="card h-100 clickable-word" data-word="${word}" style="cursor: pointer;">
                <div class="card-body">
                    <h5 class="card-title">${word}</h5>
                    ${reading ? `<h6 class="card-subtitle mb-2 text-muted">${reading}</h6>` : ''}
                    <p class="card-text">${meaning}</p>
                </div>
                ${result.jlpt ? `<div class="card-footer bg-transparent">
                    <small class="text-muted">JLPT: ${result.jlpt.join(', ')}</small>
                </div>` : ''}
            </div>
        </div>`;
    }

    html += `</div>`;
    container.innerHTML = html;

    // Thêm sự kiện click cho các từ trong "Các kết quả khác"
    document.querySelectorAll('.clickable-word').forEach(element => {
        element.addEventListener('click', function() {
            const wordToSearch = this.getAttribute('data-word');
            document.getElementById('query').value = wordToSearch;
            performSearch();
        });
    });

    // Thêm sự kiện click cho nút xem cách viết kanji
    if (firstKanji) {
        document.getElementById('show-kanji-btn').addEventListener('click', function() {
            const kanjiContainer = document.getElementById('kanji-animation-container');
            if (kanjiContainer.style.display === 'none') {
                kanjiContainer.style.display = 'block';
                showKanji(firstKanji);
                this.innerHTML = '<i class="fas fa-times"></i> Hide spelling';
            } else {
                kanjiContainer.style.display = 'none';
                this.innerHTML = '<i class="fas fa-pen"></i> See how to write';
            }
        });
    }
    if (firstKanji) {
        document.getElementById('practice-kanji-btn').addEventListener('click', function () {
            const practiceContainer = document.getElementById('kanji-practice-container');
            const animationContainer = document.getElementById('kanji-animation-container');

            // // Ẩn phần xem animation nếu đang hiển thị
            // animationContainer.style.display = 'none';
            // document.getElementById('show-kanji-btn').innerHTML = '<i class="fas fa-pen"></i> Xem cách viết';

            // Toggle hiển thị khung luyện viết
            if (practiceContainer.style.display === 'none') {
                practiceContainer.style.display = 'block';
                startPracticeKanji(firstKanji);
                this.innerHTML = '<i class="fas fa-times"></i> Exit writing practice';
            } else {
                practiceContainer.style.display = 'none';
                this.innerHTML = '<i class="fas fa-pencil-alt"></i> Practice writing';
            }
        });
    }
}

// Hàm hiển thị animation kanji bằng HanziWriter
function showKanji(kanji) {
    const kanjiElement = document.getElementById('kanji');
    kanjiElement.innerHTML = ''; // Xóa nội dung cũ

    try {
        const writer = HanziWriter.create('kanji', kanji, {
            width: 120,
            height: 120,
            padding: 5,
            strokeColor: '#222',
            radicalColor: '#168F16',
            delayBetweenStrokes: 300,
            showOutline: true,
            strokeAnimationSpeed: 2
        });

        writer.animateCharacter();
    } catch (error) {
        kanjiElement.innerHTML = `
            <div style="height:100%; display:flex; justify-content:center; align-items:center; font-size:48px;">
                ${kanji}
            </div>
        `;
        console.error('Lỗi khi tạo HanziWriter:', error);
    }
}
function startPracticeKanji(kanji) {
    const container = document.getElementById('kanji-practice');
    container.innerHTML = ''; // clear cũ

    try {
        const writer = HanziWriter.create('kanji-practice', kanji, {
            width: 200,
            height: 200,
            padding: 10,
            strokeColor: '#000',
            showOutline: true,
            showCharacter: false, // Ẩn chữ mẫu
            strokeAnimationSpeed: 1,
        });

        writer.quiz(); // Kích hoạt chế độ luyện
    } catch (error) {
        container.innerHTML = kanji;
        console.error('Lỗi khi luyện viết:', error);
    }
}


async function fetchImages(query) {
    try {
        const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${query}&client_id=${API_KEY}&per_page=1`
        );
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            displayImages(data.results[0]);
        } else {
            imageResults.innerHTML = '<p>No matching images found</p>';
        }
    } catch (error) {
        console.error('Lỗi khi tải ảnh:', error);
        imageResults.innerHTML = '<p>Unable to load photo</p>';
    }
}

function displayImages(image) {
    const imageContainer = document.getElementById('image-results');
    imageContainer.innerHTML = '';

    if (!image) return;

    const imgElement = document.createElement('img');
    imgElement.src = image.urls.regular;
    imgElement.alt = image.alt_description || 'Illustration photo';
    imgElement.style.maxWidth = '450px';
    imgElement.style.maxHeight = '300px';
    imgElement.style.borderRadius = '8px';
    imgElement.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    imgElement.style.objectFit = 'cover';

    imageContainer.appendChild(imgElement);
}

// Hàm phát âm thanh khi click nút loa
function playAudio() {
    if (audioPlayer.src) {
        audioPlayer.currentTime = 0; // Reset về đầu
        audioPlayer.play();
    }
}

// Hàm chuyển văn bản thành giọng nói
async function convertTextToSpeech(text) {
    if (!text) {
        document.getElementById('play-audio-btn').style.display = 'none';
        return;
    }

    const apiKey = "AIzaSyBoDBmFoXR8QcqFiGIp7oZ3QniEzoA-OrY";
    const request = {
        input: { text: text },
        voice: { languageCode: "ja-JP", ssmlGender: "NEUTRAL" },
        audioConfig: { audioEncoding: "MP3" }
    };

    try {
        const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
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

document.getElementById("voice-button").addEventListener("click", async () => {
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
            console.error("Voice recognition error:", event.error);
            alert("Voice recognition error: " + event.error);
        };

        recognition.onend = () => {
            console.log("Stop recording due to user silence.");
            document.getElementById("voice-button").disabled = false;
        };

        recognition.start();
        document.getElementById("voice-button").disabled = true;
    } catch (error) {
        console.error("Microphone cannot be used:", error);
        alert("Please grant microphone access.");
    }
});

// Hàm hiển thị 3 gợi ý gần nhất
function showRecentSuggestions(input) {
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    const suggestions = history
        .filter(item => item.toLowerCase().includes(input.toLowerCase()))
        .slice(0, 3);

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
        history = history.filter(item => item !== keyword);
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