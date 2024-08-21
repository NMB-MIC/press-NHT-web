const config= {
    user:'sa',
    password:'sa@admin',
    server: 'MIC-IOT-10',
    database: 'machine_control',
    options:{
        trustServerCertificate: true,
        trustedConnection: false,
        enableArithAbort: true,
        instancename: 'SQLEXPRESS'
    },
    port: 1433
}

module.exports = config