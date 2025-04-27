import { useContext } from 'react';
import TriviaContext from '../context/TriviaContext';

const ErrorMessage = () => {
  // Context
  const { errorMessage } = useContext(TriviaContext);

  return (
    <>
      {errorMessage && <p>⚠️ {errorMessage} ⚠️</p>}
    </>
  );
};

export default ErrorMessage;