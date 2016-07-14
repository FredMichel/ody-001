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
                return console.log(err);
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

                output.forEach(function (line, i) {
                    if (i == 0) {
                        for (var id in sourceTypeObj) {
                            var obj = sourceTypeObj[id];

                            if (_.difference(line, obj.header).length == 0) {
                                sourceType = obj;
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
                        //mv('-n', file, config.repositories.input + '/' + sourceType.folder + '/in/' + fileName);
                    } else if (i > 2000) {
                        return;
                    }
                });
                //console.log('sourcetype', sourceType);
                if (sourceType != 'Unknown') {

                    soap.createClient(config.repositories.wsdl + sourceType.url, function (err, client) {
                        //console.log('Pushing', args.record.length, 'records of ', sourceType.header, ' to ServiceNow');
                        client.setSecurity(new soap.BasicAuthSecurity(config.servicenow.credentials.login, config.servicenow.credentials.password));
                        client.insertMultiple(args, function (err, result) {
                            console.log(result)
                            if (err) {
                                console.log('ERROR', err);
                                //MOVE TO SPECIFIC FOLDER (sourceType.path+'error')
                                //shell.mv('-n', file, DATA_FOLDER + '/' + sourceType.folder + '/error');
                                mv('-n', file, config.repositories.data + '/' + sourceType.folder + '/error/' + fileName + '_' + formatedDate);
                            } else {
                                console.log(result);
                                //MOVE TO SPECIFIC FOLDER (sourceType.path+'processed')
                                //shell.mv('-n', file, DATA_FOLDER + '/' + sourceType.folder + '/processed'); //Move file to folder
                                mv('-n', file, config.repositories.data + '/' + sourceType.folder + '/processed/' + fileName + '_' + formatedDate);
                            }
                        });
                    });
                } else {
                    console.log('Unknown source type, no call to ServiceNow');
                    //MOVE TO Unknown
                    //shell.mv('-n', file, DATA_FOLDER + '/unknown'); //Move file to folder
                    mv('-n', file, config.repositories.data + '/unknown/' + fileName + '_' + formatedDate);
                }
            });
        });
    },
    setFilename: function (f) {
        this.filename = f;
    }
};

module.exports = Plugin;