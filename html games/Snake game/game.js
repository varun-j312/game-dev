var myGamePiece;
var tail = [];
var food;

//function to start game
function startGame() {
  myGameArea.start();
  myGamePiece = new component(30, 30, "green", 60, 0, "snake");
  tail.push(new component(30, 30, "green", 30, 0, "snake"));
  tail.push(new component(30, 30, "green", 0, 0, "snake"));
  food = new component(30, 30, "purple", 150, 0, "mice");
}

// creating game area
var myGameArea = {
  canvas: document.createElement("canvas"),
  start: function() {
    this.canvas.width = 1320;
    this.canvas.height = 630;
    this.context = this.canvas.getContext("2d"); //access content of canvas
    document.body.insertBefore(this.canvas, document.body.childNodes[0]); //insert game area into body of page
    this.interval = setInterval(updateGameArea, 20); //update gamearea every 20ms
    this.moveInterval = setInterval(updatePosition, 500);
    //maintaining array of key value and noting key presses
    window.addEventListener('keydown', function(e) {
      myGameArea.keys = (myGameArea.keys || []);
      myGameArea.keys[e.keyCode] = true;
    })
    //crossing out key value when key unpressed
    window.addEventListener('keyup', function(e) {
      myGameArea.keys[e.keyCode] = false;
    })
  },
  clear: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); //clearing gamearea
  },
  stop: function() {
    clearInterval(this.interval); //function to stop updating game
    clearInterval(this.moveInterval);
  }
}

//function for game component
function component(width, height, color, x, y, type) {
  //get features of our component
  this.width = width;
  this.height = height;
  this.speedX = 30;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.type = type;
  this.update = function() { //update component on screen
    ctx = myGameArea.context; //access content of canvas
    ctx.fillStyle = color; //choosing color for content
    ctx.fillRect(this.x, this.y, this.width, this.height); //display the component with the dimensions and location
  }
  this.newPos = function() { //finding new position of component
    this.x += this.speedX; //adding speed in the direction of movement accordingly
    this.y += this.speedY;
  }
  this.crashWith = function(otherobj) {
    if(this.type == "mice") {
      if(this.x == otherobj.x && this.y == otherobj.y) {
        ctx.clearRect(this.x, this.y, this.width, this.height);
        spawnFood();
        var xPos = tail[tail.length - 1].x;
        var yPos = tail[tail.length - 1].y;
        tail.push(new component(30, 30, "green", xPos, yPos));
      }
    }
    else if(this.type == "snake") {
      if(this.x == otherobj.x && this.y == otherobj.y) {
        myGameArea.stop();
      }
    }
  }
}

////////////////////////////////////////////////////////////////////////////////
//function to play sounds
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function() {
    this.sound.play();
  }
  this.stop = function() {
    this.sound.pause();
  }
}

//function to process movement of game piece
function movement() {
  //clearing piece speed to default value
  // myGamePiece.speedX = 0;
  // myGamePiece.speedY = 0;
  //check for changes in piece movement
  if (myGameArea.keys && myGameArea.keys[37] && myGamePiece.speedX == 0) {
    myGamePiece.speedX = -(myGamePiece.width); // left
    myGamePiece.speedY = 0;
  }
  else if (myGameArea.keys && myGameArea.keys[38] && myGamePiece.speedY == 0) {
    myGamePiece.speedY = -(myGamePiece.width); // up
    myGamePiece.speedX = 0;
  }
  else if (myGameArea.keys && myGameArea.keys[39] && myGamePiece.speedX == 0) {
    myGamePiece.speedX = (myGamePiece.width); // right
    myGamePiece.speedY = 0;
  }
  else if (myGameArea.keys && myGameArea.keys[40] && myGamePiece.speedY == 0) {
    myGamePiece.speedY = (myGamePiece.width); // down
    myGamePiece.speedX = 0;
  }
}

//function to spawn food for the snake
function spawnFood() {
  var x = 30 * Math.floor(Math.random() * 44); // change it based on canvas width
  var y = 30 * Math.floor(Math.random() * 21); // change it based on canvas height
  if(x == myGamePiece.x && y == myGamePiece.y) { spawnFood();}
  for(i = 0;i < tail.length; i++) {
    if(x == tail[i].x && y == tail[i].y) {
      spawnFood();
    }
  }
  food.x = x;
  food.y = y;
  food.update();
}

//function to find new pos of snake's body
function tailPos() {
    for(i = tail.length - 1;i >= 0; i--) {
      if(i == 0) {
        tail[i].x = myGamePiece.x;
        tail[i].y = myGamePiece.y;
      }
      else {
        tail[i].x = tail[i-1].x;
        tail[i].y = tail[i-1].y;
      }
    }
  }

//function to call tail update (called every 20ms)
function tailUpdate() {
  for(i = tail.length - 1;i >= 0; i--) {
    tail[i].update();
  }
}

////////////////////called every 500ms//////////////////////////////////////////
//function to update position of snake
function updatePosition() {
  tailPos();
  myGamePiece.newPos(); //calculate new position
}

////////////////////called every 20ms///////////////////////////////////////////
//function to clear and update gamearea
function updateGameArea() {
  //check for collisions with snake body
  for(i = 0;i < tail.length; i++) {
    myGamePiece.crashWith(tail[i]);
  }
  //clearing game area to avoid after images
  myGameArea.clear();
  //Game Piece update
  food.crashWith(myGamePiece);
  movement(); //updating movement of game piece
  tailUpdate();
  myGamePiece.update(); //update the game piece on screen
  food.update();
}
