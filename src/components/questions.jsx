import { useContext } from 'react';
import { decodeHtml } from '../util'
import Loader from './loader'
import TriviaContext from '../context/TriviaContext';

const Questions = () => {
  // Context
  const { questions, isQuestionsLoading } = useContext(TriviaContext);

  if (isQuestionsLoading) return <Loader />;
  if (!questions.length) return;

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
                <input type="radio" id={correct_answer} name={`${question}-answer`} value={decodeHtml(correct_answer)} />
                <label htmlFor={correct_answer}>{decodeHtml(correct_answer)}</label>
              </div>

              {incorrect_answers.map((answer) => (
                <div key={answer}>
                  <input type="radio" id={answer} name={`${question}-answer`} value={decodeHtml(answer)} />
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