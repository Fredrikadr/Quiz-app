
let url = "https://opentdb.com/api.php?";

let numQuestionsNode = document.querySelector("#numQuestions");
let questionNode = document.querySelector("#question")



async function getQuestions(url) {
  const response = await fetch(
    `${url}amount=${numQuestionsNode.value}`
  );
  const JSON = await response.json();
  console.log(JSON.results)
  return JSON.results;
}

async function startQuiz(questions, questionIndex, answers) {
  let currentQIndex = questionIndex
  let quizArray = await questions;
  let alternatives = [];
  let savedAnswers = answers;
  let randomIndex = Math.floor(Math.random() * quizArray[currentQIndex].incorrect_answers.length + 1); // Creates a random index for inserting correct answer


  questionNode.innerHTML += `<p>${quizArray[currentQIndex].question}</p>`; // Writes the question to the page


  if (quizArray[currentQIndex].type == "multiple") { // If question is multiple choice

    quizArray[currentQIndex].incorrect_answers // Pushes incorrect answers to alternatives array
      .forEach(alternative => alternatives
        .push(alternative))


    alternatives
      .splice(randomIndex, 0, quizArray[currentQIndex].correct_answer) // Places the correct answer at a random index in alternatives array


    alternatives.forEach(alternative =>
      questionNode.innerHTML += `
        
      <input class="radio-btn" type=radio id="${alternative}" name="alternative" value="${alternative}">
      <label for="${alternative}">${alternative}</label> <br>
      `);

      
    console.log(alternatives)
    
  }

  else if (quizArray.type = "boolean") { // If answer is true or false
    questionNode.innerHTML += `
    <input class="radio-btn" type=radio id="true" name="alternative" value="false"}">
      <label for="true">True</label> <br>
      <input class="radio-btn" type=radio id="false" name="alternative" value="false"}">
      <label for="false">False</label> <br>
    `;
  }


  //Buttons
  questionNode.innerHTML += `
  <button id="back-btn">Back</button>
  <button id="next-btn">Next</button>
  `;
  let backButtonNode = document.querySelector("#back-btn");
  let nextButtonNode = document.querySelector("#next-btn");

  backButtonNode.addEventListener("click", () => {
    if (currentQIndex == 0) {
      return;
    } else {
      currentQIndex--;
      questionNode.innerHTML = "";
      startQuiz(quizArray, currentQIndex);
    }
  })

  nextButtonNode.addEventListener("click", () => {
    currentQIndex++;
    questionNode.innerHTML = "";
    startQuiz(quizArray, currentQIndex);
  })

}




function printBooleanAlternatives(question) {

}


startQuiz(getQuestions(url), 0, [])