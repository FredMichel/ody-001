var soap = require('soap');
var parse = require('csv-parse');
var fs = require('fs');
var watch = require('watch');
var _ = require('lodash');
var xml2js = require('xml2js');
var winston = require('winston');
var chokidar = require('chokidar');
var dateFormat = require('dateformat');
var parseString = require('xml2js').parseString;
var path = require('path');
var async = require('async');

var config = require(path.resolve('config', 'config.json'));
var sourceTypeObj = require(path.resolve('lib', 'hpscOneWay.headers'));
var pathUtils = require(path.resolve('lib', 'pathUtils.js'));
var webServiceUtils = require(path.resolve('lib', 'webServiceUtils.js'));


var asyncTasks = [];

/**
 * Initialize logger
 **/
var logger = new(winston.Logger)({
    transports: [
        new(winston.transports.File)({
            filename: pathUtils.getFilePath(config.repositories.logs, 'logs'),
            json: false,
            level: config.monitoring.log_levels
        })
    ]
});

var Plugin = {
    filename: '',
    loadSequence: [],
    getName: function() {
        return 'HPSC Integration';
    },
    getFilename: function() {
        return 'hpsc-one-way.js';
    },
    /**
     * Set true to enable plugin, Set to false to disable plugin
     **/
    isValid: function(file) {
        if ((typeof file) == 'string') {
            return this.verifyExtension(file);
        } else {
            return this.isValidArray(file);
        }
    },

    isValidArray: function(fileArray) {
        fileArray.map(function(item) {
            return verifyExtension(path.resolve(config.respository.input, item));
        });
    },

    start: function() {
        var loadSequenceLength = this.loadSequence.length;

        logger.debug('The scheduler has to run the following sequence of files ' + JSON.stringify(this.loadSequence));
        var orderedFiles = _.orderBy(this.loadSequence, ['timeStamp'], ['asc']);

        async.eachSeries(orderedFiles,
            function(item, callback) {
                addTask(item);
                callback(null, item);
            },
            function(err, items) {
                if (err) {
                    return logger.error('An issue occured when processing hpsc files', item.path, err);
                }
                async.series(asyncTasks, function(err, result) {
                    if (err) {
                        return logger.error('An issue occured when processing HPSC files', err);
                    }
                    logger.info('End of process for HPSC plugin');
                });
            });
        this.loadSequence = [];
    },

    /**
     * This function returns the extension and the file name of the file to make sure that the file is valid for HPSC
     *
     * @param  {[type]} file  the file path
     * @return {[type]}      boolean that defines if the file is valid
     */
    verifyExtension: function(file) {
        var fileName = path.basename(file);
        var extensionFile = path.extname(file);
        var verifObj = {
            isValid: false,
            sourceType: {}
        };

        _.forEach(sourceTypeObj, function(obj) {
            if ( /**(fileName.toLowerCase().indexOf(obj.type) != -1) && **/ (extensionFile.toLowerCase().indexOf('xml') != -1)) {
                verifObj.isValid = true;
                verifObj.sourceType = obj;
            }
        });

        if (verifObj.isValid) {
            var moveFilePath = pathUtils.moveFileToInFolder(file, verifObj.sourceType);

            this.loadSequence.push({
                path: moveFilePath,
                sourceType: verifObj.sourceType,
                timeStamp: pathUtils.getFileInfo(fileName, '_', 3) + pathUtils.getFileInfo(fileName, '_', 4)
            });
        } else {
            pathUtils.moveToUnknownFolder(file, logger);
        }
        return verifObj.isValid;
    }
};

/**
 * This funciton add a series of waterfall functions
 *
 * @param {[Object]} taskFile An object that contais the following attributes:
 *                             path: a file path,
 *                             sourceType: a sourcetype obj,
 *                             functionalOrder: the functional order of the sourcetype Obj,
 *                             timeStamp: a timestamp
 *
 */
function addTask(taskFile) {
    return asyncTasks.push(
        function(callback) {
            async.waterfall([
                    function(callback) {
                        readFile(taskFile, callback);
                    },
                    function(taskFile, ioStream, continueSerie, callback) {
                        if (continueSerie) {
                            parseXML(taskFile, ioStream, callback);
                        } else {
                            callback(null, taskFile, null, null, false);
                        }
                    },
                    function(taskFile, rawData, records, continueSerie, callback) {
                        if (continueSerie) {
                            requestHPSCOdyssey(taskFile, rawData, records, callback);
                        } else {
                            callback(null, taskFile, rawData, null, false);
                        }
                    },
                    function(taskFile, rawData, response, continueSerie, callback) {
                        if (continueSerie) {
                            createAcknowledgement(taskFile, rawData, response, callback);
                        } else {
                            callback(null, taskFile, false);
                        }
                    }
                ],
                function(err, result) {
                    callback(null, result);
                });
        });
}

/**
 * This function reads the content of a file
 * @param  {[type]}   file     a file path
 * @param  {Function} callback a callback function
 * @return {[type]}            [description]
 */
function readFile(taskFile, callback) {
    try {
        fs.readFile(taskFile.path, function(err, data) {
            if (err) {
                logger.warn('Error parsing dropped file: ' + err);
                pathUtils.moveFileToErrorFolder(taskFile.path, taskFile.sourceType);
                return callback(null, taskFile, null, false);
            }
            callback(null, taskFile, data, true);
        });
    } catch (e) {
        logger.error('An error occured when reading file', taskFile.path, e);
        pathUtils.moveFileToErrorFolder(taskFile.path, taskFile.sourceType);
        callback(null, taskFile, null, false);
    }
}

/**
 * This function parse an XML ioStream
 * @param  {[type]}   taskFile a TaskFile object
 * @param  {[type]}   data     a ioStream from a file
 * @param  {Function} callback a callback function
 * @return {[type]}            void
 */
function parseXML(taskFile, data, callback) {
    try {
        parseString(data, function(err, result) {
            if (err) {
                logger.warn('An error occured will parsing an XML file', taskFile, path, err);
                pathUtils.moveFileToErrorFolder(taskFile.path, taskFile.sourceType);
                return callback(null, taskFile, null, null, false);
            }

            var resultObj = result.GATEWAY_SC2SNOW.unload[0];

            var action = pathUtils.getFileInfo(path.basename(taskFile.path), '_', 2);

            var rawData = resultObj[taskFile.sourceType.type][0];

            var sourceData = {
                "records": [webServiceUtils.parseDataHPSC(rawData, action)]
            };

            callback(null, taskFile, rawData, sourceData, true);
        });
    } catch (e) {
        logger.error('An error occured when reading file', taskFile.path, e);
        callback(null, taskFile, null, null, false);
    }
}

/**
 * This function makes the Web Service call to Odyssey in order to create or update a record
 * @param  {[type]}   taskFile       a taskfile object
 * @param  {[type]}   rawData        dat from an XML file
 * @param  {[type]}   parseResult    the result of the parseXML functiom
 * @param  {Function} callback       a callbakc function
 * @return {[type]}                  void
 */
function requestHPSCOdyssey(taskFile, rawData, parseResult, callback) {
    var sourceType = taskFile.sourceType;
    try {
        if (config.hasOwnProperty('proxy.url') && !_.isNil(config.proxy.url) && config.proxy.url !== '') {
            webServiceUtils.makeRequestCallWithProxy(taskFile.sourceType, parseResult, function(err, response, body) {
                if (err) {
                    logger.error('An error occured when making a request to Odyssey', err);
                    pathUtils.moveFileToErrorFolder(taskFile.path, sourceType);
                    return callback(null, taskFile, rawData, null, false);
                }

                logger.info("Response from Odyssey: " + webServiceUtils.getStatusSummary(body));
                var processedFolder = path.join(config.repositories.data, sourceType.folder, 'processed');
                var processedPath = pathUtils.getFilePath(processedFolder, path.basename(taskFile.path));
                pathUtils.movingFileToFolder(taskFile.path, processedFolder, processedPath);
                callback(null, taskFile, rawData, body, true);
            });
        } else {
            webServiceUtils.makeRequestCallNoProxy(taskFile.sourceType, parseResult, function(err, response, body) {
                if (err) {
                    logger.error('An error occured when making a request to Odyssey', err);
                    pathUtils.moveFileToErrorFolder(taskFile.path, sourceType);
                    return callback(null, taskFile, rawData, null, false);
                }

                logger.info("Response from Odyssey: " + webServiceUtils.getStatusSummary(body));
                var processedFolder = path.join(config.repositories.data, sourceType.folder, 'processed');
                var processedPath = pathUtils.getFilePath(processedFolder, path.basename(taskFile.path));
                pathUtils.movingFileToFolder(taskFile.path, processedFolder, processedPath);
                callback(null, taskFile, rawData, body, true);
            });
        }
    } catch (e) {
        callback(null, taskFile, rawData, null, false);
    }
    //});
}

/**
 * This function create an acknowledgement file when receiving a response from Odyssey
 * @param  {[type]}   taskFile a taskFile object
 * @param  {[type]}   rawData  raw data from an XML file
 * @param  {[type]}   response the response from a webservice call
 * @param  {Function} callback a callback function
 * @return {[type]}            void
 */
function createAcknowledgement(taskFile, rawData, response, callback) {
    /**
     * Define out path for ODYSSEY Response
     **/
    var xmlFileName = 'ODYSSEY_' + response.display_value + '_AK_' + dateFormat(new Date(), "yyyymmdd") + '_' + dateFormat(new Date(), "hhmmss") + '.xml';


    var responseXML = webServiceUtils.getResponseXML(response, rawData, 'hpsc');
    //if (responseXML) {
    try {
        /**
         * Write XML file
         **/
        fs.writeFile(xmlFileName, responseXML, function(err) {
            if (err) {
                logger.error('Error writing xml file: ' + err);
                return callback(null, taskFile, false);
            }

            var outFolder = path.join(config.repositories.data, taskFile.sourceType.folder, 'out');
            var outPath = pathUtils.getFilePath(outFolder, xmlFileName);
            pathUtils.movingFileToFolder(xmlFileName, outFolder, outPath);
            callback(null, taskFile, true);
        });
    } catch (e) {
        logger.error('Error writing xml file', xmlFileName, e);
        callback(null, taskFile, false);
    }
}


module.exports = Plugin;
