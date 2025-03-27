document.getElementById('search-button').addEventListener('click', performSearch);

const API_KEY = '0h5JCQWWS58FnIIbcRRDOohn75o-xl-0rbdtEEAFCkU'; // Thay bằng key của bạn
const searchInput = document.getElementById('query');
const imageResults = document.getElementById('image-results');

async function performSearch() {
    const query = searchInput.value.trim();
    if (!query) return;

    const loadingElement = document.getElementById('loading');
    const resultsElement = document.getElementById('results');

    loadingElement.style.display = 'block';
    resultsElement.innerHTML = '<div class="translation-status">Đang xử lý...</div>';
    imageResults.innerHTML = ''; // Xóa ảnh cũ

    try {
        // Bước 1: Dịch sang tiếng Nhật
        const translatedQuery = await translateToJapanese(query);
        resultsElement.innerHTML = `<div class="translation-status">Đã dịch: "${query}" → "${translatedQuery}"</div>`;

        // Bước 2: Tìm kiếm trên Jisho
        const searchResults = await searchJisho(translatedQuery);
        displayResults(searchResults);

        // Bước 3: Tìm kiếm ảnh từ Unsplash
        await fetchImages(translatedQuery);

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

// Hiển thị kết quả
function displayResults(results) {
    const container = document.getElementById('results');
    container.style.display = 'block';
    container.innerHTML = "";
    if (!results || results.length === 0) {
        container.innerHTML += '<p>Không tìm thấy kết quả</p>';
        return;
    }
    let html = `
        <div class="result-container p-3">
            <h3 class="text-primary">🔍 Kết quả tìm kiếm</h3>
            <div class="row g-3">
    `;

    results.forEach(result => {
        const japanese = result.japanese?.[0] || {};
        const senses = result.senses?.[0] || {};

        const word = japanese.word || japanese.reading || 'N/A';
        const reading = japanese.reading || '';
        const meaning = senses.english_definitions?.join(', ') || 'Không có thông tin';

        html += `
            <div class="result-item pb-2">
    <div class="d-flex align-items-center">
        <h2 class="me-5">${word}</h2> 
        <p class="meaning mb-0"><strong>Ý nghĩa:</strong> ${meaning}</p>
    </div>
    ${reading ? `<p class="reading text-muted"><em>${reading}</em></p>` : ''}
    <div class="border-bottom mt-2 w-50"></div> 
</div>


        `;
    });
    html += `</div></div>`;
    container.innerHTML += html;
}
async function fetchImages(query) {
    try {
        const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${query}&client_id=${API_KEY}&per_page=1`
        );
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            displayImages(data.results[0]); // Truyền 1 ảnh duy nhất
        } else {
            imageResults.innerHTML = '<p>Không tìm thấy ảnh phù hợp</p>';
        }
    } catch (error) {
        console.error('Lỗi khi tải ảnh:', error);
        imageResults.innerHTML = '<p>Không thể tải ảnh</p>';
    }
}

function displayImages(image) {
    imageResults.innerHTML = ''; // Xóa nội dung cũ

    const imgElement = document.createElement('img');
    imgElement.src = image.urls.regular; // URL ảnh chất lượng trung bình
    imgElement.alt = image.alt_description || 'Ảnh minh họa';

    // Thêm style để ảnh đẹp hơn (tùy chọn)
    imgElement.style.maxWidth = '100%';
    imgElement.style.borderRadius = '8px';
    imgElement.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';

    imageResults.appendChild(imgElement);
}