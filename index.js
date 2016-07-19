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
require('shelljs/global');

// Added new feature for moving files
/**winston.add(winston.transports.File, {
    filename: config.repositories.logs + 'logs'
});**/
var logger = new(winston.Logger)({
    transports: [
        new(winston.transports.File)({
            filename: config.repositories.logs + 'logs',
            json: false,

            /**timestamp: function() {
                return dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss.l");
            },
            formatter: function(options) {
                // Return string will be passed to logger.
                return options.timestamp + ' ' + options.level.toUpperCase(); + ' ' + (undefined !== options.message ? options.message : '') +
                (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
            }**/
        })
    ]
});

var plugins = [];

// Initilisation plugins


for (var i in config.capabilities) {
    plugins.push(require(config.repositories.plugins + config.capabilities[i] + '.js'));
}

for (var i in plugins) {
    logger.info('Plugin loaded successfully : [' + plugins[i].getName() + ']');
}

//Function to check if an existing file is in the input folder
var inputFolder = ls(config.repositories.input);

var exitingFiles = inputFolder.length;
if (exitingFiles > 0) {
    var filesNumber = 0;
    logger.info("Files already in the input file =" + inputFolder);
    for (i = 0; i < exitingFiles; i++) {
        logger.info('The file ' + inputFolder[i] + ' is being processed');
        getPlugin(config.repositories.input + inputFolder[i], function(err, processor) {
            if (err) {
                // No plugin matches
                logger.error('Unknown format', f);
                return;
            }
            processor.start();
        });
    }
} else {

    logger.info('No file in ' + config.repositories.input);
}

/**{
    winston.info('File Found in ' + config.repositories.input);
    console.log('File Found in ' + config.repositories.input);
    getPlugin(f, function(err, processor) {
        if (err) {
            // No plugin matches
            winston.error('Unknown format', f);
            return;
        }
        processor.start();
    });
} else {
    console.log('File not Found in ' + config.repositories.input)
}
**/
watch.createMonitor(config.repositories.input, function(monitor) {
    //monitor.files['/home/mikeal/.zshrc'] // Stat object for my zshrc.
    monitor.on("created", function(f, stat) {
        getPlugin(f, function(err, processor) {
            if (err) {
                // No plugin matches
                logger.error('Unknown format', f);
                return;
            }
            processor.start();
        });
    });
    monitor.on("changed", function(f, curr, prev) {
        logger.info('File changes detected !', f);
        //processFileCSV(f);
    });
    monitor.on("removed", function(f, stat) {
        // Handle removed files
    });
    //monitor.stop(); // Stop watching
});


function getPlugin(f, callback) {
    callback = callback || function() {};
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
        //plugins[i].setLogger(logger);
        callback(null, plugins[i]);
    } else {
        callback(true);
    }

}
