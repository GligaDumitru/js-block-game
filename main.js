const currentUser = {
  isOnline: false,
  value: "",
};

const state = {
  numberOfRows: 5,
  gameArray: [],
};

function get(id) {
  return document.getElementById(id);
}

function show(id) {
  get(id).style.display = "block";
}

function hide(id) {
  get(id).style.display = "none";
}

function set(id, value) {
  get(id).textContent = value;
}

function setStageOne() {
  hide("start-stage");
  show("setup-stage-one");
}

function handleChangeNumberRows() {
  let el = get("numberOrRows");
  if (el.value >= 5 && el.value <= 10) {
    state.numberOfRows = el.value;
  } else {
    window.blur();
    state.numberOfRows = 5;
    el.value = 5;
    setAlert("", "The number must be between 5 and 10");
  }

  generateGameArray();
  drawGame();
}

function setAlert(alertType = "", message = "", timeout = 5000) {
  set("generalAlertText", message);
  show("generalAlert");
  setTimeout(() => {
    hide("generalAlert");
  }, timeout);
}

function loginWithUsername() {
  const { value } = get("username");
  currentUser.isOnline = true;
  currentUser.value = value;
  set("userId", value);
  setStageOne();

  localStorage.setItem("usernameID", value);
  return false;
}

function logout() {
  localStorage.removeItem("usernameID");
  window.location.reload();
}

function generateGame() {
  const gameContainer = get("gameContainer");
  const generateGameArray = generateGameArray();
  console.log(generateGameArray);
}

(function () {
  const usernameID = localStorage.getItem("usernameID");
  if (usernameID) {
    set("userId", usernameID);
    setStageOne();
    generateGameArray();
    drawGame();
  }
})();

function drawGame() {
  const gameContainer = get("game-container");
  const { gameArray } = state;
  let output = "";

  gameArray.forEach((row) => {
    let _tempLine = "";
    row.forEach((cell) => {
      let _tempCell = `
        <div class="cell">
            <input type="text" class="input-cell" />
            <span class="numberId">1</span>
        </div>
      `;
      _tempLine += _tempCell;
    });

    _tempLine = `
      <div class="line">
        ${_tempLine}
      </div>
    `;

    output += _tempLine;
  });

  output = `
   <form >
      <section class="game-container">
        ${output}
      </section>
  </form>
  `;

  gameContainer.innerHTML = output;
}

function generateGameArray() {
  const { numberOfRows } = state;
  let output = [];
  const _tempCell = {
    type: "default",
    value: "",
    disabled: false,
  };
  output = Array.from({ length: numberOfRows }, (v, k) => _tempCell);
  state.gameArray = Array.from({ length: numberOfRows }, (v, k) => output);
}
