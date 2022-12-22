
let url = "https://opentdb.com/api.php?";

let numQuestionsNode = document.querySelector("#numQuestions")


async function getQuestions(url) {
  const response = await fetch(
    `${url}amount=${numQuestionsNode.value}`
  );
  const JSON = await response.json();
  return JSON;
}

