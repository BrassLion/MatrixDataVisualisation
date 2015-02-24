var exports = 0;

function saveToDisk(fileURL, fileName) {
    var blob = dataURItoBlob(fileURL) ? dataURItoBlob(fileURL) : null;
    var r = new XMLHttpRequest();
    r.open('POST', 'http://127.0.0.1:3999/' + exports++, false);
    r.send(blob);
    r.onload = function(){
        console.log(exports + ": " + blob.size); // Touch payload for no real good reason.
        if (r.status == 200){
           console.log(exports + " OK");
        }else{
           console.log(exports + " ERROR");
        }
    };
//    r.onreadystatechange = showContents(r);
    
//    r.abort();
}
//function showContents(r) {
//    console.log("Export num: " + exports + "\nStatus: " + r.status + "\nText: " + r.responseText);
//}

function dataURItoBlob(dataURI) {
    var mimetype = dataURI.split(",")[0].split(':')[1].split(';')[0];
    var byteString = atob(dataURI.split(',')[1]);
    var u8a = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        u8a[i] = byteString.charCodeAt(i);
    }
    return new Blob([u8a.buffer], {type: mimetype});
}