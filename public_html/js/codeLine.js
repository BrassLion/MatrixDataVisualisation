codeLine = function(xPos, yPos, dataName, dataSpeed, dataText, dataBrightness, dataDirection, dataType){

    this.x = xPos * codeColumnWidth;
    this.y = yPos * codeRowWidth;
    this.name = dataName;
    
    //this.codeColor = dataType === "GOOD" ? 'rgba(0,255,0,' + 1/4*dataBrightness + ')' : 'rgba(255,0,0,' + 1/4*dataBrightness + ')';
    this.codeColor = dataType === "GOOD" ? 'rgb(0,' + Math.round(255/4*dataBrightness) + ',0)' : 'rgb(' + Math.round(255/4*dataBrightness) + ',0,0)';
    this.headColor = 'rgb(' + Math.round(255/4*dataBrightness) + ',' + Math.round(255/4*dataBrightness) + ',' + Math.round(255/4*dataBrightness) + ')';
    this.isOutboundData = dataDirection === "UP" ? -1 : 1;
    
    this.lineSpeed = Math.round((1.0 - dataSpeed) * codeSlowestUpdateInterval + 1)//Math.round( (codeMaxSpeed - (speed || 1)) / codeMaxSpeed * (codeSlowestUpdateInterval - 1) + 1 );
    this.framesSinceLastUpdate = 0;
    this.text = dataText;
    this.currentCharIndex = 0;
    this.currentChar = this.text.charAt(this.currentCharIndex);
    this.prevChar = " ";
    
    this.draw = function() {

        //draw white head letter
        topCtx.fillStyle = this.headColor;
        topCtx.fillText(this.currentChar, this.x, this.y);
        
        //draw colored trail
        ctx.fillStyle = this.codeColor;
        ctx.fillText(this.prevChar, this.x, this.y - codeRowWidth * this.isOutboundData);
        
        if(this.framesSinceLastUpdate > this.lineSpeed) {
            //update draw character
            this.currentCharIndex > this.text.length - 2 ? this.currentCharIndex = 0 : this.currentCharIndex++;
            this.prevChar = this.currentChar;
            this.currentChar = this.text.charAt(this.currentCharIndex);
            
            //move trail
            this.y += codeRowWidth * this.isOutboundData;
            if(this.y - codeRowOverflow * codeRowWidth  > bottomCanvas.height / codeRowWidth ) this.kill();
            else if(this.y < 0) this.kill();

            this.framesSinceLastUpdate = 0;
        }
        
        else this.framesSinceLastUpdate++;
    };
    
    this.kill = function() {
//        addMatrixCodeLine(this.name, this.x / codeColumnWidth);
        removeLine(this);
    }
};