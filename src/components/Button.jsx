

export default function Button(props) {
  return (
    <div className="button-container">
      <p className="final-results">{props.change ? `${props.results()} / 5 questions are correct!` : ""}</p>
      <button onClick={!props.change ? props.changePage : props.startGame}>
         {props.change ? "Play Again" : "See Results"}
        </button>
    </div>

  )
}
