const config = require('../config')

const actions = {

    checkuser: function(req){

        if(!req.cookies) return null

        if(!req.cookies.username) return null
        if(!req.cookies.password) return null
    
        const user = config.users.find(x => x.username === req.cookies.username && x.password === req.cookies.password)
    
        if(user) return true
        if(!user) return null

    },

    login: function(req, res){

        var user = config.users.find(x => x.username === req.body.username && x.password === req.body.password)
        if(!user) user = config.users.find(x => x.email === req.body.username && x.password === req.body.password)
        if(!user) return false
        if(user){

            res.cookie('username', user.username)
            res.cookie('password', user.password)

        }

        return true

    },

    getuser: function(req){

        var user = config.users.find(x => x.username === req.cookies.username && x.password === req.cookies.password)
        return user

    }

}

module.exports = actions