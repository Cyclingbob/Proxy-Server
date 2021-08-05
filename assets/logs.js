const fs = require('fs')
const logs = require('../models/logs')
const mongoose = require('mongoose')

const actions = {
    add: function(options){

        options._id = mongoose.Types.ObjectId().toString()

        logs.create(options)

    },

    clear: function(options){

        fs.writeFile('../data/logs/logs.json', JSON.stringify({}), (err) => {

            if(err)return console.log(err);

        });

        var logs = fs.readFile('../data/logs/logs.json', 'utf8', function(err, data){

            if(err)return;
            
        });

    },

    get: function(){
        return 'e'
    }
}

module.exports = actions
