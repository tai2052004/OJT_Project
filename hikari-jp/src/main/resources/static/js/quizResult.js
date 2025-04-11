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

    // Hiển thị từng câu hỏi
    const container = document.getElementById('results-container');

    result.userAnswers.forEach((answer, index) => {
        const questionCard = document.createElement('div');
        questionCard.className = `question-card ${answer.isCorrect ? 'correct' : 'incorrect'}`;

        questionCard.innerHTML = `
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
                `;

        container.appendChild(questionCard);
    });
}