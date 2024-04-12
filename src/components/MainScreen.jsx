

function MainScreen(props) {
  return (
    <>
      <div className="main-container">
        <h1>Quizzical</h1>
        <p>Answer to the questions as fast as possible to be on the toplist</p>
        <button onClick={props.startGame}>Start game</button>
      </div>
    </>
  )
}

export default MainScreen;
