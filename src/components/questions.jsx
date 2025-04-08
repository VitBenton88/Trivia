import { useContext, useCallback, useState, useMemo, useEffect } from 'react';
import { capitalize, combineAndShuffle, decodeHtml } from '../utils/util'
import Loader from './loader'
import TriviaContext from '../context/TriviaContext';

const Questions = () => {
  // Context
  const { questions, isQuestionsLoading } = useContext(TriviaContext);

  // State
  const [questionsAnswered, setQuestionsAnswered] = useState([]);

  // Computed Values
  const successfulAnswers = useMemo(
    () => questionsAnswered.filter(question => !!question.correctly_answered),
    [questionsAnswered]
  );

  const summaryText = useMemo(
    () => `Correctly answered: ${successfulAnswers.length} out of ${questions.length}`, [questions, successfulAnswers]
  );

  const questionsToRender = useMemo(() => {
    const questionsCollection = [];

    questions.forEach(question => {
      const { correct_answer, incorrect_answers, type } = question;
      const answers_to_list = type === 'multiple'
        ? combineAndShuffle(correct_answer, incorrect_answers).sort()
        : [correct_answer, ...incorrect_answers].sort().reverse(); // bool type should list in 'true, false' order

      questionsCollection.push({
        ...question,
        answers_to_list,
      })
    });

    return questionsCollection;
  }, [questions]);

  // Methods
  const getQuestionClassName = useCallback((question) => {
    const questionAnswered = questionsAnswered.find(({ question: questionText }) => question === questionText);

    if (!questionAnswered) return '';

    return questionAnswered.correctly_answered ? 'correct' : 'incorrect';
  }, [questionsAnswered]);

  const handleSelect = useCallback((answer, correct_answer, question) => {
    const correctly_answered = answer === correct_answer;

    setQuestionsAnswered((prevItems) => [...prevItems, { question, correctly_answered, selected: answer }]);
  });

  const resetProgress = useCallback(() => {
    setQuestionsAnswered([]);
  });

  const isAnswered = useCallback(question =>
    questionsAnswered.some(item => item.question === question),
    [questionsAnswered]
  );

  const getAnswerClassName = useCallback((question, answer) => {
    if (isAnswered(question)) {
      const { correctly_answered, selected } = questionsAnswered.find(item => item.question === question);
      const { correct_answer } = questions.find(item => item.question === question);

      const isCorrectAnswerClass = answer === correct_answer ? 'correct-answer' : 'incorrect-answer';
      const isAnsweredIncorrectlyClass = correctly_answered ? '' : 'incorrectly-answered';
      const isSelectedAnswerClass = selected === answer ? 'selected' : '';

      return [
        'answered',
        isSelectedAnswerClass,
        isCorrectAnswerClass,
        isAnsweredIncorrectlyClass
      ].join(' ');
    }

    return ''
  },
    [questionsAnswered, questions, isAnswered]
  );

  // Effects Hooks
  useEffect(resetProgress, [questions]);

  if (isQuestionsLoading) return <Loader />;
  if (!questions?.length) return;

  return (
    <>
      <h2>Questions</h2>
      <h3>{summaryText}</h3>
      <ol id="questions-list">
        {questionsToRender.map(({ answers_to_list, correct_answer, question, category, difficulty }, index) => (
          <li key={question} className={getQuestionClassName(question)}>
            <hr />
            <h4>{decodeHtml(question)}</h4>

            <fieldset>
              <legend>Possible Answers:</legend>

              {answers_to_list.map(answer => (
                <div key={answer} className={`answer-input ${getAnswerClassName(question, answer)}`}>
                  <input
                    type="radio"
                    id={answer}
                    name={`${question}-answer`}
                    disabled={isAnswered(question)}
                    value={answer}
                    onChange={event => handleSelect(event.target.value, correct_answer, question)}
                  />
                  <label htmlFor={answer}>{decodeHtml(answer)}</label>
                </div>
              ))}

              <ul className="tags">
                <li className='tag category'>{decodeHtml(category)}</li>
                <li className={`tag difficulty ${difficulty}`}>
                  {capitalize(difficulty)}
                </li>
              </ul>
            </fieldset>
          </li>
        ))}
      </ol>
    </>
  );
};

export default Questions;