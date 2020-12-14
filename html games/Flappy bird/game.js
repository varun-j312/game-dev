var myGamePiece;
var myObstacles = [];
var myScore;
var myBackground;
var myClouds;
var mySound;
var myMusic;

//function to start game
function startGame() {
  myGameArea.start();
  myGamePiece = new component(30, 30, "flapUp.png", 10, 120, "image");
  myScore = new component("30px", "Consolas", "black", 280, 40, "text");
  myBackground = new component(480, 270, "background.png", 0, 0, "image");
  myClouds = new component(480, 270, "clouds.png", 0, 0, "clouds");
  mySound = new sound("crash.ogg");
  // myMusic = new sound("gametheme.ogg");
  // myMusic.play();
}

// creating game area
var myGameArea = {
  canvas: document.createElement("canvas"),
  start: function() {
    this.canvas.width = 480;
    this.canvas.height = 270;
    this.context = this.canvas.getContext("2d"); //access content of canvas
    document.body.insertBefore(this.canvas, document.body.childNodes[0]); //insert game area into body of page
    this.frameNo = 0;
    this.interval = setInterval(updateGameArea, 20); //update gamearea every 20ms
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
  }
}

//function to count to certain number of frames in a given interval
function everyinterval(n) {
  if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
  return false
}

//function to play sounds
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload","auto");
  this.sound.setAttribute("controls","none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function() {
    this.sound.play();
  }
  this.stop = function() {
    this.sound.pause();
  }
}

//function for game component
function component(width, height, color, x, y, type) {
  //get features of our component
  this.type = type;
  if (this.type == "image" || this.type == "clouds") {
    this.image = new Image();
    this.image.src = color;
  }
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.gravity = 0.05;
  this.gravitySpeed = 0;
  this.update = function() { //update component on screen
    ctx = myGameArea.context; //access content of canvas
    if(this.type == "text") {
      ctx.font = this.width + " " + this.height;
      ctx.fillStyle = color;
      ctx.fillText(this.text, this.x, this.y);
    }
    else if (this.type == "image" || this.type == "clouds") {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      if(this.type == "clouds") {
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
      }
    }
    else {
      ctx.fillStyle = color; //choosing color for content
      ctx.fillRect(this.x, this.y, this.width, this.height); //display the component with the dimensions and location
    }
  }
  this.newPos = function() { //finding new position of component
    this.gravitySpeed += this.gravity;
    this.x += this.speedX; //adding speed in the direction of movement accordingly
    if(this.type == "image") {
      this.y += this.speedY + this.gravitySpeed;
    }
    //this.y += this.speedY;
    if(this.type == "clouds") {
      if(this.x == -(this.width)) {
        this.x = 0;
      }
    }
  }
  this.crashWith = function(otherobj) {
    //noting all sides of both piece and obstacle
    var myleft = this.x;
    var myright = this.x + (this.width);
    var mytop = this.y;
    var mybottom = this.y + (this.height);
    var otherleft = otherobj.x;
    var otherright = otherobj.x + (otherobj.width);
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
    var crash = true;
    if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
      crash = false;
    }
    return crash;
  }
}

//function to process movement of game piece
function movement() {
  //clearing piece speed to default value
  myGamePiece.speedX = 0;
  myGamePiece.speedY = 0;
  accelerate(0.1);
  //check for changes in piece movement
  if (myGameArea.keys && myGameArea.keys[37]) {
    //myGamePiece.speedX = -1;
    myGamePiece.image.src = "flapDown.png";
    accelerate(-0.2);
  }
  if (myGameArea.keys && myGameArea.keys[38]) {
    //myGamePiece.speedY = -1;
    myGamePiece.image.src = "flapDown.png";
    accelerate(-0.2);
  }
  if (myGameArea.keys && myGameArea.keys[39]) {
    //myGamePiece.speedX = 1;
    myGamePiece.image.src = "flapDown.png";
    accelerate(-0.2);
  }
  if (myGameArea.keys && myGameArea.keys[40]) {
    //myGamePiece.speedY = 1;
    myGamePiece.image.src = "flapDown.png";
    accelerate(-0.2);
  }
}

//function to accelerate piece upwards
function accelerate(n) {
  myGamePiece.gravity = n;
}

//function to clear and update gamearea
function updateGameArea() {
  //see if piece crashes into any obstacles
  for (i = 0; i < myObstacles.length; i++) {
    if (myGamePiece.crashWith(myObstacles[i])) {
      mySound.play();
      myGameArea.stop();
      return;
    }
  }
  //clearing game area to avoid after images
  myGameArea.clear();
  //Background update
  myBackground.update();
  myClouds.speedX = -0.25;
  myClouds.newPos();
  myClouds.update();
  //adding new obstacles every ginven interval
  var x, y;
  myGameArea.frameNo += 1;
  if(myGameArea.frameNo == 1 || everyinterval(150)) {
    x = myGameArea.canvas.width;
    minHeight = 20;
    maxHeight = 200;
    height = Math.floor((Math.random() * (maxHeight - minHeight)) + minHeight);
    minGap = 50;
    maxGap = 200;
    gap = Math.floor((Math.random() * (maxGap - minGap)) + minGap);
    myObstacles.push(new component(10, height, "brown", x, 0));
    myObstacles.push(new component(10, x - height - gap, "brown", x, height + gap));
  }
  //GameObstacles update
  for(i = 0; i < myObstacles.length; i++) {
    myObstacles[i].x -= 1;
    myObstacles[i].update();
  }
  myScore.text = "SCORE:" + myGameArea.frameNo;
  myScore.update();
  myGamePiece.image.src = "flapUp.png";
  //Game Piece update
  movement(); //updating movement of game piece
  myGamePiece.newPos(); //calculate new position
  myGamePiece.update(); //update the game piece on screen
}
