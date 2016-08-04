/**
 *   Header definition to verify fiel content
 *
 **/
var sourceTypeObj = {
    incident: {
        type: 'incident',
        url: 'u_incident_import_list.do.wsdl',
        importTable:'u_incident_import',
        mandatoryFields: [],
        folder: 'incident'
    }
    /**,change: {
        type: 'change',
        url: ' ',
        header: '',
        folder: 'change'
    },
    problem: {
        type: 'problem',
        url: ' ',
        header: '',
        folder: 'problem'
    }**/
};

module.exports = sourceTypeObj;
