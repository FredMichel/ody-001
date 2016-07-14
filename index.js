/**
 * REST API Client
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


require('shelljs/global');

var sourceTypeObj = require('./lib/publishing.headers');


/*
setInterval(function(){

  fs.writeFile("/Users/frederic/2017/odyssey-client/data/" + Math.random() + '.csv',
    "CI_STATUS;ID_PERSON;TITLE;LASTNAME;FIRSTNAME;EMAIL;MOBILEPHONENUMBER;PHONENUMBER;IS_GIT;IS_DRS;IS_COMEX;IS_VIP;ID_LOCATION;ID_MANAGER;ID_SECRETARY;ID_COSTCENTER;ID_ESF\n"+
  "NULL; UT1C0H;NULL;BILLARD;;billard@email.com;NULL;NULL;0;0;0;0;FRANCE/COURBEVOIE_25DOUMER;;;3279;NULL\n"+
  "NULL; UT1D19;NULL;MORIN;;NULL;NULL;NULL;0;0;0;0;ADETERMINER;;;8784;NULL\n" +
  "NULL; UT1DLM;NULL;DELAHOUSSE;;NULL;NULL;NULL;0;0;0;0;ADETERMINER;;;8601;NULL\n" +
  "NULL; UT1DQ5;NULL;ICHTI;;NULL;NULL;NULL;0;0;0;0;ADETERMINER;;;9574;NULL\n"


    , function(err) {
    if(err) {
      return console.log(err);
    }

    console.log("The file was saved!");
  });

}, 5000);
*/
/**var parser = new xml2js.Parser();
fs.readFile(XML_FOLDER + '/create.xml', function (err, data) {
    parser.parseString(data);
});**/

// Added new feature for moving files


watch.createMonitor(config.repositories.input, function (monitor) {
    //monitor.files['/home/mikeal/.zshrc'] // Stat object for my zshrc.
    monitor.on("created", function (f, stat) {
        console.log('New file detected !', f, stat);
        processFileCSV(f);
    });
    monitor.on("changed", function (f, curr, prev) {
        console.log('File changes detected !', f);
        processFileCSV(f);
    });
    monitor.on("removed", function (f, stat) {
        // Handle removed files
    });
    //monitor.stop(); // Stop watching
});

function processFileCSV(file) {
    fs.readFile(file, 'utf8', function (err, input) {
        if (err) {
            return console.log(err);
        }
        parse(input, {
            delimiter: ';'
        }, function (err, output) {
            var args = {
                record: []
            };

            var sourceType = "Unknown";
            var dataModel = {};
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
                if (i != 0 && sourceType != 'Unknown') {
                    var record = {};
                    var dataModel = sourceType.mapping;
                    for (var k in dataModel) {
                        record[k] = line[dataModel[k]];
                    }
                    console.log('record', record);
                    args.record.push(record);
                    //MOVE TO SPECIFIC FOLDER (sourceType.path+'in')
                    // shell.mv('-n', file, sourceType.path + '/in'); //Move file to folder
                }
            });
            console.log('sourcetype', sourceType);
            if (sourceType != 'Unknown') {
                soap.createClient(config.repositories.wsdl + sourceType.url, function (err, client) {
                    console.log('Pushing', args.record.length, 'records of ', sourceType.header, ' to ServiceNow');
                    client.setSecurity(new soap.BasicAuthSecurity(config.servicenow.credentials.login, config.servicenow.credentials.password));
                    client.insertMultiple(args, function (err, result) {
                        if (err) {
                            console.log('ERROR', err);
                            //MOVE TO SPECIFIC FOLDER (sourceType.path+'error')
                            //shell.mv('-n', file, DATA_FOLDER + '/' + sourceType.folder + '/error');
                        } else {
                            console.log(result);
                            //MOVE TO SPECIFIC FOLDER (sourceType.path+'processed')
                            //shell.mv('-n', file, DATA_FOLDER + '/' + sourceType.folder + '/processed'); //Move file to folder
                        }
                    });
                });
            } else {
                console.log('Unknown source type, no call to ServiceNow');
                //MOVE TO Unknown
                //shell.mv('-n', file, DATA_FOLDER + '/unknown'); //Move file to folder
            }
        });
    });
}
