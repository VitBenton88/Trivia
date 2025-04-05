export const API_ENDPOINTS = {
  tokenFetch: 'https://opentdb.com/api_token.php?command=request',
  tokenReset: 'https://opentdb.com/api_token.php?command=reset',
  getQuestions: 'https://opentdb.com/api.php',
  getGlobalCategoryMaximums: 'https://opentdb.com/api_count_global.php',
  getCategoryMaximums: 'https://opentdb.com/api_count.php',
  getCategories: 'https://opentdb.com/api_category.php',
};

export const SESSION_KEYS = {
  sessionTokenKey: 'triviaToken',
};
