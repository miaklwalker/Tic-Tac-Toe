const  Koa =  require("koa");
const Random = require("another-random-package");
const Game = require("./game.js");
const cors = require("@koa/cors")

const app = new Koa();
const port = 4000

let availableGames = new Map();
let activeGames = new Map();

const Routes = {
    startGame(){
        let gameID = Random.randomStringAlphaNumeric(23);
        let playerID = Random.randomStringAlphaNumeric(23);
        let game = new Game(playerID);
        availableGames.set(gameID,game);
        return {gameID,playerID} ;

    },
    findGame(){
        let playerID = Random.randomStringAlphaNumeric(23);
        let games = availableGames.keys();
        let gameID = games.next().value;
        let game = availableGames.get(gameID);
        game.addPlayer(playerID);
        activeGames.set(gameID,game);
        availableGames.delete(gameID);
        return {gameID,playerID};

    },
    getBoard(gameID){
        return activeGames.get(gameID);
    },
    updateGame(gID,pID,move){
        let game = getBoard(gID)
        game.addMove(pID,move);
        return game;
    }
}

const {startGame,findGame,getBoard,updateGame} = Routes;

async function Router (ctx,next){
    await next();
    let method = ctx.request.method;

    switch (method) {
        case "PUT":
            let data = ctx.request.headers;
            let pID = data.id;
            let gID = data.game;
            let move = data.index;
            ctx.body = JSON.stringify(updateGame(gID,pID,move));
            break;
        // Make Game;
        case "GET":
            ctx.body = JSON.stringify(startGame());
            break;

        case "POST":
            ctx.body = JSON.stringify(findGame())
            break;
        case "PATCH":
            let headers = ctx.request.headers.id;
            ctx.body = JSON.stringify(getBoard(headers))    
            break;
        default:
        ctx.body = "NOT FOUND"
    }

}



app.use(cors({allowMethods:["GET","POST","PATCH","PUT"]}))

app.use(Router)
app.listen(port);
console.log(`Listening on port : ${port}`)
