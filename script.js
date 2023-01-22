
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
  let categories = await fetch(url)
  let categoriesJSON = await categories.json();
  return categoriesJSON;
}

//Starts quiz with current settings
startButtonNode.addEventListener("click", getQuizSettings)

quizSettings(categoriesURL)

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

async function getQuizSettings() {
  let queryString = url;
  let settingsNodeList = document.querySelectorAll("#settings")[0];
  let numQuestions = settingsNodeList[0].value;
  let category = settingsNodeList[1].value;
  let difficulty = settingsNodeList[2].value
  let questionType = settingsNodeList[3].value

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
  console.log(queryString)
  questions = await getQuestions(queryString);
  startQuiz();




}

function getRandomIndex(arrLength) {
  //TODO
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
  console.log(alternatives)
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
/*   questionNode.innerHTML += `
      <input class="radio-btn" type=radio id="true" name="alternative" value="True"}">
      <label for="true">True</label> <br>
      <input class="radio-btn" type=radio id="false" name="alternative" value="False"}">
      <label for="false">False</label> <br>
    `; */
}

function checkAnswers(savedAnswers, questions) {
  let score = 0;
  for (let i = 0; i < questions.length; i++) {
    if (savedAnswers[i] == questions[i].correct_answer) {
      score++;
    }
  }
  questionNode.innerHTML = `Total score: ${score}`
}


async function getQuestions(url) {
  const response = await fetch(url);
  const JSON = await response.json();
  console.log(JSON.results)
  return JSON.results;
}

async function startQuiz() {
  settingsNode.innerHTML = "";

  questionNode.innerHTML += `<p>${questions[currentQIndex].question}</p>`; // Writes the question to the page


  if (questions[currentQIndex].type == "multiple") { // If question is multiple choice
    multipleChoiceHandler()
  }

  else if (questions[currentQIndex].type = "boolean") { // If answer is true or false
    trueFalseHandler()
  }
  //Saves answer to current question in array
  questionNode.addEventListener("click", (event) => {
    if (event.target === event.currentTarget) {
      return;
    } else if (!event.target.value) {
      return;
    } else {
      savedAnswers[currentQIndex] = event.target.value;
      console.log(savedAnswers)
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
      buttonContainerNode.innerHTML = "";
      startQuiz(questions, currentQIndex, savedAnswers);
    }
  })

  nextButtonNode.addEventListener("click", () => {
    if ((currentQIndex + 1) < questions.length) {
      currentQIndex++;
      questionNode.innerHTML = "";
      buttonContainerNode.innerHTML = "";
      startQuiz(questions, currentQIndex, savedAnswers);
    } else {
      checkAnswers(savedAnswers, questions)
    }
  })

}


/* startQuiz(getQuestions(url)) */