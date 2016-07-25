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


//var sourceTypeObj = require(path.resolve('lib', 'hspc-one-way.headers.js'));
var sourceTypeObj = require('../lib/hpscOneWay.headers');
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
    getName: function () {
        return 'HPSC Integration'
    },
    getFilename: function () {
        return 'hpsc-one-way.js'
    },
    isValid: function (file) {
        return true;
    },
    start: function () {
        var file = this.filename;
        var errorFolder = pathUtils.getPath(config.repositories.data, 'error/');

        logger.info(this.getName(), ' - Processing', this.getFilename());
        //try catch
        try {
            fs.readFile(this.filename, function (err, data) {
                try {
                    parseString(data, function (err, result) {
                        try {
                            var sourceType = "Unknown";
                            var args = {
                                record: []
                            };
                            var dataModel = {};
                            var fileName = path.basename(file);
                            var fileNameSplit = fileName.split("_");
                            var action = fileNameSplit[2];
                            var resultObj = result.GATEWAY_SC2SNOW.unload[0];
                            var sourceData = {};

                            for (var name in resultObj) {
                                var value = resultObj[name];

                                for (var id in sourceTypeObj) {
                                    var obj = sourceTypeObj[id];
                                    if (obj.type == name) {
                                        sourceType = obj.type;
                                        sourceData = resultObj[sourceType][0];
                                        dataModel = sourceTypeObj[sourceType];
                                    }
                                }
                            }

                            sourceData = parseUtils.parseData(sourceData, action);

                            if (sourceType != 'Unknown') {
                                //PARSE sourceData with lowercase and u_
                                //Call to SNOW
                                try {
                                    soap.createClient(pathUtils.getPath(config.repositories.wsdl, dataModel.url), function (err, client) {

                                        try {

                                            client.setSecurity(new soap.BasicAuthSecurity(config.servicenow.credentials.login, config.servicenow.credentials.password));

                                            client.insert(sourceData, function (err, result) {

                                                if (err) {
                                                    logger.error("An error occured during the SOAP call to ServiceNow : " + err);
                                                    var errorPath = pathUtils.getPath(config.repositories.data, dataModel.folder + '/error/');
                                                    pathUtils.movingFileToFolder(file, errorPath);
                                                } else {

                                                    logger.info("Response from Odyssey: \n" + parseUtils.getStatusSummary(result, 'hpsc'));
                                                    var processedPath = pathUtils.getPath(config.repositories.data, dataModel.folder + '/processed/');
                                                    pathUtils.movingFileToFolder(file, processedPath);
                                                }
                                            });
                                            logger.info('Pushing ' + sourceData.length + ' records of ' + dataModel.folder + ' to ServiceNow');
                                        } catch (e) {
                                            console.log('error');
                                            logger.error('1 Error when connecting to Odyssey' + e);
                                            pathUtils.movingFileToFolder(file, errorFolder);
                                        }

                                    });
                                } catch (e) {
                                    console.log('error');
                                    logger.error('2 Error when connecting to Odyssey' + e);
                                    pathUtils.movingFileToFolder(file, errorFolder);
                                }


                            }


                        } catch (err) {
                            logger.warn('Unknown source type, no call to ServiceNow for file' + file);
                            pathUtils.movingFileToFolder(file, errorFolder);
                        }

                    });
                } catch (err) {
                    logger.warn('Error parsing XML file: ' + err);
                    pathUtils.movingFileToFolder(file, errorFolder);
                }
            });
        } catch (err) {
            logger.warn('Error reading file system: ' + err);
            pathUtils.movingFileToFolder(file, errorFolder);
        }
    },
    setFilename: function (f) {
        this.filename = f;
    }
};

module.exports = Plugin;