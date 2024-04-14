

function MainScreen(props) {
  return (
    <>
      <div className="main-page-container">
        <h1>Quizzical</h1>
        <p>Answer to the questions</p>
        <div className="nickname">
          {/* <label htmlFor="name"> Nickname:</label> */}
          <input required type="text" name="name" onChange={props.handleChange} value={props.playerName} placeholder="Your nickname" ></input>
        </div>
        <button onClick={props.startGame}>Start game</button>
      </div>
    </>
  )
}

export default MainScreen;
