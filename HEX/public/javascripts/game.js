"use strict";
let board_start_x = 3;
let board_start_y = 3;
let red = "#FA8F71";
let dark_red = "#AB4D33";
let blue = "#577CFA";
let dark_blue = "#455DAD";
let stroke_width = 5;

let colours = [[red, dark_red], [blue, dark_blue]];

//loading the table
let grid = document.getElementById("grid");

//load the board
for (let i = 0; i < 11; i++){
    for (let j = 0; j < 11; j++){
        let tile = document.getElementById("template").cloneNode(true);
        let hexagon = tile.childNodes[1];
        //console.log(tile.childNodes);
        hexagon.style = "pointer-events: all;";
        hexagon.addEventListener("click", ()=>{
            clickHandler(j, i);
        });
        let border;
        switch (i) {
            case 10:
                border = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
                border.style = `stroke: ${blue}; stroke-width: ${stroke_width}; fill:none;`;
                border.setAttribute("points", "0,51.96 30,69.28 60,51.96");
                tile.appendChild(border);
                break;
            
            case 0:
                border = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
                border.style = `stroke: ${blue}; stroke-width: ${stroke_width}; fill:none;`;
                border.setAttribute("points", "0,17.32 30,0 60,17.32");
                tile.appendChild(border);
                break;
        
            default:
                break;
        }
        let border2;
        switch (j) {
            case 10:
                border = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
                border.style = `stroke: ${red}; stroke-width: ${stroke_width}; fill:none;`;
                border.setAttribute("points", "60,51.96 60,17.32 30,0");
                tile.appendChild(border);
                break;
            
            case 0:
                border = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
                border.style = `stroke: ${red}; stroke-width: ${stroke_width}; fill:none;`;
                border.setAttribute("points", "0,17.32 0,51.96 30,69.28");
                tile.appendChild(border);
                break;
        
            default:
                break;
        }
        tile.style.gridColumnStart = i + (j * 2) + board_start_x;
        tile.style.gridColumnEnd = i + (j * 2) + board_start_x + 2;
        tile.style.gridRowStart = (i * 2) + board_start_y;
        tile.style.gridRowEnd = (i * 2) + board_start_y + 3;
        tile.style.display = "";
        grid.appendChild(tile);
    }
}

//setup the Websocket
let ws = new WebSocket('ws://localhost:3000');
let player = 2;
let our_turn = false;
let svgs = document.getElementsByTagName('svg');
let our_moves = 0;
let our_moves_label = document.getElementById('player_pieces');
let opp_moves = 0;
let opp_moves_label = document.getElementById('opponent_pieces');
let clock = document.getElementById("timer");
let secs = 0;
let mins = 0;
let timer = null;
let turn_label = document.getElementById('turn_label');
let home = document.getElementById('home');


ws.onmessage = function(event) {
    let message = JSON.parse(event.data);
    console.log(message);
    switch (message.type) {
        case Messages.T_WAITING_FOR_PLAYER:
            player = 1;
            document.getElementById('player').style.background = `linear-gradient(to bottom left, #fff 0% 50%, ${red} 50% 100%)`;
            document.getElementById('opponent').style.background = `linear-gradient(to top right, #fff 0% 50%, ${blue} 50% 100%)`;
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
                document.getElementById('player').style.background = `linear-gradient(to bottom left, #fff 0% 50%, ${blue} 50% 100%)`;
                document.getElementById('opponent').style.background = `linear-gradient(to top right, #fff 0% 50%, ${red} 50% 100%)`;
                turn_label.innerHTML = `Opponent's turn`;
            }
            break;  

        case Messages.T_MOVE:
            putPiece(message.data.x, message.data.y);
            our_turn = !our_turn;
            if (our_turn){
                turn_label.innerHTML = `Your turn`;
            }
            else {
                turn_label.innerHTML = `Opponent's turn`;
            }
            break;

        case Messages.T_WRONG_MOVE:
            turn_label.innerHTML = `Wrong move, don't cheat!!`;
            break;

        case Messages.T_GAME_ABORTED:
            turn_label.innerHTML = `Opponent left the game return to main menu`;
            clearInterval(timer);
            home.style.display = 'initial';
            our_turn = false;
            break;

        case Messages.T_GAME_OVER:
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


    //th.style = `fill: ${blue}`;
    /*
    console.log(svgs[x + 11 * y + 1].firstElementChild.style);
    */
}

function putPiece(x,y) {
    if(our_turn){
        svgs[x + 11 * y + 1].firstElementChild.style = `fill: ${colours[player - 1][0]}; stroke: ${colours[player - 1][1]}; stroke-width: ${stroke_width}`;
        our_moves++;
        our_moves_label.innerHTML = `${our_moves} piece${(our_moves == 1) ? '' : 's'} placed`;
    }
    else {
        svgs[x + 11 * y + 1].firstElementChild.style = `fill: ${colours[2 - player][0]}; stroke: ${colours[2 - player][1]}; stroke-width: ${stroke_width}`;
        opp_moves++;
        opp_moves_label.innerHTML = `${opp_moves} piece${(opp_moves == 1) ? '' : 's'} placed`;
    }
}

function endGame(winner) {
    clearInterval(timer);
    turn_label.innerHTML = `Game over please return to the main menu`;
    home.style.display = 'initial';
    our_turn = false;
    if (winner = player){
        
    } else {

    }
}

function updateTime(){
    secs++;
    if (secs == 60){
        mins++;
        secs=0;
    }
    clock.innerHTML = `${mins}:${secs.toString().padStart(2,"0")}`;
}