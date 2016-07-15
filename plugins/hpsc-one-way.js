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

var Plugin = {
    filename: '',
    getName: function () {
        return 'HPSC Integration'
    },
    getFilename: function () {
        return 'hpsc-one-way.js'
    },
    isValid: function (file) {
        return false;
    },
    start: function () {
        console.log('[HP SC] Processing', this.filename)
    },
    setFilename: function (f) {
        this.filename = f;
    }
};

module.exports = Plugin;