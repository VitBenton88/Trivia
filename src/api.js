import { API_ENDPOINTS, SESSION_KEYS } from './utils/constants';

export const resetToken = async (token = '') => {
  const fetchEndpoint = `${API_ENDPOINTS.tokenReset}&token=${token}`;

  sessionStorage.setItem(SESSION_KEYS.sessionTokenKey, '');

  const response = await fetch(fetchEndpoint);
  const data = await response.json();

  if (data.response_code === 0) {
    return data.token;
  } else {
    throw new Error(`Failed to reset session token. Error code: ${data.response_code}`);
  }
};

export const fetchQuestions = async (state = {}) => {
  const { category, difficulty, type, questionLimit: amount, token } = state;
  const params = { category, difficulty, type, amount, token };

  const fetchEndpoint = new URL(API_ENDPOINTS.getQuestions);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null & value !== 'any') {
      fetchEndpoint.searchParams.append(key, value);
    }
  });

  const response = await fetch(fetchEndpoint.toString());
  return await response.json();
};

export const fetchCategoryMax = async (category = '') => {
  const isAnyCategory = category === 'any';
  const fetchEndpoint = isAnyCategory ?
    API_ENDPOINTS.getGlobalCategoryMaximums :
    `${API_ENDPOINTS.getCategoryMaximums}?category=${category}`;
  const response = await fetch(fetchEndpoint);
  const data = await response.json();

  return isAnyCategory ? [
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
};

export const fetchToken = async () => {
  const tokenFromSession = sessionStorage.getItem(SESSION_KEYS.sessionTokenKey);

  if (tokenFromSession) return tokenFromSession;

  const response = await fetch(API_ENDPOINTS.tokenFetch);
  const { response_code, token } = await response.json();

  if (response_code === 0) {
    sessionStorage.setItem(SESSION_KEYS.sessionTokenKey, token);
    return token;
  } else {
    throw new Error('Failed to fetch session token.');
  }
};

export const fetchCategories = async () => {
  const response = await fetch(API_ENDPOINTS.getCategories);
  return await response.json();
};