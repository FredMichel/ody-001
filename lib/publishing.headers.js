/**
 *   Header definition to verify fiel content
 *
 **/
var workstationHeader = ['AD_DOMAINNAME', 'CI_STATUS', 'ASSETTAG', 'COMPUTERTYPE', 'ID_LOCATION', 'ID_WORKSTATION', 'OSTYPE', 'SERIALNUMBER', 'ID_MODEL', 'ID_PERSON'];
var personHeader = ['CI_STATUS', 'ID_PERSON', 'TITLE', 'LASTNAME', 'FIRSTNAME', 'EMAIL', 'MOBILEPHONENUMBER', 'PHONENUMBER', 'IS_GIT', 'IS_DRS', 'IS_COMEX', 'IS_VIP', 'ID_LOCATION', 'ID_MANAGER', 'ID_SECRETARY', 'ID_COSTCENTER', 'ID_BUSINESSLINE', 'ID_PRODUCTLINE', 'ID_ESF'];
var esfHeader = ['ID_ESF', 'NAME', 'ID_ESF_PARENT'];
var locationHeader = ['CI_STATUS', 'LOCATIONLEVEL', 'LOCATIONTYPE', 'NAME', 'ID_LOCATION', 'ID_LOCATION_PARENT', 'ADDRESS1', 'ADDRESS2', 'ZIP', 'CITY', 'COUNTRYNAME'];
var scannerHeader = ['CI_STATUS', 'ID_SCANNER', 'ID_MODEL', 'ID_COMPUTER', 'ID_LOCATION', 'ID_PERSON', 'SERIALNUMBER', 'WARRANTYENDDATE'];
var modelHeader = ['ID_BRAND', 'ID_MODEL', 'ID_MODEL_PARENT', 'ID_NATURE', 'CI_STATUS', 'NAME'];
var brandHeader = ['ID_BRAND', 'ID_BRAND_PARENT', 'COMPANYNAME', 'CI_STATUS', 'NAME'];
var bl_plHeader = ['ID_LINE', 'NAME', 'ID_LINE_PARENT', 'TYPE', 'CI_STATUS'];
var citrixfarmHeader = ['CI_STATUS', 'ENVIRONMENT', 'ID_CITRIXFARM', 'NAME'];
var monitorHeader = ['ID_MONITOR', 'ID_COMPUTER', 'ID_MODEL', 'ID_PERSON', 'SERIALNUMBER', 'SIZE', 'CI_STATUS', 'ID_LOCATION'];
var citrixpoolHeader = ['CI_STATUS', 'ID_CITRIXPOOL', 'ID_CITRIXFARM', 'NAME'];
var printerHeader = ['CI_STATUS', 'ASSETTAG', 'ID_PRINTER', 'PRINTERQUEUE', 'SERIALNUMBER', 'ID_MODEL', 'ID_SERVER', 'ID_LOCATION', 'ID_PERSON'];
var applicationHeader = ['APPLICATIONTYPE', 'CI_STATUS', 'APPLICATIONCODE', 'APPLICATIONNAME', 'APPLICATIONOTHERNAME', 'ID_APPLICATIONMANAGER', 'ID_MANAGEMENTTEAM'];
var certificateHeader = ['CI_STATUS', 'CERTIFICATENAME', 'ID_MANAGEMENTTEAM', 'APPLICATIONNAME'];
var companyHeader = ['ID_COMPANY', 'COMPANYNAME', 'CI_STATUS', 'QUALIF1', 'QUALIF2', 'PHONENUMBER', 'FAXNUMBER'];


/**
 * Defintion of the mapping object + configuration
 *
 **/

var sourceTypeObj = {
    workstation: {
        url: 'u_workstation_import_list.do.wsdl',
        header: workstationHeader,
        folder: 'workstation',
        mapping: {
            u_ad_domainname: 0,
            u_assettag: 2,
            u_ci_status: 1,
            u_computertype: 3,
            u_id_location: 4,
            u_id_model: 8,
            u_id_person: 9,
            u_id_workstation: 5,
            u_ostype: 6,
            u_serialnumber: 7
        }
    },
    person: {
        url: 'u_person_user_import_list.do.wsdl',
        header: personHeader,
        folder: 'person',
        mapping: {
            u_ci_status: 0,
            u_email: 5,
            u_firstname: 4,
            u_id_businessline: 0,
            u_id_costcenter: 15,
            u_id_esf: 18,
            u_id_location: 12,
            u_id_manager: 13,
            u_id_person: 1,
            u_id_productline: 17,
            u_id_secretary: 14,
            u_is_comex: 10,
            u_is_drs: 9,
            u_is_git: 8,
            u_is_vip: 11,
            u_ï__ci_status: 0,
            u_lastname: 3,
            u_mobilephonenumber: 6,
            u_phonenumber: 7,
            u_title: 2
        }
    },
    esf: {
        url: 'u_u_esf_department_import_list.do.wsdl',
        header: esfHeader,
        folder: 'esf',
        mapping: {
            u_id_esf: 0,
            u_id_esf_parent: 2,
            u_name: 1
        }
    },
    location: {
        url: 'u_location_import_list.do.wsdl',
        header: locationHeader,
        folder: 'location',
        mapping: {
            u_address1: 6,
            u_address2: 7,
            u_city: 9,
            u_ci_status: 0,
            u_countryname: 10,
            u_id_location: 4,
            u_id_location_parent: 5,
            u_ï__ci_status: 0,
            u_locationlevel: 1,
            u_locationtype: 2,
            u_name: 3,
            u_zip: 8
        }
    },
    scanner: {
        url: 'u_scanner_import_list.do.wsdl',
        header: scannerHeader,
        folder: 'scanner',
        mapping: {
            u_ci_status: 0,
            u_id_computer: 3,
            u_id_location: 4,
            u_id_model: 2,
            u_id_person: 5,
            u_id_scanner: 1,
            u_serialnumber: 6,
            u_warrantyenddate: 7
        }
    },
    model: {
        url: 'u_model_import_list.do.wsdl',
        header: modelHeader,
        folder: 'model',
        mapping: {
            u_ci_status: 4,
            u_id_brand: 0,
            u_id_model: 1,
            u_id_model_parent: 2,
            u_id_nature: 3,
            u_name: 5,
        }
    },
    brand: {
        url: 'u_brand_import_list.do.wsdl',
        header: brandHeader,
        folder: 'brand',
        mapping: {
            u_ci_status: 3,
            u_companyname: 2,
            u_id_brand: 0,
            u_id_brand_parent: 1,
            u_ï__id_brand: 0,
            u_name: 4,
        }
    },
    bl_pl: {
        url: 'u_bl_pl_import_list.do.wsdl',
        header: bl_plHeader,
        folder: 'bl_pl',
        mapping: {
            u_ci_status: 4,
            u_id_line_parent: 2,
            u_ï__id_line: 0,
            u_name: 1,
            u_type: 3
        }
    },
    citrixfarm: {
        url: 'u_citrix_farm_import_list.do.wsdl',
        header: citrixfarmHeader,
        folder: 'citrixfarm',
        mapping: {
            u_environment: 1,
            u_id_citrixfarm: 2,
            u_ï__ci_status: 0,
            u_name: 3
        }
    },
    monitor: {
        url: 'u_monitor_import_list.do.wsdl',
        header: monitorHeader,
        folder: 'monitor',
        mapping: {
            u_ci_status: 6,
            u_id_computer: 1,
            u_id_location: 7,
            u_id_model: 2,
            u_id_monitor: 0,
            u_id_person: 3,
            u_serialnumber: 4,
            u_size: 5
        }
    },
    citrixpool: {
        url: 'u_citrix_pool_import_list.do.wsdl',
        header: citrixpoolHeader,
        folder: 'citrixpool',
        mapping: {
            u_id_citrixfarm: 2,
            u_id_citrixpool: 1,
            u_ï__ci_status: 0,
            u_name: 3
        }
    },
    printer: {
        url: 'u_printer_import_list.do.wsdl',
        header: printerHeader,
        folder: 'printer',
        mapping: {
            u_assettag: 1,
            u_ci_status: 0,
            u_id_location: 7,
            u_id_model: 5,
            u_id_person: 8,
            u_id_printer: 2,
            u_id_server: 6,
            u_printerqueue: 3,
            u_serialnumber: 4
        }
    },
    application: {
        url: 'u_application_import_list.do.wsdl',
        header: applicationHeader,
        folder: 'application',
        mapping: {
            u_applicationcode: 2,
            u_applicationname: 3,
            u_applicationothername: 4,
            u_applicationtype: 0,
            u_ci_status: 1,
            u_id_applicationmanager: 5,
            u_id_managementteam: 6
        }
    },
    certificate: {
        url: 'u_certificate_import_list.do.wsdl',
        header: certificateHeader,
        folder: 'certificate',
        mapping: {
            u_applicationname: 3,
            u_certificatename: 1,
            u_ci_status: 0,
            u_id_managementteam: 2
        }
    },
    company: {
        url: 'u_company_import_list.do.wsdl',
        header: companyHeader,
        folder: 'company',
        mapping: {
            u_ci_status: 2,
            u_companyname: 1,
            u_faxnumber: 6,
            u_id_company: 0,
            u_ï__id_company: 0,
            u_phonenumber: 5,
            u_qualif1: 3,
            u_qualif2: 4
        }
    }
}

module.exports = sourceTypeObj;