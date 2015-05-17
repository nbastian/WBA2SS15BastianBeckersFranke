var fs = require('fs');

var wk;

fs.readFile(__dirname+"/wolkenkratzer.json", function (err, data) {
  
    if (err) throw err;
    
    wk = JSON.parse(data);
    
    for(i=0;i < wk.wolkenkratzer.length; i++){
        console.log('Name: ' + wk.wolkenkratzer[i].name);
        console.log('Stadt: ' + wk.wolkenkratzer[i].stadt);
        console.log('Hoehe: ' + wk.wolkenkratzer[i].hoehe);
        console.log('--------------------');
    }
});