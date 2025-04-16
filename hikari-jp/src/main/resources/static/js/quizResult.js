document.addEventListener('DOMContentLoaded', function() {
    // Lấy kết quả từ localStorage hoặc server
    const quizResult = JSON.parse(localStorage.getItem('quizResult')) ||
        JSON.parse('[[${quizResult}]]');

    if (!quizResult) {
        window.location.href = '/quizz';
        return;
    }

    displayResults(quizResult);
});

function displayResults(result) {
    // Hiển thị tổng điểm
    document.getElementById('score-display').textContent = result.score;
    document.getElementById('total-display').textContent = result.totalQuestions;

    const percentage = Math.round((result.score / result.totalQuestions) * 100);
    document.getElementById('percentage-display').textContent = percentage;

    const container = document.getElementById('results-container');
    const navigation = document.getElementById('results-navigation');
    let currentIndex = 0;

    // Xóa nội dung cũ
    container.innerHTML = '';
    navigation.innerHTML = '';

    // Tạo nút điều hướng
    const prevButton = document.createElement('button');
    prevButton.innerHTML = '<i class="bi bi-arrow-left"></i>';
    prevButton.className = 'nav-button';
    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            showQuestion(currentIndex);
        }
    });

    const nextButton = document.createElement('button');
    nextButton.innerHTML = '<i class="bi bi-arrow-right"></i>';
    nextButton.className = 'nav-button';
    nextButton.addEventListener('click', () => {
        if (currentIndex < result.userAnswers.length - 1) {
            currentIndex++;
            showQuestion(currentIndex);
        }
    });

    const counter = document.createElement('span');
    counter.className = 'question-counter';
    counter.textContent = `1/${result.userAnswers.length}`;

    navigation.appendChild(prevButton);
    navigation.appendChild(counter);
    navigation.appendChild(nextButton);

    // Hiển thị câu hỏi
    function showQuestion(index) {
        const answer = result.userAnswers[index];
        container.innerHTML = `
            <div class="question-card ${answer.isCorrect ? 'correct' : 'incorrect'}">
                <span class="${answer.isCorrect ? 'correct-icon' : 'incorrect-icon'}">
                    <i class="bi ${answer.isCorrect ? 'bi-check2' : 'bi-x'}"></i>
                </span>
                <p class="question-number">Question ${index + 1}:</p>
                <p class="japanese">${answer.question}</p>
                <p class="answer-row">
                    <span class="answer-label">Your Answer:</span>
                    <span class="answer ${answer.isCorrect ? 'correct' : 'incorrect'}">${answer.selected}</span>
                </p>
                ${!answer.isCorrect ? `
                <p class="answer-row">
                    <span class="answer-label">Correct Answer:</span>
                    <span class="answer correct">${answer.correct}</span>
                </p>
                ` : ''}
            </div>
        `;

        // Cập nhật counter
        counter.textContent = `${index + 1}/${result.userAnswers.length}`;

        // Disable nút khi ở đầu/cuối
        prevButton.disabled = index === 0;
        nextButton.disabled = index === result.userAnswers.length - 1;
    }

    // Hiển thị câu đầu tiên
    showQuestion(0);
}