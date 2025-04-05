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

export const RESPONSE_CODES = {
  0: {
    label: 'Success',
    message: 'Returned results successfully.'
  },
  1: {
    label: 'No Results',
    message: 'Could not return results. The API doesn\'t have enough questions for your query. (Ex. Asking for 50 Questions in a Category that only has 20.)'
  },
  2: {
    label: 'Invalid Parameter',
    message: 'Contains an invalid parameter. Arguments passed in aren\'t valid. (Ex. Amount = Five)'
  },
  3: {
    label: 'Token Not Found',
    message: 'Session Token does not exist.'
  },
  4: {
    label: 'Token Empty',
    message: 'Session Token has returned all possible questions for the specified query. Resetting the Token is necessary.'
  },
  5: {
    label: 'Rate Limit',
    message: 'Too many requests have occurred. Each IP can only access the API once every 5 seconds.'
  }
}
