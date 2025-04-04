import { useContext, useCallback } from 'react';
import TriviaContext from '../context/TriviaContext';

const DifficultySelect = () => {
  // Context
  const { dispatch, difficulty } = useContext(TriviaContext);

  // Methods
  const handleChange = useCallback(event => dispatch({ type: 'SET_DIFFICULTY', payload: event.target.value }));

  return (
    <>
      <label htmlFor="difficulty">Difficulty</label>
      <br />
      <select name="difficulty" value={difficulty} onChange={handleChange}>
        <option value="any">Any Difficulty</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
    </>
  );
};

export default DifficultySelect;