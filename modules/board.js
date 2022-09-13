export default class Board extends HTMLElement {
    constructor(state=Array(9).fill(null)) {
        super();
        this.cells = []
        const shadow = this.attachShadow({ mode: 'open' });
        const board = document.createElement('div');
        board.classList.add('board');
        state.forEach((element,i) => {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.id = i;
            if(element){
                cell.innerText = element;
            }
            this.cells.push(cell);
            board.appendChild(cell);
        });
        const style = document.createElement('style');
        style.textContent = `
        .board{
            width:50vw;
            height:50vw;
            display:grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-template-rows: 1fr 1fr 1fr;
            grid-gap: 1px;
            border: 1px solid black;
        }
        .cell{
            width:100%;
            height:100%;
            display: flex;
            justify-content: center;
            align-items: center;
            border:1px black solid;
            font-size: calc(10 * 1vw);
            font-family: sans-serif;
        }
        @keyframes winner {
            0%{
                background: white;
                color: black;
            }
            100%{
                background-color:green;
                color:white;
            }
        }
        .win{
            animation: winner 2s forwards;
        }`;
        shadow.appendChild(style);
        shadow.appendChild(board);
    }
    update(state){
        state.forEach((element,i) => {
            if(element){
                this.cells[i].innerText = element;
            }
        });
    }
    attachListener(listener){
        this.cells.forEach(cell=>{
            cell.addEventListener("click",listener)
        })
    }
    getCell(id){return this.cells.at(id)}
}
customElements.define('tic-tac-board', Board);