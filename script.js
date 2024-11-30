// Array of flashcard data
const flashcardsData = [
    { question: "What is the speed of light?", answer: "299,792 km/s", category: "Physics" },
    { question: "What is Newton's First Law?", answer: "An object in motion stays in motion...", category: "Physics" },
    { question: "What is H2O?", answer: "Water", category: "Chemistry" },
    { question: "What is the symbol for Iron?", answer: "Fe", category: "Chemistry" },
    { question: "What planet is known as the Red Planet?", answer: "Mars", category: "Physics" }
];

// Track the current flashcard and filtered flashcards list
let currentCardIndex = 0;
let filteredFlashcards = [...flashcardsData]; // Start with all flashcards

function createFlashcard(data) {
    const flashcard = document.createElement('div');
    flashcard.className = 'flashcard';
    flashcard.onclick = () => {
        flipCard(flashcard);
        speakText(data.question);
    };

    const front = document.createElement('div');
    front.className = 'front';
    front.textContent = data.question;

    const back = document.createElement('div');
    back.className = 'back';
    back.textContent = data.answer;

    flashcard.appendChild(front);
    flashcard.appendChild(back);
    return flashcard;
}

function displayFlashcard(index) {
    const container = document.getElementById('flashcard-container');
    container.innerHTML = ''; // Clear previous flashcard
    if (filteredFlashcards.length > 0) {
        container.appendChild(createFlashcard(filteredFlashcards[index]));
    } else {
        container.innerHTML = '<p>No flashcards available.</p>';
    }
    updateProgress(index, filteredFlashcards.length);
}

function flipCard(card) {
    card.classList.toggle('flipped');
}

function previousCard() {
    if (currentCardIndex > 0) {
        currentCardIndex--;
        displayFlashcard(currentCardIndex);
    }
}

function nextCard() {
    if (currentCardIndex < filteredFlashcards.length - 1) {
        currentCardIndex++;
        displayFlashcard(currentCardIndex);
    }
}

function updateProgress(currentIndex, totalCards) {
    const progress = document.getElementById('progress');
    if (totalCards > 0) {
        progress.textContent = `Card ${currentIndex + 1} of ${totalCards}`;
    } else {
        progress.textContent = 'No cards available';
    }
}

function addFlashcard() {
    const question = document.getElementById('new-question').value;
    const answer = document.getElementById('new-answer').value;
    const category = document.getElementById('new-category').value;

    if (question && answer) {
        flashcardsData.push({ question, answer, category });
        alert('Flashcard added!');
        filterFlashcards(); // Reapply the filter after adding a new card
    }
}

function filterFlashcards() {
    const selectedCategory = document.getElementById('category-select').value;
    filteredFlashcards = selectedCategory === 'all'
        ? flashcardsData
        : flashcardsData.filter(card => card.category === selectedCategory);

    // Reset the card index to the first card
    currentCardIndex = 0;

    // Display the first card from the filtered results
    displayFlashcard(currentCardIndex);
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

window.onload = function() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    displayFlashcard(currentCardIndex);
}

function startQuizMode() {
    let score = 0;
    filteredFlashcards.forEach(card => {
        let options = [card.answer];
        while (options.length < 4) {
            const randomAnswer = flashcardsData[Math.floor(Math.random() * flashcardsData.length)].answer;
            if (!options.includes(randomAnswer)) options.push(randomAnswer);
        }
        options.sort(() => Math.random() - 0.5);
        const userAnswer = prompt(`Q: ${card.question}\nOptions: ${options.join(', ')}`);
        if (userAnswer === card.answer) {
            score++;
        }
    });
    alert(`Quiz Completed! Your Score: ${score}/${filteredFlashcards.length}`);
}

function speakText(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
}
