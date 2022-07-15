This Repository is due for update in July 2022.
# Proxy-Server

This is a lightweight Node.js proxy server that allows you to match the right domain to the right web server all accessed through the same IP.
It is written using the backend code from [wiresboy-exe's dns proxy server](https://github.com/wiresboy-exe/dns "dns")

The server capability can be expanded with the use of plugins which is explained in further detail tomorrow

# Installation

1) Install Node.js on your server if you haven't already by downloading it at the official website: [Node.js](https://nodejs.org "Node.js")

2) Clone this repositry using git in your command line: `git clone https://github.com/Cyclingbob/Proxy-Server`

3) Install the required dependencies: `npm i`.

4) Edit config.js so that it is set up properly for your server.

5) Ensure the designated port in config.js is open through the firewall (if you have one) and port forwarded, if you use a router.

6) Run the server using `node .` in the directory that `index.js` lies in.

# Plugins

Plugins are here!
Plugins allow you to extend the capabilities of the proxy-server including the addition of your own custom pages.
Check out [plugins.md](https://github.com/Cyclingbob/Proxy-Server/blob/main/plugins.md "Plugins")

#Bug spotting
Should you spot a bug please open an issue in the Issues tab and clearly explain what the bug is and a possible fix.

# Copyright information

The original content is subject to copyright however changed and improved versions are permitted.
