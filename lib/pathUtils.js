var path = require('path');
var winston = require('winston');
require('shelljs/global');
var dateFormat = require('dateformat');
var config = require(path.resolve('config', 'config.json'));

var pathUtils = {

    /**
     * This function helps getting the path and add final
     *
     *
     *
     **/
    getFilePath: function(folder, file) {
        this.testFolderExist(folder);
        return path.resolve(folder, file);
    },


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
    movingFileToFolder: function(file, folder, dest) {
        var dest = dest || folder;

        this.testFolderExist(folder);
        mv('-n', file, dest);
        //logger.info("Moving file " + file + " to " + dest);
    },

    moveToUnknownFolder : function (f, logger, callback){
        callback = callback || function(){};
        // No plugin matches
        var formatedDate = dateFormat(new Date(), "yyyymmddHHMMssl");
        var fileName = path.basename(f);
        var unknownFolder = path.join(config.repositories.data, 'unknown');
        var unknownPath = pathUtils.getFilePath(unknownFolder, fileName + '_' + formatedDate);
        try{
            pathUtils.movingFileToFolder(f, unknownFolder, unknownPath);
        }catch(e){
            logger.error('Unable to move file in Unknown folder', f);
           return callback(e, null);
        }
        logger.error('Unknown format', f);
        return callback(null, true);


    },

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
    testFolderExist: function(folder) {
        if (!test('-d', folder)) {
            mkdir('-p', folder);
            if (logger) {
                //logger.info('Creation of folder ' + folder);
            } else {
                console.info('Creation of folder ' + folder);
            }
        }
    }
};

var logger = new(winston.Logger)({
    transports: [
        new(winston.transports.File)({
            filename: pathUtils.getFilePath(config.repositories.logs, 'logs'),
            json: false,
            level: config.monitoring.log_levels
        })
    ]
});

module.exports = pathUtils;
