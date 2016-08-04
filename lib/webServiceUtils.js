var path = require('path');
var winston = require('winston');
var _ = require('lodash');
var request = require('request');

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
    getStatusCountSummary: function(jsonObj) {

        var summaryObj = {
            countIgnored: 0,
            countInsert: 0,
            countUpdate: 0,
            countSkipped: 0,
            countError: 0
        };

        var recordsArray = jsonObj.records;

        if (typeof jsonObj == 'undefined' ||  jsonObj === null) {
            return summaryObj;
        }

        recordsArray.forEach(function(record) {
            if (record.sys_import_state == "ignored")
                ++summaryObj.countIgnored;
            else if (record.sys_import_state == "inserted") {
                ++summaryObj.countInsert;
            } else if (record.sys_import_state == "updated") {
                ++summaryObj.countUpdate;
            } else if (record.sys_import_state == "skipped") {
                ++summaryObj.countSkipped;
            } else if (record.sys_import_state == "error") {
                ++summaryObj.countError;
            }
        });
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
    getStatusSummary: function(jsonObj, plugin) {
        if (typeof jsonObj == 'undefined' ||  jsonObj === null) {
            return 'No record to be imported';
        }

        var countSum = this.getStatusCountSummary(jsonObj);

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
            " Error " + countSum.countError + "] ";
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
    getResponseXML: function(jsonObj, rawSource, plugin) {
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
                '<correlation_id>' + rawSource.HPSCID + '</correlation_id> \n' +
                '<status>' + status + '</status> \n' +
                '<message>Completed</message> \n' +

                '</odysseyResponse>';
        }

        return xml_body || false;
    },

    makeRequestCallWithProxy: function(sourceType, requestBody, callback) {
        callback = callback || function() {};
        logger.info('[ ' + sourceType.folder + ' ]Making a Request though proxy ' + config.proxy.url);
        request.post({
                url: config.servicenow.url + '/' + sourceType.importTable + '.do?JSONv2&sysparm_action=insert',
                proxy: config.proxy.url,
                tunnel: true,
                auth: {
                    user: config.servicenow.credentials.login,
                    pass: config.servicenow.credentials.password,
                    sendImmediately: false
                },
                json: true,
                body: requestBody,
            },
            function(err, response, body) {
                callback(err, response, body);
            });
    },

    makeRequestCallNoProxy: function(sourceType, requestBody, callback) {
        callback = callback || function() {};
        logger.info('[ ' + sourceType.folder + ' ] Making a Request without a proxy.');

        request.post({
                url: config.servicenow.url + '/' + sourceType.importTable + '.do?JSONv2&sysparm_action=insert',
                auth: {
                    user: config.servicenow.credentials.login,
                    pass: config.servicenow.credentials.password,
                    sendImmediately: true
                },
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                json: true,
                body: requestBody,
            },
            function(err, response, body) {
                callback(err, response, body);
            });
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
    parseDataHPSC: function(sourceData, action) {
        /**var newSourceData = {};
        newSourceData.u_action = '<![CDATA[' + action + ']]>';
        for (var i in sourceData) {
            var newName = 'u_' + i.toLowerCase();
            newSourceData[newName] = '<![CDATA[' + sourceData[i] + ']]>';
        }**/
        var newSourceData = {};
        newSourceData.u_action = action;
        _.forEach(sourceData, function(value, key) {
            var newName = 'u_' + key.toLowerCase();
            newSourceData[newName] = value.toString();
        });
        return newSourceData;
    }
};

module.exports = parseUtils;
