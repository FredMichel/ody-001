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
var parseString = require('xml2js').parseString;
var path = require('path');


var sourceTypeObj = require('../lib/hpscOneWay.headers');
var pathUtils = require('../lib/pathUtils.js');
var parseUtils = require('../lib/parseUtils.js');

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
    getName: function () {
        return 'HPSC Integration'
    },
    getFilename: function () {
        return 'hpsc-one-way.js'
    },
    /**
     * Set true to enable plugin, Set to false to disable plugin
     **/
    isValid: function (file) {
        return true;
    },
    start: function () {
        var file = this.filename;
        var fileName = path.basename(file);
        var formatedDate = dateFormat(new Date(), "yyyymmddHHMMssl");
        var unknownFolder = path.join(config.repositories.data, 'unknown');
        var unknownPath = pathUtils.getFilePath(unknownFolder, fileName + '_' + formatedDate);
        var errorFolder = path.join(config.repositories.data, 'error');
        var errorPath = pathUtils.getFilePath(errorFolder, fileName + '_' + formatedDate);

        logger.info(this.getName(), ' - Processing', this.getFilename());

        try {
            /**
             * Read file in drop folder
             **/
            fs.readFile(this.filename, function (err, data) {
                try {
                    if (err) {
                        logger.warn('Error parsing dropped file: ' + err);
                        pathUtils.movingFileToFolder(file, errorFolder, errorPath);
                        return false;
                    }
                    /**
                     * Process file in drop folder
                     **/
                    parseString(data, function (err, result) {
                        try {
                            if (err) {
                                logger.warn('Unknown source type, no call to ServiceNow for file' + file);
                                pathUtils.movingFileToFolder(file, unknownFolder, unknownPath);
                            }
                            var sourceType = "Unknown";
                            var args = {
                                record: []
                            };
                            var fileNameSplit = fileName.split("_");
                            /**
                             *  Get action. E.g 'UPDATE', 'CREATE', 'CLOSE' etc.
                             **/
                            var action = fileNameSplit[2];
                            /**
                             *  resultObj contains the relevant content of the XML in an JSON object
                             **/
                            var resultObj = result.GATEWAY_SC2SNOW.unload[0];
                            var sourceData = {};
                            /**
                             * Looping through the entire resultObj content to retrieve the "table" value
                             **/
                            for (var name in resultObj) {
                                var value = resultObj[name];
                                /**
                                 * Loop throught sourceTypeObj (Header) to find a match of table type. E.g incident, request etc.
                                 **/
                                for (var id in sourceTypeObj) {
                                    var obj = sourceTypeObj[id];
                                    if (obj.type == name) {
                                        sourceType = obj;
                                        sourceData = resultObj[sourceType.type][0];
                                    }
                                }
                            }
                            if (sourceType != 'Unknown') {
                                /**
                                 * Parse the source data to lowercase and add 'u_' to the property to match with SNOW
                                 **/
                                sourceData = parseUtils.parseData(sourceData);

                                var errFolder = path.join(config.repositories.data, sourceType.folder, 'error');
                                var errPath = pathUtils.getFilePath(errFolder, fileName + '_' + formatedDate);

                                try {
                                    /**
                                     * Call to SNOW
                                     **/
                                    soap.createClient(pathUtils.getFilePath(config.repositories.wsdl, sourceType.url), function (err, client) {
                                        try {
                                            /**
                                             *  Basic authentication to SNOW
                                             **/
                                            client.setSecurity(new soap.BasicAuthSecurity(config.servicenow.credentials.login, config.servicenow.credentials.password));
                                            /**
                                             *  Insert action to SNOW import set webservice
                                             **/
                                            client.insert(sourceData, function (err, result) {
                                                if (err) {
                                                    /**
                                                     * If error occurs, log and move to error folder
                                                     **/
                                                    logger.error("An error occured during the SOAP call to ServiceNow : " + err);
                                                    pathUtils.movingFileToFolder(file, errFolder, errPath);
                                                } else {
                                                    /**
                                                     * If no error, log and move to processed folder
                                                     **/
                                                    logger.info("Response from Odyssey: \n" + parseUtils.getStatusSummary(result, 'hpsc'));
                                                    var processedFolder = path.join(config.repositories.data, sourceType.folder, 'processed');
                                                    var processedPath = pathUtils.getFilePath(processedFolder, fileName + '_' + formatedDate);
                                                    pathUtils.movingFileToFolder(file, processedFolder, processedPath);
                                                }
                                            });
                                            logger.info('Pushing record of ' + sourceType.folder + ' to ServiceNow');
                                        } catch (e) {
                                            logger.error('Error when connecting to Odyssey' + e);
                                            pathUtils.movingFileToFolder(file, errFolder, errPath);
                                        }
                                    });
                                } catch (err) {
                                    logger.error('Error when connecting to Odyssey' + err);
                                    pathUtils.movingFileToFolder(file, errFolder, errPath);
                                }
                            } else {
                                logger.warn('Unknown source type, no call to ServiceNow');
                                pathUtils.movingFileToFolder(file, unknownFolder, unknownPath);
                            }
                        } catch (err) {
                            logger.warn('Unknown source type, no call to ServiceNow for file' + file);
                            pathUtils.movingFileToFolder(file, unknownFolder, unknownPath);
                        }
                    });
                } catch (err) {
                    logger.warn('Error parsing dropped file: ' + err);
                    pathUtils.movingFileToFolder(file, errorFolder, errorPath);
                }
            });
        } catch (err) {
            logger.warn('Error reading file system: ' + err);
            pathUtils.movingFileToFolder(file, errorFolder, errorPath);
        }
    },
    setFilename: function (f) {
        this.filename = f;
    }
};

module.exports = Plugin;