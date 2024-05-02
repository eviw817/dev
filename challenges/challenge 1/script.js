const synth = window.speechSynthesis;
const recognition = new webkitSpeechRecognition();
recognition.continuous = true;

const question = document.getElementById('question');
const answersList = document.getElementById('answers');
const userAnswer = document.getElementById('user-answer');
const submitBtn = document.getElementById('submit-btn');
const feedback = document.getElementById('feedback');

let currentQuestionIndex = 0;
const questions = [
    { question: 'What is 2 + 2?', answer: '4' },
    { question: 'Who is the current president of the United States?', answer: 'Joe Biden' }
];

function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
}

function askQuestion() {
    speak(questions[currentQuestionIndex].question);
}

function checkAnswer(userResponse) {
    const correctAnswer = questions[currentQuestionIndex].answer.toLowerCase();
    if (userResponse.toLowerCase() === correctAnswer) {
        speak('Correct! Well done.');
        feedback.textContent = 'Correct!';
    } else {
        speak('Incorrect. The correct answer is ' + correctAnswer);
        feedback.textContent = 'Incorrect';
    }
}

recognition.onresult = function(event) {
    const userResponse = event.results[event.results.length - 1][0].transcript;
    userAnswer.value = userResponse;
    checkAnswer(userResponse);
};

submitBtn.addEventListener('click', function() {
    recognition.start();
});

askQuestion();
