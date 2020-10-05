'use strict'

const   mysql = require('mysql'),
       {promisify} = require('util')
    
const { database } = require('./keys')

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST')
            console.error('DATABASE CONNECTION WAS CLOSED');
        if(err.code === 'ER_CON_COUNT_ERROR')
            console.error('DATABSE HAS TO MANY CONNECTION')
        if(err.code === 'ECONNREFUSED')
            console.error('DATABASE CONECTION WAS REFUSED')
        console.log(err)
    }else{
        if(connection) connection.release();
        console.log('database is connected')
    }
   
    return
});
//convertir callback a promise
pool.query = promisify(pool.query)

module.exports = pool