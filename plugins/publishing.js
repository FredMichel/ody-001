var Plugin = {
  filename : '',
  getName : function (){
    return 'Publishing Integration'
  },
  getFilename : function (){
    return 'publishing.js'
  },
  isValid : function (file){
    return true;
  },
  start : function (){
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
  },
  setFilename : function (f){
    this.filename = f;
  }
};

module.exports = Plugin;