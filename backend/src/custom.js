/*
 For a given data structure of a question, produce another
 object that doesn't contain any important meta data (e.g. the answer)
 to return to a "player"
*/
export const quizQuestionPublicReturn = question => {
  console.log('See question: ', question);
  return question;
};

/*
 For a given data structure of a question, get the IDs of
 the correct answers (minimum 1).
*/
export const quizQuestionGetCorrectAnswers = question => {
  const correctIds = [];
  question.correctAnswers.forEach((answer) => {
    const id = question.answers.indexOf(answer);
    if (id !== -1){
      correctIds.push(id);
    }
  })
  console.log('See answer: ', correctIds);
  return correctIds;
};

/*
 For a given data structure of a question, get the IDs of
 all of the answers, correct or incorrect.
*/
export const quizQuestionGetAnswers = question => {
  const ids = [];
  for (id in question.answers) {
    ids.push(id);
  }
  return ids;
};

/*
 For a given data structure of a question, get the duration
 of the question once it starts. (Seconds)
*/
export const quizQuestionGetDuration = question => {
  return question.timer;
};
