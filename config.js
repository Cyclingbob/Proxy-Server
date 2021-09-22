const config = {

    //copy the below in {} for each user
    users: [
        {
            username: "Cyclingbob",
            password: "Enterprise1",
            email: "bob21567@yahoo.com"
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

    use_0_in_time: true,

    /* These items below allows this server to access Cloudflare API. This is useful if you want to block/unblock and manage IPs visiting your site. These are required. */

    cloudflare_api_key: '418d0b810761e91d9b15baaa98e4c735ca707',
    cloudflare_email: 'bob21567@yahoo.com',
    cloudflare_account_id: 'a9fd6f9c500b9a7785f520dd9f2aa538',

    /* This allows the server to save requests to mongodb. This is required */

    mongodb_connection_string: 'mongodb+srv://dns:datingsite@cluster0.qqw2s.mongodb.net/dns?retryWrites=true&w=majority',

    /* banned keywords allows your server to automatically ban ips based on keywords in this array. If you don't want it to do this leave the array empty: [] */

    banned_keywords: ['robots.txt', 'php', '.html', '/boaform/admin/formLogin'],

    /* This option below allows you to decide if you want your server to ignore requests to its own IP. This means all requests must be made through domains */

    block_ip_access: true,
    
}

module.exports = config
