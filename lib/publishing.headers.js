/**
 *   Header definition to verify fiel content
 *
 **/
var workstationHeader = ['AD_DOMAINNAME', 'CI_STATUS', 'ASSETTAG', 'COMPUTERTYPE', 'ID_LOCATION', 'ID_WORKSTATION', 'OSTYPE', 'SERIALNUMBER', 'ID_MODEL', 'ID_PERSON'];
var personHeader = ['CI_STATUS', 'ID_PERSON', 'TITLE', 'LASTNAME', 'FIRSTNAME', 'EMAIL', 'MOBILEPHONENUMBER', 'PHONENUMBER', 'IS_GIT', 'IS_DRS', 'IS_COMEX', 'IS_VIP', 'ID_LOCATION', 'ID_MANAGER', 'ID_SECRETARY', 'ID_COSTCENTER', 'ID_BUSINESSLINE', 'ID_PRODUCTLINE', 'ID_ESF'];
var esfHeader = ['ID_ESF', 'NAME', 'CI_STATUS', 'ID_ESF_PARENT'];
var locationHeader = ['CI_STATUS', 'LOCATIONLEVEL', 'LOCATIONTYPE', 'NAME', 'ID_LOCATION', 'ID_LOCATION_PARENT', 'ADDRESS1', 'ADDRESS2', 'ZIP', 'CITY', 'COUNTRYNAME'];
var scannerHeader = ['CI_STATUS', 'ID_SCANNER', 'ID_MODEL', 'ID_COMPUTER', 'ID_LOCATION', 'ID_PERSON', 'SERIALNUMBER', 'WARRANTYENDDATE'];
var modelHeader = ['ID_BRAND', 'ID_MODEL', 'ID_MODEL_PARENT', 'ID_NATURE', 'CI_STATUS', 'SN_CATEGORY', 'NAME'];
var brandHeader = ['ID_BRAND', 'ID_BRAND_PARENT', 'COMPANYNAME', 'CI_STATUS', 'NAME'];
var bl_plHeader = ['ID_LINE', 'NAME', 'ID_LINE_PARENT', 'TYPE', 'CI_STATUS'];
var citrixfarmHeader = ['CI_STATUS', 'ENVIRONMENT', 'ID_CITRIXFARM', 'NAME'];
var monitorHeader = ['ID_MONITOR', 'ID_COMPUTER', 'ID_MODEL', 'ID_PERSON', 'SERIALNUMBER', 'SIZE', 'CI_STATUS', 'ID_LOCATION'];
var citrixpoolHeader = ['CI_STATUS', 'ID_CITRIXPOOL', 'ID_CITRIXFARM', 'NAME'];
var printerHeader = ['CI_STATUS', 'ASSETTAG', 'ID_PRINTER', 'PRINTERQUEUE', 'SERIALNUMBER', 'ID_MODEL', 'ID_LOCATION', 'ID_PERSON'];
var applicationHeader = ['APPLICATIONTYPE', 'CI_STATUS', 'APPLICATIONCODE', 'APPLICATIONNAME', 'APPLICATIONOTHERNAME', 'ID_APPLICATIONMANAGER', 'ID_MANAGEMENTTEAM'];
var certificateHeader = ['CI_STATUS', 'CERTIFICATENAME', 'ID_MANAGEMENTTEAM', 'APPLICATIONNAME'];
var companyHeader = ['ID_COMPANY', 'COMPANYNAME', 'CI_STATUS', 'QUALIF1', 'QUALIF2', 'PHONENUMBER', 'FAXNUMBER'];


/** Tracen update **/
var managementteamHeader = ['ID_MANAGEMENTTEAM', 'EMAIL', 'ID_TEAMMANAGER', 'PENALTYPHONE', 'PHONE', 'CI_STATUS'];
var rdbmsinstanceHeader = ['CI_STATUS', 'ENGINENAME', 'ID_INSTANCE', 'ID_MANAGEMENTTEAM', 'ENVIRONMENTINFRA', 'INSTANCENAME', 'ID_SERVER'];
var rdbmsdatabaseHeader = ['DATABASENAME', 'ID_DATABASE', 'ID_INSTANCE', 'CI_STATUS'];
var diskarrayHeader = ['CI_STATUS', 'ID_DISKARRAY', 'ID_LOCATION', 'ID_MODEL', 'SERIALNUMBER'];
var disklunHeader = ['ID_DISKLUN', 'ID_DISKARRAY', 'NAME', 'CI_STATUS'];
var tapelibraryHeader = ['ID_TAPELIBRARY', 'ID_LOCATION', 'ID_MODEL', 'CI_STATUS', 'SERIALNUMBER'];
var fibreswitchHeader = ['CI_STATUS', 'ID_FIBERSWITCH', 'ID_LOCATION', 'ID_MODEL', 'OSNAME', 'SERIALNUMBER'];
var fibreswitchportHeader = ['ID_FIBERSWITCHPORT', 'ID_FIBERSWITCH', 'CI_STATUS'];
var aliasHeader = ['ID_ALIAS', 'ALIAS_LABEL', 'ALIAS_DOMAINNAME', 'CI_STATUS'];
var mobilephoneHeader = ['ID_MOBILEPHONE', 'MOBILEPHONENUMBER', 'ID_COSTCENTER', 'ID_MANAGEMENTTEAM', 'ID_MODEL', 'ID_PERSON', 'CI_STATUS'];
var landlineHeader = ['ID_LANDLINE', 'ID_MODEL', 'CI_STATUS', 'ID_LOCATION', 'ID_MANAGEMENTTEAM', 'ID_PERSON', 'TYPE', 'PHONENUMBER', 'SERIAL_NUMBER'];


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
            u_id_esf_parent: 3,
            u_ci_status: 2,
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
            u_sn_category: 5,
            u_name: 6,
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
            u_id_location: 6,
            u_id_model: 5,
            u_id_person: 8,
            u_id_printer: 2,
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
    }, //start
    managementteam: {
        url: 'u_management_team_import.do.wsdl',
        header: managementteamHeader,
        folder: 'managementteam',
        mapping: {
            u_phone: 4,
            u_id_teammanager: 2,
            u_email: 1,
            u_ci_status: 5,
            u_penaltyphone: 3,
            u_id_managementteam: 0
        }
    },
    rdbmsinstance: {
        url: 'u_rdbms_instance_import.do.wsdl',
        header: rdbmsinstanceHeader,
        folder: 'rdbmsinstance',
        mapping: {
            u_ci_status: 0,
            u_enginename: 1,
            u_instancename: 5,
            u_id_managementteam: 3,
            u_environmentinfra: 4,
            u_ï__ci_status: 0,
            u_id_server: 6,
            u_id_instance: 2
        }
    },
    rdbmsdatabase: {
        url: 'u_rdbms_database_import.do.wsdl',
        header: rdbmsdatabaseHeader,
        folder: 'rdbmsdatabase',
        mapping: {
            u_ï__databasename: 0,
            u_id_database: 1,
            u_id_instance: 2,
            u_ci_status: 3
        }
    },
    diskarray: {
        url: 'u_diskarray_import.do.wsdl',
        header: diskarrayHeader,
        folder: 'diskarray',
        mapping: {
            u_id_location: 2,
            u_id_model: 3,
            u_id_diskarray: 1,
            u_ï__ci_status: 0,
            u_serialnumber: 4
        }
    },
    disklun: {
        url: 'u_disklun_import.do.wsdl',
        header: disklunHeader,
        folder: 'disklun',
        mapping: {
            u_ci_status: 3,
            u_name: 2,
            u_id_diskarray: 1,
            u_ï__id_disklun: 0
        }
    },
    tapelibrary: {
        url: 'u_tape_library_import.do.wsdl',
        header: tapelibraryHeader,
        folder: 'tapelibrary',
        mapping: {
            u_serialnumber: 4,
            u_id_model: 2,
            u_id_location: 1,
            u_ci_status: 3,
            u_ï__id_tapelibrary: 0
        }
    },
    fibreswitch: {
        url: 'u_fibreswitch_import.do.wsdl',
        header: fibreswitchHeader,
        folder: 'fibreswitch',
        mapping: {
            u_ï__ci_status: 0,
            u_id_location: 2,
            u_ci_status: 0,
            u_osname: 4,
            u_id_model: 3,
            u_id_fiberswitch: 1,
            u_serialnumber: 5
        }
    },
    fibreswitchport: {
        url: 'u_fibreswitchport_import.do.wsdl',
        header: fibreswitchportHeader,
        folder: 'alias',
        mapping: {
            u_ï__id_fiberswitchport: 0,
            u_id_fiberswitch: 1,
            u_id_fiberswitchport: 0,
            u_ci_status: 2
        }
    },
    alias: {
        url: 'u_alias_import.do.wsdl',
        header: aliasHeader,
        folder: 'alias',
        mapping: {
            u_alias_domainname: 2,
            u_ï__id_alias: 0,
            u_alias_label: 1,
            u_ci_status: 3
        }
    },
    mobilephone: {
        url: 'u_mobile_phone_import.do.wsdl',
        header: mobilephoneHeader,
        folder: 'mobilephone',
        mapping: {
            u_ï__id_mobilephone: 0,
            u_id_model: 4,
            u_id_costcenter: 2,
            u_mobilephonenumber: 1,
            u_id_person: 5,
            u_id_managementteam: 3,
            u_ci_status: 6
        }
    },
    landline: {
        url: 'u_land_line_import.do.wsdl',
        header: landlineHeader,
        folder: 'landline',
        mapping: {
            u_id_person: 5,
            u_id_managementteam: 4,
            u_serial_number: 8,
            u_ci_status: 2,
            u_ï__id_landline: 0,
            u_id_model: 1,
            u_type: 6,
            u_id_location: 3,
            u_phonenumber: 7
        }
    }
}


module.exports = sourceTypeObj;