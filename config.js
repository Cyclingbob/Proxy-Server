const config = {

    //copy the below in {} for each user
    users: [
        {
            username: "Admin",
            password: "Test",
            email: "test@test.com"
        }
    ],

    /*
    The option below changes how dates are displayed on the logs at /panel.
    For example with the ".", dates would be formatted as "27.06.2021"
    */

    split_date: ".",

    /*
    The option below changes how time is displayed on the logs at /panel.
    For example with the ":", dates would be formatted as "20:11:2021"
    */

    split_time: ":",

    /*
    The option below allows you to select if you want "0" to displayed if a value is less than 10 for time.
    For example with value below as "true", time would be formatted as: "08:07:04"
    If the value is "false", time would be formatted as "8:7:4"
    */

    use_0_in_time: true
    
    /* These items below allows this server to access Cloudflare API. This is useful if you want to block/unblock and manage IPs visiting your site. These are required. */

    cloudflare_api_key: '',
    cloudflare_email: '',
    cloudflare_account_id: '',

    /* This allows the server to save requests to mongodb. This is required */

    mongodb_connection_string: ''

    
}

module.exports = config
