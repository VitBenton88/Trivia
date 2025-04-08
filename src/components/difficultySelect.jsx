import { useContext, useCallback } from 'react';
import { DIFFICULTY_TYPES } from '../utils/constants';
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
        <option value={DIFFICULTY_TYPES.any}>Any Difficulty</option>
        <option value={DIFFICULTY_TYPES.easy}>Easy</option>
        <option value={DIFFICULTY_TYPES.medium}>Medium</option>
        <option value={DIFFICULTY_TYPES.hard}>Hard</option>
      </select>
    </>
  );
};

export default DifficultySelect;