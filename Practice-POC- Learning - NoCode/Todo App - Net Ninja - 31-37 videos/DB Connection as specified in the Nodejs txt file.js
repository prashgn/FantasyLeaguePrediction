let mysql = require('mysql');
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'test'
});

connection.connect(function(err) {
  if (err) {
    return console.error('error: ' + err.message);
  }

    console.log('The database connected.');
});


  let sql = 'SELECT * FROM pet'; 
/*let sql = "INSERT INTO pet(name,val1) VALUES('name2','val2')";*/
/* let sql = "UPDATE pet SET val2 = 'val2' WHERE name = 'name2'";  */
/*
let data = ['val2', 'name2']; */

connection.query(sql, (error, results, fields) => {
  if (error) {
    return console.error(error.message);
  }
  console.log(results);
});

connection.end(function(err) {
  if (err) {
    return console.log('error:' + err.message);
  }
  console.log('Close the database connection.');
});