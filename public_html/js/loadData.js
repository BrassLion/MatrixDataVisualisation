
function loadContentData(callback){	
	var filePath = "data/All.json";
	filePath = encodeURI( filePath );
	// console.log(filePath);
			
	var xhr = new XMLHttpRequest();
	xhr.open( 'GET', filePath, true );
	xhr.onreadystatechange = function() {
		if ( xhr.readyState === 4 && xhr.status === 200 ) {
	    	var timeBins = JSON.parse( xhr.responseText ).timeBins;			    											    	

                for(var i in timeBins[0].data) {
                    var dataPiece = timeBins[0].data[i];
                    
                    if(dataPiece.i === "Spain") {
                        dataIn.push(clamp(dataPiece.v, 0, 300));
                    }
                    
                    else if(dataPiece.e === "Spain") {
                        dataOut.push(clamp(dataPiece.v, 0, 300));
                    }
                }
			if(callback)
				callback();				
	    	console.log("finished read data file");	   	
	    }
	};
	xhr.send( null );					    	
}

function clamp(x, min, max) {
    return Math.max( Math.min(x, max), min );
}