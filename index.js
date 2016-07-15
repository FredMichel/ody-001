/**
 * REST API Client + File Manipulator
 *
 * Libraries used :
 * ---------------
 * config : Configuration files
 * soap : Soap client
 * fs : file system
 * parse : CSV management
 * chokidar : File monitoring (will replace parse)
 * _ : Utilities array, object , ....
 * xml2js : XML management
 * winston : Log management
 * dateformat : Date time management
 */


var config = require('./config/config.json');
var soap = require('soap');
var parse = require('csv-parse');
var fs = require('fs');
var watch = require('watch');
var _ = require('lodash');
var xml2js = require('xml2js');
var winston = require('winston');
var chokidar = require('chokidar');
var dateFormat = require('dateformat');



// Added new feature for moving files

var plugins = [];


// Initilisation plugins

for (var i in config.capabilities) {
    plugins.push(require(config.repositories.plugins + config.capabilities[i] + '.js'));
}

for (var i in plugins) {
    winston.info('Plugin loaded successfully : ['+ plugins[i].getName()+ ']');
}


watch.createMonitor(config.repositories.input, function (monitor) {
    //monitor.files['/home/mikeal/.zshrc'] // Stat object for my zshrc.
    monitor.on("created", function (f, stat) {
        getPlugin(f, function (err, processor) {
            if (err) {
                // No plugin matches
                winston.error('Unknown format', f);
                return;
            }

            processor.start();

        });


    });
    monitor.on("changed", function (f, curr, prev) {
        console.log('File changes detected !', f);
        //processFileCSV(f);
    });
    monitor.on("removed", function (f, stat) {
        // Handle removed files
    });
    //monitor.stop(); // Stop watching
});


function getPlugin(f, callback) {
    callback = callback || function () {};
    var isValid = false;
    var i = 0;

    while (!isValid && (i < plugins.length)) {
        isValid = plugins[i].isValid(f);
        if (!isValid) {
            i++;
        }
    }
    if (isValid) {
        plugins[i].setFilename(f);
        plugins[i].setLogger (winston);
        callback(null, plugins[i]);
    } else {
        callback(true);
    }

}