const express = require('express')
const users = require('../assets/users')
const format = require('../assets/format')

const logs = require('../models/logs')
const config = require('../config')
const countryCodes = require('../assets/countrycodes.json')

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")

const fetch = require('node-fetch')

const fs = require('fs')

function panel(){

    const app = express()

    app.use('/assets', express.static(__dirname + '/public'))
    
    app.use(cookieParser());

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(bodyParser.raw());

    app.set('view-engine', 'ejs')
    app.set('views', __dirname + '/views');

    app.get('/', (req, res) => {

        if(!users.checkuser(req)) return res.redirect('/login')

        res.render('index.ejs', {
            user: users.getuser(req)
        })
        
    })

    app.get('/logs', async (req, res) => {

        if(!users.checkuser(req)) return res.redirect('/login')

        var gotlogs = await logs.find({ type: 'visit' })

        var dates = []
        var countries = []

        gotlogs.forEach(function(item, index){

            var date = new Date(item.time)
            
            dates[index] = format.date(date).formatted

            countries[index] = countryCodes[item.country]

            if(countries[index] === undefined)  countries[index] = 'Unknown'

        })

        res.render('logs.ejs', {
            user: users.getuser(req),
            countries,
            logs: gotlogs,   
            dates         
        })

    })

    app.get('/delete', async (req, res) => {
        var e = await logs.find()
        e.forEach(async item => {
            await item.delete()
        })
        res.send('e')
    })

    app.get('/domains', (req, res) => {

        if(!users.checkuser(req)) return res.redirect('/login')

        fs.readFile(__dirname.substring(__dirname.length - 5, __dirname) + '/data/domains.json', 'utf8', function(err, domains){

            if(err) return console.log(err)

            domains = JSON.parse(domains)

            res.render('domains.ejs', {
    
                user: users.getuser(req),
                domains: domains
    
            })

        })

    })

    app.get('/ip', async (req, res) => {

        if(!users.checkuser(req)) return res.redirect('/login')

        var gotlogs = await logs.find({ type: 'visit' })

        var ips = []

        gotlogs.forEach(item => {

            if(!ips.find(ip => ip === item.ip)){

                ips.push(item.ip)

            }

        })

        var cloudflare_data = await fetch(`https://api.cloudflare.com/client/v4/accounts/${config.cloudflare_account_id}/firewall/access_rules/rules`, {
            headers: {
                "X-Auth-Key": config.cloudflare_api_key,
                "X-Auth-Email": config.cloudflare_email,
                "Content-Type": "application/json"
            },
            method: "GET",
        })
        .then(data => data.json())
        .then(data => {

            var blocked = []
            var challenge = []
            var js_challenge = []

            var cloudflare_ips = []
            
            data.result.forEach(item => {

                if(item.mode === 'block') blocked.push(item.configuration.value)
                if(item.mode === 'challenge') challenge.push(item.configuration.value)
                if(item.mode === 'js_challenge') js_challenge.push(item.configuration.value)

                cloudflare_ips.push(item.configuration.value)

            })

            return { cloudflare_ips, challenge, js_challenge, blocked }

        })

        var not_blocked = ips.filter(a => !cloudflare_data.cloudflare_ips.find(b => a === b))

        res.render('ip.ejs', {
            user: users.getuser(req),
            allowed_ips: not_blocked,
            blocked_ips: cloudflare_data.blocked,
            challenge_ips: cloudflare_data.challenge,
            js_challenge_ips: cloudflare_data.js_challenge
        })

    })

    app.get('/login', (req, res) => {

        if(users.checkuser(req)) return res.redirect('/')

        res.sendFile(__dirname + '/views/login.html')

    })

    app.get('/logout', (req, res) => {

        res.clearCookie('username')
        res.clearCookie('password')
        
        res.redirect('/login')

    })

    app.post('/login', (req, res) => {

        var info = users.login(req, res)

        if(!info){

            res.send('error')

        } else {

            res.send('ok')

        }

    })

    app.post('/domain/add', (req, res) => {

        fs.readFile(__dirname.substring(__dirname.length - 5, __dirname) + '/data/domains.json', 'utf8', function(err, domains){

            if(err) return console.log(err)

            domains = JSON.parse(domains)
            domains.push(req.body)
            domains = JSON.stringify(domains)

            fs.writeFile(__dirname.substring(__dirname.length - 5, __dirname) + '/data/domains.json', domains, function(err){
                
                if(err) return console.log(err)

                res.send('ok')

            })

        })

    })

    app.post('/domain/delete', (req, res) => {

        fs.readFile(__dirname.substring(__dirname.length - 5, __dirname) + '/data/domains.json', 'utf8', function(err, domains){

            if(err) return console.log(err)

            domains = JSON.parse(domains)

            domains = domains.filter(x => x.domain !== req.body.domain)

            domains = JSON.stringify(domains)

            fs.writeFile(__dirname.substring(__dirname.length - 5, __dirname) + '/data/domains.json', domains, function(err){
                
                if(err) return console.log(err)

                res.send('ok')

            })

        })

    })

    app.post('/ip/block', (req, res) => {

        fetch(`https://api.cloudflare.com/client/v4/accounts/${config.cloudflare_account_id}/firewall/access_rules/rules`, {
            headers: {
                "X-Auth-Key": config.cloudflare_api_key,
                "X-Auth-Email": config.cloudflare_email,
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                mode: "block",
                configuration: {
                    target: "ip",
                    value: req.body.ip
                }
            })
        })
        .then(data => data.json())
        .then(data => {
            
            if(data.success === true) res.send('ok')

        })

    })

    app.post('/ip/challenge', async (req, res) => {

        var data = await fetch(`https://api.cloudflare.com/client/v4/accounts/${config.cloudflare_account_id}/firewall/access_rules/rules`, {
            headers: {
                "X-Auth-Key": config.cloudflare_api_key,
                "X-Auth-Email": config.cloudflare_email,
                "Content-Type": "application/json"
            },
            method: "GET"
        })
        .then(data => data.json())
        .then(data => {
            
            return data.result

        })

        var item = data.find(a => a.configuration.value === req.body.ip)

        if(item){

            fetch(`https://api.cloudflare.com/client/v4/accounts/${config.cloudflare_account_id}/firewall/access_rules/rules/${item.id}`, {
                headers: {
                    "X-Auth-Key": config.cloudflare_api_key,
                    "X-Auth-Email": config.cloudflare_email,
                    "Content-Type": "application/json"
                },
                method: "PATCH",
                body: JSON.stringify({
                    id: item.id,
                    allowed_modes: [
                        "whitelist",
                        "block",
                        "challenge",
                        "js_challenge"
                    ],
                    mode: 'challenge',
                    configuration: { target: 'ip', value: req.body.ip },
                    scope: {
                        id: config.cloudflare_account_id,
                        email: config.cloudflare_email,
                        type: "user"
                    }
                })
            })
            .then(data => data.json())
            .then(data => {
                
                if(data.success === true) return res.send('ok')
    
            })

        } else {

            fetch(`https://api.cloudflare.com/client/v4/accounts/${config.cloudflare_account_id}/firewall/access_rules/rules`, {
                headers: {
                    "X-Auth-Key": config.cloudflare_api_key,
                    "X-Auth-Email": config.cloudflare_email,
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({
                    mode: "challenge",
                    configuration: {
                        target: "ip",
                        value: req.body.ip
                    }
                })
            })
            .then(data => data.json())
            .then(data => {
                
                if(data.success === true) res.send('ok')

            })

        }

    })

    app.post('/ip/js_challenge', async (req, res) => {

        var data = await fetch(`https://api.cloudflare.com/client/v4/accounts/${config.cloudflare_account_id}/firewall/access_rules/rules`, {
            headers: {
                "X-Auth-Key": config.cloudflare_api_key,
                "X-Auth-Email": config.cloudflare_email,
                "Content-Type": "application/json"
            },
            method: "GET"
        })
        .then(data => data.json())
        .then(data => {
            
            return data.result

        })

        var item = data.find(a => a.configuration.value === req.body.ip)

        if(item){

            fetch(`https://api.cloudflare.com/client/v4/accounts/${config.cloudflare_account_id}/firewall/access_rules/rules/${item.id}`, {
                headers: {
                    "X-Auth-Key": config.cloudflare_api_key,
                    "X-Auth-Email": config.cloudflare_email,
                    "Content-Type": "application/json"
                },
                method: "PATCH",
                body: JSON.stringify({
                    id: item.id,
                    allowed_modes: [
                        "whitelist",
                        "block",
                        "challenge",
                        "js_challenge"
                    ],
                    mode: 'js_challenge',
                    configuration: { target: 'ip', value: req.body.ip },
                    scope: {
                        id: config.cloudflare_account_id,
                        email: config.cloudflare_email,
                        type: "user"
                    }
                })
            })
            .then(data => data.json())
            .then(data => {
                
                if(data.success === true) return res.send('ok')
    
            })

        } else {

            fetch(`https://api.cloudflare.com/client/v4/accounts/${config.cloudflare_account_id}/firewall/access_rules/rules`, {
                headers: {
                    "X-Auth-Key": config.cloudflare_api_key,
                    "X-Auth-Email": config.cloudflare_email,
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({
                    mode: "js_challenge",
                    configuration: {
                        target: "ip",
                        value: req.body.ip
                    }
                })
            })
            .then(data => data.json())
            .then(data => {
                
                if(data.success === true) res.send('ok')

            })

        }

    })

    app.post('/ip/whitelist', async (req, res) => {

        var data = await fetch(`https://api.cloudflare.com/client/v4/accounts/${config.cloudflare_account_id}/firewall/access_rules/rules`, {
            headers: {
                "X-Auth-Key": config.cloudflare_api_key,
                "X-Auth-Email": config.cloudflare_email,
                "Content-Type": "application/json"
            },
            method: "GET"
        })
        .then(data => data.json())
        .then(data => {
            
            return data.result

        })

        var item = data.find(a => a.configuration.value === req.body.ip)

        var info = await fetch(`https://api.cloudflare.com/client/v4/accounts/${config.cloudflare_account_id}/firewall/access_rules/rules/${item.id}`, {
            headers: {
                "X-Auth-Key": config.cloudflare_api_key,
                "X-Auth-Email": config.cloudflare_email,
                "Content-Type": "application/json"
            },
            method: "DELETE",
        })
        .then(data => data.json())
        .then(data => {
            
            return data

        })
        
        if(data.success === true) return res.send('ok')

    })

    app.post('/ip/search', async (req, res) => {

        var data = await fetch(`https://api.cloudflare.com/client/v4/accounts/${config.cloudflare_account_id}/firewall/access_rules/rules?configuration.target=ip&configuration.value=${req.body.ip}`, {
            headers: {
                "X-Auth-Key": config.cloudflare_api_key,
                "X-Auth-Email": config.cloudflare_email,
                "Content-Type": "application/json"
            },
            method: "GET",
        })
        .then(data => data.json())
        .then(data => {
            
            return data

        })

        var object = {}

        if(data.success === true){

            if(data.result[0]){

                object.mode = data.result[0].mode

            } else {

                object.mode = 'allow'

            }

            res.json()

        } else {

            res.json({ success: false, errors: data.errors})

        }

    })

    app.post('/logs/sort', async (req, res) => {

        if(!users.checkuser(req)) return res.redirect('/login')

        var data = {
            type: 'visit'
        }

        if(req.body.ip !== '') data.ip = req.body.ip
        if(req.body.domain !== '') data.domain = req.body.domain
        if(req.body.path !== '') data.path = req.body.path

        var gotlogs = await logs.find(data)

        var dates = []
        var countries = []

        gotlogs.forEach(function(item, index){

            var date = new Date(item.time)
            
            dates[index] = format.date(date).formatted

            countries[index] = countryCodes[item.country]

            if(countries[index] === undefined)  countries[index] = 'Unknown'

        })

        res.render('sortedlogs.ejs', {
            countries,
            logs: gotlogs,   
            dates         
        })

    })

    app.listen(2052)

}

module.exports = panel
