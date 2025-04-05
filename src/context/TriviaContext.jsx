import { createContext, useReducer, useEffect, useState, useCallback } from 'react';
import { fetchCategoryMax, fetchQuestions, fetchToken, resetToken } from '../api';
import { triviaContextReducer } from '../util';

// Initial state
const initialState = { questionLimit: 10, maximums: [], category: 'any', difficulty: 'any', type: 'any', token: '', questions: [], };

// Create context
const TriviaContext = createContext();

// Provider component
export const TriviaProvider = ({ children }) => {
  // State
  const [state, dispatch] = useReducer(triviaContextReducer, initialState);
  const [isTokenLoading, setIsTokenLoading] = useState(true);
  const [isCategoryLoading, setIsCategoryLoading] = useState(true);
  const [isQuestionsLoading, setIsQuestionsLoading] = useState(false);

  // Methods
  const clearToken = useCallback(async () => {
    try {
      setIsTokenLoading(true);
      const token = await resetToken(state.token);
      dispatch({ type: 'SET_TOKEN', payload: token });
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsTokenLoading(false);
    }
  });

  const generateQuestions = useCallback(async () => {
    setIsQuestionsLoading(true);

    try {
      const { response_code, results } = await fetchQuestions(state);
      const tokenErrorCodes = [3, 4];

      if (tokenErrorCodes.includes(response_code)) {
        clearToken();
        generateQuestions();
      } else {
        dispatch({ type: 'SET_QUESTIONS', payload: results });
      }

    } catch (error) {
      console.error(error.message);
    } finally {
      setIsQuestionsLoading(false);
    }
  });

  // Effects Hooks
  useEffect(() => {
    const getMaximums = async () => {
      try {
        const maximums = await fetchCategoryMax(state.category);
        dispatch({ type: 'SET_MAXIMUMS', payload: maximums });
      } catch (error) {
        console.error(error.message);
      }
    };

    getMaximums();
  }, [state.category]);

  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await fetchToken();
        dispatch({ type: 'SET_TOKEN', payload: token });
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsTokenLoading(false);
      }
    };

    getToken();
  }, []);

  return (
    <TriviaContext.Provider value={{ ...state, isTokenLoading, isCategoryLoading, dispatch, setIsCategoryLoading, generateQuestions, isQuestionsLoading, }}>
      {children}
    </TriviaContext.Provider>
  );
};

export default TriviaContext;