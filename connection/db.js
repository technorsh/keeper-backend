const mysql = require('mysql');

var mysqlConnection = mysql.createConnection({
  host: 'sql6.freesqldatabase.com',
  port :3306,
  user: 'sql6423093',
  password: 'IItiEcjc5L',
  database: 'sql6423093',
  multipleStatements : true
});

// host: 'sql6.freesqldatabase.com',
// port :3306,
// user: 'sql6411713',
// password: 'Dmg2NclDiQ',
// database: 'sql6411713',
// multipleStatements : true

mysqlConnection.connect((err)=> {
  if(!err)
    console.log('Connection Established Successfully');
  else
    console.log('Connection Failed!'+ JSON.stringify(err,undefined,2));
});

module.exports = mysqlConnection;
