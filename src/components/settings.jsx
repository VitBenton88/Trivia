
import { useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { fetchCategories } from '../api';
import Loader from './loader'
import CategorySelect from './categorySelect'
import DifficultySelect from './difficultySelect'
import LengthSelect from './lengthSelect'
import TypeSelect from './typeSelect'
import TriviaContext from '../context/TriviaContext';

const Settings = () => {
  // Context
  const {
    isTokenLoading, isCategoryLoading, setIsCategoryLoading, category, generateQuestions, isQuestionsLoading,
  } = useContext(TriviaContext);

  // Computed Values
  const categoryIsAny = useMemo(() => category === 'any', [category]);

  // State
  const [categories, setCategories] = useState([]);

  // Methods
  const handleClick = useCallback(() => generateQuestions());

  // Effects Hooks
  useEffect(() => {
    const getCategories = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      try {
        const { trivia_categories } = await fetchCategories();
        setCategories([...categories, ...trivia_categories]);
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsCategoryLoading(false);
      }
    };

    getCategories();
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
      <button type="button" onClick={handleClick} disabled={isQuestionsLoading}>Generate Questions</button>
    </fieldset>
  );
};

export default Settings;