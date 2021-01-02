import { grid } from './lib/grid.js';
import { play } from './lib/play.js';

//declaring global variables
//canvas
let canv=document.getElementById("gc");
let ctx=canv.getContext("2d");
canv.style.top = "60px";
canv.style.left = "10px";
canv.style.position = "absolute";
//audio
var audio_win = new Audio('audio/win.wav')
var audio_singlemove = new Audio('audio/singlemove.wav')
var audio_doublemove = new Audio('audio/doublemove.wav')
//game settings and data
var gameSound = 1;
//originaly colored X and O signs, then switched to white and black stones, sign property is still used in grid.markcell
let cellColorData = [{"sign":null,"color":"black"},{"sign":"ex","color":"red"},{"sign":"circle","color":"yellow"}]
let navbarSelectColor = "#000e88";
var gridSize = 12;
var rowLength = 5;
var cellCount = gridSize*gridSize;
let gridData = {};
var currentTurn = 1;
let gameState;
let gameMod
setGameMod(1)

//loading images
var board = new Image();
board.src = 'graphics/wood_wallpaper.jpg';
var blackStone = new Image();
blackStone.src = 'graphics/blackStone.png';
var whiteStone = new Image();
whiteStone.src = 'graphics/whiteStone.png';

board.onload = function() {
    // drawing all images in onload function on loadup
    ctx.drawImage(board, 0, 0,canv.width,canv.height);
    
    ctx.drawImage(blackStone, 0, 0,1,1);
    ctx.drawImage(whiteStone, 0, 0,1,1);
    
    startGame(gridSize,rowLength);
}

function startGame(submitGridSize,submitRowLength){
    gameState = 1;
    gridSize = submitGridSize;
    rowLength = submitRowLength;
    
    ctx.clearRect(0, 0, canv.width, canv.height);
    
    ctx.drawImage(board, 0, 0, canv.width,canv.height);
    
    cellCount = gridSize*gridSize;
    currentTurn = 1;
    gridData = {};
    
    var cx = 0;
    var cy = 0;
    var posX = 0;
    var posY = 0;
    var i = 0;
    ctx.fillStyle="black";

    ctx.strokeStyle = "black";
    ctx.lineWidth = canv.width/gridSize*0.01
    while (i < cellCount) {
        
        ctx.rect(cx, cy, canv.width/gridSize, canv.height/gridSize);
        ctx.stroke();

        gridData[posX + "_" + posY] = {"x":cx,"y":cy,"state":0,"gridX":posX,"gridY":posY};
        i += 1;
        if (i % gridSize == 0){
            cx = 0;
            posX = 0; 
            cy += canv.height/gridSize;
            posY += 1;
        } else {
            cx += canv.width/gridSize;
            posX += 1;
        }
    }
    
    drawUselessLine();
}


function playSound(gameMod){
    if (gameSound == 0){
        return
    }
    if (gameMod < 3){
        audio_doublemove.play()
    } else {
        audio_singlemove.play()
    }
}

function executeTurn(currentTurnSubmit,key,r = 0){
    
    if (gameState == 0){
        drawUselessLine();
        return
    }
    playSound(gameMod)
    gridData = grid.markCell(key,currentTurnSubmit,gridData,ctx,canv,cellColorData,blackStone,whiteStone)
    var rowData = grid.getTopRow(currentTurnSubmit,gridData)
    // checking win
    if (rowLength <= rowData.length){
        if (gameSound == 1){
            audio_win.play()
        }
        console.log("Winner!")
        
        var x1 = rowData[0]["x"]
        var y1 = rowData[0]["y"]
        var x2 = rowData[ rowData.length-1 ]["x"]
        var y2 = rowData[ rowData.length-1 ]["y"]
        var w = canv.width/gridSize
        var h = canv.height/gridSize
        ctx.strokeStyle = "green";
        ctx.lineWidth = w*0.2;
        ctx.beginPath();
        ctx.moveTo(x1+w*0.5, y1+h*0.5);
        ctx.lineTo(x2+w*0.5, y2+h*0.5);
        ctx.stroke();
        gameState = 0;
        drawUselessLine();
        return
    }
    // checking draw
    if (grid.getStateCount(0,gridData) == 0){
        //console.log("Draw!")
        gameState = 0;
        drawUselessLine();
        return
    }
    if (r == 1){
        return
    }
    // computer turn if set in gameMod
    if (gameMod < 3){
        let playTurn;
        if (currentTurnSubmit == 1){
            playTurn = 2;
        } else {
            playTurn = 1;
        }
        let playCell = play.turn(gameMod,playTurn,gridData,rowLength)
        executeTurn(playTurn,playCell["x"] + "_" + playCell["y"],1)
        drawUselessLine();
        return
    }
    // switching turn
    if (currentTurnSubmit == 1){
        currentTurn = 2;
    } else {
        currentTurn = 1;
    }
    drawUselessLine();
}

function drawUselessLine(){
    //last draw does not clear with ctx.clearRect method, workaround - drawing 1px on border that is always black
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(1, 1);
    ctx.lineTo(1, 2);
    ctx.stroke();
}

function setGameMod(set){
    // setting game mod, 1- easy, 2- hard, 3- player vs player
    gameMod = set;
    //coloring navigation bar based on selection
    if (set == 1){ 
        document.getElementById("PvC1").style.backgroundColor = navbarSelectColor;
        document.getElementById("PvC2").style.backgroundColor = "";
        document.getElementById("PvP").style.backgroundColor = "";
    }
    if (set == 2){ 
        document.getElementById("PvC1").style.backgroundColor = "";
        document.getElementById("PvC2").style.backgroundColor = navbarSelectColor;
        document.getElementById("PvP").style.backgroundColor = "";
    }
    if (set == 3){ 
        document.getElementById("PvC1").style.backgroundColor = "";
        document.getElementById("PvC2").style.backgroundColor = "";
        document.getElementById("PvP").style.backgroundColor = navbarSelectColor;
    }
};


document.getElementById("Sound").onclick = function(){
    if (gameSound == 1){
        gameSound = 0;
        document.getElementById("Sound").innerHTML = "🔇";
    } else {
        gameSound = 1;
        document.getElementById("Sound").innerHTML = "🔊";
    }
}

// individual id bidnings, onClick function in html was producing error if importing modules
document.getElementById("gc").onclick = function(){
    
    var key = grid.getCell(event.clientX,event.clientY,gridData,canv);
    if (gridData[key]["state"] != 0){
        return
    }
    executeTurn(currentTurn,key,0);
}

document.getElementById("Restart").onclick = function(){
    drawUselessLine();
    startGame(gridSize,rowLength)
}

document.getElementById("PvC1").onclick = function(){
    setGameMod(1)
}
document.getElementById("PvC2").onclick = function(){
    setGameMod(2)
}
document.getElementById("PvP").onclick = function(){
    setGameMod(3)
}
document.getElementById("startGame3x3").onclick = function(){
    startGame(3,3);
}
document.getElementById("startGame3x3").onclick = function(){
    startGame(3,3);
}
document.getElementById("startGame4x4").onclick = function(){
    startGame(4,4);
}
document.getElementById("startGame5x4").onclick = function(){
    startGame(5,4);
}
document.getElementById("startGame12x5").onclick = function(){
    startGame(12,5);
}
document.getElementById("startGame20x5").onclick = function(){
    startGame(20,5);
}
document.getElementById("startGame30x6").onclick = function(){
    startGame(30,6);
}

//dropdown interaction
document.getElementById("dropbt_id").onclick = function(){
    document.getElementById("myDropdown").classList.toggle("show");
}
window.onclick = function(e) {
    if (!e.target.matches('.dropbtn')) {
        var myDropdown = document.getElementById("myDropdown");
        if (myDropdown.classList.contains('show')) {
            myDropdown.classList.remove('show');
        }
    }
}