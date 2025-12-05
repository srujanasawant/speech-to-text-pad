// Check if browser supports Speech Recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
let isListening = false;

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const saveBtn = document.getElementById("saveBtn");
const statusText = document.getElementById("status");
const textArea = document.getElementById("textArea");
const notesList = document.getElementById("notesList");

if (!SpeechRecognition) {
    statusText.textContent = "Speech Recognition not supported in this browser.";
    startBtn.disabled = true;
} else {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
        statusText.textContent = "Status: Listening...";
        startBtn.classList.add("listening");
        startBtn.disabled = true;
        stopBtn.disabled = false;
    };

    recognition.onend = () => {
        statusText.textContent = "Status: Stopped";
        startBtn.classList.remove("listening");
        startBtn.disabled = false;
        stopBtn.disabled = true;
        isListening = false;
    };

    recognition.onerror = (e) => {
        statusText.textContent = "Error: " + e.error;
    };

    recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        textArea.value = transcript.trim();
    };
}

// Start listening
startBtn.addEventListener("click", () => {
    if (!isListening) {
        recognition.start();
        isListening = true;
    }
});

// Stop listening
stopBtn.addEventListener("click", () => {
    if (isListening) {
        recognition.stop();
    }
});

// Save note
saveBtn.addEventListener("click", () => {
    const noteText = textArea.value.trim();
    if (noteText === "") return;

    const li = document.createElement("li");
    li.textContent = noteText;
    notesList.appendChild(li);

    textArea.value = "";
});
