const https = require('https')
const fs = require('fs')
const config = require('./config')
const express= require('express')
const app = express()
const fetch = require('node-fetch')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

var domains = require('./assets/data/domains.json')
var current_panel_domain = fs.readFileSync(__dirname + '/assets/data/current_panel_domain.txt').toString()
var plugin_pages = []
var plugin_scripts = []

app.set('views', __dirname + '/assets/pages');
app.set('view-engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.raw());

const files = fs.readdirSync(config.pluginFolder) // reading files from folders
files.map(file => {
    if(fs.lstatSync(config.pluginFolder + file).isFile()){
        var plugin = require(config.pluginFolder + file)
        app.use(plugin.web)
        plugin_pages.push({name: file.split('.').shift(), pages: plugin.pages})
    }
})

if(config.useSSL == true){
    console.log('listening')
    https.createServer({
        key: config.privateKey.toString(),
        cert: config.certificate.toString()
    }, app).listen(config.port)
} else {
    app.listen(config.port)
}

app.use((req, res, next) => {
    var ip = req.headers["cf-connecting-ip"] || req.connection.remoteAddress
    var domain = domains.find(a => a.domain === req.headers.host)
    if(typeof domain === "object" && domain.domain !== current_panel_domain){
	var options = {
	   method: req.method,
	   headers: req.headers,
	}
	if(req.method !== "GET") options.body = JSON.stringify(req.body)
        fetch(`http://${domain.ip}:${domain.port}${req.originalUrl}`, options).then(actual => {
            actual.headers.forEach((v, n) => res.setHeader(n, v));
            actual.body.pipe(res);
        }).catch(e => {
	    console.log(e)
            if(e.code === "ECONNREFUSED") res.status(404).sendFile(__dirname + "/assets/pages/404.html") 
        })
    } else next()
})

app.use("/panel/public", (req, res, next) => {
    if(fs.existsSync(__dirname + "/assets/public" + req.path)){
        res.sendFile(__dirname + "/assets/public" + req.path)
    } else next()
})

app.get("/panel/login", (req, res) => {
    res.sendFile(__dirname + "/assets/pages/login.html")
})
app.post("/panel/login", (req, res) => {
    if(req.body.password === config.password) res.cookie("password", config.password).send("ok")
})

app.use((req, res, next) => {
    if(req.cookies.password === config.password) next()
    else res.redirect("/panel/login")
})

app.post("/panel/create_domain", (req, res) => {
    if(domains.find(a => a.domain === req.body.domain)) return res.send("not ok")
    domains.push(req.body)
    fs.writeFileSync(__dirname + "/assets/data/domains.json", JSON.stringify(domains), "utf-8")
    res.send("ok")   
})

app.post("/panel/delete_domain", (req, res) => {
    domains = domains.filter(a => a.domain !== req.body.domain)
    fs.writeFileSync(__dirname + "/assets/data/domains.json", JSON.stringify(domains), "utf-8")
    res.send("ok")
})

app.post("/panel/setpaneldomain", (req, res) => {
    var domain = req.body.domain
    current_panel_domain = req.body.domain
    fs.writeFileSync(__dirname + "/assets/data/current_panel_domain.txt", current_panel_domain)
    res.json({status: "ok", domain})
})

app.get("/panel", (req, res) => {
    res.render("panel.ejs", { domains, current_panel_domain, plugin_pages})
})

app.get("/", (req, res) => {
    res.redirect('/panel')
})

app.use((req, res) => {
    res.status(404).sendFile(__dirname + "/assets/pages/404.html")
})
