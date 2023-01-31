var startCard = document.getElementById('countdown');
var button = document.getElementById('start');
var introduction = document.getElementById('intro');
var questionContainer = document.getElementById('quesCards');
var questions = document.getElementById('questions');
var answerBtn = document.getElementById('ansBtn')
var results = document.getElementById('results');

var quizEnd = document.getElementById('quiz-end');
var finalScores = document.getElementById('final-score');
var scoreForm = document.getElementById('score-form');
var initialsEl = document.getElementById('initials');

var linkHof = document.getElementById('hof');
var hallOfFame = document.getElementById('hall-of-fame');
var scoresList = document.getElementById('scores-list');
var clearBtn = document.getElementById('clear');
var backBtn = document.getElementById('go-back'); 

var scores = [];
let questionIndex = 0;
var secondsLeft = 60;
let timerInterval;
let flashTimeout;

function startQuiz(){
    hideElement (introduction);
    showElement(questionContainer);
    availableQuestions = questionBank;
    displayQuestion();
    startTimer();
    
}

function displayQuestion() {
    var currentQuestion = availableQuestions[questionIndex];
    questions.textContent = currentQuestion.question;
    var possibleAnswers = currentQuestion.choices;
    for (i=0; i < possibleAnswers.length; i++) {
        var button = document.createElement('button');
        button.textContent = possibleAnswers[i];
        button.setAttribute('class', 'btn')
        button.addEventListener('click', function(event){
            checkAnswer(event);
            resetQuestions();
            nextQuestion();
        });
        
        answerBtn.appendChild(button);
        
    }
};

function resetQuestions() {
    questionIndex++;
    if (questionIndex < availableQuestions.length) {
        while (answerBtn.firstChild) {
            answerBtn.removeChild(answerBtn.firstChild);
        }
         
    } else {
        endQuiz();

    }
}


function checkAnswer(event) {
    var selectedEl = event.target;
    var selected = selectedEl.textContent;
    var msgEl = document.createElement('h4');   
    
    if (selected === questionBank[questionIndex].answer) {
        results.setAttribute('class', 'right');
        msgEl.innerText = "Right!";
        results.appendChild(msgEl);
        flashTimout = setTimeout(function() {
            hideElement(msgEl);
            clearTimeout(flashTimout);
            
        },800); 
    } else {
        secondsLeft -= 10;
        results.setAttribute('class', 'wrong');
        msgEl.innerText = 'Wrong!';
        results.appendChild(msgEl);
        flashTimout = setTimeout(function() {
            hideElement(msgEl);
            clearTimeout(flashTimout);
        },800);
    }
    
    nextQuestion();
    
}

function nextQuestion() {
    if (questionIndex < questionBank.length) {
        displayQuestion();
    } else {
        setTimeout(function() {
            endQuiz();
        },1000)
    }
}

function endQuiz() {
    clearInterval(timerInterval); 
    startCard.textContent = 0; 
 
    
    if (secondsLeft < 0) {
        secondsLeft = 0;
    }
    
    finalScores.textContent = secondsLeft;
    hideElement(questionContainer);
    showElement(quizEnd);
}

function compareScores(a, b) {
    return b.score - a.score;
}

function renderScores() {
    hideElement(questionContainer);
    hideElement(quizEnd);
    hideElement (introduction);
    scoresList.innerHTML = "";
    scores.sort(compareScores);
    for (let i = 0; i < scores.length; i++) {
        var li = document.createElement('li');
        li.textContent = `${scores[i].initials} - ${scores[i].score}`;
        scoresList.appendChild(li);
    }

    showElement(hallOfFame);
}

function storeScore() {
    localStorage.setItem('scores', JSON.stringify(scores));
}

function loadScores() {
    var storedScores = JSON.parse(localStorage.getItem('scores'));
    if (storedScores) {
        scores = storeScores;
    }
}



backBtn.addEventListener("click", function () {

    clearInterval(timerInterval);

    questionIndex = 0;
    secondsLeft = 60;

    startCard.textContent = secondsLeft;

    resetQuestions();
    hideElement(hallOfFame);
    showElement (introduction);
})

scoreForm.addEventListener('submit', function(event) {
    event.preventDefault();
    var initials = initialsEl.value.trim();
    if (!initials) {
        return;
    }

    var initialsScore = { initials: initials, score: secondsLeft };


    scores.push(initialsScore);

    initialsEl.value = "";


    storeScore();

    renderScores();
})


clearBtn.addEventListener('click', function() {
    localStorage.clear();
    scores = [];
    renderScores();
})

linkHof.addEventListener('click', function() {
    clearInterval(timerInterval);
    renderScores();

})

var questionBank = [
    {
        question: "Commonly used datatypes include:",
        choices: ['1. string', '2. boolean', '3. undefined', '4. all of the above'],
        answer: "4. all of the above"
    },
    {
        question: "Is JavaScript a case sensative language?",
        choices: ['1. Yes', '2. No', '3. dont know', '4. maybe'],
        answer: "1. Yes"
    },
    {
        question: "What is an array in JavaScript",
        choices: ['1. numbers and strings', '2. booleans', '3. other arrays', '4. Used to store multiple values in a single variable'],
        answer: "4. Used to store multiple values in a single variable"
    },
    {
        question: "What is a very useful tool used in debugging to print content to the debugger?",
        choices: ['1. functions', '2. if statement', '3. console.log', '4. for loop'],
        answer: "3. console.log"
    },
    {
        question: "What number does JavaScript array start with?",
        choices: ["1. 1", "2. 2>", "3. 3>", "4. 0>"],
        answer: "4. 0>"
    },
    
];

function showElement(element) {
    element.removeAttribute('class', 'hide');
}

function hideElement(element) {
    element.setAttribute('class', 'hide');
}

function startTimer() {
     timerInterval = setInterval(function() {
        startCard.textContent = secondsLeft;
        secondsLeft--;
        if (secondsLeft === 0) {
            clearInterval(timerInterval);
            endQuiz();
        }
    },1000);
}


button.addEventListener("click", startQuiz);
