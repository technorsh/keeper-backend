const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');

const user = require('./routes/user.js');
const notes = require('./routes/notes.js');

var app = express();
var cors = require('cors')

app.use(bodyParser.json());
app.use(cors());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const port = process.env.PORT || 3001;

app.use('/user', user);
app.use('/notes',notes);

app.listen(port)
