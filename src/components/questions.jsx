import { useContext, useCallback, useState, useMemo, useEffect } from 'react';
import { combineAndShuffle, decodeHtml, patchObjectInArray } from '../utils/util'
import Loader from './loader'
import TriviaContext from '../context/TriviaContext';

const Questions = () => {
  // Context
  const { questions, isQuestionsLoading } = useContext(TriviaContext);

  // State
  const [questionsAnswered, setQuestionsAnswered] = useState([]);

  // Computed Values
  const successfulAnswers = useMemo(
    () => questionsAnswered.filter(question => !!question.correctlyAnswered),
    [questionsAnswered]
  );

  const summaryText = useMemo(
    () => `Correctly answered: ${successfulAnswers.length} out of ${questions.length}`,
    [questions, successfulAnswers]
  );

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
  const getClassName = useCallback((question) => {
    const questionAnswered = questionsAnswered.find(({ question: questionText }) => question === questionText);

    if (!questionAnswered) return '';

    return questionAnswered.correctlyAnswered ? 'correct' : 'incorrect';
  }, [questionsAnswered, successfulAnswers]);

  const handleSelect = useCallback((answer, correct_answer, question) => {
    const correctlyAnswered = answer === correct_answer;

    setQuestionsAnswered((prevItems) => {
      // Check if the object already exists based on the `id` property
      const existingIndex = prevItems.findIndex(({ question: questionText }) => question === questionText);
      if (existingIndex !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          correctlyAnswered,
        };
        return updatedItems;
      }

      return [...prevItems, { question, correctlyAnswered }];
    });
  });

  const resetProgress = useCallback(() => {
    setQuestionsAnswered([]);
  });

  // Effects Hooks
  useEffect(resetProgress, [questions]);

  if (isQuestionsLoading) return <Loader />;
  if (!questions?.length) return;

  return (
    <>
      <h2>Questions</h2>
      <h3>{summaryText}</h3>
      <ul id="questions-list">
        {questionsToRender.map(({ answers_to_list, correct_answer, question }) => (
          <li key={question} className={getClassName(question)}>
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