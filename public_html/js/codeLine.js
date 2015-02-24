codeLine = function(xPos, yPos, speed, outboundData){

    this.x = xPos * codeColumnWidth;
    this.y = yPos * codeRowWidth;
    
    this.healthyColor = outboundData ? '#F00' : '#0F0';
    this.infectedColor = '#F00';
    this.codeColor = this.healthyColor;
    this.isOutboundData = outboundData ? -1 : 1;
    
    this.infected = false;
    this.infectionChance = 0.01;
    this.lineSpeed = Math.round((1.0 - speed) * codeSlowestUpdateInterval + 1)//Math.round( (codeMaxSpeed - (speed || 1)) / codeMaxSpeed * (codeSlowestUpdateInterval - 1) + 1 );
    console.log(this.lineSpeed);
    this.framesSinceLastUpdate = 0;
    this.text = String.fromCharCode(33 + Math.random() * 93);
    
    this.draw = function() {

        //draw white head letter
        topCtx.fillStyle = '#FFF';
        topCtx.fillText(this.text, this.x, this.y);
        
        //draw colored trail
        ctx.fillStyle = this.codeColor;
        ctx.fillText(this.text, this.x, this.y - codeRowWidth * this.isOutboundData);
        
        if(this.framesSinceLastUpdate > this.lineSpeed) {
            //update draw character
            this.text = String.fromCharCode(33 + Math.random() * 93);
            
            //move trail
            this.y += codeRowWidth * this.isOutboundData;
            if(this.y - codeRowOverflow * codeRowWidth  > bottomCanvas.height / codeRowWidth ) this.y = 0;
            else if(this.y < 0) this.y = bottomCanvas.height / codeRowWidth + codeRowOverflow * codeRowWidth;
                
            if(this.infected) {
                this.sendInfection();
            }
            
            this.framesSinceLastUpdate = 0;
        }
        
        else this.framesSinceLastUpdate++;
    };
    
    this.sendInfection = function() {
        for(var i in codeLines) {
            var dist = Math.sqrt( (codeLines[i].x - this.x) * (codeLines[i].x - this.x) + (codeLines[i].y - this.y) * (codeLines[i].y - this.y) );

            if(dist < 150 && codeLines[i] !== this && !codeLines[i].infected && Math.random() < this.infectionChance) {
                codeLines[i].infect();
                console.log("Infected: " + i);
                
                //draw infection line
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(codeLines[i].x, codeLines[i].y);
                ctx.lineWidth = 5;
                ctx.strokeStyle = '#F00';
                ctx.stroke();
            }
        }
    };
    
    this.infect = function() {
        this.infected = true;
        this.codeColor = this.infectedColor;
    };         
};