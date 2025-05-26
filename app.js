let currentQuestions = [];
let timer;
let timeLeft = 600; // 5 minutes

fetch('questions.json')
  .then(res => res.json())
  .then(data => {
    currentQuestions = data;
    displayQuestions();
    startTimer();
  });

function displayQuestions() {
  const container = document.getElementById('quiz-container');
  container.innerHTML = '';
  currentQuestions.forEach((q, index) => {
    const div = document.createElement('div');
    div.className = 'question';
    div.innerHTML = `<p>${index + 1}. ${q.question}</p>` +
      q.options.map((opt, i) =>
        `<label class="option">
          <input type="radio" name="q${index}" value="${opt}">
          ${opt}
        </label><br>`).join('');
    container.appendChild(div);
  });
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').textContent = formatTime(timeLeft);
    if (timeLeft <= 0) {
      clearInterval(timer);
      submitQuiz();
    }
  }, 1000);
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function submitQuiz() {
  clearInterval(timer);
  let score = 0;
  let answers = '';
  currentQuestions.forEach((q, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    const answer = selected ? selected.value : 'Not answered';
    if (selected && selected.value === q.answer) score++;
    answers += `Q${i + 1}: ${q.question}\nYour Answer: ${answer}\nCorrect Answer: ${q.answer}\n\n`;
  });
  const resultText = `Score: ${score} out of ${currentQuestions.length}\n\n${answers}`;
  document.getElementById('result').textContent = resultText.replace(/\n/g, '\n');
  document.getElementById('export-btn').style.display = 'inline';

  const adminSection = document.getElementById('admin-panel');
  adminSection.style.display = 'block';
}

function exportResult() {
  const blob = new Blob([document.getElementById('result').textContent], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'cbt_result.txt';
  link.click();
}

function addQuestion() {
  const q = document.getElementById('admin-question').value.trim();
  const opts = [
    document.getElementById('admin-opt1').value.trim(),
    document.getElementById('admin-opt2').value.trim(),
    document.getElementById('admin-opt3').value.trim(),
    document.getElementById('admin-opt4').value.trim()
  ];
  const ans = document.getElementById('admin-answer').value.trim();

  if (!q || opts.some(opt => !opt) || !ans) {
    alert('Please fill all fields.');
    return;
  }

  currentQuestions.push({ question: q, options: opts, answer: ans });
  alert('Question added successfully (not saved permanently).');
}