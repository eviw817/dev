// Setting up global variables
// These variables are used throughout the script
let map = undefined;
let geoMarker = undefined;
let questionMarker = undefined;
let questionLine = undefined;
let questionIndex = 0;
let questionEl = undefined;
let resultEl = undefined;
let formEl = undefined;
let nextButton = undefined;
let gameOverContainer = undefined;
let restartButton = undefined;

// Define questions
// This array holds the questions and their corresponding coordinates
let question = [
    // Each question is an object with a "question" property and a "coordinates" property
    // The "question" property is a string that will be displayed to the user
    // The "coordinates" property is an array of two numbers representing the latitude and longitude of the location the question is about
    {
        question: "How far are you from the statue of Liberty? (In kilometers)",
        coordinates: [40.689247, -74.044502]
    },
    {
        question: "How far are you from the Taj Mahal (In kilometers)?",
        coordinates: [27.173891, 78.042068]
    },
    {
        question: "How far are you from the Eiffel Tower (In kilometers)?",
        coordinates: [48.858370, 2.294481]
    },
    {
        question: "How far are you from the Shibuya Square (In kilometers)?",
        coordinates: [35.661777, 139.704056]
    }
]

// This event listener waits for the entire HTML document to load before running the callback function
// The callback function sets up the selectors, initial visibility, and map
document.addEventListener('DOMContentLoaded', () => {
    setUpSelectors();
    setUpInitialVisibility();
    map = initMap();
});

// INITIAL SETUP //
// This function gets references to various HTML elements and assigns them to the global variables
function setUpSelectors(){
    questionEl = document.querySelector(".question");
    resultEl = document.querySelector(".result");
    formEl = document.querySelector("form");
    nextButton = document.querySelector(".next");
    restartButton = document.querySelector(".restart");
    gameOverContainer = document.querySelector(".game-over");
}

// Hides the elements that should not be visible at the start
function setUpInitialVisibility(){
    resultEl.innerHTML = "";
    gameOverContainer.style.display = "none";
}

// This function initializes the Leaflet map and sets up event listeners for location found and location error events
function initMap() {
    let result = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(result);
    result.on('locationfound', onGeolocate);
    result.on('locationerror', onGeolocateError);
    result.locate({ setView: true, maxZoom: 16 });
    return result;
}

// This function is called when the user's location is found
// It sets up the user's location marker, loads the first question, and sets up event listeners for the form submit, "next" button click, and "restart" button click events
function onGeolocate(e){
    geoMarker = L.marker(e.latlng);
    geoMarker.addTo(map).bindPopup("You are here");
    loadInQuestion(question[questionIndex]);
    formEl.addEventListener("submit", handleSubmit);
    nextButton.addEventListener("click", handleNext);
    restartButton.addEventListener("click", handleRestart);
}

// This function is called when there is an error finding the user's location
function onGeolocateError(e){
    console.error(e);
}

// GAME LOGIC //
// This function is called when the user submits an answer
// It calculates the distance between the user's location and the question's location, compares it to the user's answer, and displays the result
function handleSubmit(e) {
    e.preventDefault();
    const distance = (geoMarker.getLatLng().distanceTo(questionMarker.getLatLng()) / 1000).toFixed(0)
    const answer = e.target[0].value;
    formEl.style.display = "none";
    resultEl.style.display = "flex";
    (distance == answer) 
        ? resultEl.innerHTML = "Correct, well guessed! ^^" 
        : resultEl.innerHTML = `Unfortunately, you were off by ${Math.abs(distance - answer)} kilometers. The correct answer was ${distance} kilometers.`;
    nextButton.style.display = "block";
}

// This function is called when the user clicks the "next" button
// It increments the question index, removes the previous question's marker and line, and either ends the game or loads the next question
function handleNext(e){
    questionIndex++;
    map.removeLayer(questionMarker);
    map.removeLayer(questionLine);
    if(questionIndex >= question.length){
        nextButton.style.display = "none";
        resultEl.style.display = "none";
        gameOverContainer.style.display = "flex";
    } else {
        resultEl.innerHTML = "";
        loadInQuestion(question[questionIndex]);
        nextButton.disabled = false;
        nextButton.style.display = "none";  
    }
}

// This function is called when the user clicks the "restart" button
// It resets the question index and loads the first question
function handleRestart(e){
    questionIndex = 0;
    gameOverContainer.style.display = "none";
    loadInQuestion(question[questionIndex]);
}

// This function is called to load a question
// It displays the question, sets up the question's marker and line, and adjusts the map view to include both the user's location and the question's location
function loadInQuestion(current){
    questionEl.innerHTML = current.question;
    nextButton.style.display = "none";
    formEl.style.display = "flex";
    questionMarker = L.marker(current.coordinates);
    questionLine = L.polyline([geoMarker.getLatLng(), current.coordinates]);
    questionMarker.addTo(map);
    questionLine.addTo(map);
    map.flyToBounds([geoMarker.getLatLng(), current.coordinates])
}