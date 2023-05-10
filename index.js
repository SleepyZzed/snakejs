//canvas of the game
const canvas = document.getElementById('gameScreen');
//context of canvas to draw on 
const ctx = canvas.getContext('2d');
//speed variable for the snake
let speed  = 7;
//tiles across and down
let tileCount = 40;
//tile size is the size each tile will take i.e food, or snake head
let tileSize = canvas.width / tileCount - 2;

//snake head x across from canvas
let headX = 10;
//snake head y down from canvas
let headY = 10;
// the x axis movment
let xVelocity=0;
// the y movement
let yVelocity=0;

//function that draws game every second using setTimeOutfunction which will allow for adjustable speed
//gameloop
function drawGame(){
    clearScreen();
    changeSnakeDirection();
    drawSnake();
    setTimeout(drawGame, 1000/ speed);
}
//clears screen
function clearScreen(){
    ctx.fillStyle='black';
    ctx.fillRect(0,0,canvas.width, canvas.height);
}
//draws snake
function drawSnake(){
    ctx.fillStyle = 'red';
    ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}
function changeSnakeDirection(){
    headX = headX + xVelocity;
    headY = headY + yVelocity;
}

//keyboard listener for movement
document.body.addEventListener('keydown', keyDown);

function keyDown(event){
    //Up arrow
    if(event.keyCode == 38){
        if(yVelocity == 1)
            return;
      yVelocity = -1;
      xVelocity = 0; 
    }
    //dpwn arrow
    if(event.keyCode == 40){
        if(yVelocity == -1)
        return;
        yVelocity = 1;
        xVelocity = 0; 
      }
      //left arrow
      if(event.keyCode == 37){
        if(xVelocity == 1)
        return;
        yVelocity = 0;
        xVelocity = -1; 
      }
      // right arrow
      if(event.keyCode == 39){
        if(xVelocity == -1)
        return;
        yVelocity = 0;
        xVelocity = 1; 
      }
}

drawGame();
