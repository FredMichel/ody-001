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
     * This function extract a timeStamp from afileName
     *
     * @param  {[type]} fileName a file name
     * @param  {[type]} separator the separator in the file name
     * @param  {[type]} index index of the timestamp in the file name
     *
     * @return {[type]}          a string
     */
    getFileInfo: function(fileName, separator, index) {
        return (fileName.split(separator))[index];
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

    /**
     * This function move a file to an unknown folder
     * @param  {[String]}   f        a file path
     * @param  {[Obj]}   logger    a winston logger
     * @param  {Function} callback a callback function
     * @return {[type]}            void
     */
    moveToUnknownFolder: function(f, logger, callback) {
        callback = callback || function() {};
        // No plugin matches
        var formatedDate = dateFormat(new Date(), "yyyymmddHHMMssl");
        var fileName = path.basename(f);
        var unknownFolder = path.join(config.repositories.data, 'unknown');
        var unknownPath = pathUtils.getFilePath(unknownFolder, fileName + '_' + formatedDate);
        try {
            pathUtils.movingFileToFolder(f, unknownFolder, unknownPath);
        } catch (e) {
            logger.error('Unable to move file in Unknown folder', f);
            return callback(e, null);
        }
        logger.error('Unknown format', f);
        return callback(null, true);
    },

    /**
     * This function move the file in the 'In' folder
     * @param  {[type]}   file a fiel path
     * @param  {[Object]} sourceType object
     * @return {[type]}            void
     */
    moveFileToInFolder: function(file, sourceType) {
        logger.debug('[' + sourceType.folder + '] Move ' + file + ' to In folder');
        var inFolder = path.join(config.repositories.data, sourceType.folder, 'in');
        var inPath = pathUtils.getFilePath(inFolder, path.basename(file) + '_' + dateFormat(new Date(), "yyyymmddHHMMssl"));
        pathUtils.movingFileToFolder(file, inFolder, inPath);
        return inPath;
    },

    /**
     * This function move the file in the 'In' folder
     * @param  {[type]}   file a fiel path
     * @param  {[Object]} sourceType object
     * @return {[type]}            void
     */
    moveFileToErrorFolder: function(file, sourceType) {
        logger.debug('[' + sourceType.folder + '] Move ' + file + ' to Error folder');
        var errorFolder = path.join(config.repositories.data, sourceType.folder, 'error');
        var errorPath = pathUtils.getFilePath(errorFolder, path.basename(file) + '_' + dateFormat(new Date(), "yyyymmddHHMMssl"));
        pathUtils.movingFileToFolder(file, errorFolder, errorPath);
        return errorPath;
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
