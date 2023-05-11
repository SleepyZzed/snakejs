//canvas of the game
const canvas = document.getElementById('gameScreen');
//context of canvas to draw on 
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
ctx.scale(2, 2);
class SnakePart{
    constructor(x, y){
    this.x = x
    this.y = y
    }
}


//speed variable for the snake
let speed  = 10;
//tiles across and down
let tileCount = 20;
//tile size is the size each tile will take i.e food, or snake head
let tileSize = canvas.width / 2 /  tileCount -2;

//snake head x across from canvas
let headX = 10;
//snake head y down from canvas
let headY = 10;
const snakeParts = [];
let tailLength = 2;
let angle = 0;

//food x position 
let foodX = 5;
//food y position
let foodY = 5;
// the x axis movment
let xVelocity=0;
// the y movement
let yVelocity=0;

let score = 0;

const collectSound = new Audio('./assets/sounds/collect.mp3');
const bgmusic = new Audio ('./assets/sounds/bg.mp3');
const img = new Image();
img.src = './assets/images/testHead.png';
const foodimg = new Image();
foodimg.src = './assets/images/food.png';
const bodyImg = new Image();
bodyImg.src = './assets/images/body.png';
const tailImg = new Image();
tailImg.src = './assets/images/tail.png';






//function that draws game every second using setTimeOutfunction which will allow for adjustable speed
//gameloop
function drawGame(){
    
    changeSnakeDirection();
    let result = isGameOver();
    if(result){
        return;
    }

    clearScreen();
    


    checkFoodCollision();
    drawFood();
    drawSnake();
    drawScore();
    



    setTimeout(drawGame, 1000/ speed);
    if(!(yVelocity === 0 && xVelocity === 0)){
        if (bgmusic.paused) {
            bgmusic.currentTime = 0;
            bgmusic.volume = 0.3; // Set volume to 50%
            bgmusic.loop = true; // Set loop to true
            bgmusic.play();
            
            }
    }
}
function isGameOver(){
    let gameOver = false;
    
    if(yVelocity ===0 && xVelocity ===0){
        return false;
        
    }
    //walls
    if(headX < 0){
        gameOver = true;
    }
    else if(headX >= tileCount){
        gameOver = true;
    }
    else if(headY < 0){
        gameOver = true;
    }
    else if(headY >= tileCount){
        gameOver = true;
    }

    //snake check
    for(let i = 0; i <snakeParts.length; i ++){
        let part = snakeParts[i];
        if(part.x === headX && part.y === headY)
        {
            gameOver = true;
            break;
        }
    }
    if (gameOver) {
        
        ctx.fillStyle = "white";
        ctx.font = "100px Nunito";
        if(!bgmusic.paused){
            bgmusic.currentTime = 0;
            bgmusic.pause();
        }
        if (gameOver) {
          ctx.fillStyle = "white";
          ctx.font = "50px Nunito";
    
          var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
          gradient.addColorStop("0", " magenta");
          gradient.addColorStop("0.5", "blue");
          gradient.addColorStop("1.0", "red");
          // Fill with gradient
          ctx.fillStyle = gradient;
    
          ctx.fillText("Game Over!", canvas.width / 12.5, canvas.height / 4);
        }
    
        ctx.fillText("Game Over!", canvas.width / 12.5, canvas.height / 4);
      }
    return gameOver;
    
}

function drawScore(){
  ctx.fillStyle = 'white';
  ctx.font = 'bold 20px Nunito';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.strokeText('Score: ' + score, canvas.width / 2 - 100, 20);
  ctx.fillText('Score: ' + score, canvas.width / 2 - 100, 20);
  
}
//clears screen
function clearScreen(){

  //scale factor for grid as canvas is scaled up by 2
  const scaleFactor = 2;
  const scaledWidth = canvas.width / scaleFactor;
  const scaledHeight = canvas.height / scaleFactor;
  const tileSize = 10;
  const cellSize = tileSize * scaleFactor;
  
  const lightColor = '#95FFBD';
  const darkColor = '#11492C';
  
  //checkerboard pattern
  for (let i = 0; i < scaledHeight / cellSize; i++) {
    for (let j = 0; j < scaledWidth / cellSize; j++) {
      const x = j * cellSize;
      const y = i * cellSize;
      const color = (i + j) % 2 === 0 ? lightColor : darkColor;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, cellSize, cellSize);
    }
  }
  


    //ctx.fillStyle='black';
    //ctx.fillRect(0,0,canvas.width, canvas.height);
}
//draws snake
function drawSnake() {
  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    ctx.save(); // save the current state of the context
    ctx.translate((part.x + 0.5) * tileCount, (part.y + 0.5) * tileCount); // set the rotation point to the center of the part
    let angle = 0;
    if (i > 0) { // calculate the angle of rotation for all parts except the head
      let prevPart = snakeParts[i-1];
      if (part.x > prevPart.x) {
        angle = Math.PI / 2; // rotate 90 degrees clockwise if moving right
      } else if (part.x < prevPart.x) {
        angle = -Math.PI / 2; // rotate 90 degrees counterclockwise if moving left
      } else if (part.y > prevPart.y) {
        angle = Math.PI; // rotate 180 degrees if moving down
      }
    } else { // calculate the angle of rotation for the head
      if (xVelocity === 1) {
        angle = Math.PI / 2; // rotate 90 degrees clockwise if moving right
      } else if (xVelocity === -1) {
        angle = -Math.PI / 2; // rotate 90 degrees counterclockwise if moving left
      } else if (yVelocity === 1) {
        angle = Math.PI; // rotate 180 degrees if moving down
      }
    }
    ctx.rotate(angle); // rotate the context by the calculated angle
    if (i === 0) { // if it's the last part, use the tailImg
      ctx.drawImage(tailImg, -tileSize / 2, -tileSize / 2, tileSize, tileSize);
    } else {
      ctx.drawImage(bodyImg, -tileSize / 2, -tileSize / 2, tileSize, tileSize);
    }
    ctx.restore(); // restore the previous state of the context
  }
  
  snakeParts.push(new SnakePart(headX, headY));
  if (snakeParts.length > tailLength) {
    snakeParts.shift();
  }
  
  ctx.save(); // save the current state of the context
  ctx.translate((headX + 0.5) * tileCount, (headY + 0.5) * tileCount); // set the rotation point to the center of the head
  let angle = 0;
  if (xVelocity === 1) {
    angle = Math.PI / 2; // rotate 90 degrees clockwise if moving right
  } else if (xVelocity === -1) {
    angle = -Math.PI / 2; // rotate 90 degrees counterclockwise if moving left
  } else if (yVelocity === 1) {
    angle = Math.PI; // rotate 180 degrees if moving down
  }
  ctx.rotate(angle); // rotate the context by the calculated angle
  ctx.drawImage(img, -tileSize / 2, -tileSize / 2, tileSize, tileSize); // draw the head centered at the origin (which is now the center of the head)
  ctx.restore(); // restore the previous state of the context
  
}


//moves snake direction
function changeSnakeDirection(){
    headX = headX + xVelocity;
    headY = headY + yVelocity;
    
    
}
//draws the snake food
function drawFood(){
    //ctx.fillStyle ='yellow';
    //ctx.fillRect(foodX * tileCount, foodY *tileCount, tileSize, tileSize);
    ctx.drawImage(foodimg, foodX * tileCount, foodY *tileCount, tileSize, tileSize);
    
}
//checks the food collison
function checkFoodCollision() {
    if (foodX == headX && foodY == headY) {
      // Generate new random positions until food is not on top of a snake part
      do {
        foodX = Math.floor(Math.random() * tileCount);
        foodY = Math.floor(Math.random() * tileCount);
      } while (snakeParts.some(part => part.x === foodX && part.y === foodY));
  
      tailLength++;
      score++;
      collectSound.currentTime = 0; // Reset the audio to the beginning
      collectSound.play();
      if(speed < 20)
      {
        speed ++;
      }
      // Ensure food doesn't spawn outside of canvas boundaries
      if (foodX >= tileCount) {
        foodX = tileCount - 1;
      } else if (foodX < 0) {
        foodX = 0;
      }
  
      if (foodY >= tileCount) {
        foodY = tileCount - 1;
      } else if (foodY < 0) {
        foodY = 0;
      }
    }
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
