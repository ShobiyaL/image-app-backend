import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';
import authentication from './controllers/authController.js';

const app = express();
const port = process.env.PORT || 8002;

let corsOptions = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token'],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/images', authentication, imageRouter);

// --------- Test API------------------
// app.get('/api/test', (req, res) => {
//   res.json('It works!!');
// });

// API endpoint to get images
app.get('/api/image/:filename', (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(__dirname, 'public', 'images', filename);
  console.log(imagePath, 'imagepath');
  // Check if the file exists
  if (fs.existsSync(imagePath)) {
    // Read the file and send it as the response
    // Read the image file
    const image = fs.readFileSync(imagePath);
    console.log(image);
    // Convert the image to base64
    const base64Image = image.toString('base64');

    const dataUri = `data:image/png;base64,${base64Image}`;

    // Send the data URI as the response
    res.json({ image: dataUri });
    console.log(dataUri, 'hi');
  } else {
    res.status(404).send('Not Found');
  }
});

app.listen(port, () => {
  console.log('Server is running on the port:', port);
});
