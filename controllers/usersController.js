import { db } from '../db.js';
import { encryptFunc, decryptFunc } from '../utils/hashFunction.js';
import { generateToken } from '../utils/tokenization.js';

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log(username, email, password);
    //   Check user already exists
    const sql_query = 'SELECT * FROM `users` WHERE `email` = ?';
    db.query(sql_query, [email], async (err, data) => {
      if (err) return err;
      // console.log(data);
      if (data.length > 0) {
        return res.status(403).json({
          message: 'We already have an account with this email address',
          status: 'error',
        });
      }
      // Create new encrypted password before inserting into the users table
      const newPassword = await encryptFunc(password);
      const q =
        'INSERT INTO `users` (`username`,`email`,`password`) VALUES (?,?,?)';
      db.query(q, [username, email, newPassword], (err, result) => {
        if (err) {
          console.log(err);
          return err;
        }

        // console.log(result);
        const selectQuery =
          'SELECT * FROM `users` WHERE `id` = LAST_INSERT_ID()';
        db.query(selectQuery, (err, insertedData) => {
          console.log(insertedData[0].id);
          const payload = {
            username: insertedData[0].username,
            email: insertedData[0].email,
            id: insertedData[0].id,
          };
          //   console.log(payload, 'Payload');
          const token = generateToken(payload);
          //   console.log(token);
          res.status(201).json({
            data: {
              ...payload,
              token,
            },
            message: 'User created successfully',
            status: 'success',
          });
        });
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `${error.message}--Problem in Registration`,
      status: 'error',
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const sql_query = 'SELECT * FROM users WHERE email = ?';
    db.query(sql_query, [email], async (err, data) => {
      // console.log(data);
      if (err) return err;
      if (data.length === 0)
        res.status(400).json({
          message: 'Wrong credentials',
          status: 'error',
        });

      const checkPassword = await decryptFunc(password, data[0].password);
      if (!checkPassword) {
        res.status(400).json({
          message: 'Wrong credentials',
          status: 'error',
        });
      } else {
        const payload = {
          username: data[0].username,
          email: data[0].email,
          id: data[0].id,
        };
        const token = generateToken(payload);
        res.status(200).json({
          data: {
            ...payload,
            token,
          },
          message: 'LoggedIn successfully',
          status: 'success',
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `${error.message}--Problem in logging in`,
      status: 'error',
    });
  }
};
