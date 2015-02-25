
//var s = window.screen;
//var width = topCanvas.width = s.width;
//var height = topCanvas.height;

//    var yPositions = Array(300).join(0).split('');
var codeLines = [];

var ctx = bottomCanvas.getContext('2d');
var topCtx = topCanvas.getContext('2d');

var codeColumnWidth = 40;
var codeRowWidth = 20;
var codeRowOverflow = 40;

var canvasWidth = window.screen.width;
var canvasHeight = 800;

var infectionRadius = 10;

var isSaveToDiskActive = true;

var dataType = [];
var data = [];
var badData = [];
var badDataType = [];
var dataColumn = [];
var currentDataIndex = [];
var lineSpeeds = [];
var lineLastUpdates = [];

var codeMaxSpeed = 1;
var codeMinSpeed = 1;
var codeSlowestUpdateInterval = 20;
var maxCodeLinesPerType = 50;
var badLineFrequency = 10;
var badLineFrequencyRandom = 0;
var timeSinceLastBadLine = [];

function init() {
    topCanvas.width = canvasWidth;
    topCanvas.height = canvasHeight;
    bottomCanvas.width = canvasWidth;
    bottomCanvas.height = canvasHeight;
    compCanvas.width = canvasWidth;
    compCanvas.height = canvasHeight;
    
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    //find data speed limits
    for(var i in data) {
        if(data[i].length > codeMaxSpeed) codeMaxSpeed = data[i].length;
        
        else if(data[i].length < codeMinSpeed) codeMinSpeed = data[i].length;
    }
    
    //add codelines
    for(var i in data) {
        var x = Math.round(Math.random() * topCanvas.width / codeColumnWidth);
        
        while(dataColumn.indexOf(x) !== -1) {
            x = Math.round(Math.random() * topCanvas.width / codeColumnWidth);
        }
        
//        var x = i;
        currentDataIndex.push(0);
        lineSpeeds.push(Math.round((1.0 - getDataSpeed(data[i].length) ) * codeSlowestUpdateInterval + 1));
        lineLastUpdates.push(0);
        dataColumn.push(x);

        addMatrixCodeLine(dataType[i], x);
    }
}

function draw() {
    ctx.fillStyle = 'rgba(0,0,0,.03)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = '#FFF';
    ctx.font = topCtx.font = '14pt Georgia';
    
    //Wipe top canvas white letters
    topCtx.clearRect(0,0,canvasWidth,canvasHeight);

    for(var i in codeLines) {
       codeLines[i].draw();
       lineLastUpdates[i]++;
    }
    
    //check if blank space available to add new line
    addNewLineIfRoom();
    
    if(isSaveToDiskActive) {
        var compCtx = compCanvas.getContext('2d');
        compCtx.drawImage(bottomCanvas, 0, 0);
        compCtx.drawImage(topCanvas, 0, 0);
        saveToDisk(compCanvas.toDataURL(), "png");
    }
}

function addNewLineIfRoom() {
    
    for(var i in dataType) {
        if(lineLastUpdates[i] > lineSpeeds[i] * 9) {
            lineLastUpdates[i] = 0;
            addMatrixCodeLine(dataType[i], dataColumn[i]);
        }
    }
}

function addMatrixCodeLine(name, x) {
    
    var badIndex = badDataType.indexOf(name);
    //add bad line if time
    if(badIndex !== -1) {
        
        if(timeSinceLastBadLine[badIndex] > badLineFrequency + badLineFrequencyRandom * Math.random()) {
            addBadMatrixCodeLine(name);
        
            timeSinceLastBadLine[badIndex] = 0;

            return;
        }
        
        timeSinceLastBadLine[badIndex]++;
    }
    
    
    ////////////////////////
    
    var typeIndex = dataType.indexOf(name);
    
    if(currentDataIndex[ typeIndex ] > data[typeIndex].length - 1) currentDataIndex[ typeIndex ] = 0;
    
    var lineIndex = currentDataIndex[ typeIndex ];
    var dataPiece = data[typeIndex][lineIndex];
    
    var xPos = Math.round(x);
    var yPos = dataPiece[2] === "DOWN" ? 0 : topCanvas.height / codeRowWidth;
    
    var line = new codeLine(xPos, yPos, name, getDataSpeed(data[typeIndex].length), dataPiece[0], dataPiece[1] * 1.5, dataPiece[2], dataPiece[3] );
    
    codeLines.push( line );
    
    currentDataIndex[ typeIndex ]++;
}

function addBadMatrixCodeLine(name) {
    
    var i = badDataType.indexOf(name);
    
    var dataPiece = badData[i];
    var typeIndex = dataType.indexOf(badDataType[i]);
    var x = dataColumn[typeIndex];
    
    var xPos = Math.round(x);
    var yPos = dataPiece[2] === "DOWN" ? 0 : topCanvas.height / codeRowWidth;
    
    var line = new codeLine(xPos, yPos, name, getDataSpeed(data[typeIndex].length), dataPiece[0], dataPiece[1] * 1.5, dataPiece[2], dataPiece[3] );
    
    codeLines.push( line );
}

function getDataSpeed(length) {
    return clamp( normalise(length, codeMinSpeed, codeMaxSpeed), 0, 1.0);
}

function removeLine(line) {
    var index = codeLines.indexOf(line);
    
    codeLines.splice(index, 1);
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

function normalise(x, min, max) {
    return (x - min) / (max - min);
}

function clamp(x, min, max) {
    return Math.max(Math.min(x, max), min);
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
$("button#nextFrame").click(function () {
    draw();
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