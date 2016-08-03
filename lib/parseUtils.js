var path = require('path');
var winston = require('winston');
var _ = require('lodash');

var config = require(path.resolve('config', 'config.json'));
var pathUtils = require(path.resolve('lib', 'pathUtils.js'));

var logger = new(winston.Logger)({
    transports: [
        new(winston.transports.File)({
            filename: pathUtils.getFilePath(config.repositories.logs, 'logs'),
            json: false,
            level: config.monitoring.log_levels
        })
    ]
});


var parseUtils = {

    /**
     *  This function helps returning the summary of the status of an import
     *
     * Parameters:
     * - jsonObj: an json object
     *
     * Return:
     * - a summary of a JSON response
     *
     *
     **/
    getStatusCountSummary: function (jsonObj, plugin) {

        var summaryObj = {
            countIgnored: 0,
            countInsert: 0,
            countUpdate: 0,
            countSkipped: 0,
            countError: 0
        };


        if (typeof jsonObj=='undefined' || jsonObj==null){
            return  summaryObj;
        }
        if (plugin == 'hpsc') {

            if (jsonObj.status == "ignored")
                ++summaryObj.countIgnored;
            else if (jsonObj.status == "inserted") {
                ++summaryObj.countInsert;
            } else if (jsonObj.status == "updated") {
                ++summaryObj.countUpdate;
            } else if (jsonObj.status == "skipped") {
                ++summaryObj.countSkipped;
            } else if (jsonObj.status == "error") {
                ++summaryObj.countError;
            }
        } else {
            if (jsonObj.hasOwnProperty('insertMultipleResponse')) {
                return {
                    countIgnored: 'N/A',
                    countInsert: 'N/A',
                    countUpdate: 'N/A',
                    countSkipped: 'N/A',
                    countError: 'N/A'
                };
            }
            var arrayTest = jsonObj.insertResponse;
            for (var id in arrayTest) {
                var response = arrayTest[id];
                if (response.status == "ignored") {
                    ++summaryObj.countIgnored;
                } else if (response.status == "inserted") {
                    ++summaryObj.countInsert;
                } else if (response.status == "updated") {
                    ++summaryObj.countUpdate;
                } else if (response.status == "skipped") {
                    ++summaryObj.countSkipped;
                } else if (response.status == "error") {
                    ++summaryObj.countError;
                }
            }
        }

        return summaryObj;
    },

    /**
     *  This function helps returning the summary of the status of an import
     *
     * Parameters:
     * - jsonObj: an json object
     *
     * Return:
     * - a summary of a JSON response
     *
     *
     **/
    getStatusSummary: function (jsonObj, plugin) {

        var countSum;
        if (typeof jsonObj=='undefined' || jsonObj==null){
            return  'No record to be imported';
        }
        if (plugin == 'hpsc') {
            countSum = this.getStatusCountSummary(jsonObj, plugin);
        } else
            countSum = this.getStatusCountSummary(jsonObj);


        if (jsonObj.status == 'error') {
            response_message = jsonObj.error_message;
        } else {
            if (jsonObj.status == 'inserted')
                response_message = 'Record ' + jsonObj.display_value + ' inserted successfully';
            else if (jsonObj.status == 'updated')
                response_message = 'Record ' + jsonObj.display_value + ' updated successfully';
            else
                response_message = jsonObj.status_message;
        }

        return " [ Inserted " + countSum.countInsert +
            " Updated " + countSum.countUpdate +
            " Ignored " + countSum.countIgnored +
            " Skipped " + countSum.countSkipped +
            " Error " + countSum.countError + "] " ;
    },

    /**
     *  This function build an XML to be passed to HPSC
     *
     * Parameters:
     * - jsonObj: an json object
     *
     * Return:
     * - file
     *
     *
     **/
    getResponseXML: function (jsonObj, rawSource, plugin) {
        var scope, number, status, response_message, xml_body;
        if (plugin == 'hpsc') {
            scope = jsonObj.table;
            number = jsonObj.display_value;
            status = jsonObj.status;
            if (jsonObj.status == 'error') {
                response_message = jsonObj.error_message;
            } else {
                if (jsonObj.status == 'inserted')
                    response_message = 'Record ' + jsonObj.display_value + ' inserted successfully';
                else if (jsonObj.status == 'updated')
                    response_message = 'Record ' + jsonObj.display_value + ' updated successfully';
                else
                    response_message = jsonObj.status_message;
            }

            xml_body = '<?xml version="1.0" encoding="UTF-8"?> \n' +
                '<odysseyResponse> \n' +
                '<scope>' + scope + '</scope> \n' +
                '<number>' + number + '</number> \n' +
                '<correlation_id>' + rawSource['HPSCID'] + '</correlation_id> \n' +
                '<status>' + status + '</status> \n' +
                '<message>Completed</message> \n' +

                '</odysseyResponse>';
        }

        return xml_body || false;

    },


    /**
     *  This function parses raw source data to SNOW recognizable data
     *  To lower case and adding 'u_' in each property
     * Parameters:
     * - sourceData: Object
     * - action (Optional):
     * Return:
     * - an object of new parsed data
     *
     *
     **/
    parseData: function (sourceData, action) {
        var newSourceData = {};
        newSourceData.u_action = '<![CDATA[' + action + ']]>';
        for (var i in sourceData) {
            var newName = 'u_' + i.toLowerCase();
            newSourceData[newName] = '<![CDATA[' + sourceData[i] + ']]>';
        }
        return newSourceData;
    }
};

module.exports = parseUtils;