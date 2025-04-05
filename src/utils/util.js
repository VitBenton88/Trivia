export const decodeHtml = (html) => {
  const txt = document.createElement('textarea')
  txt.innerHTML = html
  return txt.value
};

export const triviaContextReducer = (state, action) => {
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