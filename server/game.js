module.exports = class Game {
    constructor(player){
        this.gameState = Array(9).fill(null);
        this.available = true;
        this.playerOneID = player;
        this.playerTwoID = "";
        this.currentPlayer = "";
        this.currentBool = true;
    }
    pickChar(){
        this.currentBool = !this.currentBool;
        this.currentPlayer = this.currentBool ? this.playerOneID : this.playerTwoID ;
        return this.currentBool ? "O" : "X"
    }
    addMove(id,move){
        let {currentBool,currentPlayer,playerOneID,playerTwoID} = this;
        if(id === this.currentPlayer){
            this.gameState[move] = this.pickChar();
            return this.gameState;
        }else{
            console.log(currentPlayer + " tried to make two moves")

        }
    }

    addPlayer(id){
        if(this.available){
            this.available = false;
            this.playerTwoID = id;
            this.currentPlayer = this.playerOneID;
            return true;
        }else{
            return false;
        }
    }

}