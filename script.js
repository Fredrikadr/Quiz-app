let url = "https://opentdb.com/api.php?";
let categoriesURL = "https://opentdb.com/api_category.php";

const numQuestionsNode = document.querySelector("#numQuestions");
const questionNode = document.querySelector("#question");
const buttonContainerNode = document.querySelector("#button-container");
const settingsNode = document.querySelector("#settings");
const startButtonNode = document.querySelector("#startQuiz");
let currentQIndex = 0;
let savedAnswers = [];
let questions = undefined;

async function getCategories(url) {
  let categories = await fetch(url);
  let categoriesJSON = await categories.json();
  return categoriesJSON;
}

//Starts quiz with current settings
startButtonNode.addEventListener("click", startQuiz);


async function quizSettings(url) {
  let categories = await getCategories(url);  //Fetches categories from API
  let categoryNode = document.querySelector("#category-select");

  //Puts each category as an option in dropdown menu
  categories.trivia_categories.forEach(category => {
    categoryNode.innerHTML += `
    <option value=${category.id}>${category.name}</option>
    `;
  })

}

async function startQuiz() {

  let queryString = url;
  let settingsNodeList = document.querySelectorAll("#settings")[0];
  let numQuestions = settingsNodeList[0].value;
  let category = settingsNodeList[1].value;
  let difficulty = settingsNodeList[2].value
  let questionType = settingsNodeList[3].value
  let messageNode = document.querySelector("#message")

  if (numQuestions == "" || numQuestions == 0 || numQuestions > 50) {
    messageNode.innerHTML = "Number of questions must be between 1 and 50."
    return;
  }

  if (numQuestions != "") {
    queryString += `amount=${settingsNodeList[0].value}`;
  } else return;

  if (category != "") {
    queryString += `&category=${category}`;
  }
  if (difficulty != "") {
    queryString += `&difficulty=${difficulty}`;
  }
  if (questionType != "") {
    queryString += `&type=${questionType}`
  }
  startButtonNode.removeEventListener("click", startQuiz);

  questions = await getQuestions(queryString);

  settingsNode.innerHTML = "";

  renderQuestion();

}

function multipleChoiceHandler() {
  let alternatives = [];
  // Creates a random index for inserting correct answer
  let randomIndex = Math.floor(Math.random() * questions[currentQIndex].incorrect_answers.length + 1);
  // Pushes incorrect answers to alternatives array
  questions[currentQIndex].incorrect_answers
    .forEach(alternative => alternatives
      .push(alternative))

  // Places the correct answer at a random index in alternatives array
  alternatives
    .splice(randomIndex, 0, questions[currentQIndex].correct_answer)


  alternatives.forEach(alternative => {

    if (alternative == savedAnswers[currentQIndex]) {
      questionNode.innerHTML += `
    
  <input checked class="radio-btn" type=radio id="${alternative}" name="alternative" value="${alternative}">
  <label for="${alternative}">${alternative}</label> <br>
  
  `;
    } else {
      questionNode.innerHTML += `
      
    <input class="radio-btn" type=radio id="${alternative}" name="alternative" value="${alternative}">
    <label for="${alternative}">${alternative}</label> <br>
    
    `;

    }
  })
}

function trueFalseHandler() {
  let alternatives = [questions[currentQIndex].incorrect_answers, questions[currentQIndex].correct_answer]
    .sort()
    .reverse();

  alternatives.forEach(alternative => {
    if (alternative == savedAnswers[currentQIndex]) {
      questionNode.innerHTML += `
      <input checked class="radio-btn" type=radio id="${alternative}" name="alternative" value="${alternative}"}">
      <label for="${alternative}">${alternative}</label> <br>
      `;
    } else {
      questionNode.innerHTML += `
      <input class="radio-btn" type=radio id="${alternative}" name="alternative" value="${alternative}"}">
      <label for="${alternative}">${alternative}</label> <br>
      `;
    }
  })
}

function checkAnswers(savedAnswers, questions) {
  let score = 0;
  questionNode.innerHTML = "";
  for (let i = 0; i < questions.length; i++) {
    if (savedAnswers[i] == questions[i].correct_answer) {
      questionNode.innerHTML += `
      <h4>${i + 1}. ${questions[i].question}</h4>
      <p style="color: green ">${savedAnswers[i]} 👍</p>
      `
      score++;
    } else if (!savedAnswers[i]) {
      questionNode.innerHTML += `
      <h4>${i + 1}. ${questions[i].question}</h4>
      <p style="color: red ">You didn't answer. 😐</p>
      `
    } else {
      questionNode.innerHTML += `
      <h4>${i + 1}. ${questions[i].question}</h4>
      <p style="color: red ">${savedAnswers[i]} 😞</p>
      `
    }
  }
  questionNode.innerHTML += `<h3>Total score: ${score}/${questions.length}</h3>`
}


function retryQuiz() {
  currentQIndex = 0;
  savedAnswers = [];
  questionNode.innerHTML = "";
  renderQuestion();
}

async function getQuestions(url) {
  const response = await fetch(url);
  const JSON = await response.json();
  return JSON.results;
}

async function renderQuestion() {
  buttonContainerNode.innerHTML = "";
  questionNode.innerHTML += `<h3>${currentQIndex + 1}/${questions.length}. ${questions[currentQIndex].question}</h3>`; // Writes the question to the page

  if (questions[currentQIndex].type == "multiple") { // If question is multiple choice
    multipleChoiceHandler();
  }

  else if (questions[currentQIndex].type = "boolean") { // If answer is true or false
    trueFalseHandler();
  }
  //Saves answer to current question in array
  questionNode.addEventListener("click", (event) => {
    if (event.target === event.currentTarget) {
      return;
    } else if (!event.target.value) {
      return;
    } else {
      savedAnswers[currentQIndex] = event.target.value;
    }
  });


  //Buttons
  if (currentQIndex + 1 == questions.length) {
    buttonContainerNode.innerHTML = `
    <button id="back-btn">Back</button>
    <button id="next-btn">Submit</button>`;

  } else {
    buttonContainerNode.innerHTML += `
    <button id="back-btn">Back</button>
    <button id="next-btn">Next</button>
    `;
  }

  let backButtonNode = document.querySelector("#back-btn");
  let nextButtonNode = document.querySelector("#next-btn");


  backButtonNode.addEventListener("click", () => {
    if (currentQIndex <= 0) {
      return;
    } else {
      currentQIndex--;
      questionNode.innerHTML = "";
      renderQuestion();
    }
  })

  nextButtonNode.addEventListener("click", () => {
    if ((currentQIndex + 1) < questions.length) {
      currentQIndex++;
      questionNode.innerHTML = "";
      renderQuestion();
    } else {
      checkAnswers(savedAnswers, questions);
      buttonContainerNode.innerHTML = "";
      let retryButton = document.createElement("button");

      retryButton.innerText = "Try again";
      retryButton.addEventListener("click", retryQuiz);
      buttonContainerNode.appendChild(retryButton);

      let newQuizButton = document.createElement("button");
      newQuizButton.innerHTML = "New Quiz";
      newQuizButton.addEventListener("click", () => {
        location.reload();
      })
      buttonContainerNode.appendChild(newQuizButton)
    }
  })

}

quizSettings(categoriesURL);