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

require('shelljs/global');


var config = require(path.resolve('config', 'config.json'));
var sourceTypeObj = require(path.resolve('lib', 'publishing.headers'));
var pathUtils = require(path.resolve('lib', 'pathUtils.js'));
var parseUtils = require(path.resolve('lib', 'parseUtils.js'));

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
    /**logger : new(winston.Logger),
    setLogger : function (logger){
        this.logger = logger;
    },**/
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
            logger.info('test type file ' + file + '  ' + (typeof file));
            if ((typeof file) == 'string') {
                isValid = this.verifyHeader(file).isValid;
            } else {
                logger.info('go in array');
                isValid = this.isValidArray(file);
            }
        } catch (e) {
            logger.error('An error occured during validation of file ' + file + ' : ' + e);
        }
        return isValid;
    },

    isValidArray: function(files) {
        var isValid = false;
        var fileLength = files.length;
        for (var singleFile in files) {

            if (!isNaN(parseInt(singleFile))) {
                var file = files[singleFile];
                var verif = this.verifyHeader(path.resolve(config.repositories.input, file.name));
                logger.debug('The file ' + file + ' is to be added at position ' + verif.sourceType.sequenceOrder + ' in the process sequence.');
                this.loadSequence[verif.sourceType.sequenceOrder] = {
                    path: path.resolve(config.repositories.input, file.name),
                    sourceType: verif.sourceType
                };
                isValid = verif.isValid || isValid;
            }
        }
        return isValid;
    },

    start: function() {
        if (config.plugin_scheduler_mode) {
            var loadSequenceLength = this.loadSequence.length;
            logger.info('The scheduler has to run the following sequence of files ' + JSON.stringify(this.loadSequence));
            for (var i = 0; i < loadSequenceLength; i++) {
                var loadObj = this.loadSequence[i];
                logger.debug('This is the file being process ' + JSON.stringify(loadObj));
                if (!_.isNil(loadObj)) {
                    this.sendOdysseyRequest(loadObj.path);
                }
            }
        } else {
            this.sendOdysseyRequest(this.filename);
        }

    },
    setFilename: function(f) {
        this.filename = f;
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
            var returnValid = csvHeader.head('-n', 1).stdout;

            for (var id in sourceTypeObj) {
                var obj = sourceTypeObj[id];
                if (returnValid.indexOf(obj.header.join(";")) != -1) {
                    verifyObj.isValid = true;
                    verifyObj.sourceType = obj;
                    break;
                }
            }
        } catch (e) {
            logger.error('An error occured during the validation of the file for Publishing:' + e);
        }
        return verifyObj;
    },

    sendOdysseyRequest: function(file) {
        logger.info(this.getName(), ' - Processing', this.getFilename());
        try {
            fs.readFile(file, 'utf8', function(err, input) {
                if (err) {
                    return logger.error(err);
                }
                parse(input, {
                    delimiter: ';' //,
                        //quote: '~' // Commented TODO: tranform data and remove double quote from data
                }, function(err, output) {
                    var args = {
                        record: []
                    };

                    var sourceType = "Unknown";
                    var dataModel = {};
                    var formatedDate = dateFormat(new Date(), "yyyymmddHHMMssl");
                    var fileName = path.basename(file);

                    try {
                        output.forEach(function(line, i) {
                            if (i === 0) {
                                for (var id in sourceTypeObj) {
                                    var obj = sourceTypeObj[id];

                                    if (_.difference(line, obj.header).length === 0) {
                                        sourceType = obj;
                                        var inFolder = path.join(config.repositories.data, sourceType.folder, 'in');
                                        var inPath = pathUtils.getFilePath(inFolder, fileName + '_' + formatedDate);
                                        pathUtils.movingFileToFolder(file, inFolder, inPath);
                                        file = inPath;
                                        break;
                                    }
                                }
                            }
                            if (i !== 0 && sourceType != 'Unknown' && i < 2000) {
                                var record = {};
                                var dataModel = sourceType.mapping;
                                for (var k in dataModel) {
                                    record[k] = '<![CDATA[' + line[dataModel[k]] + ']]>';
                                }
                                args.record.push(record);
                            }
                        });
                        if (sourceType != 'Unknown') {
                            try {
                                soap.createClient(pathUtils.getFilePath(config.repositories.wsdl, sourceType.url), function(err, client) {

                                    try {
                                        client.setSecurity(new soap.BasicAuthSecurity(config.servicenow.credentials.login, config.servicenow.credentials.password));
                                        try {
                                            client.insertMultiple(args, function(err, result) {
                                                if (err) {
                                                    logger.error('An error occured during the SOAP call to ServiceNow : ' + err);
                                                    var errorPath = path.join(config.repositories.data, sourceType.folder, 'error');
                                                    pathUtils.movingFileToFolder(file, errorPath);
                                                } else {
                                                    logger.info('Response from Odyssey: \n' + parseUtils.getStatusSummary(result));
                                                    var processedPath = path.join(config.repositories.data, sourceType.folder, 'processed');
                                                    pathUtils.movingFileToFolder(file, processedPath);
                                                }
                                            });
                                        } catch (e) {
                                            logger.error('Error during sending request to Odyssey :' + e);
                                            var errorFolder = path.join(config.repositories.data, sourceType.folder, 'error');
                                            pathUtils.movingFileToFolder(file, errorFolder);
                                        }
                                        logger.info('Pushing ' + args.record.length + ' records of ' + sourceType.folder + ' to ServiceNow');
                                    } catch (e) {
                                        logger.error('Error when connecting to Odyssey :' + e);
                                        var errorFolderWS = path.join(config.repositories.data, 'error');
                                        pathUtils.movingFileToFolder(file, errorFolderWS);
                                    }

                                });
                            } catch (e) {
                                logger.error('Error when connecting to Odyssey' + file);
                                var errorFolder = path.join(config.repositories.data, 'error');
                                pathUtils.movingFileToFolder(file, errorFolder);
                            }

                        } else {
                            logger.warn('Unknown source type, no call to ServiceNow');
                            var unknownFolder = path.join(config.repositories.data, 'unknown');
                            var unknownPath = pathUtils.getFilePath(unknownFolder, fileName + '_' + formatedDate);
                            pathUtils.movingFileToFolder(file, unknownFolder, unknownPath);
                        }
                    } catch (e) {
                        logger.warn('Unknown source type, no call to ServiceNow for file' + file + ' ' + e);
                        var unknownNoMatchFolder = path.join(config.repositories.data, 'unknown');
                        var unknownNoMatchPath = pathUtils.getFilePath(unknownNoMatchFolder, fileName + '_' + formatedDate);
                        pathUtils.movingFileToFolder(file, unknownNoMatchFolder, unknownNoMatchPath);
                    }
                });
            });
        } catch (e) {
            logger.error('An error occured while reading file' + file + ' for Publishing : ' + e);
        }
    }
};

module.exports = Plugin;
