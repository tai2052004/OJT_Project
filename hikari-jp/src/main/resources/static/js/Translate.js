const inputText = document.getElementById('inputText');
const sourceLanguage = document.getElementById('source-language');
const targetLanguage = document.getElementById('target-language');
const translatedText = document.getElementById('translatedText');
const hiraganaText = document.getElementById('hiragana-text');
const starButton = document.querySelectorAll('.star-button');
const historyButton = document.querySelector('.history-title');
const savedButton = document.querySelector('.saved-title');
const historyBody = document.querySelector('.history-body');
const savedBody = document.querySelector('.Saved-body');

document.addEventListener('DOMContentLoaded', () => {
    let timeout = null;
    sourceLanguage.addEventListener('input', translateText);
    targetLanguage.addEventListener('input',translateText);
    inputText.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(translateText, 500); // Chờ 500ms sau khi nhập để gọi API
    });
    starButton.forEach(button => button.addEventListener('click',() =>
    {
        const imgst = button.querySelector('.star_image');
        changeImage(imgst);
    }));
    historyButton.addEventListener('click', () => {
        changeHistoryandSave(savedButton,historyButton);
        historyBody.style.display = "flex";
        savedBody.style.display = "none";
    });
    savedButton.addEventListener('click',() => {
        changeHistoryandSave(historyButton,savedButton);
        historyBody.style.display = "none";
        savedBody.style.display = "flex";
    });
});
async function translateText() {
    const text = inputText.value.trim();
    const source = sourceLanguage.value;
    const target = targetLanguage.value;

    if (!text) {
        translatedText.textContent = '';
        hiraganaText.textContent = '';
        return;
    }

    try {
        // Dịch văn bản
        const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(text)}`);
        const data = await response.json();
        const translation = data[0].map(item => item[0]).join('');
        translatedText.textContent = translation;
        const response2 = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=ja&tl=ja-Latn&dt=rm&dt=t&q=${encodeURIComponent(translation)}`);
        const data2 = await response2.json();
        const translation2 = data2[0].map(item => item[0]).join('');

        // const response3 = await fetch(`https://api.datamuse.com/words?ml=${translation}`);
        // const data3 = await response3.json();
        // const synonyms = data3.slice(0, 5).map(item => item.word);
        //
        // const query = synonyms.join(",");
        // const response4 = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ja&dt=rm&dt=t&q=${encodeURIComponent(query)}`);
        // const data4 = await response4.json();
        // const translation4 = data4[0].map(item => item[0]).join('');
        //
        // console.log(translation4);
        // const API_KEY = "AIzaSyBoDBmFoXR8QcqFiGIp7oZ3QniEzoA-OrY";


        console.log("Kanji:", translation);
        console.log("Romaji:", translation2);
        hiraganaText.textContent = translation2;

    } catch (error) {
        console.error('Lỗi khi dịch:', error);
        translatedText.textContent = 'Lỗi dịch!';
        hiraganaText.textContent = '';
    }
}
function swaptrans()
{
    const temp = sourceLanguage.value;
    sourceLanguage.value = targetLanguage.value;
    targetLanguage.value = temp;
    translateText().catch();
}
function changeImage(starImage)
{
    if ( starImage.src.includes("Star_white.png"))
    {
        starImage.src = "../static/images/Star_yellow.png";
    }
    else
    {
        starImage.src = "../static/images/Star_white.png";
    }

}
function changeHistoryandSave(activeButton,InactiveButton)
{
    activeButton.classList.remove('active');
    InactiveButton.classList.add('active');
}