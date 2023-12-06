import mysql from 'mysql';
import jwt from 'jsonwebtoken';

import { db } from '../db.js';

const authentication = async (req, res, next) => {
  console.log(req.headers.authorization);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      console.log(token, 'token..');
      if (!token) {
        return res.status(404).json({
          message: 'Token data missing',
          status: 'error',
        });
      }

      // Decode the token to get the user ID
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const id = decodedToken.id;
      console.log(id);
      // Query the MySQL database to find the user based on the ID from the token
      db.query(
        'SELECT * FROM `users` WHERE `id` = ?',
        [id],
        async (error, results, fields) => {
          if (error) {
            console.log(error, ' err-authCheckFunc');
            return res
              .status(500)
              .json({ message: error.message, status: 'error' });
          }

          if (results.length === 0) {
            return res
              .status(401)
              .json({ message: 'User not found', status: 'error' });
          }
          console.log(results, 'user object');
          // Store the user information in the request object
          req.user = { ...results[0], id };
          next();
        }
      );
    } catch (error) {
      console.log(error, ' err-authCheckFunc');
      return res.status(500).json({ message: error.message, status: 'error' });
    }
  } else {
    return res
      .status(403)
      .json({ message: 'Auth header missing', status: 'error' });
  }
};

export default authentication;
