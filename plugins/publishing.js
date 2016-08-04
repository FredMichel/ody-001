/**
 * Plugin for publishing
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
var path = require('path');
var async = require('async');
var request = require('request');

require('shelljs/global');

var config = require(path.resolve('config', 'config.json'));
var sourceTypeObj = require(path.resolve('lib', 'publishing.headers'));
var pathUtils = require(path.resolve('lib', 'pathUtils.js'));
var webServiceUtils = require(path.resolve('lib', 'webServiceUtils.js'));

var asyncTasks = [];

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

    loadSequence: [],
    getName: function() {
        return 'Publishing Integration';
    },
    getFilename: function() {
        return 'publishing.js';
    },

    isValid: function(file) {
        var isValid = false;
        try {

            logger.debug('Test the type of the input for isValid function.', JSON.stringify(file), (typeof file));
            if ((typeof file) == 'string') {
                isValid = this.verifyHeader(file).isValid;
            } else {
                logger.debug('The validation of file is made on an Array');
                isValid = this.isValidArray(file);
            }
        } catch (e) {
            logger.error('An error occured during validation of file', JSON.stringify(file), e);
        }
        return isValid;
    },

    isValidArray: function(files) {
        var isValid = false;
        var fileLength = files.length;
        for (var singleFile in files) {
            var file = files[singleFile];
            var verif = this.verifyHeader(path.resolve(config.repositories.input, file));
            logger.debug('The file ' + file + ' is to be added at position ' + verif.sourceType.sequenceOrder + ' in the process sequence.');
            isValid = verif.isValid || isValid;
        }
        return isValid;
    },

    start: function() {

        var loadSequenceLength = this.loadSequence.length;
        logger.debug('The scheduler has to run the following sequence of files ' + JSON.stringify(this.loadSequence));
        var orderedFiles = _.orderBy(this.loadSequence, ['functionalOrder', 'timeStamp'], ['asc', 'asc']);

        async.eachSeries(orderedFiles,
            function(item, callback) {
                addTask(item);
                callback(null, item);
            },

            function(err, items) {
                async.series(asyncTasks, function(err, result) {
                    if (err) {
                        return logger.error('An issue occured when processing pubishing files', err);
                    }
                    this.loadSequence = [];
                    asyncTasks = [];
                    logger.info('End of process for publishing plugin');
                });
            });
    },

    /**
     * This function verify if the file has a valid header and returns a boolean and the matching headerObj
     *
     * Parameter:
     * - file: a file pathUtils
     *
     * Return:
     * - an object that contains isValid and the headerobj
     *
     **/
    verifyHeader: function(file) {
        var verifyObj = {
            isValid: false,
            sourceType: {}
        };
        try {
            var csvHeader = head(file);
            var returnValid = _.split(_.trim(csvHeader.head('-n', 1).stdout), ';');

            var obj = {};
            for (var id in sourceTypeObj) {
                obj = sourceTypeObj[id];
                if (_.difference(returnValid, obj.header).length === 0) {
                    verifyObj.isValid = true;
                    verifyObj.sourceType = obj;
                    break;
                }
            }
            if (verifyObj.isValid) {
                var moveFilePath = pathUtils.moveFileToInFolder(file, verifyObj.sourceType);
                this.loadSequence.push({
                    path: moveFilePath,
                    sourceType: verifyObj.sourceType,
                    functionalOrder: verifyObj.sourceType.sequenceOrder,
                    timeStamp: (fs.statSync(moveFilePath)).ctime // TODO: take timestamp from file
                });
            } else {
                pathUtils.moveToUnknownFolder(file, logger);
            }
        } catch (e) {
            logger.error('An error occured during the validation of the file for Publishing:' + e);
        }
        return verifyObj;
    }
};


/**
 * THis funciton add a series of waterfall functions
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
                        //callback(null);
                    },
                    function(taskFile, ioStream, continueSerie, callback) {
                        if (continueSerie) {
                            parseCSV(taskFile, ioStream, callback);
                        } else {
                            callback(null, taskFile, null, false);
                        }
                    },
                    function(taskFile, records, continueSerie, callback) {
                        if (continueSerie) {
                            requestPublishingOdyssey(taskFile, records, callback);
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
 * This function is reading file
 * @param  {[Object]}   taskFile An object that contais the following attributes:
 *                             path: a file path,
 *                             sourceType: a sourcetype obj,
 *                             functionalOrder: the functional order of the sourcetype Obj,
 *                             timeStamp: a timestamp
 * @param  {Function} callback A callback function
 * @return {[type]}            void
 */
function readFile(taskFile, callback) {
    try {
        fs.readFile(taskFile.path, 'utf8', function(err, input) {
            if (err) {
                logger.error('An error occured while reading a file', taskFile.path, err);
                return callback(null, taskFile, null, false);
            }
            callback(null, taskFile, input, true);
        });
    } catch (e) {
        logger.error('An error occured when reading file', taskFile.path, e);
        callback(null, taskFile, null, false);
    }
}

/**
 * This function parse a CSV file
 *
 * Parameter:
 * - ioStream: a I/O strem of a file
 * - callback, a calback function
 *
 *
 **/
function parseCSV(taskFile, ioStream, callback) {
    try {
        parse(ioStream, {
            delimiter: ';' //,
                //quote: '~' // Commented TODO: tranform data and remove double quote from data
        }, function(err, output) {
            if (err) {
                logger.error('An error occured when parsing a file', taskFile.path, err);
                pathUtils.moveFileToErrorFolder(taskFile.path, taskFile.sourceType);
                return callback(null, taskFile, null, false);
            }
            var args = {
                "records": []
            };
            var sourceType = taskFile.sourceType;

            var dataModel = sourceType.mapping;
            output.forEach(function(line, i) {
                if (i !== 0) {
                    var record = {};

                    _.forEach(dataModel, function(value, key) {
                        record[key] = line[parseInt(value.toString())];
                    });
                    args.records.push(record);
                }
            });
            callback(null, taskFile, args, true);
        });
    } catch (e) {
        logger.error('An error occured when running throught the CSV', e);
        callback(null, taskFile, null, false);
    }
}

function requestPublishingOdyssey(taskFile, records, callback) {
    var sourceType = taskFile.sourceType;
    var file = taskFile.path;
    logger.info('[ ' + sourceType.folder + ' ] Pushing ' + records.records.length + ' records to Odyssey');
    if (!_.isNil(config.proxy.url) && config.proxy.url !== '') {
        webServiceUtils.makeRequestCallWithProxy(sourceType, records, function(err, response, body) {
            logger.debug('response JSON = ' + JSON.stringify(response));
            if (err) {
                pathUtils.moveFileToErrorFolder(file, sourceType);
                logger.error('An error occured during the SOAP call to ServiceNow.', err);
                return callback(null, taskFile, false);
            }
            logger.info('[ ' + sourceType.folder + ' ] Response from Odyssey: ' + webServiceUtils.getStatusSummary(body));
            var processedPath = path.join(config.repositories.data, sourceType.folder, 'processed');
            pathUtils.movingFileToFolder(file, processedPath);
            callback(null, taskFile, true);
        });
    } else {
        webServiceUtils.makeRequestCallNoProxy(sourceType, records, function(err, response, body) {
            logger.debug('response JSON = ' + JSON.stringify(response));
            if (err) {
                pathUtils.moveFileToErrorFolder(file, sourceType);
                logger.error('An error occured during the SOAP call to ServiceNow.', err);
                return callback(null, taskFile, false);
            }
            logger.info('[ ' + sourceType.folder + ' ] Response from Odyssey: ' + webServiceUtils.getStatusSummary(body));
            var processedPath = path.join(config.repositories.data, sourceType.folder, 'processed');
            pathUtils.movingFileToFolder(file, processedPath);
            callback(null, taskFile, true);
        });
    }
}

module.exports = Plugin;
