const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');

const db = require('./../connection/db.js');

router.post('/sign-up', (req, res, next) => {
  db.query(
    `SELECT * FROM users WHERE LOWER(username) = LOWER(${db.escape(
      req.body.username
    )});`,
    (err, result) => {
      if (result.length) {
        return res.status(409).send({
          message: 'This username is already in use!'
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).send({
              message: err
            });
          } else {
            db.query(
              `INSERT INTO users (id, username, password, reg_date) VALUES ('${uuid.v4()}', ${db.escape(
                req.body.username
              )}, ${db.escape(hash)}, now())`,
              (err, result) => {
                if (err) {
                  throw err;
                  return res.status(400).send({
                    message: err
                  });
                }
                return res.status(201).send({
                  statusCode : 201,
                  message: 'Registered Suceesfully!'
                });
              }
            );
          }
        });
      }
    }
  );
});

router.post('/login', (req, res, next) => {
  db.query(
    `SELECT * FROM users WHERE username = ${db.escape(req.body.username)};`,
    (err, result) => {
      if (err) {
        throw err;
        return res.status(400).send({
          message: err
        });
      }
      if (!result.length) {
        return res.status(401).send({
          message: 'Username or password is incorrect!'
        });
      }
      bcrypt.compare(
        req.body.password,
        result[0]['password'],
        (bErr, bResult) => {
          if (bErr) {
            throw bErr;
            return res.status(401).send({
              message: 'Username or password is incorrect!'
            });
          }
          if (bResult) {
            const token = jwt.sign({
                username: result[0].username,
                userId: result[0].id
              },
              'DUCS2020', {
                expiresIn: '7d'
              }
            );
            db.query(
              `UPDATE users SET last_login = now() WHERE id = '${result[0].id}'`
            );
            return res.status(200).send({
              statusCode : 200,
              message: 'Logged in!',
              token,
              user: result[0]
            });
          }
          return res.status(401).send({
            message: 'Username or password is incorrect!'
          });
        }
      );
    }
  );
});

router.get('/verify', (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(
      token,
      'DUCS2020'
    );
    req.userData = decoded;
    next();
  } catch (err) {
    return res.status(401).send({
      message: 'Your session is not valid!'
    });
  }
}, (req, res, next) => {
  return res.status(200).send(req.userData);
});

module.exports = router;
