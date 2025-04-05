import { useContext, useCallback } from 'react';
import { decodeHtml } from '../utils/util'
import Loader from './loader'
import TriviaContext from '../context/TriviaContext';

const Questions = () => {
  // Context
  const { questions, isQuestionsLoading } = useContext(TriviaContext);

  // Methods
  const handleSelect = useCallback((answer, correct_answer) => {
    if (answer === correct_answer) {
      console.log('CORRECT!');
    }
  });

  if (isQuestionsLoading) return <Loader />;
  if (!questions?.length) return;

  return (
    <>
      <h2>Questions</h2>
      <ul id="questions-list">
        {questions.map(({ correct_answer, incorrect_answers, question }) => (
          <li key={question}>
            <h3>{decodeHtml(question)}</h3>

            <fieldset>
              <legend>Possible Answers:</legend>

              <div key={correct_answer}>
                <input
                  type="radio"
                  id={correct_answer}
                  name={`${question}-answer`}
                  value={correct_answer}
                  onChange={event => handleSelect(event.target.value, correct_answer)}
                />
                <label htmlFor={correct_answer}>{decodeHtml(correct_answer)}</label>
              </div>

              {incorrect_answers.map((answer) => (
                <div key={answer}>
                  <input
                    type="radio"
                    id={answer}
                    name={`${question}-answer`}
                    value={answer}
                    onChange={event => handleSelect(event.target.value, correct_answer)}
                  />
                  <label htmlFor={answer}>{decodeHtml(answer)}</label>
                </div>
              ))}
            </fieldset>

          </li>
        ))}
      </ul>
    </>
  );
};

export default Questions;