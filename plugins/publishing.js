/**
 * Plugin for publishing
 */
var config = require('../config/config.json');
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

var sourceTypeObj = require('../lib/publishing.headers');
var pathUtils = require('../lib/pathUtils.js');
var parseUtils = require('../lib/parseUtils.js');

var logger = new(winston.Logger)({
    transports: [
        new(winston.transports.File)({
            filename: pathUtils.getPath(config.repositories.logs, 'logs'),
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
    getName: function () {
        return 'Publishing Integration';
    },
    getFilename: function () {
        return 'publishing.js';
    },
    isValid: function (file) {
        return false;
    },
    start: function () {
        var file = this.filename;
        logger.info(this.getName(), ' - Processing', this.getFilename());
        fs.readFile(file, 'utf8', function (err, input) {
            if (err) {
                return logger.error(err);
            }
            parse(input, {
                delimiter: ';' //,
                    //quote: '~' // Commented TODO: tranform data and remove double quote from data
            }, function (err, output) {
                var args = {
                    record: []
                };


                var sourceType = "Unknown";
                var dataModel = {};
                var formatedDate = dateFormat(new Date(), "yyyymmddHHMMssl");
                var fileName = path.basename(file);

                try {
                    output.forEach(function (line, i) {
                        if (i === 0) {
                            for (var id in sourceTypeObj) {
                                var obj = sourceTypeObj[id];

                                if (_.difference(line, obj.header).length === 0) {
                                    sourceType = obj;
                                    var inFolder = pathUtils.getPath(config.repositories.data, sourceType.folder + '/in/');
                                    var inPath = pathUtils.getPath(inFolder, fileName + '_' + formatedDate);
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
                            //console.log('record', record);
                            args.record.push(record);
                            //MOVE TO SPECIFIC FOLDER (sourceType.path+'in')
                            // shell.mv('-n', file, sourceType.path + '/in'); //Move file to folder
                        }
                    });
                    //console.log('sourcetype', sourceType);
                    if (sourceType != 'Unknown') {
                        try {
                            soap.createClient(pathUtils.getPath(config.repositories.wsdl, sourceType.url), function (err, client) {

                                try {
                                    client.setSecurity(new soap.BasicAuthSecurity(config.servicenow.credentials.login, config.servicenow.credentials.password));
                                    client.insertMultiple(args, function (err, result) {
                                        if (err) {
                                            logger.error("An error occured during the SOAP call to ServiceNow : " + err);
                                            var errorPath = pathUtils.getPath(config.repositories.data, sourceType.folder + '/error/');
                                            pathUtils.movingFileToFolder(file, errorPath);
                                        } else {
                                            logger.info("Response from Odyssey: \n" + parseUtils.getStatusSummary(result));
                                            var processedPath = pathUtils.getPath(config.repositories.data, sourceType.folder + '/processed/');
                                            pathUtils.movingFileToFolder(file, processedPath);
                                        }
                                    });
                                    logger.info('Pushing ' + args.record.length + ' records of ' + sourceType.folder + ' to ServiceNow');
                                } catch (e) {
                                    console.log('error');
                                    logger.error('Error when connecting to Odyssey' + e);
                                    var errorFolder = pathUtils.getPath(config.repositories.data, 'error/');
                                    pathUtils.movingFileToFolder(file, errorFolder);
                                }

                            });
                        } catch (e) {
                            logger.error('Error when connecting to Odyssey' + file);
                            var errorFolder = pathUtils.getPath(config.repositories.data, 'error/');
                            pathUtils.movingFileToFolder(file, errorFolder);
                        }

                    } else {
                        logger.warn('Unknown source type, no call to ServiceNow');
                        //MOVE TO Unknown
                        //shell.mv('-n', file, DATA_FOLDER + '/unknown'); //Move file to folder
                        var unknownFolder = pathUtils.getPath(config.repositories.data, 'unknown/');
                        var unknownPath = pathUtils.getPath(unknownFolder, fileName + '_' + formatedDate);
                        pathUtils.movingFileToFolder(file, unknownFolder, unknownPath);
                    }
                } catch (exception) {
                    logger.warn('Unknown source type, no call to ServiceNow for file' + file);
                    //MOVE TO Unknown
                    //shell.mv('-n', file, DATA_FOLDER + '/unknown'); //Move file to folder
                    var unknownNoMatchFolder = pathUtils.getPath(config.repositories.data, 'unknown/');
                    var unknownNoMatchPath = pathUtils.getPath(unknownNoMatchFolder, fileName + '_' + formatedDate);
                    pathUtils.movingFileToFolder(file, unknownNoMatchFolder, unknownNoMatchPath);
                }
            });
        });
    },
    setFilename: function (f) {
        this.filename = f;
    }
};

module.exports = Plugin;