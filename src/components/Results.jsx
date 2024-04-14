import { motion } from "framer-motion";
import {container} from './Motion'

function Results(props) {


  return (
    <div className= {props.data.correct ? "question correct-answer" : "question wrong-answer"}>
    <motion.div
      className="container"
      variants={container}
      initial="hidden"
      animate="visible"
    >
          <h3>{props.data.question}</h3>
          <div className="answers-container" >

              {props.data.answers.map(answer => {
                if (answer === props.data.correctAnswer)
                  {
                    return (
                      <div className="answer" key={answer}>
                        <div className="correct">
                          {answer}
                        </div>
                      </div>
                    )
                  }

                if (answer === props.data.markedAnswer) {
                    return (
                      <div className="answer" key={answer}>
                        <div className="marked">
                          {answer}
                        </div>
                      </div>
                    )
                }
                return (
                  <div className="answer" key={answer}>
                    <div className="results">
                      {answer}
                    </div>
                  </div>
                )
              })
              }

          </div>
        </motion.div>
        </div>


    // What do I want:
    // I want to have the same interface as in the Questions section
    // I want to see the marked answer.
    // I want to see the correct answer. Green color.
          // if the correct answer was the marked one, then I want to have it green only.


    // I want to calculate the correct answer numbers.


    // <div className="question-page-container">
    //   <div className="question" >
    //     <h2>{props.data.question}</h2>
    //     <div className="answers-container">
    //       {props.data.answers.map(answer => {
    //         return (
    //           <div className="answer" key={nanoid()} >
    //             <input
    //               type='radio'
    //               name={props.data.name}
    //               id={answer}
    //               value={answer}
    //               // the only source of truth should be what is in the state.
    //               checked={props.data.markedAnswer === answer}
    //               onChange={props.handleChange}
    //             />
    //             <label htmlFor={answer}>{answer}</label>
    //           </div>
    //         )
    //         })}
    //     </div>
    //   </div>
    //   <button>Check Answers</button>
    // </div>
  )
}


export default Results;
