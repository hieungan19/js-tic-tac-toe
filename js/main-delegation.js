import { CELL_VALUE, GAME_STATUS, TURN } from "./constants.js";
import {
  getCellElementList,
  getCellElementAtIdx,
  getCurrentTurnElement,
  getGameStatusElement,
  getReplayBtnElement,
  getUlEle,
} from "./selectors.js";
import { checkGameStatus } from "./utils.js";
//console.log(checkGameStatus(['X', 'O', 'O', '', 'X', '', '', 'O', 'X']));
/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let isGameEnded = false;
let gameStatus = GAME_STATUS.PLAYING;
let cellValues = new Array(9).fill("");

function toggleTurn() {
  currentTurn = currentTurn === TURN.CIRCLE ? TURN.CROSS : TURN.CIRCLE;
  //update turn on DOM ele

  const currentTurnEle = getCurrentTurnElement();
  if (currentTurnEle) {
    currentTurnEle.classList.remove(TURN.CIRCLE, TURN.CROSS);
    currentTurnEle.classList.add(currentTurn);
  }
}

function updateGameStatus(newGameStatus) {
  gameStatus = newGameStatus;

  const gameStatusEle = getGameStatusElement();
  if (gameStatusEle) gameStatusEle.textContent = newGameStatus; 

}
function showReplayBtn() {
  const replayBtn = getReplayBtnElement();
  if (replayBtn) replayBtn.classList.add("show");
}
function hideReplayBtn(){
  const replayBtn = getReplayBtnElement();
  if (replayBtn) replayBtn.classList.remove("show");
}
function highlightWin(winPositions) {
  if (!Array.isArray(winPositions) || winPositions.length===0) {
    throw new Error("Invalid win position");
  }
   
  for (const position of winPositions) {
    const cell = getCellElementAtIdx(position);
    cell.classList.add("win"); 

  }
}
function handleCellClick(cell, index) {
  const isEndGame = gameStatus !== GAME_STATUS.PLAYING;
  const isClicked =
    cell.classList.contains(TURN.CIRCLE) || cell.classList.contains(TURN.CROSS);
  if (isClicked || isEndGame) return;

  // set selected cell
  cell.classList.add(currentTurn);

  //update cell value
  cellValues[index] =
    currentTurn === TURN.CIRCLE ? CELL_VALUE.CIRCLE : CELL_VALUE.CROSS;

  //toggle turn
  toggleTurn();

  //check game status
  const game = checkGameStatus(cellValues);
  switch (game.status) {
    case GAME_STATUS.ENDED: {
      //update status
      updateGameStatus(game.status);
      //show replay btn
      showReplayBtn();
      break;
    }
    case GAME_STATUS.X_WIN: {
      //update status
      updateGameStatus(game.status);
      //show replay btn
      showReplayBtn();
      //high light win cell
      highlightWin(game.winPositions);
      break;
    }
    case GAME_STATUS.O_WIN: {
      //update status
      updateGameStatus(game.status);
      //show replay btn
      showReplayBtn();
      //high light win cell
      highlightWin(game.winPositions);
      break;
    }
    default:
    //playing
  }
}
function initCellElementList() {
  //setIndex for each Li
  const cellEleList = getCellElementList();

  cellEleList.forEach((cell, index) => {
    cell.dataset.idx = index; 
   });

  const ulEle = getUlEle();
  const index = 0; 
  if (ulEle) {
    ulEle.addEventListener('click',(event)=>{
      if (event.target.tagName !== 'LI') return; 
      const index = Number.parseInt(event.target.dataset.idx) ; 
      handleCellClick(event.target, index); 
    })
  }; 
  // const cellEleList = getCellElementList();

  // cellEleList.forEach((cell, index) => {
  //   cell.addEventListener("click", () => handleCellClick(cell, index));
  // });
}
function resetGame(){
  //reset temp global
  currentTurn = TURN.CROSS;
  gameStatus = GAME_STATUS.PLAYING;
  cellValues = cellValues.map(()=>'');

  //reset dom elements
  // game status
  updateGameStatus(GAME_STATUS.PLAYING);

  //current turn 
  const currentTurnEle = getCurrentTurnElement();
  if (currentTurnEle) {
    currentTurnEle.classList.remove(TURN.CIRCLE, TURN.CROSS);
    currentTurnEle.classList.add(TURN.CROSS);
  } 
  //game board
  const cellEleList = getCellElementList();
  for (const cellEle of cellEleList)
  {
    //cellEle.classList.remove(TURN.CIRCLE, TURN.CROSS,"win");
    cellEle.classList=''; 
  }

  

  //hide btn 
  hideReplayBtn();

}
function initReplayBtn(){
  const replayBtn = getReplayBtnElement();
  if (replayBtn){
    replayBtn.addEventListener('click',resetGame)
  }
}
/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */
(() => {
  //bind click event for li elements
  initCellElementList();
  initReplayBtn()
  //bind click event for replay button
})();
