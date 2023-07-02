const mysql = require('mysql')

function select(sql, params){
  
}

function getConn(){
  return mysql.createConnection({
    host: '',
    user: '',
    password: '',

  })
}

module.exports = {
  select: select
}