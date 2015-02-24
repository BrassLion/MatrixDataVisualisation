
//var s = window.screen;
//var width = topCanvas.width = s.width;
//var height = topCanvas.height;

//    var yPositions = Array(300).join(0).split('');
var codeLines = [];

var ctx = bottomCanvas.getContext('2d');
var topCtx = topCanvas.getContext('2d');

var codeColumnWidth = 20;
var codeRowWidth = 20;
var codeRowOverflow = 40;

var canvasWidth = window.screen.width;
var canvasHeight = 800;

var infectionRadius = 10;

var isSaveToDiskActive = false;

var dataIn = [];
var dataOut = [];
var codeMaxSpeed;
var codeMinSpeed;
var codeSlowestUpdateInterval = 100;

function init() {
    topCanvas.width = canvasWidth;
    topCanvas.height = canvasHeight;
    bottomCanvas.width = canvasWidth;
    bottomCanvas.height = canvasHeight;
    compCanvas.width = canvasWidth;
    compCanvas.height = canvasHeight;
    
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    //add inbound data
    //normalise data
    dataIn.sort(function(a, b) {
                    return b - a;
                  });
    codeMaxSpeed = dataIn[0];
    codeMinSpeed = dataIn[dataIn.length - 1]; 
    
    //add codelines
    for(var i in dataIn) {
        addMatrixCodeLine(i, 0, (dataIn[i] - codeMinSpeed) / (codeMaxSpeed - codeMinSpeed), false );
    }
    
    //add outbound data
    //normalise data
    
    dataOut.sort(function(a, b) {
                    return b - a;
                  });
    codeMaxSpeed = Math.max(dataOut[0], codeMaxSpeed);
    codeMinSpeed = Math.min(dataOut[dataOut.length - 1], codeMinSpeed); 
    
    //add codelines
    for(var i in dataOut) {
        addMatrixCodeLine(i, topCanvas.height / codeRowWidth, (dataOut[i] - codeMinSpeed) / (codeMaxSpeed - codeMinSpeed), true );
    }
}

function draw() {
    ctx.fillStyle = 'rgba(0,0,0,.05)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = '#FFF';
    ctx.font = topCtx.font = '10pt Georgia';
    
    //Wipe top canvas white letters
    topCtx.clearRect(0,0,canvasWidth,canvasHeight);

    for(var i in codeLines) {
       codeLines[i].draw();
    }
    
    if(isSaveToDiskActive) {
        var compCtx = compCanvas.getContext('2d');
        compCtx.drawImage(bottomCanvas, 0, 0);
        compCtx.drawImage(topCanvas, 0, 0);
        saveToDisk(compCanvas.toDataURL(), "png");
    }
}

function getDistBetweenCodeLines( line ) {
    
    var xPos = codeLinesX[line];
    var yPos = codeLinesY[line];
    
    var firstIndex = codeLinesX.indexOf(xPos - infectionRadius);
    var lastIndex = codeLinesX.lastIndexOf(xPos + infectionRadius);
    
    
    for(var i = firstIndex;i < lastIndex;i++) {
        
        if(Math.abs(codeLinesY[i] - yPos) < infectionRadius) {
            console.log("infected new line: " + i);
            codeLineInfected = true;
        }
    }
}

function addMatrixCodeLine(x, y, speed, outboundData) {
    
    var xPos = Math.round(x);
    var yPos = Math.round(y);
    
    var line = new codeLine(xPos, yPos, speed, outboundData);
    
    codeLines.push( line );
}

function addRandomMatrixCodeLines() {
    for(var i = 0; i < topCanvas.width / codeColumnWidth; i++ ) {
        addMatrixCodeLine(i, Math.random() * topCanvas.height / codeRowWidth );
    }
}

function RunMatrix()
{
    if (typeof Game_Interval != "undefined") clearInterval(Game_Interval);
    
    Game_Interval = setInterval(draw, 10);
}
function StopMatrix()
{
    clearInterval(Game_Interval);
}

$( document ).ready(function() {
    loadContentData( function() {
        init();
        draw();
        RunMatrix(); 
    });
});

$("button#pause").click(function () {
    StopMatrix();
});
$("button#play").click(function () {
    RunMatrix();
});
$("button#addCodeLines").click(function () {
    addRandomMatrixCodeLines();
});


$('#topCanvas').on('click', function(e){
      event = e;

    event = event || window.event;

    var canvas = document.getElementById('topCanvas'),
        x = event.pageX - canvas.offsetLeft,
        y = event.pageY - canvas.offsetTop;

    addMatrixCodeLine(x  / codeColumnWidth, y / codeRowWidth);
    codeLines[codeLines.length - 1].infect();
});