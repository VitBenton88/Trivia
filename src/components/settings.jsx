
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
    isTokenLoading, isCategoryLoading, setIsCategoryLoading, setIsQuestionsLoading, category, generateQuestions, isQuestionsLoading,
  } = useContext(TriviaContext);

  // Computed Values
  const categoryIsAny = useMemo(() => category === 'any', [category]);

  // State
  const [categories, setCategories] = useState([]);

  // Methods
  const handleClick = useCallback(() => setIsQuestionsLoading(true));

  // Effects Hooks
  useEffect(() => {
    let timeoutId = undefined;
    const controller = new AbortController();

    const getCategories = async () => {
      await new Promise(resolve => {
        timeoutId = setTimeout(resolve, 1000);
      });
      try {
        const { trivia_categories } = await fetchCategories(controller.signal);
        setCategories(trivia_categories);
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsCategoryLoading(false);
      }
    };

    getCategories();

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!isQuestionsLoading) return;

    const controller = new AbortController();
    generateQuestions(controller.signal)

    return () => controller.abort();
  }, [isQuestionsLoading]);

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