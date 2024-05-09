const questions  = [
    { question: "What is 4 + 4?", answers: ["eight", "8"] },
    { question: "How many liters of water should you drink every day?", answers: ["two", "2"] },
    { question: "What is the capital of England?", answers: ["London"] },
    { question: "How high is the Eifeltower in meters?", answers: ["321", "threehundred twenty one"] },
];

let currentQuestionIndex = 0;

/* Selectors */
const questionEl = document.querySelector(".question");
const resultEl = document.querySelector(".result");
const speakQuestionBtn = document.querySelector(".speakQuestionButton");
const answerBtn = document.querySelector(".answerButton");
const nextBtn = document.querySelector(".nextButton");

/* Voice Recognition option */
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "en-EN";

/* Speech Synthesis option */
const synth = window.speechSynthesis;
let utterance = new SpeechSynthesisUtterance();
utterance.lang = "en-EN";
utterance.pitch = 1.2;
utterance.rate = 0.9;

function speakQuestion(questionText) {
    utterance.text = questionText;
    synth.speak(utterance);
}

speakQuestionBtn.addEventListener("click", function() {
    speakQuestion(questions[currentQuestionIndex].question);
    answerBtn.disabled = false;
});

answerBtn.addEventListener("click", function() {
    recognition.start();
});

recognition.onresult = function(event) {
    const answer = event.results[0][0].transcript.trim().toLowerCase();
    console.log(`I got something, I heard ${answer}`)
    const correctAnswers = questions[currentQuestionIndex].answers.map(anwser => answer.toLowerCase());
    if (correctAnswers.includes(answer)) {
        nextBtn.style.display = "inline-block";
        speakQuestionBtn.disabled = "none";
        answerBtn.disabled = "none";
    } else {
        nextBtn.style.display = "none";
        answerBtn.disabled = false; // Enable answer button again for retry
    }
}

nextBtn.addEventListener("click", function() {
    resultEl.textContent = "";
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        questionEl.textContent = questions[currentQuestionIndex].question;
        speakQuestionBtn.disabled = false;
        answerBtn.disabled = true;
        nextBtn.style.display = "none";
    } else {
        questionEl.textContent = "Well Done! The quiz is over.";
        questionEl.style.color = "#AF03FF";
        speakQuestionBtn.disabled = true;
        answerBtn.disabled = true;
        nextBtn.style.display = "none";
    }
});

// Start with the first question
questionEl.textContent = questions[currentQuestionIndex].question;
speakQuestionBtn.disabled = false;
answerBtn.disabled = true;
