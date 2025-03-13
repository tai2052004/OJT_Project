let currentIndex = 0;
const flashcards = document.querySelectorAll(".flashcard");

// Hiển thị flashcard hiện tại, ẩn các flashcard khác
function showCard(index) {
    flashcards.forEach((card, i) => {
        card.style.display = i === index ? "block" : "none";
    });
}

// Chuyển flashcard khi nhấn Next hoặc Previous
function plusDivs(n) {
    currentIndex = (currentIndex + n + flashcards.length) % flashcards.length;
    showCard(currentIndex);
}

// Lật
function flipCard(card) {
    card.classList.toggle("flipped");
}

showCard(currentIndex);
