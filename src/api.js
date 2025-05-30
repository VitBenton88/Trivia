import { API_ENDPOINTS, RESPONSE_CODES, SESSION_KEYS, DIFFICULTY_TYPES } from './utils/constants';

export const resetToken = async (expiredToken = '') => {
  sessionStorage.setItem(SESSION_KEYS.sessionTokenKey, '');

  const fetchEndpoint = `${API_ENDPOINTS.tokenReset}&token=${expiredToken}`;
  const response = await fetch(fetchEndpoint);
  const { response_code, token } = await response.json();

  if (response_code === 0) {
    sessionStorage.setItem(SESSION_KEYS.sessionTokenKey, token);
    return token;
  } else {
    throw new Error(`Failed to reset session token. ${RESPONSE_CODES[response_code].label}`, {cause: RESPONSE_CODES[response_code].message});
  }
};

export const fetchQuestions = async (state = {}, signal = undefined) => {
  const { category, difficulty, type, questionLimit: amount, token } = state;
  const params = { category, difficulty, type, amount, token };

  const fetchEndpoint = new URL(API_ENDPOINTS.getQuestions);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null & value !== 'any') {
      fetchEndpoint.searchParams.append(key, value);
    }
  });

  const response = await fetch(fetchEndpoint.toString(), { signal });
  return await response.json();
};

export const fetchCategoryMax = async (category = '', signal = undefined) => {
  const isAnyCategory = category === 'any';
  const fetchEndpoint = isAnyCategory ?
    API_ENDPOINTS.getGlobalCategoryMaximums :
    `${API_ENDPOINTS.getCategoryMaximums}?category=${category}`;
  const response = await fetch(fetchEndpoint, { signal });
  const data = await response.json();

  return isAnyCategory ? [
    { difficulty: DIFFICULTY_TYPES.any, max: data.overall.total_num_of_verified_questions }
  ] : [
    {
      difficulty: DIFFICULTY_TYPES.any,
      max: data.category_question_count.total_question_count,
    },
    {
      difficulty: DIFFICULTY_TYPES.easy,
      max: data.category_question_count.total_easy_question_count,
    },
    {
      difficulty: DIFFICULTY_TYPES.medium,
      max: data.category_question_count.total_medium_question_count,
    },
    {
      difficulty: DIFFICULTY_TYPES.hard,
      max: data.category_question_count.total_hard_question_count,
    },
  ];
};

export const fetchToken = async (signal = undefined) => {
  const tokenFromSession = sessionStorage.getItem(SESSION_KEYS.sessionTokenKey);

  if (tokenFromSession) return tokenFromSession;

  const response = await fetch(API_ENDPOINTS.tokenFetch, { signal });
  const { response_code, token } = await response.json();

  if (response_code === 0) {
    sessionStorage.setItem(SESSION_KEYS.sessionTokenKey, token);
    return token;
  } else {
    throw new Error(`Failed to fetch session token. ${RESPONSE_CODES[response_code].label}`, {cause: RESPONSE_CODES[response_code].message});
  }
};

export const fetchCategories = async (signal = undefined) => {
  const response = await fetch(API_ENDPOINTS.getCategories, { signal });
  return await response.json();
};