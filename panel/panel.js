const express = require('express')
const users = require('../assets/users')
const format = require('../assets/format')

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")

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

    app.get('/logs', (req, res) => {

        if(!users.checkuser(req)) return res.redirect('/login')

        fs.readFile(__dirname.substring(__dirname.length - 5, __dirname) + '/data/logs/logs.json', 'utf8', function(err, file_logs){

            if(err) return console.log(err)

            var parsed_logs = JSON.parse(file_logs)

            parsed_logs.forEach(log => {
                
                var time = new Date(log.time)

                log.time = format.date(time)

            })

            res.render('logs.ejs', {

                user: users.getuser(req),
                logs: parsed_logs,
                json_logs: file_logs
                
            })

        })

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

    app.post('/adddomain', (req, res) => {

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

    app.listen(2052)

}

module.exports = panel
