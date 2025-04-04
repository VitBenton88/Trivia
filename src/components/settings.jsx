
import { useContext, useState, useEffect, useMemo, useCallback } from 'react';
import Loader from './loader'
import CategorySelect from './categorySelect'
import DifficultySelect from './difficultySelect'
import LengthSelect from './lengthSelect'
import TypeSelect from './typeSelect'
import TriviaContext from '../context/TriviaContext';

const Settings = () => {
  // Context
  const {
    isTokenLoading, isCategoryLoading, setIsCategoryLoading, category, generateQuestions,
  } = useContext(TriviaContext);

  // Computed Values
  const categoryIsAny = useMemo(() => category === 'any', [category]);

  // State
  const [categories, setCategories] = useState([]);

  // Methods
  const handleClick = useCallback(() => generateQuestions());

  // Effects Hooks
  useEffect(() => {
    const fetchCategories = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      try {
        const response = await fetch('https://opentdb.com/api_category.php');
        const data = await response.json();
        setCategories([...categories, ...data.trivia_categories]);
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsCategoryLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isTokenLoading || isCategoryLoading) return <Loader />;

  return (
    <fieldset>
      <legend>Settings</legend>
      <CategorySelect categories={categories} />
      {!categoryIsAny &&
        <>
          <br />
          <br />
          <DifficultySelect />
        </>
      }
      <br />
      <br />
      <LengthSelect />
      <br />
      <br />
      <TypeSelect />
      <br />
      <br />
      <button type="button" onClick={handleClick}>Generate Questions</button>
    </fieldset>
  );
};

export default Settings;