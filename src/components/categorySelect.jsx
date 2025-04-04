import React, { useCallback, useContext, useMemo } from 'react';
import TriviaContext from '../context/TriviaContext';

const CategorySelect = ({ categories = [] }) => {
  // Context
  const { dispatch, category } = useContext(TriviaContext);

  // Computed Values
  const categoriesExist = useMemo(() => !!categories.length, [categories]);
  const sortedCategories = useMemo(() => categories.sort((a, b) => a.name.localeCompare(b.name)), [categories]);

  // Methods
  const handleChange = useCallback(event => dispatch({ type: 'SET_CATEGORY', payload: event.target.value }));

  return (
    <>
      {categoriesExist ? (
        <>
          <label htmlFor="category">Category</label>
          <br />
          <select name="category" value={category} onChange={handleChange}>
            <option value="any">Any Category</option>
            {
              sortedCategories.map(({ id, name }) => (
                <option key={id} value={id}>{name}</option>
              ))
            }
          </select>
        </>
      ) : (
        <p>An error occurred while fetching categories.</p>
      )}
    </>
  );
};

export default CategorySelect;