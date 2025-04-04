import { useContext, useMemo, useCallback } from 'react';
import TriviaContext from '../context/TriviaContext';

const LengthSelect = () => {
  // Context
  const { dispatch, difficulty, maximums, questionLimit } = useContext(TriviaContext);

  // Computed Values
  const maximum = useMemo(() => maximums.find(maximum => maximum.difficulty === difficulty)?.max, [difficulty, maximums]);

  // Methods
  const handleChange = useCallback(event => dispatch({ type: 'SET_LIMIT', payload: parseInt(event.target.value) }));

  return (
    <>
      <label htmlFor="limit">Question limit (between 1 and {maximum}):</label>
      <br />
      <input type="number" name="limit" min="1" max={maximum} value={questionLimit} onChange={handleChange}></input>
    </>

  );
};

export default LengthSelect;