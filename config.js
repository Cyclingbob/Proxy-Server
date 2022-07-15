const config = {
    port: 80, //the port you want the http/https server to listen on. default HTTP is 80, HTTPS is 443.
    pluginFolder: `${__dirname}/plugins/`, //folder where plugins are stored. Only change this if you are moving your plugin folder. The current option will work if you've just cloned the repositry and not change the file composition.
    password: "PanelPassword", //the admin password for the control panel
    useSSL: false, //if you want your server to support HTTPS. You will need a privatekey and a certificate from your certificate authority.
    privateKey: require('fs').readFileSync(__dirname + '/assets/certificates/privatekey.pem'), //these 2 files are only needed if you have set useSSL to true.
    certificate: require('fs').readFileSync(__dirname + '/assets/certificates/certificate.pem'),
}

module.exports = config
