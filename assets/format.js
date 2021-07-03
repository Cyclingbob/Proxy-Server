const config = require('../config.js')

const ip = require('ip')

const actions = {

    date: function(date){

        if(!date) date = new Date()

        var d = {

            hour: date.getHours() > 9 ? `${date.getHours()}` : `0${date.getHours()}`,
            minute: date.getMinutes() > 9 ? `${date.getMinutes()}` : `0${date.getMinutes()}`,
            second: date.getSeconds() > 9 ? `${date.getSeconds()}` : `0${date.getSeconds()}`,
            date: `${date.getDate()}`,
            month: `${date.getMonth() + 1}`,
            year: `${date.getFullYear()}`

        }

        if(config.use_0_in_time === false){

            d.hour = `${date.getHours()}`
            d = `${date.getMinutes()}`
            d = `${date.getSeconds()}`

        }        

        d.formatted = `[${d.date}${config.split_date}${d.month}${config.split_date}${d.year} at ${d.hour}${config.split_time}${d.minute}${config.split_time}${d.second}]`
    
        return d
    }

    
}

module.exports = actions