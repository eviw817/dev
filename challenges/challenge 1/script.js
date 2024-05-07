const questions  = [
    { question: "What is 4 + 4?", answer: "eight" },
    { question: "How much liters should you drink a day?", answer: "two" },
    { question: "Where in Europa is Disneyland?", answer: "Paris" },
    { question: "What is the capital of Belgium", answer: "Brussels" },
];

let currentQuestionIndex = 0;

const questionElement = document.getElementById("question");
const resultElement = document.getElementById("result");
const speakQuestionButton = document.getElementById("speakQuestionButton");
const answerButton = document.getElementById("answerButton");
const nextButton = document.getElementById("nextButton");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "en-EN";

const synth = window.speechSynthesis;
let utterance = new SpeechSynthesisUtterance();
utterance.lang = "en-EN";
utterance.pitch = 1.2;
utterance.rate = 0.9;

function speakQuestion(questionText) {
    utterance.text = questionText;
    synth.speak(utterance);
}

speakQuestionButton.addEventListener("click", function() {
    speakQuestion(questions[currentQuestionIndex].question);
    answerButton.disabled = false;
});

answerButton.addEventListener("click", function() {
    recognition.start();
});

recognition.onresult = function(event) {
    const answer = event.results[0][0].transcript.trim().toLowerCase();
    const correctAnswer = questions[currentQuestionIndex].answer.toLowerCase();
    if (answer === correctAnswer) {
        resultElement.textContent = "That's right!";
        resultElement.style.color = "white";
        resultElement.style.fontSize = "40px";
        nextButton.style.display = "inline-block";
        speakQuestionButton.disabled = "none";
        answerButton.disabled = "none";
    } else {
        resultElement.textContent = "Wrong! Try again.";
        resultElement.style.color = "black";
        resultElement.style.fontSize = "40px";
        nextButton.style.display = "none";
        answerButton.disabled = false; // Enable answer button again for retry
    }
}

answerButton.addEventListener("click", function() {
    recognition.start();
});

nextButton.addEventListener("click", function() {
    resultElement.textContent = "";
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        questionElement.textContent = questions[currentQuestionIndex].question;
        speakQuestionButton.disabled = false;
        answerButton.disabled = true;
        nextButton.style.display = "none";
    } else {
        questionElement.textContent = "Well Done! The quiz is over.";
        questionElement.style.color = "#117bd5";
        speakQuestionButton.disabled = true;
        answerButton.disabled = true;
        nextButton.style.display = "none";
    }
});

// Start with the first question
questionElement.textContent = questions[currentQuestionIndex].question;
speakQuestionButton.disabled = false;
answerButton.disabled = true;
