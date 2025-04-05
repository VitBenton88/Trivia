import { useContext, useCallback, useState, useMemo, useEffect } from 'react';
import { combineAndShuffle, decodeHtml } from '../utils/util'
import Loader from './loader'
import TriviaContext from '../context/TriviaContext';

const Questions = () => {
  // Context
  const { questions, isQuestionsLoading } = useContext(TriviaContext);

  // State
  const [successfulAnswers, setSuccessfulAnswers] = useState([]);
  const [questionsAnswered, setQuestionsAnswered] = useState([]);

  // Computed Values
  const questionsToRender = useMemo(() => {
    const questionsCollection = [];

    questions.forEach(question => {
      const { correct_answer, incorrect_answers, type } = question;
      const answers_to_list = type === 'multiple'
        ? combineAndShuffle(correct_answer, incorrect_answers).sort()
        : [correct_answer, incorrect_answers].sort().reverse(); // bool type should list in 'true, false' order

      questionsCollection.push({
        ...question,
        answers_to_list,
      })
    });

    return questionsCollection;
  }, [questions]);

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

  const resetProgress = useCallback(() => {
    setSuccessfulAnswers([]);
    setQuestionsAnswered([]);
  });

  // Effects Hooks
  useEffect(resetProgress, [questions]);

  if (isQuestionsLoading) return <Loader />;
  if (!questions?.length) return;

  return (
    <>
      <h2>Questions</h2>
      <h3>{`Correctly answered: ${successfulAnswers.length} out of ${questions.length}`}</h3>
      <ul id="questions-list">
        {questionsToRender.map(({ answers_to_list, correct_answer, question }) => (
          <li key={question} className={getClassName(correct_answer, question)}>
            <h4>{decodeHtml(question)}</h4>

            <fieldset>
              <legend>Possible Answers:</legend>

              {answers_to_list.map(answer => (
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