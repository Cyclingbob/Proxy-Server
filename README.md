# Proxy-Server

This is a lightweight Node.js proxy server to be used with [Cloudflare](https://cloudflare.com "Cloudflare"). This proxy server allows you to match the right domain to the right web server all running on the same IP.

# Installation

1) Install Node.js on your server if you haven't already by downloading it at the official website: [Node.js](https://nodejs.org "Node.js")

2) Clone this repositry using git in your command line: `git clone https://github.com/Cyclingbob/Proxy-Server`

3) Install the required dependencies: `npm i`.

4) Run the server using `node .` in the directory that `index.js` lies in.

# Using Cloudflare

Cloudflare offers free ddos protection, SSL certificate and other features. It allows you to proxy your domain traffic to your server so that your server IP is hidden.

Assuming you have purchased a domain, head to [cloudflare.com](https://cloudflare.com "Cloudflare"). Add a site and follow the instructions. Set your security to `flexible` in the SSL/TLS tab, and add an `A` record that points to your server IP. Enable proxying for the record (I recommend it).

After your registar name servers have updated, go to `[Your server ip]:2052` in your address bar. Click on the "Domains" tab and fill in the form:

For "IP" enter 127.0.0.1 if your webserver runs on the same server as the Proxy Server.
For "Domain" enter your domain name, including the subdomain if you used one for your `A` record.
For "Port" enter the port your webserver runs on.

Then click Submit. If all has been done correctly, your domain should resolve!
