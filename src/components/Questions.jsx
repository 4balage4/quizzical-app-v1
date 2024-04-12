import {nanoid} from 'nanoid'

function Question(props) {
  // props coming: data, key
  return (

      <div className="question" >
        <h3>{props.data.question}</h3>
        <div className="answers-container">
          {props.data.answers.map(answer => {
            let id = nanoid();
            return (
              <div className="answer" key={answer} >
                <input
                  type='radio'
                  name={props.data.name}
                  id={id}
                  value={answer}
                  // the only source of truth should be what is in the state.
                  checked={props.data.markedAnswer === answer}
                  onChange={props.handleChange}
                />
                <label htmlFor={id}>{answer}</label>
              </div>
            )
            })}
        </div>
      </div>

  )
}


export default Question;
