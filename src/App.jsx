import { TriviaProvider } from './context/TriviaContext';
import Settings from './components/settings'
import Questions from './components/questions'
import './App.css'

function App() {
  return (
    <TriviaProvider>
      <h1>Trivia</h1>
      <Settings />
      <Questions />
    </TriviaProvider>
  )
}

export default App
