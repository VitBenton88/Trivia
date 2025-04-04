import { createContext, useReducer, useEffect, useState, useCallback } from 'react';

// Initial state
const initialState = { questionLimit: 10, maximums: [], category: 'any', difficulty: 'any', type: 'any', token: '', questions: [], };

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_DIFFICULTY':
      return { ...state, difficulty: action.payload };
    case 'SET_MAXIMUMS':
      return { ...state, maximums: action.payload };
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'SET_CATEGORY':
      return { ...state, category: action.payload };
    case 'SET_LIMIT':
      return { ...state, questionLimit: action.payload };
    case 'SET_TYPE':
      return { ...state, type: action.payload };
    case 'SET_QUESTIONS':
      return { ...state, questions: action.payload };
    default:
      return state;
  }
};

// Create context
const TriviaContext = createContext();

// Provider component
export const TriviaProvider = ({ children }) => {
  // State
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isTokenLoading, setIsTokenLoading] = useState(true);
  const [isCategoryLoading, setIsCategoryLoading] = useState(true);

  // Methods
  const resetToken = useCallback(async () => {
    setIsTokenLoading(true);

    try {
      const { token } = state;
      const fetchEndpoint = `https://opentdb.com/api_token.php?command=reset&token=${token}`;
      const response = await fetch(fetchEndpoint);
      const data = await response.json();

      if (data.response_code === 0) {
        sessionStorage.setItem('triviaToken', data.token);
        dispatch({ type: 'SET_TOKEN', payload: data.token });
      } else {
        console.error('Failed to reset session token.');
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsTokenLoading(false);
    }
  });

  const generateQuestions = useCallback(async () => {
    try {
      const { category, difficulty, type, questionLimit: amount, token } = state;
      const params = { category, difficulty, type, amount, token };

      const fetchEndpoint = new URL('https://opentdb.com/api.php');

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null & value !== 'any') {
          fetchEndpoint.searchParams.append(key, value);
        }
      });

      const response = await fetch(fetchEndpoint.toString());
      const data = await response.json();
      const tokenErrorCodes = [3, 4];

      if (tokenErrorCodes.includes(data.response_code)) {
        resetToken();
        generateQuestions();
      } else {
        dispatch({ type: 'SET_QUESTIONS', payload: data.results });
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsTokenLoading(false);
    }
  });

  // Effects Hooks
  useEffect(() => {
    const fetchCategoryMax = async () => {
      const isAnyCategory = state.category === 'any';

      try {
        const fetchEndpoint = isAnyCategory ?
          'https://opentdb.com/api_count_global.php' :
          `https://opentdb.com/api_count.php?category=${state.category}`;
        const response = await fetch(fetchEndpoint);
        const data = await response.json();

        const payload = isAnyCategory ? [
          { difficulty: 'any', max: data.overall.total_num_of_verified_questions }
        ] : [
          {
            difficulty: 'any',
            max: data.category_question_count.total_question_count,
          },
          {
            difficulty: 'easy',
            max: data.category_question_count.total_easy_question_count,
          },
          {
            difficulty: 'medium',
            max: data.category_question_count.total_medium_question_count,
          },
          {
            difficulty: 'hard',
            max: data.category_question_count.total_hard_question_count,
          },
        ];

        dispatch({ type: 'SET_MAXIMUMS', payload });
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchCategoryMax();
  }, [state.category]);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const tokenFromSession = sessionStorage.getItem('triviaToken');

        if (tokenFromSession) {
          dispatch({ type: 'SET_TOKEN', payload: tokenFromSession });
        } else {
          const fetchEndpoint = 'https://opentdb.com/api_token.php?command=request';
          const response = await fetch(fetchEndpoint);
          const data = await response.json();

          if (data.response_code === 0) {
            sessionStorage.setItem('triviaToken', data.token);
            dispatch({ type: 'SET_TOKEN', payload: data.token });
          } else {
            console.error('Failed to fetch session token.');
          }
        }
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsTokenLoading(false);
      }
    };

    fetchToken();
  }, []);

  return (
    <TriviaContext.Provider value={{ ...state, isTokenLoading, isCategoryLoading, dispatch, setIsCategoryLoading, generateQuestions }}>
      {children}
    </TriviaContext.Provider>
  );
};

export default TriviaContext;
