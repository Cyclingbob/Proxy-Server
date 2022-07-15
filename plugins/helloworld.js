const express = require('express')
const fs = require('fs')
const app = express.Router()

var plugin = {}
plugin.web = app

plugin.pages = [
  {
    name: "Welcome",
    path: "/plugins/helloworld/home",
    type: "passive",
    html: fs.readFileSync(__dirname + "/helloworld/index.html")
  }
]

module.exports = plugin
