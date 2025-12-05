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

let notes = []; // store notes array locally

// Load saved notes on page load
window.onload = () => {
    const storedNotes = localStorage.getItem("speechNotes");
    if (storedNotes) {
        notes = JSON.parse(storedNotes);
        renderNotes();
    }
};

function renderNotes() {
    notesList.innerHTML = "";

    notes.forEach((note, index) => {
        const li = document.createElement("li");

        const textSpan = document.createElement("span");
        textSpan.textContent = note;

        // Download button
        const downloadBtn = document.createElement("button");
        downloadBtn.textContent = "Download 📥";
        downloadBtn.classList.add("download-btn");
        downloadBtn.addEventListener("click", () => {
            downloadNote(note);
        });

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete ❌";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", () => {
            deleteNote(index);
        });

        li.appendChild(textSpan);
        li.appendChild(downloadBtn);
        li.appendChild(deleteBtn);
        notesList.appendChild(li);
    });
}

function deleteNote(index) {
    notes.splice(index, 1); // remove note at index
    localStorage.setItem("speechNotes", JSON.stringify(notes));
    renderNotes();
}

function downloadNote(noteText) {
    const blob = new Blob([noteText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "note.txt"; // file name
    a.click();

    URL.revokeObjectURL(url);
}

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

    notes.push(noteText);
    localStorage.setItem("speechNotes", JSON.stringify(notes));

    renderNotes();
    textArea.value = "";
});
