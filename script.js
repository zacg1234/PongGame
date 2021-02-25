const BALLOBJ = document.getElementById("ball");
const PLAYERPADDLEOBJ = document.getElementById("player-paddle");
const BOTPADDLEOBJ = document.getElementById("bot-paddle");
const PlAYAREAOBJ = document.getElementById("play-area");
const MARKER = document.getElementById("marker");
const MESSAGE = document.getElementById("message");
const PLYRSCORE = document.getElementById("player-score");
const COMPSCORE = document.getElementById("computer-score");
const LIVES = document.getElementById("lives");

var playAreaWidth = PlAYAREAOBJ.clientWidth;
var playAreaHeight = PlAYAREAOBJ.clientHeight;
console.log("playAreaWidth: " + playAreaWidth + " playAreaHeight: " + playAreaHeight )

var playAreaWidthPercent = playAreaWidth / 100;
var playAreaHeightPercent = playAreaHeight / 100;

//current mouse position
var mouseX;

var playerPaddleX = (42 * playAreaWidthPercent); 
PLAYERPADDLEOBJ.style.left = playerPaddleX;

var botPaddleX = (42 * playAreaWidthPercent);
BOTPADDLEOBJ.style.left = botPaddleX;


// game dynamics 
var botPaddleSpeed = 1.25;
//2.5;

var playerPaddleSpeed = 10;

var level = 1;

var lives = 3;

var plyrScore = 0;

var compScore = 0;

// hypotenuse 
var initSpeed = 5;

//initial angle of the ball
var initAngle = Math.floor(Math.random() * -131) - 20; 

// change in X and Y of the ball to achieve proper trajectory
var deltaY = Math.sin(Math.PI * initAngle / 180) * initSpeed;
var deltaX = Math.cos(Math.PI * initAngle / 180) * initSpeed;

// curent X and Y postion of the ball 
var ballXPosition = Math.abs(49 * playAreaWidthPercent);
var ballYPosition = Math.abs(70 * playAreaHeightPercent);

// the interval timer that moves the ball
var myIntervalTimer;

// the interval timer that moves the player paddle
var playerPaddleMovementTimer;

// the interval timer that flashes the messages
var messageFlash;
var message = "PRESS SPACE TO BEGIN";
MESSAGE.style.left = "10vw"

// was an arrow key pressed
var pressed = false;

// has the game reset
var gameReset = true;

//BALLOBJ.addEventListener("click", startBall);

window.addEventListener("load", setMessage)
window.addEventListener("keydown", registerButtonPress);
window.addEventListener("keyup", stopMovement);


function setMessage(){
    clearInterval(messageFlash);
    MESSAGE.innerText = message;
    messageFlash = setInterval(function(){
        if(MESSAGE.style.display == "none"){
            MESSAGE.style.display ="inline";
        }
        else{
            setTimeout(() => { MESSAGE.style.display = "none" ; }, 600);
        }
    }, 1000);
}
        // starts the game and handles player paddel movement 
function registerButtonPress(event){
    if(event.code === "Space" && gameReset == true){
        clearInterval(messageFlash);
        MESSAGE.style.display = "none"
        startBall();
        gameReset = false;
    }

    if (!event.repeat && playerPaddleMovementTimer == 0) {
        if(pressed == true){
            clearInterval(playerPaddleMovementTimer);
        }  
            // Move the playerPaddle right
        if(event.code === "KeyD" || event.code === "ArrowRight" && gameReset == false){
            playerPaddleMovementTimer = setInterval(function(){
                playerPaddleX = playerPaddleX + playerPaddleSpeed;
                PLAYERPADDLEOBJ.style.left = playerPaddleX;
                if (playerPaddleX > (playAreaWidthPercent * 82.5)){clearInterval(playerPaddleMovementTimer);}
            }, 10)
        }
                // Move the playerPaddle left
        if(event.code === "KeyA" || event.code === "ArrowLeft" && gameReset == false){
            playerPaddleMovementTimer = setInterval(function(){
                playerPaddleX = playerPaddleX - playerPaddleSpeed;
                PLAYERPADDLEOBJ.style.left = playerPaddleX;
                if (playerPaddleX < (playAreaWidthPercent * 1.4)){clearInterval(playerPaddleMovementTimer);}
            }, 10)
        }
        pressed = true;
    };
}

// helper function for player paddle movement
function stopMovement(event){
    clearInterval(playerPaddleMovementTimer); 
    playerPaddleMovementTimer = 0; 
    pressed = false;
}

function startBall(){
    initAngle = Math.floor(Math.random() * -131) - 20;
    deltaY = Math.sin(Math.PI * initAngle / 180) * initSpeed;
    deltaX = Math.cos(Math.PI * initAngle / 180) * initSpeed;
    PlAYAREAOBJ.style.cursor = "none";
    myIntervalTimer = setInterval(startBallMovement, 5);
};
                    // TODO: MIGHT WANT TO PUT "STARTBALLMOVEMENT" DIRECTLY INTO "STSRTBALL"
function startBallMovement(){
    BALLOBJ.style.bottom = ballYPosition;
    BALLOBJ.style.left = ballXPosition;
    ballXPosition = ballXPosition + (deltaX * playAreaWidth/1000);
    ballYPosition = ballYPosition  + (deltaY * playAreaWidth/1000);
            /* setMarkerPosition(0, 0)
            console.log("x: " + ballXPosition + "  y: " + ballYPosition + "  playHeight: " 
            + playAreaHeight  + "  playWidth: " + playAreaWidth + "  paddleLocation: " + playerPaddleX 
            + " deltaX: " + deltaX); */
    moveBotPaddle();
    bounceTheBall();
};

function moveBotPaddle(){
    //doubles the speed
        for(let i = 0; i < 2; i++ ){
            //if the ball is to the right of the paddle
            if(ballXPosition > (botPaddleX + (8 * playAreaWidthPercent)) 
            && botPaddleX < (83 * playAreaWidthPercent)){
                botPaddleX = botPaddleX + botPaddleSpeed + (Math.floor(Math.random() * 2) - 1);
            };
            //if the ball is to the left of the paddle
            if(ballXPosition < (botPaddleX + (8 * playAreaWidthPercent)) 
            && botPaddleX > (0.5 * playAreaWidthPercent)){
                botPaddleX = botPaddleX - botPaddleSpeed + (Math.floor(Math.random() * 2) - 1);
            };
            BOTPADDLEOBJ.style.left = botPaddleX;
        }
    }
                                            // ***    bounces the ball   *** 
function bounceTheBall(){
    //when the ball hits the player's paddle
            // top of paddle
    if(ballYPosition <  (7 * playAreaHeightPercent) 
    && ballYPosition > (6 * playAreaHeightPercent)
    && ballXPosition > (playerPaddleX - (playAreaWidthPercent * 2))  // left edge of paddle
    && ballXPosition < playerPaddleX + (playAreaWidthPercent * 18)){ // right edge of paddle
                // left edge boost
        if(ballXPosition < playerPaddleX + (playAreaWidthPercent * 7.9) && deltaX > -6){
            deltaX = deltaX - 1;
        };
                // right edge boost
        if(ballXPosition > playerPaddleX + (playAreaWidthPercent * 8) && deltaX < 6){
            deltaX = deltaX + 1;
        };
        deltaY = -deltaY;
    };
    //when the ball hits the bots's paddle
            // top of paddle
    if(ballYPosition <  (89 * playAreaHeightPercent) 
    && ballYPosition > (88 * playAreaHeightPercent)
            // left edge of paddle
    && ballXPosition > (botPaddleX - (playAreaWidthPercent * 1.5)) 
            // right edge of paddle
    && ballXPosition < botPaddleX + (playAreaWidthPercent * 17)){
        deltaY = -deltaY;
    };
    //when ball touches sides
    if(ballXPosition > playAreaWidth - 2 * playAreaWidthPercent 
    || ballXPosition < (0.75 * playAreaWidthPercent)){
        deltaX = -deltaX;
    }
    //when the player wins
    if(ballYPosition > (playAreaHeight + playAreaHeightPercent * 5)){
        resetTheGame(1);
    } 
    // when the comp wins
    if(ballYPosition < (-10 * playAreaHeightPercent) ){
       resetTheGame(-1);
    }
}





function resetTheGame(winner){
    clearInterval(myIntervalTimer);
    gameReset = true;
        // reset the ball
    ballXPosition = Math.abs(49 * playAreaWidthPercent);
    ballYPosition = Math.abs(70 * playAreaHeightPercent);
    BALLOBJ.style.bottom = ballYPosition;
    BALLOBJ.style.left = ballXPosition;
        // reset the player paddle
    playerPaddleX = (42 * playAreaWidthPercent); 
    PLAYERPADDLEOBJ.style.left = playerPaddleX;
        // reset the bot paddle
    botPaddleX = (42 * playAreaWidthPercent);
    BOTPADDLEOBJ.style.left = botPaddleX;
    // player scores;
    if(winner > 0){
        ++plyrScore;
        PLYRSCORE.innerText = plyrScore;
        if((plyrScore % 3) == 0){
            ++lives;
            LIVES.innerText = lives;
            changeColors();
        }
    }
    // comp scores
    if(winner < 0){
        ++compScore;
        COMPSCORE.innerText = compScore;
        --lives;
        LIVES.innerText = lives;
    }
    if(lives > 0){
        MESSAGE.style.display = "";
        setMessage();
    }
    else{
        PlAYAREAOBJ.style.cursor = "auto";
        message = "GAME OVER"
        MESSAGE.style.left = "31vw"
        setMessage();
        window.removeEventListener("keydown", registerButtonPress);
    }
}


function changeColors(){
    switch(level){
        case 0:
            PlAYAREAOBJ.style.backgroundColor = "rgb(64, 69, 62)"
            PlAYAREAOBJ.style.boxShadow = "0px 0px 20px 1px rgb(195, 235, 190)"
            PLAYERPADDLEOBJ.style.backgroundColor = "rgb(188, 203, 189)"
            BOTPADDLEOBJ.style.backgroundColor = "rgb(188, 203, 189)"
            BALLOBJ.style.backgroundColor = "rgb(188, 203, 189)"
        break;
        case 1:
            PlAYAREAOBJ.style.backgroundColor = "rgb(69, 62, 62)"
            PlAYAREAOBJ.style.boxShadow = "0px 0px 20px 1px rgb(235, 190, 190)"
            PLAYERPADDLEOBJ.style.backgroundColor = "rgb(203, 188, 188)"
            BOTPADDLEOBJ.style.backgroundColor = "rgb(203, 188, 188)"
            BALLOBJ.style.backgroundColor = "rgb(203, 188, 188)"
            initSpeed = initSpeed + 2;
            ++botPaddleSpeed;
        break;
        case 2:
            PlAYAREAOBJ.style.backgroundColor = "rgb(62, 62, 69)"
            PlAYAREAOBJ.style.boxShadow = "0px 0px 20px 1px rgb(190, 190, 235)"
            PLAYERPADDLEOBJ.style.backgroundColor = "rgb(189, 188, 203)"
            BOTPADDLEOBJ.style.backgroundColor = "rgb(189, 188, 203)"
            BALLOBJ.style.backgroundColor = "rgb(189, 188, 203)"
            initSpeed = initSpeed + 2;
            ++botPaddleSpeed;
        break;
        case 3:
            PlAYAREAOBJ.style.backgroundColor = "rgb(4, 12, 1)"
            PlAYAREAOBJ.style.boxShadow = "0px 0px 20px 1px rgb(227, 240, 227)"
            PLAYERPADDLEOBJ.style.backgroundColor = "rgb(240, 255, 240)"
            BOTPADDLEOBJ.style.backgroundColor = "rgb(240, 255, 240)"
            BALLOBJ.style.backgroundColor = "rgb(240, 255, 240)"
            initSpeed = initSpeed + 2;
            ++botPaddleSpeed;
        break;
        case 4:
            PlAYAREAOBJ.style.backgroundColor = "rgb(249, 249, 249)"
            PlAYAREAOBJ.style.boxShadow = "0px 0px 20px 1px rgb(227, 240, 227)"
            PLAYERPADDLEOBJ.style.backgroundColor = "rgb(166, 197, 237)"
            BOTPADDLEOBJ.style.backgroundColor = "rgb(166, 197, 237)"
            BALLOBJ.style.backgroundColor = "rgb(166, 197, 237)"
            initSpeed = initSpeed + 2;
            ++botPaddleSpeed;
            level = 1;
        break;
    }
    if(level < 4){++level;}
    else if (level == 4){level = 0;}
}
  
function setMarkerPosition(x, y){
    MARKER.style.bottom = y;
    MARKER.style.left = x;
}

// make the player paddle move based on buttons
// make the score board
// make the speeds increase
// add mobile paddle functionality
// add a color change 
// add score
// add sound

/*
1)
    background: rgb(64, 69, 62);
    paddles:  rgb(188, 203, 189);
    shaddow: 0px 0px 20px 1px rgb(195, 235, 190);

2)
    background: rgb(69, 62, 62);
    paddles: rgb(203, 188, 188);
    shaddow: 0px 0px 20px 1px rgb(235, 190, 190);

3)
    background: rgb(62, 62, 69);
    paddles: rgb(189, 188, 203);
    shaddow: 0px 0px 20px 1px rgb(190, 190, 235);

4)
    background:  rgb(4, 12, 1);
    paddles:  rgb(240, 255, 240);
    shaddow: 0px 0px 20px 1px rgb(227, 240, 227);

5)
    background: rgb(249, 249, 249);
    paddles: rgb(166, 197, 237);
    shaddow: 0px 0px 20px 1px rgb(227, 240, 227);

*/