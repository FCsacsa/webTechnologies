"use strict";
let board_start_x = 2;
let board_start_y = 2;
let red = "red";
let blue = "blue";

//loading the table
let grid = document.getElementById("grid");


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
                border.style = `stroke: ${blue}; stroke-width: 5; fill:none;`;
                border.setAttribute("points", "0,51.96 30,69.28 60,51.96");
                tile.appendChild(border);
                break;
            
            case 0:
                border = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
                border.style = `stroke: ${blue}; stroke-width: 5; fill:none;`;
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
                border.style = `stroke: ${red}; stroke-width: 5; fill:none;`;
                border.setAttribute("points", "60,51.96 60,17.32 30,0");
                tile.appendChild(border);
                break;
            
            case 0:
                border = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
                border.style = `stroke: ${red}; stroke-width: 5; fill:none;`;
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

let home = document.getElementById("home");
home.addEventListener("click", () => {location.reload()});

function clickHandler(x,y, th) {
    console.log(`Button clicked! ${x}, ${y}`);
    let color = Math.floor(Math.random()*16777215).toString(16);
    th.style = `fill: ${blue}`
}