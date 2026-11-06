const buttons = document.querySelectorAll('.option-btn');
const feedbackEl = document.getElementById('feedback');
const scoreEl = document.getElementById('score');
let score = 0;

buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        buttons.forEach(b => b.disabled = true);
        if (btn.dataset.correct === "true") {
            feedbackEl.textContent = "✅ Correct!";
            feedbackEl.style.color = "#27ae60";
            score++;
        } else {
            feedbackEl.textContent = "❌ Wrong answer.";
            feedbackEl.style.color = "#e74c3c";
        }
        scoreEl.textContent = score;
    })
})
