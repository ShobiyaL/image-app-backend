import mysql from 'mysql';
import dotenv from 'dotenv';
dotenv.config();

export const db = mysql.createConnection({
  host: process.env.HOSTNAME,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:...', err);
    return;
  }
  console.log('Connected to MySQL database..');
});
