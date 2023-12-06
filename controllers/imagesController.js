import { db } from '../db.js';

export const uploadsFunc = (req, res) => {
  // console.log(req.user.id);
  const { description } = req.body;
  // console.log(description);
  const imageUrl = req.file.filename;
  // console.log(imageUrl);

  const q = 'INSERT INTO images (`description`,`img`,`uid`) VALUES (?,?,?)';

  db.query(q, [description, imageUrl, req.user.id], (err, data) => {
    if (err) return err;
    if (data)
      return res
        .status(201)
        .json({ message: 'Image uploaded successfully', status: 'success' });
  });
};

export const getImages = async (req, res) => {
  // console.log(req.user.id);
  const q = 'SELECT * FROM images WHERE uid = ?';
  db.query(q, [req.user.id], (err, data) => {
    if (err) {
      console.log(err);
      return err;
    }
    // console.log(data);
    res
      .status(200)
      .json({ message: 'Fetched images', status: 'success', data });
  });
};
