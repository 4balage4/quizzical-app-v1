import { useState, useEffect } from 'react'
import Question from './components/Questions'
import Results from "./components/Results";
import MainScreen from "./components/MainScreen";
import { nanoid } from 'nanoid'
import Button from "./components/Button"
import {decode} from 'html-entities';
import  ScaleLoader from 'react-spinners/ScaleLoader';



import './App.css'

function App() {
  // first intro screen
  const [firstRender, setFirstRender] = useState(true)
  const [questions, setQuestions] = useState([])
  // if the state changes will update the array. This is only changed,  on the first render and when the user clicks on the new game.
  // The questions are rendered when the page loads.
  const [refresh, setRefresh] = useState(false)

  // evaluate the answers
  const [change, setChange] = useState(false)
  const [sessionToken, setSessionToken] = useState('')


  const [loadingInProgress, setLoadingInProgress] = useState(true);

  // player name for the results.
  const [playerName, setPlayerName] = useState('')

  useEffect(() => {

      if(!sessionToken) {
      fetch("https://opentdb.com/api_token.php?command=request")
      .then(response => response.json())
      .then(data => setSessionToken(data.token))
    }
    console.log('fetching data...')

       fetchData()
  }, [refresh, sessionToken])


  setTimeout(() => {
    setLoadingInProgress(false);
   }, 500)



// Fetching the data and setting up the array of question is here.
  function fetchData() {
    setQuestions([])


    // easy medium
    const difficulty = "medium"
    // setQuestions([])
   fetch(`https://opentdb.com/api.php?amount=5&category=22&difficulty=${difficulty}&type=multiple&token=${sessionToken}`)
        .then(response => response.json())
        .then(data =>  {
            data.results.map(questionData => {
                let info = nanoid()
                const correctedArray = questionData.incorrect_answers.map ((answer) => decode(answer))
                const correctAnswer = decode(questionData.correct_answer)
                const questionSet  =  {
                name: info,
                key: info,
                question: decode(questionData.question),
                correctAnswer: correctAnswer,
                answers: shuffleArr([...correctedArray, correctAnswer]),
                difficulty: questionData.difficulty,
                category: questionData.category ? questionData.category : '',
                type: questionData.type,
                markedAnswer: "",
                correct: false
              }
              return setQuestions(prev => [...prev, questionSet])
            })
        })

  }

  // Create a timer for the user. When he clicks the start game and when he clicks the see results
  // this will be saved as the result. The time, results, name.


  // Fisher–Yates Shuffle
  // https://bost.ocks.org/mike/shuffle/
  // This is for shuffling the array of the answers
  function shuffleArr(array) {
    let currentIndex = array.length;

    while (currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex --;

      [array[currentIndex], array[randomIndex]] =
      [array[randomIndex], array[currentIndex]];
    }
    return array;
  }


  // Setting the question state when the user answers to the question.
  function handleChange(event) {
    // get the properties when clicked
    const {name, value} = event.target

    // Iset the questions state markedAnswer to the marked answer.
        setQuestions(prev => {
            return (prev.map(question => {
              // iterate trough the questions state and if the question.name (unique) is the same as the event.target.name
              // we update that questions markedAnswer to the value of the event.target.value
              if (question.name === name) {
                return {
                 ...question,
                  markedAnswer: value,
                  correct: value === question.correctAnswer ? true : false
                }
              // if does not match we just return.
              } else {
                return question
              }
          }))
        })
  }


  // Changing the page state. This is a helper function to change the page. The event listener is on the QUESTIONS.jsx component.
  //  The standard value is false.
  // When the user click on the button, it sets the page to true. And the RESULTS.jsx component will be rendered.
  function changePage() {
    return setChange(prev =>!prev)
  }


  // Start game is on the MAINSCREEN components button.
  // The firstRender state is on true. And clicking to the button will set to TRUE, and the question component will be rendered.
  // The same button is on the RESULTS.jsx component's button. At this moment, the firstRender state is on false. And the Change button will set to false
  //  which means the main page will render.
  // Whenever the refresh state changes, the api will run and get the questions.
  function startGame() {

    if (!firstRender) {
      setLoadingInProgress(true)
      setRefresh(prev => !prev)
      setChange(false)
    }

    return (
      setFirstRender(prev => !prev),
      setLoadingInProgress(true),
      setTimeout(() => {
        setLoadingInProgress(false)
      }, 500)
    )

  }

  const getResults = questions.map(question => {
    return (
       <Results data={question} key={nanoid()}  />
    )
  })


  const createdQuestions = questions.map(question => {
    return (
      <Question data={question} key={nanoid()} handleChange={handleChange} loadingInProgress={loadingInProgress} />
     )
  })


  // This here could be replaced by state, and when it is clicked, it updates the state and
  // I show this state in the results.
  // So just in the setState method I will run this code.

  function results() {
    let result = 0;
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].correct) result++;
    }
    return result
  }



  // PlayerName setter
  function handlePlayerName(event) {
    const name = event.target.value
    setPlayerName(name)
  }



  return (
    <>
      {loadingInProgress ? (
          <div className="loader-container">
          <ScaleLoader color={'#E78895'} height={50}  width={6} speedMultiplier={0.75} />
      </div>)
        :
        (firstRender && <MainScreen startGame={startGame} playerName={playerName} handleChange={handlePlayerName}/>)
      }

     {
      !firstRender && loadingInProgress ? (
        <div className="loader-container">
          <ScaleLoader color={'#E78895'} height={50}  width={6} speedMultiplier={0.75} />
      </div>
      ) :
       (
        !firstRender &&
         <div className="question-page-container">
          {/* The change is set with the changePage function */}
          {change ? getResults : createdQuestions}
          <Button changePage={changePage} change={change} results={results} firstRender={firstRender} startGame={startGame}/>
        </div>

      )
    }
    </>
)
}

export default App
