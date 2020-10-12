'use strict'

const   {format} = require('timeago.js'),
        helpers = {}
//recibir una fecha y convertirla en formato tiempo atras
helpers.timeago = (timestamp) => {
    return format(timestamp)
}
module.exports = helpers
