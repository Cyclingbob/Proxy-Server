const express= require('express')
const fs = require('fs')

function start(){

    const errors = express();
    
    errors.get('/404', function(req, res){

        res.sendFile(__dirname.substring(0, __dirname.length - 7) + '/templates/404.html')

    })
    
    errors.get('/500', function(req, res){

        res.sendFile(__dirname.substring(0, __dirname.length - 7) + '/templates/500.html')

    })
    
    errors.get('/ban', function(req, res){
        res.status(401).send('You have been banned from this site')
    })
    
    errors.listen(2086)

}

module.exports = start