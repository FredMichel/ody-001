var path = require('path');
var winston = require('winston');

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
        var arrayTest = jsonObj.insertResponse;
        for (var id in arrayTest) {
            //console.log(arrayTest[id].status);
            //console.log(summaryObj.countIgnored+=1 +"tets +=1");
            if (arrayTest[id].status == "ignored") {
                ++summaryObj.countIgnored;
            } else if (arrayTest[id].status == "inserted") {
                ++summaryObj.countInsert;
            } else if (arrayTest[id].status == "updated") {
                ++summaryObj.countUpdate;
            } else if (arrayTest[id].status == "skipped") {
                ++summaryObj.countSkipped;
            } else if (arrayTest[id].status == "error") {
                ++summaryObj.countError;
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
    getStatusSummary: function(jsonObj) {
        var countSum = this.getStatusCountSummary(jsonObj);
        return "Inserted " + countSum.countInsert + "\n" +
            "Updated " + countSum.countUpdate + "\n" +
            "Ignored " + countSum.countIgnored + "\n" +
            "Skipped " + countSum.countSkipped + "\n" +
            "Error " + countSum.countError;
    }
};

module.exports = parseUtils;
