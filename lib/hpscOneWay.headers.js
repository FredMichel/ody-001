/**
 *   Header definition to verify fiel content
 *
 **/



/**
 * Defintion of the mapping object + configuration
 *
 **/

/**
var sourceTypeObj = {
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
    cluster: {
        url: 'u_cluster_import_list.do.wsdl',
        header: clusterHeader,
        folder: 'cluster',
        mapping: {
            u_ci_status: 1,
            u_id_managementteam: 2,
            u_ï__cluster_identifier: 0,
            u_package_type: 3
        }
    },
    cluster_package: {
        url: 'u_cluster_package_import_list.do.wsdl',
        header: clusterPackageHeader,
        folder: 'cluster_package',
        mapping: {
            u_ci_status: 1,
            u_id_cluster: 3,
            u_ï__package_name: 0,
            u_package_type: 2
        }
    },
    costcenter: {
        url: 'u_costcenter_import_list.do.wsdl',
        header: costCenterHeader,
        folder: 'cost_center',
        mapping: {
            u_enddate: 3,
            u_id_costcenter: 0,
            u_ï__id_costcenter: 0,
            u_name: 1,
            u_startdate: 2
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
    },
    country: {
        url: 'u_country_import_list.do.wsdl',
        header: countryHeader,
        folder: 'country',
        mapping: {
            u_ci_status: 2,
            u_hub: 3,
            u_ï__countryname: 0,
            u_region: 1
        }
    },
    enclosure: {
        url: 'u_enclosure_import_list.do.wsdl',
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
    it_entity: {
        url: 'u_it_entity_import_list.do.wsdl',
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
    moveable_equipment: {
        url: 'u_moveable_equipment_import_list.do.wsdl',
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
        }
    },
    network_card: {
        url: 'u_networkcard_import_list.do.wsdl',
        header: networkCardheader,
        folder: 'network_card',
        mapping: {
            u_ci_status: 3,
            u_computername: 2,
            u_dnssuffixes: 1,
            u_ï__id_networkcard: 0
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
    server: {
        url: 'u_server_import_list.do.wsdl',
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
        }
    },
    software: {
        url: 'u_software_import_list.do.wsdl',
        header: softwareHeader,
        folder: 'software',
        mapping: {
            u_ci_status: 0,
            u_id_brand: 3,
            u_id_software: 1,
            u_ï__ci_status: 0,
            u_softwarename: 2
        }
    },
    subnet: {
        url: 'u_subnet_import_list.do.wsdl',
        header: subnetHeader,
        folder: 'subnet',
        mapping: {
            u_ci_status: 3,
            u_ipmask: 1,
            u_ï__id_subnet: 0,
            u_subnet: 2
        }
    },
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
};
**/
var sourceTypeObj = {
    incident: {
        type: 'incident',
        url: 'u_incident_import_list.do.wsdl',
        mandatoryFields: [],
        folder: 'incident'
    },
    change: {
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
    }

};

module.exports = sourceTypeObj;