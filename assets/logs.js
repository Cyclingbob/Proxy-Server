const fs = require('fs')

const actions = {
    add: function(options){

        fs.readFile(__dirname.substring(__dirname.length - 6, __dirname) + '/data/logs/logs.json', 'utf8', function(err, logs){

            if(err) return console.log(err)

            logs = JSON.parse(logs)

            logs.push(options)

            fs.writeFile(__dirname.substring(__dirname.length - 6, __dirname) + '/data/logs/logs.json', JSON.stringify(logs), (err) => {
    
                if(err) return console.log(err);
    
            });

        })

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