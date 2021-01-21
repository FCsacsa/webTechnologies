"use strict";
const BOARD_START_X = 3;
const BOARD_START_Y = 3;
const RED = "#FA8F71";
const DARK_RED = "#AB4D33";
const BLUE = "#577CFA";
const DARK_BLUE = "#455DAD";
const GOLD = '#ffd700';
const DARK = '#202020';
const STROKE_WIDTH = 5;
const COLOURS = [[RED, DARK_RED], [BLUE, DARK_BLUE]];

//get all needed elements from the document
let grid = document.getElementById("grid");
let our_moves_label = document.getElementById('player_pieces');
let opp_moves_label = document.getElementById('opponent_pieces');
let clock = document.getElementById("timer");
let turn_label = document.getElementById('turn_label');
let home = document.getElementById('home');

//load the board
for (let i = 0; i < 11; i++){
    for (let j = 0; j < 11; j++){
        let tile = document.getElementById("template").cloneNode(true);
        let hexagon = tile.childNodes[1];
        hexagon.style = "pointer-events: all;";
        hexagon.addEventListener("click", ()=>{
            clickHandler(j, i);
        });
        hexagon.setAttribute("stroke-linecap", "round");
        let border;
        switch (i) {
            case 10:
                border = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
                border.style = `stroke: ${BLUE}; stroke-width: ${STROKE_WIDTH}; fill:none;`;
                border.setAttribute("points", "0,51.96 30,69.28 60,51.96");
                border.setAttribute("stroke-linecap", "round");
                tile.appendChild(border);
                break;
            
            case 0:
                border = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
                border.style = `stroke: ${BLUE}; stroke-width: ${STROKE_WIDTH}; fill:none;`;
                border.setAttribute("points", "0,17.32 30,0 60,17.32");
                border.setAttribute("stroke-linecap", "round");
                tile.appendChild(border);
                break;
        
            default:
                break;
        }
        switch (j) {
            case 10:
                border = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
                border.style = `stroke: ${RED}; stroke-width: ${STROKE_WIDTH}; fill:none;`;
                border.setAttribute("points", "60,51.96 60,17.32 30,0");
                border.setAttribute("stroke-linecap", "round");
                tile.appendChild(border);
                break;
            
            case 0:
                border = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
                border.style = `stroke: ${RED}; stroke-width: ${STROKE_WIDTH}; fill:none;`;
                border.setAttribute("points", "0,17.32 0,51.96 30,69.28");
                border.setAttribute("stroke-linecap", "round");
                tile.appendChild(border);
                break;
        
            default:
                break;
        }
        tile.style.gridColumnStart = i + (j * 2) + BOARD_START_X;
        tile.style.gridColumnEnd = i + (j * 2) + BOARD_START_X + 2;
        tile.style.gridRowStart = (i * 2) + BOARD_START_Y;
        tile.style.gridRowEnd = (i * 2) + BOARD_START_Y + 3;
        tile.style.display = "";
        grid.appendChild(tile);
    }
}

//get the newly created svgs
let svgs = document.getElementsByTagName('svg');

//setup the Websocket
let ws = new WebSocket('ws://localhost:3000');

// variables for the game
let player = 2;
let our_turn = false;
let our_moves = 0;
let opp_moves = 0;
let secs = 0;
let mins = 0;
let timer = null;
let placeSound = new Audio('../sounds/place.flac');


ws.onmessage = function(event) {
    let message = JSON.parse(event.data);
    console.log(message);

    switch (message.type) {
        case Messages.T_WAITING_FOR_PLAYER:
            player = 1;
            document.getElementById('player').style.background = `linear-gradient(to bottom left, ${DARK} 0% 50%, ${RED} 50% 100%)`;
            document.getElementById('opponent').style.background = `linear-gradient(to top right, ${DARK} 0% 50%, ${BLUE} 50% 100%)`;
            break;

        case Messages.T_GET_USERNAME:
            let response = Messages.O_USERNAME;
            response.data = document.getElementById('player_name').innerHTML;
            ws.send(JSON.stringify(response));
            break;

        case Messages.T_OPPONENT_CONNECTED:
            timer = setInterval(updateTime, 1000);
            document.getElementById('opponent_name').innerHTML = message.data;
            if (player == 1){
                our_turn = true;
                turn_label.innerHTML = `Your turn`;
            }
            else {
                document.getElementById('player').style.background = `linear-gradient(to bottom left, ${DARK} 0% 50%, ${BLUE} 50% 100%)`;
                document.getElementById('opponent').style.background = `linear-gradient(to top right, ${DARK} 0% 50%, ${RED} 50% 100%)`;
                turn_label.innerHTML = `Opponent's turn`;
            }
            break;  

        case Messages.T_MOVE:
            putPiece(message.data.x, message.data.y, message.data.player);
            if (message.data.player != player){
                turn_label.innerHTML = `Your turn`;
                our_turn = true;
            }
            else {
                turn_label.innerHTML = `Opponent's turn`;
                our_turn = false;
            }
            break;

        case Messages.T_WRONG_MOVE:
            turn_label.innerHTML = `Wrong move, don't cheat!!`;
            break;

        case Messages.T_GAME_ABORTED:
            turn_label.innerHTML = `Opponent left the game, return to main menu`;
            clearInterval(timer);
            home.style.display = 'initial';
            our_turn = false;
            break;

        case Messages.T_GAME_OVER:
            console.log(message.data);
            endGame(message.data);
            break;
    
        default:
            break;
    }
}


function clickHandler(x,y) {
    console.log(`Button clicked! ${x}, ${y}`);
    if (our_turn) {
        let message = Messages.O_MOVE;
        message.data = {
            x: x,
            y: y,
            player: player
        }
        ws.send(JSON.stringify(message));
    }
}

function putPiece(x,y, msgPlayer) {
    placeSound.play();
    if(msgPlayer == player){
        svgs[x + 11 * y + 1].firstElementChild.style = `fill: ${COLOURS[player - 1][0]}; stroke: ${COLOURS[player - 1][1]}; stroke-width: ${STROKE_WIDTH}`;
        our_moves++;
        our_moves_label.innerHTML = `${our_moves} piece${(our_moves == 1) ? '' : 's'} placed`;
    }
    else {
        svgs[x + 11 * y + 1].firstElementChild.style = `fill: ${COLOURS[2 - player][0]}; stroke: ${COLOURS[2 - player][1]}; stroke-width: ${STROKE_WIDTH}`;
        opp_moves++;
        opp_moves_label.innerHTML = `${opp_moves} piece${(opp_moves == 1) ? '' : 's'} placed`;
    }
}

function putBorder(x,y) {
    svgs[x + 11 * y + 1].firstElementChild.style.stroke = GOLD; 
}

function endGame(win) {
    clearInterval(timer);
    turn_label.innerHTML = `Game over please return to the main menu`;
    home.style.display = 'initial';
    our_turn = false;
    console.log(win.winner);
    console.log(win.winner == player);
    if (win.winner == player){
        console.log('won');
        document.getElementById('player_won').style.display = '';
        document.getElementById('opponent_lost').style.display = '';
    }else {
        console.log('lost');
        document.getElementById('player_lost').style.display = '';
        document.getElementById('opponent_won').style.display = '';
    }
    win.line.forEach(element => {
        let coords = JSON.parse(element);
        putBorder(coords[0], coords[1]);
    });
}

function updateTime(){
    secs++;
    if (secs == 60){
        mins++;
        secs=0;
    }
    clock.innerHTML = `${mins}:${secs.toString().padStart(2,"0")}`;
}