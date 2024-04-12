import { useState, useEffect } from 'react'
import Question from './components/Questions'
import Results from "./components/Results";
import MainScreen from "./components/MainScreen";
import { nanoid } from 'nanoid'
import Button from "./components/Button"
import {decode} from 'html-entities';

import './App.css'

function App() {
  // first intro screen
  const [firstRender, setFirstRender] = useState(true)

  const [questions, setQuestions] = useState([])

  // evaluate the answers
  const [change, setChange] = useState(false)
  const [sessionToken, setSessionToken] = useState('')

  useEffect(() => {

    fetch("https://opentdb.com/api_token.php?command=request")
    .then(response => response.json())
    .then(data => setSessionToken(data.token))
    console.log('fetching data...')
    fetchData()

  }, [firstRender])



  const fetchData  = async () => {
    const difficulty = "medium"

    const info = await fetch(`https://opentdb.com/api.php?amount=5&category=22&difficulty=${difficulty}&type=multiple&token=${sessionToken}`)
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
             setQuestions(prev => [...prev, questionSet])
          })
       })
       return info
  }

  //  function fetchData() {
  //    fetch('https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple')
  //     .then(response => response.json())
  //     .then(data =>  {
  //         data.results.map(questionData => {
  //             let info = nanoid()
  //             const correctedArray = questionData.incorrect_answers.map ((answer) => decode(answer))
  //             const correctAnswer = decode(questionData.correct_answer)
  //             const questionSet  =  {
  //             name: info,
  //             key: info,
  //             question: decode(questionData.question),
  //             correctAnswer: correctAnswer,
  //             answers: shuffleArr([...correctedArray, correctAnswer]),
  //             difficulty: questionData.difficulty,
  //             category: questionData.category ? questionData.category : '',
  //             type: questionData.type,
  //             markedAnswer: "",
  //             correct: false
  //            }
  //            setQuestions(prev => [...prev, questionSet])
  //         })
  //      })

  // }


  // Fisher–Yates Shuffle
  // https://bost.ocks.org/mike/shuffle/

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

  function changePage() {
    return setChange(prev =>!prev)
  }

  function startGame() {
    if (!firstRender) {
      setQuestions([])
      setChange(false)
    }
    return setFirstRender(prev => !prev)
  }

  const getResults = questions.map(question => {
    return (
       <Results data={question} key={nanoid()}  />
    )
  })


  const createdQuestions = questions.map(question => {
    return (
      <Question data={question} key={nanoid()} handleChange={handleChange} />
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



  return (
    <>
      {firstRender && <MainScreen startGame={startGame}/>}
      {!firstRender &&
         <div className="question-page-container">
          {change ? getResults : createdQuestions}
          <Button changePage={changePage} change={change} results={results} firstRender={firstRender} startGame={startGame}/>
        </div>
      }
    </>
)
}

export default App

{/* <MainScreen /> */}
