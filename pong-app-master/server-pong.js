//variable definition section
var updateFunctionIds = [];
var timerToStartIntervalId = 0;
const initialSpeed = 0.5;
const winningScore = 11;
const statusBroadcastPerSecond = 50;
const upatesPerSecond = 500;





"use strict";
// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'node-pong';
// Port where we'll run the websocket server
const PORT = process.env.PORT || 3000;
const fs = require('fs')

// websocket and http servers
var webSocketServer = require('websocket').server;
var http = require('http');
var connections = [];
var server = http.createServer(function (request, response) {
  //send the frontend app
  response.writeHead(200, { 'content-type': 'text/html' })
  fs.createReadStream('index.html').pipe(response)
});
server.listen(PORT, function () {
  console.log((new Date()) + " Server is listening on port "
    + PORT);
});
/**
 * WebSocket server
 */
var wsServer = new webSocketServer({

  // WebSocket server is tied to a HTTP server. WebSocket
  // request is just an enhanced HTTP request. For more info 
  // http://tools.ietf.org/html/rfc6455#page-6
  httpServer: server
});

// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function (request) {
  console.log((new Date()) + ' Connection from origin '
    + request.origin + '.');
  // accept connection - you should check 'request.origin' to
  // make sure that client is connecting from your website
  // (http://en.wikipedia.org/wiki/Same_origin_policy)
  //if(request.origin == 'the site of the react app')
  if (connections.length < 2) {
    var connection = request.accept(null, request.origin);
  }
  else {
    request.reject(403, 'Too many connections connected');
  }
  // we need to know client index to remove them on 'close' event
  var index = connections.push(connection) - 1;
  console.log((new Date()) + ' Connection accepted with ' + request.origin);
  // send back chat history
  var playerPosition = index == 0 ? 'l' : 'r';
  connection.sendUTF(
    JSON.stringify({
      playerPosition: playerPosition
    }));

  // user sent its status
  connection.on('message', function (message) {
    if (message.type === 'utf8') { // accept only text
      var messageObject = JSON.parse(message.utf8Data);
      if (messageObject.user != undefined && messageObject.user != null) {
        movePaddle(messageObject.user);
      }
      if (messageObject.keyboardCommand != undefined && messageObject.keyboardCommand != null) {
        if (messageObject.keyboardCommand == 'esc') {
          if (cvs.resuming == false) {
            if (cvs.paused == true) {
              startGame();
            }
            else {
              stopGame();
            }
          }
        }
        else if (messageObject.keyboardCommand == 'reset') {
          resetGame();
        }
      }
    }
  });
  // user disconnected
  connection.on('close', function (connection) {
    // remove user from the list of connected clients
    for (var i = 0; i < connections.length; i++) {
      if (connections[i].state == 'closing' || connections[i].state == 'closed') {
        connections.splice(i, 1);
        stopGame();
        cvs.connecting = true;
      }
    }
  });
  if (connections.length == 2) {
    cvs.connecting = false;
    resetGame();
  }
  if (connections.length == 1) {
    cvs.connecting = true;
  }
});

function sendStatus() {
  var json = JSON.stringify(context);
  for (var i = 0; i < connections.length; i++) {
    connections[i].sendUTF(json);
  }
}

//PONG logic and physics
//select canvas
const cvs = {
  width: 600,
  height: 400,
  paused: false,
  timeRemaining: 3,
  resuming: false,
  connecting: true
}

// create yhe userL paddle
const userL = {
  x: 0,
  y: cvs.height / 2 - 100 / 2,
  width: 10,
  height: 100,
  color: "WHITE",
  score: 0
}
const userR = {
  x: cvs.width - 10,
  y: cvs.height / 2 - 100 / 2,
  width: 10,
  height: 100,
  score: 0
}
//create the ball
const ball = {
  x: cvs.width / 2,
  y: cvs.height / 2,
  radius: 10,
  speed: initialSpeed,
  velocityX: initialSpeed / 1.4,
  velocityY: initialSpeed / 1.4,
  color: 'white'
}

const context = {
  cvs: cvs,
  userL: userL,
  userR: userR,
  ball: ball
}


//collision detection
function collision(b, p) {

  b.top = b.y - b.radius;
  b.bottom = b.y + b.radius;
  b.right = b.x + b.radius;
  b.left = b.x - b.radius;

  p.top = p.y;
  p.bottom = p.y + p.height;
  p.left = p.x;
  p.right = p.x + p.width;

  return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;

}

//control the userL paddle;

function movePaddle(user) {
  if (user.pos == 'l') {
    userL.y = user.y;
  }
  else {
    userR.y = user.y
  }
}

//reset ball
function resetBall() {
  ball.x = cvs.width / 2;
  ball.y = cvs.height / 2;
  ball.velocityX = -ball.velocityX * (initialSpeed / ball.speed);
  ball.velocityY = -ball.velocityY * (initialSpeed / ball.speed);
  ball.speed = initialSpeed;
}

// update : pos, movement, score, ...
function update() {
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;



  if (ball.y + ball.radius > cvs.height || ball.y - ball.radius < 0) {
    ball.velocityY = -ball.velocityY;
  }
  let player = (ball.x < cvs.width / 2) ? userL : userR;

  if (collision(ball, player)) {
    //where the ball hit the player
    let collidePoint = ball.y - (player.y + player.height / 2);

    //normalilization
    collidePoint = collidePoint / (player.height / 2);

    //calculate angle in Radian
    let angleRad = collidePoint * Math.PI / 4;

    //x direction of the ball when it'a hit
    let direction = (ball.x < cvs.width / 2) ? 1 : -1;

    //change vel X and Y
    ball.velocityX = direction * ball.speed * Math.cos(angleRad);
    ball.velocityY = direction * ball.speed * Math.sin(angleRad);

    //everytime the ball hit a paddle, we encrese iys speed
    ball.speed += initialSpeed / 10;
  }
  //update the score
  if (ball.x - ball.radius < 0) {
    // the userR win
    userR.score++;
    resetBall();
    if (userR.score > winningScore) {
      gameOver('R');
    }
  } else if (ball.x + ball.radius > cvs.width) {
    //the userL win
    userL.score++;
    resetBall();
    if (userL.score > winningScore) {
      gameOver('L');
    }
  }
}

setInterval(sendStatus, 1000 / statusBroadcastPerSecond);

//loop
function startGame() {
  cvs.resuming = true;
  cvs.paused = false;
  cvs.gameOver = false;
  cvs.timeRemaining = 3;
  timerToStartIntervalId = setInterval(function () {
    if (cvs.timeRemaining > 0) {
      cvs.timeRemaining--;
    }
    else {
      clearInterval(timerToStartIntervalId);
      cvs.resuming = false;
      var updateFunctionId = setInterval(update, 1000 / upatesPerSecond);
      updateFunctionIds.push(updateFunctionId)
    }
  }, 1000);



}

function stopGame() {
  cvs.paused = true;
  for (var i = 0; i < updateFunctionIds.length; i++) {
    clearInterval(updateFunctionIds[i]);
  }
  updateFunctionIds = [];
}

function resetGame() {
  stopGame();
  resetBall();
  userL.score = 0;
  userR.score = 0;
  startGame();
}

function gameOver(player) {
  stopGame();
  cvs.gameOver = true;
  cvs.gameOverMessage = 'Player ' + player + ' won';
}
