/**
 *   Header definition to verify fiel content
 *
 **/

var applicationHeader = ['APPLICATIONTYPE', 'CI_STATUS', 'APPLICATIONCODE', 'APPLICATIONNAME', 'APPLICATIONOTHERNAME', 'ID_APPLICATIONMANAGER', 'ID_ITENTITY', 'ID_MANAGEMENTTEAM', 'ID_BUSINESSLINE_OWNER'];
var bl_plHeader = ['ID_LINE', 'NAME', 'ID_LINE_PARENT', 'TYPE', 'CI_STATUS'];
var brandHeader = ['COMPANYNAME', 'CI_STATUS', 'NAME'];
var certificateHeader = ['CI_STATUS', 'CERTIFICATENAME', 'ID_MANAGEMENTTEAM', 'APPLICATIONNAME'];
var citrixfarmHeader = ['CI_STATUS', 'ENVIRONMENT', 'ID_CITRIXFARM', 'NAME'];
var citrixpoolHeader = ['CI_STATUS', 'ID_CITRIXPOOL', 'ID_CITRIXFARM', 'NAME'];
var clusterHeader = ['CLUSTER_IDENTIFIER', 'CI_STATUS', 'ID_MANAGEMENTTEAM', 'PACKAGE_TYPE'];
var clusterPackageHeader = ['PACKAGE_NAME', 'CI_STATUS', 'PACKAGE_TYPE', 'ID_CLUSTER'];
var companyHeader = ['ID_COMPANY', 'COMPANYNAME', 'CI_STATUS', 'PHONENUMBER', 'FAXNUMBER'];
var costCenterHeader = ['ID_COSTCENTER', 'NAME', 'STARTDATE', 'ENDDATE'];
var countryHeader = ['COUNTRYNAME', 'REGION', 'CI_STATUS', 'HUB'];
var enclosureHeader = ['NAME', 'CI_STATUS', 'ENVIRONMENT', 'ID_MODEL', 'ID_MANAGEMENTTEAM', 'ID_LOCATION'];
var esfHeader = ['ID_ESF', 'NAME', 'CI_STATUS', 'ID_ESF_PARENT'];

var itEntityHeader = ['ID_ITENTITY', 'ID_ESF', 'ID_PAM', 'ID_PAMBACKUP', 'ID_SAM', 'ID_SAMBACKUP', 'ID_TEAMMANAGER', 'CI_STATUS'];
var locationHeader = ['CI_STATUS', 'LOCATIONLEVEL', 'LOCATIONTYPE', 'NAME', 'ID_LOCATION', 'ID_LOCATION_PARENT', 'ADDRESS1', 'ADDRESS2', 'ZIP', 'CITY', 'COUNTRYNAME'];
var modelHeader = ['BRAND_NAME', 'ID_MODEL', 'ID_MODEL_PARENT', 'ID_NATURE', 'CI_STATUS', 'SN_CATEGORY', 'NAME'];
var monitorHeader = ['ID_MONITOR', 'ID_COMPUTER', 'ID_MODEL', 'ID_PERSON', 'SERIALNUMBER', 'SIZE', 'CI_STATUS', 'ID_LOCATION'];
var moveableEquipmentHeader = ['CI_STATUS', 'ID_UKME', 'ID_COSTCENTER', 'ID_LOCATION', 'ID_MANAGEMENTTEAM', 'ID_MODEL', 'ID_PERSON'];
var networkHeader = ['SERIALNUMBER', 'HOSTNAME', 'CI_STATUS', 'DOMAIN', 'ENVIRONMENTINFRA', 'ID_LOCATION', 'NETWORK_TYPE', 'EQUIPMENT_FUNCTION', 'ID_NETWORKEQUIPMENT_PARENT', 'ID_MANAGEMENTTEAM'];
var networkCardheader = ['ID_NETWORKCARD', 'DNSSUFFIXES', 'COMPUTERNAME', 'CI_STATUS'];
var personHeader = ['CI_STATUS', 'ID_PERSON', 'TITLE', 'LASTNAME', 'FIRSTNAME', 'EMAIL', 'MOBILEPHONENUMBER', 'PHONENUMBER', 'IS_GIT', 'IS_DRS', 'IS_COMEX', 'IS_VIP', 'ID_LOCATION', 'ID_MANAGER', 'ID_SECRETARY', 'ID_COSTCENTER', 'ID_BUSINESSLINE', 'ID_PRODUCTLINE', 'ID_ESF'];
var printerHeader = ['CI_STATUS', 'ASSETTAG', 'ID_PRINTER', 'PRINTERQUEUE', 'SERIALNUMBER', 'ID_MODEL', 'ID_LOCATION', 'ID_PERSON'];
var scannerHeader = ['CI_STATUS', 'ID_SCANNER', 'ID_MODEL', 'ID_COMPUTER', 'ID_LOCATION', 'ID_PERSON', 'SERIALNUMBER', 'WARRANTYENDDATE'];
var serverHeader = ['CI_STATUS', 'ID_SERVER', 'COMPUTERENVIRONMENT', 'COMPUTERFUNCTION', 'ID_LOCATION', 'ID_MANAGEMENTTEAM', 'ID_MODEL', 'ISCLUSTER', 'OSTYPE', 'SERIALNUMBER'];
var softwareHeader = ['CI_STATUS', 'ID_SOFTWARE', 'SOFTWARENAME', 'ID_BRAND'];
var subnetHeader = ['ID_SUBNET', 'IPMASK', 'SUBNET', 'CI_STATUS'];
var workstationHeader = ['AD_DOMAINNAME', 'CI_STATUS', 'ASSETTAG', 'COMPUTERTYPE', 'ID_LOCATION', 'ID_WORKSTATION', 'OSTYPE', 'SERIALNUMBER', 'ID_MODEL', 'ID_PERSON'];

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
    alias: {
        url: 'u_alias_import_list.do.wsdl',
        importTable: 'u_alias_import',
        header: aliasHeader,
        folder: 'alias',
        mapping: {
            u_alias_domainname: 2,
            u_ï__id_alias: 0,
            u_alias_label: 1,
            u_ci_status: 3
        },
        sequenceOrder: 10
    },
    application: {
        url: 'u_application_import_list.do.wsdl',
        importTable: 'u_application_import',
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
        },
        sequenceOrder: 11
    },
    bl_pl: {
        url: 'u_bl_pl_import_list.do.wsdl',
        importTable: 'u_bl_pl_import',
        header: bl_plHeader,
        folder: 'bl_pl',
        mapping: {
            u_ci_status: 4,
            u_id_line_parent: 2,
            u_ï__id_line: 0,
            u_name: 1,
            u_type: 3
        },
        sequenceOrder: 2
    },
    brand: {
        url: 'u_brand_import_list.do.wsdl',
        importTable: 'u_brand_import',
        header: brandHeader,
        folder: 'brand',
        mapping: {
            u_ci_status: 1,
            u_companyname: 0,
            u_name: 2
        },
        sequenceOrder: 0
    },
    certificate: {
        url: 'u_certificate_import_list.do.wsdl',
        importTable: 'u_certificate_import',
        header: certificateHeader,
        folder: 'certificate',
        mapping: {
            u_applicationname: 3,
            u_certificatename: 1,
            u_ci_status: 0,
            u_id_managementteam: 2
        },
        sequenceOrder: 12
    },
    citrixfarm: {
        url: 'u_citrix_farm_import_list.do.wsdl',
        importTable: 'u_citrix_farm_import',
        header: citrixfarmHeader,
        folder: 'citrixfarm',
        mapping: {
            u_environment: 1,
            u_id_citrixfarm: 2,
            u_ï__ci_status: 0,
            u_name: 3
        },
        sequenceOrder: 13
    },
    citrixpool: {
        url: 'u_citrix_pool_import_list.do.wsdl',
        importTable: 'u_citrix_pool_import',
        header: citrixpoolHeader,
        folder: 'citrixpool',
        mapping: {
            u_id_citrixfarm: 2,
            u_id_citrixpool: 1,
            u_ï__ci_status: 0,
            u_name: 3
        },
        sequenceOrder: 14
    },
    cluster: {
        url: 'u_cluster_import_list.do.wsdl',
        importTable: 'u_cluster_import',
        header: clusterHeader,
        folder: 'cluster',
        mapping: {
            u_ci_status: 1,
            u_id_managementteam: 2,
            u_ï__cluster_identifier: 0,
            u_package_type: 3
        },
        sequenceOrder: 15
    },
    cluster_package: {
        url: 'u_cluster_package_import_list.do.wsdl',
        importTable: 'u_cluster_package_import',
        header: clusterPackageHeader,
        folder: 'cluster_package',
        mapping: {
            u_ci_status: 1,
            u_id_cluster: 3,
            u_ï__package_name: 0,
            u_package_type: 2
        },
        sequenceOrder: 16
    },
    costcenter: {
        url: 'u_costcenter_import_list.do.wsdl',
        importTable: 'u_costcenter_import',
        header: costCenterHeader,
        folder: 'cost_center',
        mapping: {
            u_enddate: 3,
            u_id_costcenter: 0,
            u_ï__id_costcenter: 0,
            u_name: 1,
            u_startdate: 2
        },
        sequenceOrder: 6
    },
    company: {
        url: 'u_company_import_list.do.wsdl',
        importTable: 'u_company_import',
        header: companyHeader,
        folder: 'company',
        mapping: {
            u_ci_status: 2,
            u_companyname: 1,
            u_faxnumber: 4,
            u_id_company: 0,
            u_ï__id_company: 0,
            u_phonenumber: 3
        },
        sequenceOrder: 1
    },
    country: {
        url: 'u_country_import_list.do.wsdl',
        importTable: 'u_country_import',
        header: countryHeader,
        folder: 'country',
        mapping: {
            u_ci_status: 2,
            u_hub: 3,
            u_ï__countryname: 0,
            u_region: 1
        },
        sequenceOrder: 17
    },
    diskarray: {
        url: 'u_diskarray_import_list.do.wsdl',
        importTable: 'u_diskarray_import',
        header: diskarrayHeader,
        folder: 'diskarray',
        mapping: {
            u_id_location: 2,
            u_id_model: 3,
            u_id_diskarray: 1,
            u_ï__ci_status: 0,
            u_serialnumber: 4
        },
        sequenceOrder: 18
    },
    disklun: {
        url: 'u_disklun_import_list.do.wsdl',
        importTable: 'u_disklun_import',
        header: disklunHeader,
        folder: 'disklun',
        mapping: {
            u_ci_status: 3,
            u_name: 2,
            u_id_diskarray: 1,
            u_ï__id_disklun: 0
        },
        sequenceOrder: 19
    },
    enclosure: {
        url: 'u_enclosure_import_list.do.wsdl',
        importTable: 'u_enclosure_import',
        header: enclosureHeader,
        folder: 'enclosure',
        mapping: {
            u_ci_status: 1,
            u_environment: 2,
            u_id_location: 5,
            u_id_managementteam: 3,
            u_id_model: 3,
            u_ï__name: 0,
            u_name: 0
        },
        sequenceOrder: 20
    },
    esf: {
        url: 'u_u_esf_department_import_list.do.wsdl',
        importTable: 'u_u_esf_department_import',
        header: esfHeader,
        folder: 'esf',
        mapping: {
            u_id_esf: 0,
            u_id_esf_parent: 3,
            u_ci_status: 2,
            u_name: 1
        },
        sequenceOrder: 3
    },
    fibreswitch: {
        url: 'u_fibreswitch_import_list.do.wsdl',
        importTable: 'u_fibreswitch_import',
        header: fibreswitchHeader,
        folder: 'fibre-switch',
        mapping: {
            u_ï__ci_status: 0,
            u_id_location: 2,
            u_ci_status: 0,
            u_osname: 4,
            u_id_model: 3,
            u_id_fiberswitch: 1,
            u_serialnumber: 5
        },
        sequenceOrder: 21
    },
    fibreswitchport: {
        url: 'u_fibreswitchport_import_list.do.wsdl',
        importTable: 'u_fibreswitchport_import',
        header: fibreswitchportHeader,
        folder: 'fiber-switch-port',
        mapping: {
            u_ï__id_fiberswitchport: 0,
            u_id_fiberswitch: 1,
            u_id_fiberswitchport: 0,
            u_ci_status: 2
        },
        sequenceOrder: 22
    },
    it_entity: {
        url: 'u_it_entity_import_list.do.wsdl',
        importTable: 'u_it_entity_import',
        header: itEntityHeader,
        folder: 'it_entity',
        mapping: {
            u_ï__id_itentity: 0,
            u_id_teammanager: 6,
            u_id_sambackup: 5,
            u_id_sam: 4,
            u_id_pambackup: 3,
            u_id_pam: 2,
            u_id_esf: 1,
            u_ci_status: 7
        },
        sequenceOrder: 4
    },
    landline: {
        url: 'u_land_line_import_list.do.wsdl',
        importTable: 'u_land_line_import',
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
        },
        sequenceOrder: 23
    },
    location: {
        url: 'u_location_import_list.do.wsdl',
        importTable: 'u_location_import',
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
        },
        sequenceOrder: 5
    },
    managementteam: {
        url: 'u_management_team_import_list.do.wsdl',
        importTable: 'u_management_team_import',
        header: managementteamHeader,
        folder: 'managementteam',
        mapping: {
            u_phone: 4,
            u_id_teammanager: 2,
            u_email: 1,
            u_ci_status: 5,
            u_penaltyphone: 3,
            u_id_managementteam: 0
        },
        sequenceOrder: 9
    },
    mobilephone: {
        url: 'u_mobile_phone_import_list.do.wsdl',
        importTable: 'u_mobile_phone_import',
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
        },
        sequenceOrder: 24
    },
    model: {
        url: 'u_model_import_list.do.wsdl',
        importTable: 'u_model_import',
        header: modelHeader,
        folder: 'model',
        mapping: {
            u_ci_status: 4,
            u__brand_name: 0,
            u_id_model: 1,
            u_id_model_parent: 2,
            u_id_nature: 3,
            u_sn_category: 5,
            u_name: 6,
        },
        sequenceOrder: 8
    },
    monitor: {
        url: 'u_monitor_import_list.do.wsdl',
        importTable: 'u_monitor_import',
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
        },
        sequenceOrder: 25
    },
    moveable_equipment: {
        url: 'u_moveable_equipment_import_list.do.wsdl',
        importTable: 'u_moveable_equipment_import',
        header: moveableEquipmentHeader,
        folder: 'moveable_equipment',
        mapping: {
            u_id_costcenter: 2,
            u_id_location: 3,
            u_id_managementteam: 4,
            u_id_model: 5,
            u_id_person: 6,
            u_id_ukme: 1,
            u_ï__ci_status: 0
        },
        sequenceOrder: 26
    },
    network: {
        url: 'u_network_import_list.do.wsdl',
        importTable: 'u_network_import',
        header: networkHeader,
        folder: 'network',
        mapping: {
            u_ci_status: 2,
            u_domain: 3,
            u_environmentinfra: 4,
            u_equipment_function: 7,
            u_hostname: 1,
            u_id_location: 5,
            u_id_managementteam: 9,
            u_id_networkequipment_parent: 8,
            u_network_type: 6,
            u_serialnumber: 0
        },
        sequenceOrder: 28
    },
    network_card: {
        url: 'u_networkcard_import_list.do.wsdl',
        importTable: 'u_networkcard_import',
        header: networkCardheader,
        folder: 'network_card',
        mapping: {
            u_ci_status: 3,
            u_computername: 2,
            u_dnssuffixes: 1,
            u_ï__id_networkcard: 0
        },
        sequenceOrder: 27
    },
    person: {
        url: 'u_person_user_import_list.do.wsdl',
        importTable: 'u_person_user_import',
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
        },
        sequenceOrder: 7
    },
    printer: {
        url: 'u_printer_import_list.do.wsdl',
        importTable: 'u_printer_import',
        header: printerHeader,
        folder: 'printer',
        mapping: {
            u_assettag: 1,
            u_ci_status: 0,
            u_id_location: 6,
            u_id_model: 5,
            u_id_person: 7,
            u_id_printer: 2,
            u_printerqueue: 3,
            u_serialnumber: 4
        },
        sequenceOrder: 29
    },
    rdbmsdatabase: {
        url: 'u_rdbms_database_import_list.do.wsdl',
        importTable: 'u_rdbms_database_import',
        header: rdbmsdatabaseHeader,
        folder: 'rdbmsdatabase',
        mapping: {
            u_ï__databasename: 0,
            u_id_database: 1,
            u_id_instance: 2,
            u_ci_status: 3
        },
        sequenceOrder: 30
    },
    rdbmsinstance: {
        url: 'u_rdbms_instance_import_list.do.wsdl',
        importTable: 'u_rdbms_instance_import',
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
        },
        sequenceOrder: 31
    },
    scanner: {
        url: 'u_scanner_import_list.do.wsdl',
        importTable: 'u_scanner_import',
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
        },
        sequenceOrder: 32
    },
    server: {
        url: 'u_server_import_list.do.wsdl',
        importTable: 'u_server_import',
        header: serverHeader,
        folder: 'server',
        mapping: {
            u_computerenvironment: 2,
            u_computerfunction: 3,
            u_id_location: 4,
            u_id_managementteam: 5,
            u_id_model: 6,
            u_id_server: 1,
            u_iscluster: 7,
            u_ï__ci_status: 0,
            u_ostype: 8,
            u_serialnumber: 9
        },
        sequenceOrder: 33
    },
    software: {
        url: 'u_software_import_list.do.wsdl',
        importTable: 'u_software_import',
        header: softwareHeader,
        folder: 'software',
        mapping: {
            u_ci_status: 0,
            u_id_brand: 3,
            u_id_software: 1,
            u_ï__ci_status: 0,
            u_softwarename: 2
        },
        sequenceOrder: 34
    },
    subnet: {
        url: 'u_subnet_import_list.do.wsdl',
        importTable: 'u_subnet_import',
        header: subnetHeader,
        folder: 'subnet',
        mapping: {
            u_ci_status: 3,
            u_ipmask: 1,
            u_ï__id_subnet: 0,
            u_subnet: 2
        },
        sequenceOrder: 35
    },
    tapelibrary: {
        url: 'u_tape_library_import_list.do.wsdl',
        importTable: 'u_tape_library_import',
        header: tapelibraryHeader,
        folder: 'tapelibrary',
        mapping: {
            u_serialnumber: 4,
            u_id_model: 2,
            u_id_location: 1,
            u_ci_status: 3,
            u_ï__id_tapelibrary: 0
        },
        sequenceOrder: 36
    },
    workstation: {
        url: 'u_workstation_import_list.do.wsdl',
        importTable: 'u_workstation_import',
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
        },
        sequenceOrder: 37
    }
};


module.exports = sourceTypeObj;
