const serverURL = "http://localhost:4000"

let scoreboard;
async function messageServer(method,headers={}){
   let rHeaders = new Headers(headers);
   let request = new Request(serverURL);
   const init = {
       method:method,
       headers:rHeaders,
       cache:"default",
       mode:"cors"
   }
   let response = await fetch(request,init);
   return response.json();
}
async function startGame(){
    sessionStorage.clear();
    const {gameID,playerID} = await messageServer("GET")
    sessionStorage.setItem("gameID",gameID);
    sessionStorage.setItem("playerID",playerID);
    addGameToHTML();
    scoreboard.innerText = "Hello Player One, You are X"
}
async function joinGame(){
    sessionStorage.clear();
    const {gameID,playerID} = await messageServer("POST")
    sessionStorage.setItem("gameID",gameID);
    sessionStorage.setItem("playerID",playerID);
    addGameToHTML();
    scoreboard.innerText = "Hello Player Two, You are O"
}
async function refreshGame(){
    let ID = sessionStorage.getItem("gameID");
    const board = await messageServer("PATCH",{ID})
    let game = await board;
    draw(game.gameState);
    return board;
}
async function makeMove(e){
  let index = e.target.id;
  let game = sessionStorage.getItem("gameID");
  let ID = sessionStorage.getItem("playerID");
  let response =  await messageServer("PUT",{ID,game,index})
  console.log(response)
}


function checkWinner(game){
    let toCheck = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ]
    for (let i = 0; i < toCheck.length; i++) {
        let combo = toCheck[i] // [0,1,2]
        let cellA = game[combo[0]]
        let cellB = game[combo[1]]
        let cellC = game[combo[2]]
        if(cellA && cellB && cellC ){
            if(cellA === cellB && cellB === cellC){
                return {combo,win:true}
            }
        }
    }
    return{combo:null,win:false}
}

async function clickCell (event){
    let cell = +event.target.id;
    let game = await refreshGame();



}
function draw (game) {
    game.forEach((value,index)=>{
        let ele = document.getElementById(`${index}`);
        if(value){
            ele.innerText = value;
        }else{
            ele.innerText = "";
        }
    })
}
function addGameToHTML(){
    document.querySelector(".container").innerHTML = `
        <div class="scoreboard"></div>
        <div class="board">
            <div id="0" class="cell">1</div>
            <div id="1" class="cell">2</div>
            <div id="2" class="cell">3</div>
            <div id="3" class="cell">4</div>
            <div id="4" class="cell">5</div>
            <div id="5" class="cell">6</div>
            <div id="6" class="cell">7</div>
            <div id="7" class="cell">8</div>
            <div id="8" class="cell">9</div>
        </div>
    `;
    let cells = document.querySelectorAll(".cell");
    for (let index = 0; index < cells.length; index++) {
        const element = cells[index];
        element.addEventListener("click",makeMove)
    }
    scoreboard = document.querySelector(".scoreboard");
    setInterval(async ()=>{
       let game = await refreshGame();
       draw(game.gameState);
       let {win,combo} = checkWinner(game.gameState);
        if(win){
            combo.forEach(cell=>{
                let element = document.getElementById(`${cell}`)
                element.classList.add("win");
            });
        }
    },100)
}

function init(){
    if(document.querySelector("button")){
        let start = document.querySelector("[data-command=START]");
        let join =  document.querySelector("[data-command=JOIN]");
        start.addEventListener("click",startGame);
        join.addEventListener("click",joinGame)
    }
}
init();



