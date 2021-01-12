"use strict";
let board_start_x = 5;
let board_start_y = 2;


//loading the table
let grid = document.getElementById("grid");


for (let i = 0; i < 11; i++){
    for (let j = 0; j < 11; j++){
        let tile = document.getElementById("template").cloneNode(true);
        let hexagon = tile.childNodes[1];
        //console.log(tile.childNodes);
        hexagon.style = "pointer-events: all;";
        hexagon.addEventListener("click", ()=>{
            clickHandler(j, i);
        });
        tile.style.gridColumnStart = i + (j * 2) + board_start_x;
        tile.style.gridColumnEnd = i + (j * 2) + board_start_x + 2;
        tile.style.gridRowStart = (i * 2) + board_start_y;
        tile.style.gridRowEnd = (i * 2) + board_start_y + 3;
        tile.style.display = "";
        grid.appendChild(tile);
    }
}

let home = document.getElementById("home");
home.addEventListener("click", () => {clickHandler(10, 9)});

function clickHandler(x,y) {
    alert(`Button clicked! ${x}, ${y}`);
}