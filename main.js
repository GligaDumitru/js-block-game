const types = {
  LOGIN_STAGE: "login_stage",
  SETUP_STAGE_ONE: "setup_setup_one",
  SETUP_STAGE_TWO: "setup_setup_two",
  SETUP_STAGE_THREE: "setup_setup_three",
  STAGE_PLAY: "stage_play",
  END_GAME: "end_game",
};

const BLOCKS_TYPES = {
  ONE: "1",
  TWO: "2",
  THREE: "3",
  FOUR: "4",
};

let state = {
  numberOfRows: 5,
  gameArray: [],
  currentStage: types.LOGIN_STAGE,
  numberOfBlocks: 0,
  currentUser: {
    isOnline: false,
    value: "",
  },
  totalRedBlock: 0,
  totalBlackBlocks: 0,
  currentRound: 1,
  finalResult: "s",
  redBlocks: [
    "",
    {
      type: BLOCKS_TYPES.ONE,
      current: 0,
      maxim: 3,
    },
    {
      type: BLOCKS_TYPES.TWO,
      current: 0,
      maxim: 2,
    },
    {
      type: BLOCKS_TYPES.THREE,
      current: 0,
      maxim: 2,
    },
    {
      type: BLOCKS_TYPES.FOUR,
      current: 0,
      maxim: 1,
    },
  ],
  blackBlocks: [
    "",
    {
      type: BLOCKS_TYPES.ONE,
      current: 0,
      maxim: 3,
    },
    {
      type: BLOCKS_TYPES.TWO,
      current: 0,
      maxim: 2,
    },
    {
      type: BLOCKS_TYPES.THREE,
      current: 0,
      maxim: 2,
    },
    {
      type: BLOCKS_TYPES.FOUR,
      current: 0,
      maxim: 1,
    },
  ],
};

function saveState() {
  localStorage.setItem("state", JSON.stringify(state));
}

function getState() {
  let stateLocal = localStorage.getItem("state");
  if (stateLocal) {
    stateLocal = JSON.parse(stateLocal);
    state = stateLocal;
  }
}

function get(id) {
  return document.getElementById(id);
}

function show(id, asVisibility = false) {
  const element = get(id);
  if (element) {
    if (asVisibility) {
      if (element.classList.contains("hidden")) {
        element.classList.remove("hidden");
      }
    } else {
      element.style.display = "block";
    }
  }
}

function hide(id, asVisibility = false) {
  const element = get(id);
  if (element) {
    if (asVisibility) {
      if (!element.classList.contains("hidden")) {
        element.classList.add("hidden");
      }
    } else {
      element.style.display = "none";
    }
  }
}

function set(id, value) {
  get(id).textContent = value;
}

function setStageOne() {
  state.currentStage = types.SETUP_STAGE_ONE;
  hide("start-stage");
  show("setup-stage-one");
}

function setStageTwo() {
  state.currentStage = types.SETUP_STAGE_TWO;
  hide("start-stage");
  hide("setup-stage-one");
  show("setup-stage-two");
}

function setStageThree() {
  state.currentStage = types.SETUP_STAGE_THREE;
  hide("start-stage");
  hide("setup-stage-one");
  hide("setup-stage-two");
  show("setup-stage-three");
}

function makeGameArrayAsPlayMode() {
  state.gameArray.forEach((row) => {
    row.forEach((cell) => {
      if (cell.type !== "red") {
        cell.disabled = true;
      } else {
        cell.disabled = false;
      }
    });
  });
}

function disableCells() {
  state.gameArray.forEach((row) => {
    row.forEach((cell) => {
      cell.disabled = true;
    });
  });
}

function setStagePlay() {
  state.currentStage = types.STAGE_PLAY;
  hide("start-stage");
  hide("setup-stage-one");
  hide("setup-stage-two");
  hide("setup-stage-three");
  show("stage-play");
  makeGameArrayAsPlayMode();
}

function setStageEnd() {
  state.currentStage = types.END_GAME;
  hide("start-stage");
  hide("setup-stage-one");
  hide("setup-stage-two");
  hide("setup-stage-three");
  hide("stage-play");
  show("stage-play-end");
  disableCells();
}

function handleChangeNumberRows() {
  let el = get("numberOrRows");
  if (el.value >= 5 && el.value <= 10) {
    state.numberOfRows = parseInt(el.value);
  } else {
    window.blur();
    state.numberOfRows = 5;
    el.value = 5;
    setAlert("", "The number must be between 5 and 10");
  }
  generateGameArray();
  drawGame();
  saveState();
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
  state.currentUser.isOnline = true;
  state.currentUser.value = value;
  set("userId", value);
  setStageOne();
  generateGameArray();
  drawGame();
  saveState();
  return false;
}

function logout() {
  localStorage.clear();
  window.location.reload();
}

(function () {
  getState();
  const { currentStage, currentUser, numberOfRows } = state;

  switch (currentStage) {
    case types.END_GAME: {
      setStageEnd();
      set("totalRedBlocksPlayEnd", state.totalRedBlock);
      set("totalDarkBlocksPlayEnd", state.totalBlackBlocks);
      set("totalGrayBlocksPlayEnd", state.numberOfBlocks);
      set("winnerIs1", state.finalResult);
      set("roundNumberEnd", `${state.currentRound}`);
      set("userId", currentUser.value);
      drawGame("game-container_stage_play_end");
      break;
    }
    case types.STAGE_PLAY: {
      setStagePlay();
      set("totalRedBlocksPlay", state.totalRedBlock);
      set("totalDarkBlocksPlay", state.totalBlackBlocks);
      set("totalGrayBlocksPlay", state.numberOfBlocks);
      set("roundNumber", `${state.currentRound}`);
      set("userId", currentUser.value);
      drawGame("game-container_stage_play");
      break;
    }
    case types.SETUP_STAGE_THREE: {
      setStageThree();
      set("userId", currentUser.value);

      set("numberOfBlackBlocks", `${state.totalBlackBlocks} / 8`);
      if (state.totalBlackBlocks > 0) {
        show("nextBtnThree", true);
      }
      drawGame("game-container_stage_three");
      break;
    }
    case types.SETUP_STAGE_TWO: {
      setStageTwo();
      set("userId", currentUser.value);
      set("numberORedBlocks", `${state.totalRedBlock} / 8`);
      if (state.totalRedBlock > 0) {
        show("nextBtnTwo", true);
      }
      drawGame("game-container_stage_two");
      break;
    }
    case types.SETUP_STAGE_ONE: {
      if (currentUser.value) {
        const totalNumberOfBlockAvailable = parseInt(
          Math.pow(numberOfRows, 2) / 3
        );
        set("userId", currentUser.value);
        setStageOne();
        get("numberOrRows").value = numberOfRows;
        set("numberOfBlocks", "0 / 0");
        set(
          "numberOfBlocks",
          `${state.numberOfBlocks} / ${totalNumberOfBlockAvailable}`
        );
        if (
          state.numberOfBlocks > 0 &&
          state.numberOfBlocks + 1 <= totalNumberOfBlockAvailable
        ) {
          show("nextBtn", true);
        }
        drawGame();
      }
      break;
    }
    default: {
      show("start-stage");
    }
  }
})();

function drawGame(id = "game-container") {
  const gameContainer = get(id);
  const { gameArray } = state;
  let output = "";

  gameArray.forEach((row, rowIndex) => {
    let _tempLine = "";
    // <span class="numberId">1</span>
    //
    row.forEach((cell, index) => {
      const cellId = `cell-${rowIndex}-${index}`;
      let _tempCell = `
        <div class="cell ${cell.type}">
            <input ${cell.disabled && "disabled"} value="${
        cell.value || ""
      }" type="text" id="${cellId}" onchange="handleChangeCell('${cellId}')" class="input-cell" />
          ${cell.model && `<span class="numberId">${cell.model}</span>`}
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

function swapProperties(x1, y1, x2, y2) {
  const _tempObj = state.gameArray[x1][y1];
  state.gameArray[x1][y1] = state.gameArray[x2][y2];
  state.gameArray[x2][y2] = _tempObj;
}

function removeCellBlock(x1, y1, x2, y2) {
  state.gameArray[x1][y1] = state.gameArray[x2][y2];
  state.gameArray[x2][y2] = {
    type: "default",
    value: "",
    model: 0,
    disabled: true,
  };
}

function checkAndUpdateCells(x, y, value, type) {
  const { gameArray } = state;
  let success = {
    ok: false,
    type: "default",
    operation: [],
  };

  const currentElement = gameArray[x][y];
  currentElement.model = parseInt(currentElement.model);
  switch (value) {
    case "a" || "A": {
      if (y - 1 < 0) {
        setAlert("", `You cannot move outside the box game`);
      } else {
        const leftElement = gameArray[x][y - 1];
        if (leftElement.type === type) {
          setAlert("", `You cannot move on your own cell`);
        } else if (leftElement.type === "block") {
          setAlert("", `You cannot move on a block cell`);
        } else if (leftElement.type === "default") {
          success = {
            ok: true,
            type: "default",
            operation: [x, y - 1, x, y],
          };
        } else if (leftElement.type === "dark") {
          if (currentElement.model > leftElement.model) {
            success = {
              ok: true,
              type: "removeBlackCell",
              operation: [x, y - 1, x, y],
            };
          } else if (currentElement.model === 1 && leftElement.model === 4) {
            success = {
              ok: true,
              type: "removeBlackCell",
              operation: [x, y - 1, x, y],
            };
          } else {
            success = {
              ok: true,
              type: "removeRedCell",
              operation: [x, y, x, y],
            };
          }
        }
      }
      break;
    }
    case "s" || "S": {
      if (x + 1 >= state.numberOfRows) {
        setAlert("", `You cannot move outside the box game`);
      } else {
        const downElement = gameArray[x + 1][y];
        if (downElement.type === type) {
          setAlert("", `You cannot move on your own cell`);
        } else if (downElement.type === "block") {
          setAlert("", `You cannot move on a block cell`);
        } else if (downElement.type === "default") {
          success = {
            ok: true,
            type: "default",
            operation: [x + 1, y, x, y],
          };
        } else if (downElement.type === "dark") {
          if (currentElement.model > downElement.model) {
            success = {
              ok: true,
              type: "removeBlackCell",
              operation: [x + 1, y, x, y],
            };
          } else if (currentElement.model === 1 && downElement.model === 4) {
            success = {
              ok: true,
              type: "removeBlackCell",
              operation: [x + 1, y, x, y],
            };
          } else {
            success = {
              ok: true,
              type: "removeRedCell",
              operation: [x, y, x, y],
            };
          }
        }
      }
      break;
    }
    case "d" || "D": {
      if (y + 1 >= state.numberOfRows) {
        setAlert("", `You cannot move outside the box game`);
      } else {
        const rightElement = gameArray[x][y + 1];
        if (rightElement.type === type) {
          setAlert("", `You cannot move on your own cell`);
        } else if (rightElement.type === "block") {
          setAlert("", `You cannot move on a block cell`);
        } else if (rightElement.type === "default") {
          success = {
            ok: true,
            type: "default",
            operation: [x, y + 1, x, y],
          };
        } else if (rightElement.type === "dark") {
          if (currentElement.model > rightElement.model) {
            success = {
              ok: true,
              type: "removeBlackCell",
              operation: [x, y + 1, x, y],
            };
          } else if (currentElement.model === 1 && rightElement.model === 4) {
            success = {
              ok: true,
              type: "removeBlackCell",
              operation: [x, y + 1, x, y],
            };
          } else {
            success = {
              ok: true,
              type: "removeRedCell",
              operation: [x, y, x, y],
            };
          }
        }
      }
      break;
    }
    case "w" || "W": {
      if (x - 1 < 0) {
        setAlert("", `You cannot move outside the box game`);
      } else {
        const upElement = gameArray[x - 1][y];
        if (upElement.type === type) {
          setAlert("", `You cannot move on your own cell`);
        } else if (upElement.type === "block") {
          setAlert("", `You cannot move on a block cell`);
        } else if (upElement.type === "default") {
          success = {
            ok: true,
            type: "default",
            operation: [x - 1, y, x, y],
          };
        } else if (upElement.type === "dark") {
          if (currentElement.model > upElement.model) {
            success = {
              ok: true,
              type: "removeBlackCell",
              operation: [x - 1, y, x, y],
            };
          } else if (currentElement.model === 1 && upElement.model === 4) {
            success = {
              ok: true,
              type: "removeBlackCell",
              operation: [x - 1, y, x, y],
            };
          } else {
            success = {
              ok: true,
              type: "removeRedCell",
              operation: [x, y, x, y],
            };
          }
        }
      }
      break;
    }
    default: {
      setAlert("", `You cannot make this move`);
    }
  }

  if (success.ok) {
    switch (success.type) {
      case "removeBlackCell": {
        state.totalBlackBlocks -= 1;
        break;
      }
      case "removeRedCell": {
        state.totalRedBlock -= 1;
        break;
      }
      default: {
        console.log("default success type");
      }
    }

    const [x1, y1, x2, y2] = success.operation;
    removeCellBlock(x1, y1, x2, y2);
    state.currentRound += 1;
  }

  return success.ok;
}

function validateAndSubmitGame() {
  set("totalRedBlocksPlay", state.totalRedBlock);
  set("totalDarkBlocksPlay", state.totalBlackBlocks);
  set("totalGrayBlocksPlay", state.numberOfBlocks);
  set("roundNumber", `${state.currentRound}`);

  if (state.totalBlackBlocks === 0) {
    state.currentStage = types.END_GAME;
    state.finalResult = "User Won";
    saveState();
    location.reload();
  } else if (state.totalRedBlock === 0) {
    state.currentStage = types.END_GAME;
    state.finalResult = "PC Won";
    saveState();
    location.reload();
  } else {
    state.currentStage = types.END_GAME;
    state.winnerGame = "Draw";
    state.finalResult = "Draw Beetween User and PC";
    saveState();
    location.reload();
  }
}

function handleChangeCell(id) {
  if (id) {
    const { numberOfBlocks, numberOfRows, gameArray, currentStage } = state;
    let value = get(id).value;

    const _TempID = id.split("-");
    const _row = _TempID[1];
    const _column = _TempID[2];
    switch (currentStage) {
      case types.STAGE_PLAY: {
        const successMoved = checkAndUpdateCells(
          parseInt(_row),
          parseInt(_column),
          value,
          "red"
        );
        if (successMoved) {
          validateAndSubmitGame();
          pcTurn();
          validateAndSubmitGame();
        }
        drawGame("game-container_stage_play");
        break;
      }
      case types.SETUP_STAGE_THREE: {
        if (["1", "2", "3", "4"].includes(value)) {
          const currentBlackBlock = state.blackBlocks[parseInt(value)];
          if (currentBlackBlock.current < currentBlackBlock.maxim) {
            gameArray[_row][_column] = {
              type: "dark",
              value: "",
              model: parseInt(value),
              disabled: true,
            };
            state.totalBlackBlocks += 1;
            set("numberOfBlackBlocks", `${state.totalBlackBlocks} / 8`);
            state.blackBlocks[parseInt(value)].current += 1;
            show("nextBtnThree", true);
          } else {
            state.gameArray[_row][_column] = {
              ...state.gameArray[_row][_column],
              value: "",
            };
            setAlert(
              "",
              `You can insert ${currentBlackBlock.maxim} of type '${value}'`
            );
          }
        } else {
          state.gameArray[_row][_column] = {
            ...state.gameArray[_row][_column],
            value: "",
          };
          setAlert("", `You can insert only 1, 2, 3 or 4 as input for blocks`);
        }

        drawGame("game-container_stage_three");
        break;
      }
      case types.SETUP_STAGE_TWO: {
        if (["1", "2", "3", "4"].includes(value)) {
          const currentRedBlock = state.redBlocks[parseInt(value)];
          if (currentRedBlock.current < currentRedBlock.maxim) {
            gameArray[_row][_column] = {
              type: "red",
              value: "",
              model: parseInt(value),
              disabled: true,
            };
            state.totalRedBlock += 1;
            set("numberORedBlocks", `${state.totalRedBlock} / 8`);
            state.redBlocks[parseInt(value)].current += 1;
            show("nextBtnTwo", true);
          } else {
            state.gameArray[_row][_column] = {
              ...state.gameArray[_row][_column],
              value: "",
            };
            setAlert(
              "",
              `You can insert ${currentRedBlock.maxim} of type '${value}'`
            );
          }
        } else {
          state.gameArray[_row][_column] = {
            ...state.gameArray[_row][_column],
            value: "",
          };
          setAlert("", `You can insert only 1, 2, 3 or 4 as input for blocks`);
        }

        drawGame("game-container_stage_two");
        break;
      }
      case types.SETUP_STAGE_ONE: {
        if (["b", "B"].includes(value)) {
          const totalNumberOfBlockAvailable = parseInt(
            Math.pow(numberOfRows, 2) / 3
          );
          if (numberOfBlocks + 1 <= totalNumberOfBlockAvailable) {
            show("nextBtn", true);
            state.numberOfBlocks += 1;
            set(
              "numberOfBlocks",
              `${state.numberOfBlocks} / ${totalNumberOfBlockAvailable}`
            );
            gameArray[_row][_column] = {
              type: "block",
              value: "",
              disabled: true,
            };
          } else {
            setAlert(
              "",
              `You can put maxim ${totalNumberOfBlockAvailable} blocks`
            );
          }
        } else {
          state.gameArray[_row][_column] = {
            ...state.gameArray[_row][_column],
            value: "",
          };
          setAlert("", "You can only use 'b' or 'B' to add blocks");
        }
        drawGame();
        break;
      }
      default: {
        console.log("default");
      }
    }
    saveState();
  }
}

function endGame() {
  state.currentStage = types.END_GAME;
  saveState();
  location.reload();
}
function next() {
  switch (state.currentStage) {
    case types.STAGE_PLAY: {
      state.currentStage = types.END_GAME;
      saveState();
      location.reload();
      break;
    }
    case types.SETUP_STAGE_THREE: {
      state.currentStage = types.STAGE_PLAY;
      saveState();
      location.reload();
      break;
    }
    case types.SETUP_STAGE_TWO: {
      state.currentStage = types.SETUP_STAGE_THREE;
      saveState();
      location.reload();
      break;
    }
    case types.SETUP_STAGE_ONE:
    default: {
      state.currentStage = types.SETUP_STAGE_TWO;
      saveState();
      location.reload();
    }
  }
}

function back() {
  switch (state.currentStage) {
    case types.SETUP_STAGE_THREE: {
      state.currentStage = types.SETUP_STAGE_TWO;
      saveState();
      location.reload();
      break;
    }
    case types.SETUP_STAGE_TWO:
    default: {
      state.currentStage = types.SETUP_STAGE_ONE;
      saveState();
      location.reload();
    }
  }
}

function generateGameArray() {
  const { numberOfRows } = state;
  state.numberOfBlocks = 0;
  set("numberOfBlocks", "0 / 0");
  hide("nextBtn", true);
  const _tempCell = {
    type: "default",
    value: "",
    model: 0,
    disabled: false,
  };
  state.gameArray = new Array(numberOfRows)
    .fill()
    .map((x) => new Array(numberOfRows).fill(_tempCell));
}

const getShuffledArr = (arr) => {
  const newArr = arr.slice();
  for (let i = newArr.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
  }
  return newArr;
};

async function pcTurn() {
  const load = get("loading");
  get("loading").classList.remove("hidden");
  let moveHasBeenDone = false;
  const optionsAvailable = {
    // 3 red with 1
    // 2 red with 2
    // 2 red with 3
    // 1 red with 4
    with1Remove4: {
      isPosible: false,
      options: [],
    },
    with4Remove3: {
      // 4 > 3
      isPosible: false,
      options: [],
    },
    with4Remove2: {
      // 4 > 2
      isPosible: false,
      options: [],
    },
    with3Remove2: {
      // 3 > 2
      isPosible: false,
      options: [],
    },
    // remove 1
    with4Remove1: {
      // 4 > 1
      isPosible: false,
      options: [],
    },
    with3Remove1: {
      // 3 > 1
      isPosible: false,
      options: [],
    },
    with2Remove1: {
      // 4 > 1
      isPosible: false,
      options: [],
    },
    randomMove: {
      default: true,
      isPosible: false,
      options: [],
    },
  };

  // the happy flow, where the dark piece eat a red piece
  state.gameArray.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      if (cell.type === "dark") {
        const leftN =
          cellIndex - 1 >= 0
            ? {
                ...state.gameArray[rowIndex][cellIndex - 1],
                x: rowIndex,
                y: cellIndex - 1,
              }
            : null;
        const rightN =
          cellIndex + 1 < state.numberOfRows
            ? {
                ...state.gameArray[rowIndex][cellIndex + 1],
                x: rowIndex,
                y: cellIndex + 1,
              }
            : null;
        const topN =
          rowIndex - 1 >= 0
            ? {
                ...state.gameArray[rowIndex - 1][cellIndex],
                x: rowIndex - 1,
                y: cellIndex,
              }
            : null;
        const downN =
          rowIndex + 1 < state.numberOfRows
            ? {
                ...state.gameArray[rowIndex + 1][cellIndex],
                x: rowIndex + 1,
                y: cellIndex,
              }
            : null;
        const neightbours = [leftN, rightN, topN, downN];
        switch (cell.model) {
          case 1: {
            neightbours.forEach((neightbour) => {
              if (
                neightbour &&
                neightbour?.type === "red" &&
                neightbour?.model === 4
              ) {
                optionsAvailable["with1Remove4"].isPosible = true;
                optionsAvailable["with1Remove4"].options.push({
                  x1: neightbour.x,
                  y1: neightbour.y,
                  x2: rowIndex,
                  y2: cellIndex,
                });
              }
              if (neightbour && neightbour?.type === "default") {
                optionsAvailable["randomMove"].isPosible = true;
                optionsAvailable["randomMove"].options.push({
                  x1: neightbour.x,
                  y1: neightbour.y,
                  x2: rowIndex,
                  y2: cellIndex,
                });
              }
            });
            break;
          }
          case 4: {
            neightbours.forEach((neightbour) => {
              if (neightbour && neightbour?.type === "default") {
                optionsAvailable["randomMove"].isPosible = true;
                optionsAvailable["randomMove"].options.push({
                  x1: neightbour.x,
                  y1: neightbour.y,
                  x2: rowIndex,
                  y2: cellIndex,
                });
              }
              if (
                neightbour &&
                neightbour?.type === "red" &&
                neightbour?.model === 3
              ) {
                optionsAvailable["with4Remove3"].isPosible = true;
                optionsAvailable["with4Remove3"].options.push({
                  x1: neightbour.x,
                  y1: neightbour.y,
                  x2: rowIndex,
                  y2: cellIndex,
                });
              }
              if (
                neightbour &&
                neightbour?.type === "red" &&
                neightbour?.model === 2
              ) {
                optionsAvailable["with4Remove2"].isPosible = true;
                optionsAvailable["with4Remove2"].options.push({
                  x1: neightbour.x,
                  y1: neightbour.y,
                  x2: rowIndex,
                  y2: cellIndex,
                });
              }
              if (
                neightbour &&
                neightbour?.type === "red" &&
                neightbour?.model === 1
              ) {
                optionsAvailable["with4Remove1"].isPosible = true;
                optionsAvailable["with4Remove1"].options.push({
                  x1: neightbour.x,
                  y1: neightbour.y,
                  x2: rowIndex,
                  y2: cellIndex,
                });
              }
            });
            break;
          }
          case 3: {
            neightbours.forEach((neightbour) => {
              if (neightbour && neightbour?.type === "default") {
                optionsAvailable["randomMove"].isPosible = true;
                optionsAvailable["randomMove"].options.push({
                  x1: neightbour.x,
                  y1: neightbour.y,
                  x2: rowIndex,
                  y2: cellIndex,
                });
              }
              if (
                neightbour &&
                neightbour?.type === "red" &&
                neightbour?.model === 2
              ) {
                optionsAvailable["with3Remove2"].isPosible = true;
                optionsAvailable["with3Remove2"].options.push({
                  x1: neightbour.x,
                  y1: neightbour.y,
                  x2: rowIndex,
                  y2: cellIndex,
                });
              }
              if (
                neightbour &&
                neightbour?.type === "red" &&
                neightbour?.model === 1
              ) {
                optionsAvailable["with3Remove1"].isPosible = true;
                optionsAvailable["with3Remove1"].options.push({
                  x1: neightbour.x,
                  y1: neightbour.y,
                  x2: rowIndex,
                  y2: cellIndex,
                });
              }
            });
            break;
          }
          case 2: {
            neightbours.forEach((neightbour) => {
              if (neightbour && neightbour?.type === "default") {
                optionsAvailable["randomMove"].isPosible = true;
                optionsAvailable["randomMove"].options.push({
                  x1: neightbour.x,
                  y1: neightbour.y,
                  x2: rowIndex,
                  y2: cellIndex,
                });
              }
              if (
                neightbour &&
                neightbour?.type === "red" &&
                neightbour?.model === 1
              ) {
                optionsAvailable["with2Remove1"].isPosible = true;
                optionsAvailable["with2Remove1"].options.push({
                  x1: neightbour.x,
                  y1: neightbour.y,
                  x2: rowIndex,
                  y2: cellIndex,
                });
              }
            });
            break;
          }
          default: {
            console.log("cell model default");
          }
        }
      }
    });
  });

  Object.values(optionsAvailable).every((item) => {
    if (item && item?.isPosible && item?.options.length > 0) {
      const { x1, y1, x2, y2 } = getShuffledArr(item?.options)[0];
      removeCellBlock(x1, y1, x2, y2);
      moveHasBeenDone = true;
      if (!item?.default) {
        state.totalRedBlock -= 1;
      }
      return false;
    }

    return true;
  });

  if(moveHasBeenDone === false){
    state.currentStage = types.END_GAME;
    state.winnerGame = "Draw";
    state.finalResult = "Draw Beetween User and PC";
    saveState();
    location.reload();
  }

  setTimeout(() => {
    get("loading").classList.add("hidden");
  }, 2000);
}
