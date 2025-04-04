import { useCallback, useContext } from 'react';
import TriviaContext from '../context/TriviaContext';

const TypeSelect = () => {
  // Context
  const { dispatch, type } = useContext(TriviaContext);

  // Methods
  const handleChange = useCallback(event => dispatch({ type: 'SET_TYPE', payload: event.target.value }));

  return (
    <>
      <label htmlFor="type">Type</label>
      <br />
      <select name="type" value={type} onChange={handleChange}>
        <option value="any">Any Type</option>
        <option value="multiple">Multiple Choice</option>
        <option value="boolean">True / False</option>
      </select>
    </>
  );
};

export default TypeSelect;