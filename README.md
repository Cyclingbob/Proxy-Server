This Repository is due for update in July 2022.
# Proxy-Server

This is a lightweight Node.js proxy server to be used with [Cloudflare](https://cloudflare.com "Cloudflare"). This proxy server allows you to match the right domain to the right web server all running on the same IP.
It is written using the backend code from [wiresboy-exe's dns proxy server](https://github.com/wiresboy-exe/dns "dns")

This server has many features, including logging all requests, IP management through cloudflare to block/challenge/javscript challenge requests. It also has built in cache control which allows it to monitor requests and serve them quickly. Cache is only stored in runtime and is cleared once the server is stopped.

This server uses Cloudflare and Mongodb to function effectively and both are free services.

# Installation

1) Install Node.js on your server if you haven't already by downloading it at the official website: [Node.js](https://nodejs.org "Node.js")

2) Clone this repositry using git in your command line: `git clone https://github.com/Cyclingbob/Proxy-Server`

3) Install the required dependencies: `npm i`.

4) Ensure ports 80 and 2052 are open through the firewall (if you have one) and port forwarded, if you use a router.

5) Run the server using `node .` in the directory that `index.js` lies in.

# Using Cloudflare

Cloudflare offers free ddos protection, SSL certificate and other features. It allows you to proxy your domain traffic to your server so that your server IP is hidden.

Assuming you have purchased a domain, head to [cloudflare.com](https://cloudflare.com "Cloudflare"). Add a site and follow the instructions. Set your security to `flexible` in the SSL/TLS tab, and add an `A` record that points to your server IP. Enable proxying for the record (I recommend it).

Then, you should edit `config.js` with your cloudflare email (the one you use to login), account id, (found on right side of page in the overview of a domain) and global api key. This is found by clicking on "Get your own API token", then clicking "view" on the `Global API key`, entering your password. Enter this in the `cloudflare_api_key` property of config.js.

After your registar name servers have updated, go to `[Your server ip]:2052` in your address bar. Click on the "Domains" tab and fill in the form:

For "IP" enter 127.0.0.1 if your webserver runs on the same server as the Proxy Server.
For "Domain" enter your domain name, including the subdomain if you used one for your `A` record.
For "Port" enter the port your webserver runs on.

Then click Submit. Follow the mongodb instructions below and if all has been done correctly, your domain should resolve!

# Using Mongodb

Mongodb is a databse service that allows the server to save requests and match them to IPs.

Head to [mongodb.com](https://account.mongodb.com/account "Mongodb") and sign up. If this link doesn't work, go to the main page [mongodb.com](https://mongodb.com "Mongodb") . Create a cluster. Then, allow IP access to your server's IP in `Network Access` on the left side. After this, click on `Database Access` above. Create a user and password, ensuring it has access to all databases and full read/write access. Keep the credentials, you'll need them in a minute. Click on `Databases` near the top of the left side. Then, click `Connect` and click `Connect your application`. Copy this into `config.js` in the `mongodb_connection_string` property, replacing username and password with your user credentials and myFirstDatabase with `DNS`.

# Customisation

To customize display and user access, edit the `config.js` in the main directory of your clone (where `index.js` lies)

# Plugins

Plugins are here!
Plugins currently allow you to listen in and handle requests.
Check out [plugins.md](https://github.com/Cyclingbob/Proxy-Server/blob/main/plugins.md "Plugins")

# Copyright

©Cyclingbob 2021. All rights reserved. Unauthorised distribution or modification is not permitted.
