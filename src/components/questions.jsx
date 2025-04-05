import { useContext, useCallback, useState } from 'react';
import { decodeHtml } from '../utils/util'
import Loader from './loader'
import TriviaContext from '../context/TriviaContext';

const Questions = () => {
  // Context
  const { questions, isQuestionsLoading } = useContext(TriviaContext);

  // State
  const [successfulAnswers, setSuccessfulAnswers] = useState([]);
  const [questionsAnswered, setQuestionsAnswered] = useState([]);

  // Methods
  const getClassName = useCallback((correct_answer, question) => {
    if (!questionsAnswered.includes(question)) return '';

    return successfulAnswers.includes(correct_answer) ? 'correct' : 'incorrect';
  });

  const handleSelect = useCallback((answer, correct_answer, question) => {
    setQuestionsAnswered(prevValues => [...prevValues, question])

    if (answer === correct_answer) {
      setSuccessfulAnswers(prevValues => [...prevValues, correct_answer])
    } else {
      setSuccessfulAnswers(prevValues => prevValues.filter(answer => answer !== correct_answer))
    }
  });

  if (isQuestionsLoading) return <Loader />;
  if (!questions?.length) return;

  return (
    <>
      <h2>Questions</h2>
      <h3>{`Correctly answered: ${successfulAnswers.length} out of ${questions.length}`}</h3>
      <ul id="questions-list">
        {questions.map(({ correct_answer, incorrect_answers, question }) => (
          <li key={question} className={getClassName(correct_answer, question)}>
            <h4>{decodeHtml(question)}</h4>

            <fieldset>
              <legend>Possible Answers:</legend>

              <div key={correct_answer}>
                <input
                  type="radio"
                  id={correct_answer}
                  name={`${question}-answer`}
                  value={correct_answer}
                  onChange={event => handleSelect(event.target.value, correct_answer, question)}
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
                    onChange={event => handleSelect(event.target.value, correct_answer, question)}
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