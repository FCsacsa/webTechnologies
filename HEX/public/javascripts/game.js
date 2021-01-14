"use strict";
let board_start_x = 2;
let board_start_y = 2;
let red = "red";
let dark_red = "red";
let blue = "blue";
let dark_blue = "blue";
let stroke_width = 5;

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
            clickHandler(j, i, hexagon);
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

ws.onmessage = function(event) {
    let message = JSON.parse(event.data);
    console.log(message);
    switch (message.type) {
        case Messages.T_WAITING_FOR_PLAYER:
            player = 1;
            break;

        case Messages.T_GET_USERNAME:
            let response = Messages.O_USERNAME;
            response.data = document.getElementById('player_name').innerHTML;
            ws.send(JSON.stringify(response));
            break;

        case Messages.T_OPPONENT_CONNECTED:
            document.getElementById('opponent_name').innerHTML = message.data;
            if (player = 1){
                our_turn = true;
            }
            break;

        case Messages.T_MOVE:
            putPiece(message.data.x, message.data.y);
            our_turn = !our_turn;
            break;

        case Messages.T_WRONG_MOVE:
            alert('Wrong move!');
            break;

        case Messages.T_GAME_ABORTED:
            alert('Other player left!');
            //show home button TODO
            break;

        case Messages.T_GAME_OVER:
            endGame(message.data);
    
        default:
            break;
    }
}


function clickHandler(x,y, th) {
    console.log(`Button clicked! ${x}, ${y}`);
    let color = Math.floor(Math.random()*16777215).toString(16);
    //th.style = `fill: ${blue}`;
    let svgs = document.getElementsByTagName('svg');
    console.log(svgs[x + 11 * y + 1].firstElementChild.style);
    svgs[x + 11 * y + 1].firstElementChild.style = `fill: ${blue}; stroke: ${dark_blue}; stroke-width: ${stroke_width}`;
}

function putPiece(x,y) {

}

function endGame(winner) {
    if (winner = player){

    } else {

    }
}