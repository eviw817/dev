document.addEventListener("DOMContentLoaded", () => {
    const webcamElement = document.querySelector(".video");
    const canvasElement = document.querySelector(".canvas");
    const captureButton = document.querySelector(".button");
    const resultContainer = document.querySelector(".result");
    const webcam = new Webcam(webcamElement, "user", canvasElement);
    let model;

    // Loading MobileNet model
    mobilenet.load().then(loadedModel => {
        model = loadedModel;
        console.log("MobileNet model loaded");
    });

    // Starting webcam
    webcam.start()
        .then(() => {
            console.log("Webcam started");
        })
        .catch(err => {
            console.error("Error starting webcam", err);
        });

    // Capturing image and classifying it
    captureButton.addEventListener("click", () => {
        const picture = webcam.snap();
        const imageElement = new Image();
        imageElement.src = picture;

        imageElement.onload = () => {
            model.classify(imageElement).then(predictions => {
                console.log("Predictions: ", predictions);
                resultContainer.innerHTML = predictions.map(p => `
                    <p>${p.className}: ${(p.probability * 100).toFixed(2)}%</p>
                `).join("");
            });
        };
    });
});
