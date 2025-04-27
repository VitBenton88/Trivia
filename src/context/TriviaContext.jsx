import { createContext, useReducer, useEffect, useState, useCallback } from 'react';
import { fetchCategoryMax, fetchQuestions, fetchToken, resetToken } from '../api';
import { triviaContextReducer } from '../utils/util';
import { DIFFICULTY_TYPES, RESPONSE_CODES, LIMIT_ERROR_CODES, TOKEN_ERROR_CODES } from '../utils/constants'

// Initial state
const initialState = { questionLimit: 10, maximums: [], category: 'any', difficulty: DIFFICULTY_TYPES.any, type: 'any', token: '', questions: [], };

// Create context
const TriviaContext = createContext();

// Provider component
export const TriviaProvider = ({ children }) => {
  // State
  const [state, dispatch] = useReducer(triviaContextReducer, initialState);
  const [isTokenLoading, setIsTokenLoading] = useState(true);
  const [isCategoryLoading, setIsCategoryLoading] = useState(true);
  const [isQuestionsLoading, setIsQuestionsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Methods
  const clearToken = useCallback(async signal => {
    try {
      setIsTokenLoading(true);
      dispatch({ type: 'SET_TOKEN', payload: '' });

      const token = await resetToken(state.token, { signal });
      dispatch({ type: 'SET_TOKEN', payload: token });
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsTokenLoading(false);
    }
  });

  const generateQuestions = useCallback(async signal => {
    setIsQuestionsLoading(true);

    try {
      const { response_code, results } = await fetchQuestions(state, signal);

      if (LIMIT_ERROR_CODES.includes(response_code)) {
        const error = RESPONSE_CODES[response_code];
        setErrorMessage(error.message);
        dispatch({ type: 'SET_QUESTIONS', payload: [] });
      } else if (TOKEN_ERROR_CODES.includes(response_code)) {
        await clearToken(signal);
        await generateQuestions(signal);
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
    if (isQuestionsLoading && errorMessage) {
      setErrorMessage('');
    }
  }, [isQuestionsLoading]);

  useEffect(() => {
    const controller = new AbortController();
    const getMaximums = async () => {
      try {
        const maximums = await fetchCategoryMax(state.category, controller.signal);
        dispatch({ type: 'SET_MAXIMUMS', payload: maximums });
      } catch (error) {
        console.error(error.message);
      }
    };

    getMaximums();

    return () => controller.abort();
  }, [state.category]);

  useEffect(() => {
    const controller = new AbortController();
    const getToken = async () => {
      try {
        const token = await fetchToken(controller.signal);
        dispatch({ type: 'SET_TOKEN', payload: token });
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsTokenLoading(false);
      }
    };

    getToken();

    return () => controller.abort();
  }, []);

  return (
    <TriviaContext.Provider value={{
      ...state,
      dispatch,
      errorMessage,
      generateQuestions,
      isCategoryLoading,
      isQuestionsLoading,
      isTokenLoading,
      setIsCategoryLoading,
      setIsQuestionsLoading,
    }}>
      {children}
    </TriviaContext.Provider>
  );
};

export default TriviaContext;