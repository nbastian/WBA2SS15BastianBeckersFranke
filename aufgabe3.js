var fs = require('fs');
var chalk = require('chalk');

var wk;
var wks;
var farbename = chalk.blue;
var farbestadt = chalk.red;
var farbehoehe = chalk.green;
var farbestriche = chalk.yellow;

fs.readFile(__dirname+"/wolkenkratzer.json", function (err, data) {
  
    if (err) throw err;
    
    wk = JSON.parse(data.toString());
    
    wk.wolkenkratzer.sort(function(a,b) {
       return b.hoehe - a.hoehe;
    });
    
    wks = JSON.stringify(wk, null, 3);
    
    fs.writeFile(__dirname+"/wolkenkratzer_sortiert.json", wks, function(err, data) {
        if (err) throw err;
        console.log('It\'s saved!');
    });
    
    for(i=0;i < wk.wolkenkratzer.length; i++){
        console.log(farbename('Name: ' + wk.wolkenkratzer[i].name));
        console.log(farbestadt('Stadt: ' + wk.wolkenkratzer[i].stadt));
        console.log(farbehoehe('Hoehe: ' + wk.wolkenkratzer[i].hoehe));
        console.log(farbestriche('--------------------'));
    }
});