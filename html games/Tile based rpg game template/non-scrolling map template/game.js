// Player settings
var myGamePiece;
var playerSpeed = 6; // set player speed
// Map settings
var myJson; // to store json file data
var layers = []; // to store the map data
var objects = [];
var tileSetImg = new Image(); // to store the tileset image
var tileCol; // number of tile columns in tileset image
var tileW; // width of a tile
var tileH; // height of a tile
var mapW; // width of the map in tiles
var mapH; // height of the map in tiles

/////////////////////////////////////////////////////////////////////////////////

//fetching the json file and the required data
fetch("level1.json").then(function(res) {
  return res.json();
}).then(function(data) {
  myJson = data;
  for(var i = 0; i < 2; i++) {
    layers.push(myJson.layers[i].data);
  }
  objects = myJson.layers[2].objects;
  tileSetImg.src = myJson.tilesets[0].image;
  tileCol = myJson.tilesets[0].columns;
  tileW = myJson.tilesets[0].tilewidth;
  tileH = myJson.tilesets[0].tileheight;
  mapW = myJson.width;
  mapH = myJson.height;
});

/////////////////////////////////////////////////////////////////////////////////

//function to start game
function startGame() {
  myGameArea.start();
  myGamePiece = new component(32, 32, "red", 322, 226);
  myCamera = new camera();
}

// creating game area
var myGameArea = {
  canvas: document.getElementById("myCanvas"),
  start: function() {
    //this.canvas.width = 640;
    //this.canvas.height = 640;
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
function component(width, height, color, x, y) {
  //get features of our component
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.crash = false;
  this.update = function() { //update component on screen
    ctx = myGameArea.context; //access content of canvas
    ctx.fillStyle = color; //choosing color for content
    ctx.fillRect(this.x, this.y, this.width, this.height); //display the component with the dimensions and location
  }
  this.newPos = function() { //finding new position of component
    this.x += this.speedX; //adding speed in the direction of movement accordingly
    this.y += this.speedY;
    this.centerx = (this.x + this.width) / 2;
    this.centery = (this.y + this.height) / 2;
  }
  this.rightPos = function() {
    this.x += this.speedX;
  }
  this.leftPos = function() {
    this.x += this.speedX;
  }
  this.upPos = function() {
    this.y += this.speedY;
  }
  this.downPos = function() {
    this.y += this.speedY;
  }
  this.crashWith = function(xCam, yCam, x, y, width, height) {
    var myleft = xCam + this.x;
    var myright = xCam + this.x + (this.width);
    var mytop = yCam + this.y;
    var mybottom = yCam + this.y + (this.height);
    var otherleft = x;
    var otherright = x + width;
    var othertop = y;
    var otherbottom = y + height;
    this.crash = false;
    if ((mybottom>othertop&&mytop<otherbottom) && (myright > otherleft && myright < otherright)&&(this.speedX!=0))        {this.x = (otherleft - this.width) - xCam; this.crash = true;} // left to right
    else if ((mybottom>othertop&&mytop<otherbottom) && (myleft < otherright && myleft > otherleft)&&(this.speedX!=0))     {this.x = otherright - xCam; this.crash = true;} // right to left
    else if ((myright>otherleft&&myleft<otherright) && (mybottom > othertop && mybottom < otherbottom)&&(this.speedY!=0)) {this.y = (othertop - this.height) - yCam; this.crash = true;} // top to bottom
    else if ((myright>otherleft&&myleft<otherright) && (mytop < otherbottom && mytop > othertop)&&(this.speedY!=0))       {this.y = otherbottom - yCam; this.crash = true;} // bottom to top
  }
}

//function to process movement of game piece
function movement() {
  //clearing piece speed to default value
  myGamePiece.speedX = 0;
  myGamePiece.speedY = 0;
  //check for changes in piece movement
  if (myGameArea.keys && myGameArea.keys[37]) {
    myGamePiece.speedX = -playerSpeed;
  }
  else if (myGameArea.keys && myGameArea.keys[38]) {
    myGamePiece.speedY = -playerSpeed;
  }
  else if (myGameArea.keys && myGameArea.keys[39]) {
    myGamePiece.speedX = playerSpeed;
  }
  else if (myGameArea.keys && myGameArea.keys[40]) {
    myGamePiece.speedY = playerSpeed;
  }
  // if(myGamePiece.speedX != 0 && myGamePiece.speedY != 0) {
  //   myGamePiece.speedX *= 0.707;
  //   myGamePiece.speedY *= 0.707;
  // }
}

//function to implement camera
function camera() {
  this.x = 0;
  this.y = 0;
  this.width = myGameArea.canvas.width;
  this.height = myGameArea.canvas.height;
  this.toggleRight = true;
  this.toggleLeft = true;
  this.toggleUp = true;
  this.toggleDown = true;
  this.newPos = function() {
    this.x += (myGamePiece.speedX * 0.5);
    this.y += (myGamePiece.speedY * 0.5);
    if(this.x < 0) {this.x = 0; this.toggleLeft = false;}
    if(this.y < 0) {this.y = 0; this.toggleUp = false;}
    if(this.x + this.width > mapW * tileW) {this.x = (mapW * tileW) - this.width; this.toggleRight = false;}
    if(this.y + this.height > mapH * tileH) {this.y = (mapH * tileH) - this.height; this.toggleDown = false;}
  }
}

//function to clear and update gamearea
function updateGameArea() {

  // //checking collisions with objects
  for(var i=0; i<objects.length; i++) {
    myGamePiece.crashWith(myCamera.x, myCamera.y, objects[i].x, objects[i].y, objects[i].width, objects[i].height);
  }

  //clearing game area to avoid after images
  myGameArea.clear();

  //rendering the map
  rendermap(myGameArea.context);

  //updating movement of game piece
  movement();

  // non-scrolling camera movement
  if(myGamePiece.x > myCamera.width) {myCamera.x += myCamera.width; myGamePiece.x = 0;}
  if(myGamePiece.x + myGamePiece.width < 0) {myCamera.x -= myCamera.width; myGamePiece.x = myCamera.width - myGamePiece.width;}
  if(myGamePiece.y > myCamera.height) {myCamera.y += myCamera.height; myGamePiece.y = 0;}
  if(myGamePiece.y + myGamePiece.height < 0) {myCamera.y -= myCamera.height; myGamePiece.y = myCamera.height - myGamePiece.height;}

  myGamePiece.newPos();

  //updating gamepiece
  myGamePiece.update(); //update the game piece on screen
}

//////////////////////////////////////////////////////////////////////////////////

//function to render a tile
function rendertile(tileId, x, y, ctx) {
  if(tileId == -1) {return;}
  var sx = (tileId % tileCol) * tileW;
  var sy = ~~(tileId / tileCol) * tileH;
  ctx.drawImage(tileSetImg, sx, sy, tileW, tileH, x, y, tileW, tileH);
  return;
}

//function to render a map
function rendermap(ctx) {
  for(var layer = 0; layer < layers.length; layer++) {
    var x=-myCamera.x, y=-myCamera.y, count=1;
    for(var tile = 0; tile < layers[layer].length; tile++, x=x+tileW, count++) {
      if(count == (mapW+1)) {
        x = -myCamera.x;
        y = y + tileH;
        count = 1;
      }
      rendertile(layers[layer][tile] - 1, x, y, ctx);
    }
  }
}
