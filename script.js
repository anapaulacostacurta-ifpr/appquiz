// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);

// Elements
const questionInput = document.getElementById('question');
const answerInput = document.getElementById('answer');
const timeLimitInput = document.getElementById('time-limit');
const addQuestionButton = document.getElementById('add-question');

const rollDiceButton = document.getElementById('roll-dice');
const activitySection = document.getElementById('activity-section');
const activityQuestion = document.getElementById('activity-question');
const playerAnswerInput = document.getElementById('player-answer');
const submitAnswerButton = document.getElementById('submit-answer');
const timerDisplay = document.getElementById('timer');

// Event: Add Question to Firestore
addQuestionButton.addEventListener('click', async () => {
    const question = questionInput.value.trim();
    const answer = answerInput.value.trim();
    const timeLimit = parseInt(timeLimitInput.value, 10);

    if (question && answer && timeLimit) {
        try {
            await db.collection('questions').add({
                question,
                answer,
                timeLimit
            });
            alert('Question added successfully!');
            questionInput.value = '';
            answerInput.value = '';
            timeLimitInput.value = '';
        } catch (error) {
            console.error('Error adding question:', error);
        }
    } else {
        alert('Please fill out all fields!');
    }
});

// Timer Function
function startTimer(seconds, callback) {
    let remainingTime = seconds;
    timerDisplay.textContent = `Time left: ${remainingTime}s`;

    const timerInterval = setInterval(() => {
        remainingTime--;
        timerDisplay.textContent = `Time left: ${remainingTime}s`;

        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            timerDisplay.textContent = 'Time is up!';
            callback();
        }
    }, 1000);
}

// Event: Roll Dice
rollDiceButton.addEventListener('click', async () => {
    try {
        const querySnapshot = await db.collection('questions').get();
        const questions = querySnapshot.docs.map(doc => doc.data());

        if (questions.length > 0) {
            const randomQuestion = questions[Math.floor(Math.random() * questions.length)];

            activitySection.style.display = 'block';
            activityQuestion.textContent = randomQuestion.question;
            playerAnswerInput.value = '';

            startTimer(randomQuestion.timeLimit, () => {
                alert('Time is up!');
                activitySection.style.display = 'none';
            });
        } else {
            alert('No questions available!');
        }
    } catch (error) {
        console.error('Error fetching questions:', error);
    }
});

// Event: Submit Answer
submitAnswerButton.addEventListener('click', () => {
    const playerAnswer = playerAnswerInput.value.trim();
    if (playerAnswer) {
        alert(`Your answer: ${playerAnswer}`);
        activitySection.style.display = 'none';
    } else {
        alert('Please enter an answer!');
    }
});
