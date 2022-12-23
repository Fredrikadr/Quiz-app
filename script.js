
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

async function startQuiz(questions) {
  let currentQIndex = 0;
  let quizArray = await questions;
  let alternatives = [];
  let savedAnswers = [];
  let randomIndex = Math.floor(Math.random() * quizArray[currentQIndex].incorrect_answers.length + 1); // Creates a random index for inserting correct answer
  
  
  questionNode.innerHTML += `<p>${quizArray[currentQIndex].question}</p>`; // Writes the question to the page


  if (quizArray[currentQIndex].type == "multiple") { // If question is multiple choice

    quizArray[currentQIndex].incorrect_answers // Pushes incorrect answers to alternatives array
      .forEach(alternative => alternatives
        .push(alternative))
        
    
    alternatives
      .splice(randomIndex, 0, quizArray[currentQIndex].correct_answer) // Places the correct answer at a random index in alternatives array
    
    
    alternatives.forEach(alternative =>
      questionNode.innerHTML +=`
        
        <label for="${alternative}">${alternative}</label>
        <input type=radio id="${alternative}" name="alternative" value="${alternative}">`)
      
    
    console.log(alternatives)


  
  }
  
  else if (quizArray.type = "boolean") { // If question is true or false
    quizArray[currentQIndex].incorrect_answers
  }

}




function printBooleanAlternatives(question) {

}


startQuiz(getQuestions(url))