/**
 * REST API Client + File Manipulator
 *
 * Libraries used :
 * ---------------
 * config : Configuration files
 * soap : Soap client
 * fs : file system
 * parse : CSV management
 * chokidar : File monitoring (will replace watch)
 * _ : Utilities array, object , ....
 * xml2js : XML management
 * winston : Log management
 * dateformat : Date time management
 */
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
var path = require('path');
var CronJob = require('cron').CronJob;

var config = require(path.resolve('config', 'config.json'));
var pathUtils = require(path.resolve('lib', 'pathUtils.js'));

//process.env.TZ = config.timezone.singapore;

var logger = new(winston.Logger)({
    transports: [
        new(winston.transports.File)({
            filename: pathUtils.getFilePath(config.repositories.logs, 'logs'),
            json: false,
            level: config.monitoring.log_level
        })
    ]
});

var plugins = [];

var watcher = chokidar.watch('file, dir, glob, or array', {
    ignored: /[\/\\]\./,
    persistent: true
});



if (! fs.existsSync(config.repositories.input)) {
    console.log (config.repositories.input + ' does not exist, please check config.json');
    logger.error(config.repositories.input + ' does not exist, please check config.json');
    process.exit(0);
}



// Initilisation plugins
try {
    for (var i in config.capabilities) {
        plugins.push(require(pathUtils.getFilePath(config.repositories.plugins, config.capabilities[i] + '.js')));
    }
} catch (e) {
    logger.error('An error occured while loading the plugins : ' + e);
}


for (var i in plugins) {
    logger.info('Plugin loaded successfully : [' + plugins[i].getName() + ']');
}

if (config.plugin_scheduler_mode) {
    try {
        var job = new CronJob({
            cronTime: config.plugin_schedule_frequency,
            // Function to run when the cronTime is met
            onTick: function() {
                checkExistingFileInInputFolder();
            },
            // Function that runs when the onTick function ends
            onComplete: function() {
            },
            start: true
                //timeZone: config.timezone.singapore
        });
    } catch (e) {
        logger.error('An error occured during the initilisation of the cron process : ' + e);
    }
} else {

   // checkExistingFileInInputFolder();

    var watcher = chokidar.watch(config.repositories.input, {
        ignored: /[\/\\]\./,
        usePolling : true,
        awaitWriteFinish : {
            stabilityThreshold : 10000,
            pollInterval : 1000
        },
        persistent: true
    });

    watcher
      .on('add', function (f) {
          getPlugin(f, function(err, processor) {
              if (err) {
                  // No plugin matches
                  pathUtils.moveToUnknownFolder(f, logger, function (err, result){
                      if (err){
                          return false;
                      }
                  });

                  return false;
              }

              processor.start();
          });

      })
      .on('change', function (path) {console.log ('added', path)})
      .on('unlink', function (path) {console.log ('unlink', path)});
}


console.log ('File monitoring started ...');


function checkExistingFileInInputFolder() {
    //Function to check if an existing file is in the input folder
    try {
        var inputFolder = ls('-l', path.resolve(config.repositories.input));
        var exitingFiles = inputFolder.length;

        if (exitingFiles > 0 && !config.plugin_scheduler_mode) {
            var filesNumber = 0;
            logger.info(exitingFiles + " files already in the input file =" + inputFolder);
            for (var singleFile in inputFolder) {
                if (!isNaN(parseInt(singleFile))) {
                    var fileObj = inputFolder[singleFile];
                    logger.info('The file ' + fileObj.name + ' is being processed.');
                    getPlugin(pathUtils.getFilePath(config.repositories.input, fileObj.name), function(err, processor) {
                        if (err) {
                            // No plugin matches
                            logger.error('Unknown format', inputFolder[i]);
                            return;
                        }
                        processor.start();
                    });
                }
            }
        } else if (exitingFiles > 0 && config.plugin_scheduler_mode) {
            getPlugin(inputFolder, function(err, processor) {
                if (err) {
                    // No plugin matches
                    logger.error('Unknown format', inputFolder[i]);
                    return;
                }
                processor.start();
            });
        } else {
            logger.info('File not Found in ' + config.repositories.input);
        }
    } catch (e) {
        logger.error('An error occured while verifying for existing file in ' + config.repositories.input + ' : ' + e);
    }
}

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
    if (isValid && !config.plugin_scheduler_mode) {
        plugins[i].setFilename(f);
        //plugins[i].setLogger(logger);
        callback(null, plugins[i]);
    } else if (isValid && config.plugin_scheduler_mode) {
        callback(null, plugins[i]);
    } else {
        callback(true);
    }

}
