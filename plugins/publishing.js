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

require('shelljs/global');

var sourceTypeObj = require('../lib/publishing.headers');

var Plugin = {
    filename: '',

    getName: function () {
        return 'Publishing Integration'
    },
    getFilename: function () {
        return 'publishing.js'
    },
    isValid: function (file) {
        return true;
    },
    start: function () {
        var file = this.filename;
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
                var fileFolders = file.split('/');
                var fileName = fileFolders[(fileFolders.length - 1)];

                try {
                    output.forEach(function (line, i) {
                        if (i == 0) {
                            for (var id in sourceTypeObj) {
                                var obj = sourceTypeObj[id];

                                if (_.difference(line, obj.header).length == 0) {
                                    sourceType = obj;
                                    var inFolder = config.repositories.data + sourceType.folder + '/in/';
                                    var inPath = inFolder + fileName + '_' + formatedDate;
                                    movingFileToFolder(file, inFolder, inPath);
                                    file = inPath;
                                    break;
                                }
                            }
                        }
                        if (i != 0 && sourceType != 'Unknown' && i < 2000) {
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

                        soap.createClient(config.repositories.wsdl + sourceType.url, function (err, client) {
                            winston.info('Pushing ' + args.record.length + ' records of ' + sourceType.header + ' to ServiceNow');
                            client.setSecurity(new soap.BasicAuthSecurity(config.servicenow.credentials.login, config.servicenow.credentials.password));
                            client.insertMultiple(args, function (err, result) {
                                if (err) {
                                    winston.error("An error has happende during the SOAP call to ServiceNow : " + err);
                                    //MOVE TO SPECIFIC FOLDER (sourceType.path+'error')
                                    //shell.mv('-n', file, DATA_FOLDER + '/' + sourceType.folder + '/error');
                                    var errorPath = config.repositories.data + sourceType.folder + '/error/';
                                    movingFileToFolder(file, errorPath);
                                } else {
                                    winston.info("This is the SOAP Response " + result.toString());
                                    //MOVE TO SPECIFIC FOLDER (sourceType.path+'processed')
                                    //shell.mv('-n', file, DATA_FOLDER + '/' + sourceType.folder + '/processed'); //Move file to folder
                                    var processedPath = config.repositories.data + sourceType.folder + '/processed/';
                                    movingFileToFolder(file, processedPath);
                                }
                            });
                        });
                    } else {
                        winston.warn('Unknown source type, no call to ServiceNow');
                        //MOVE TO Unknown
                        //shell.mv('-n', file, DATA_FOLDER + '/unknown'); //Move file to folder
                        var unknownFolder = config.repositories.data + 'unknown/';
                        var unknownPath = unknownFolder + fileName + '_' + formatedDate;
                        movingFileToFolder(file, unknownFolder, unknownPath);
                    }
                } catch (exception) {
                    winston.warn('Unknown source type, no call to ServiceNow for file' + file);
                    //MOVE TO Unknown
                    //shell.mv('-n', file, DATA_FOLDER + '/unknown'); //Move file to folder
                    var unknownFolder = config.repositories.data + 'unknown/';
                    var unknownPath = unknownFolder + fileName + '_' + formatedDate;
                    movingFileToFolder(file, unknownFolder, unknownPath);
                }
            });
        });
    },
    setFilename: function (f) {
        this.filename = f;
    }
};

/**
 * This function tests if a folder exists.
 * If not it will be created as well as the intermediate folder if necessary
 * 
 * Parameters:
 * - folder: the folder to check existence
 * 
 * Return:
 * - void
 */
function testFolderExist(folder) {
    if (!test('-d', folder)) {
        mkdir('-p', folder);
        winston.info('Creation of folder ' + folder);
    }
}

/**
 * This function is moving a file from a folder to an other
 * 
 * Parameters:
 * - file: the file to move
 * - folder: desination folder
 * - dest: destintion forlder or file if a renaming is made
 * 
 * Return:
 * - void
 */
function movingFileToFolder(file, folder, dest) {
    var dest = dest || folder;

    testFolderExist(folder);
    mv('-n', file, dest);
    winston.info("Moving file " + file + " to " + dest);
}

module.exports = Plugin;