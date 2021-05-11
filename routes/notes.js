const express = require('express');
const router = express.Router();

const db = require('./../connection/db.js');

router.get('/' , (req, res) => {
  db.query('SELECT * FROM keeper', (err, rows, fields) => {
  if (!err)
    res.send(rows);
  else
    console.log(err);
  })
});

router.get('/:userid' , (req, res) => {
  db.query('SELECT * FROM keeper where userid = ?',[req.params.userid], (err, rows, fields) => {
  if (!err)
    res.send(rows);
  else
    console.log(err);
  })
});

router.post('/add', async (req, res) => {
  let sql = `INSERT INTO keeper ( title, content, created_date, userid ) VALUES (?, ?, now(), ?)`;
  let values = [
    req.body.title,
    req.body.content,
    req.body.userid
  ];
  await db.query(sql, values, function(err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      message: "New Notes added successfully"
    })
  })
});

router.put('/update/:userid/:id', async (req, res) => {
  let sql = `UPDATE keeper SET title = ?, content = ?, modified_date = now() WHERE id = ? AND userid = ?` ;
  let values = [
    req.body.title,
    req.body.content,
    req.params.id,
    req.params.userid
  ];
  await db.query(sql, values, function(err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      message: "Notes updated successfully"
    })
  })
});

router.delete('/delete/:userid/:id', async (req, res) => {
  let sql = `DELETE FROM keeper WHERE id = ? AND userid = ?`;
  await db.query(sql, [req.params.id,req.params.userid], function(err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      message: "Notes deleted successfully"
    })
  })
});

module.exports = router;
