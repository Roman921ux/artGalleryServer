import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer'
//
import authRoute from './routes/auth.js'
import { checkAuth } from './utils/checkAuth.js';
import { createArt, createRoom, getAllArt, getAllRoom, getOneArt, getUser, removeArt, updateArt, updateArtComment, updateArtLike, updateFollowerUser, updateUnsubUser } from './controllers/ArtControllers.js';
import { artCreateValidation } from './validation/art.js'
//

const app = express();
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

dotenv.config()
const PORT = process.env.PORT || 5001
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_NAME

app.use(cors());
// Middleware для парсинга JSON
app.use(express.json());
app.use('/uploads', express.static('uploads'));
// нужен чтобы открывать img в браузере
// Endpoi
app.get('/', (req, res) => {
  res.json({ message: 'Hi, Roma!' })
})
// auth
app.use('/api/auth', authRoute)
// art
app.get('/api/arts', getAllArt)
app.get('/api/arts/:id', getOneArt)
app.post('/api/arts', checkAuth, createArt)
app.patch('/api/arts/:id/like', checkAuth, updateArtLike)
app.patch('/api/arts/:id/comment', checkAuth, updateArtComment)
app.delete('/api/arts/:id', checkAuth, artCreateValidation, removeArt)
app.patch('/api/arts/:id', checkAuth, artCreateValidation, updateArt) // +/edit
// user
app.patch('/api/follower/:id', checkAuth, updateFollowerUser)
app.patch('/api/unsub/:id', checkAuth, updateUnsubUser)
app.get('/api/user/:id', getUser)
// sortRoom
app.post('/api/sort', checkAuth, createRoom)
app.get('/api/sort', getAllRoom)
// imgFile
app.post('/api/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`
  });
});
// нужен чтобы загрузить картинку на сервер и сделать типо ссылку,
// которую можно просто открыть в браузере и передать куда угодно


async function start() {
  try {
    await mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.awglyfa.mongodb.net/${DB_NAME}`)
      .then(() => { console.log('DB OK!') })
      .catch((err) => console.log('Error DB', err));
    app.listen(PORT, () => {
      console.log('Server Ok', PORT);
    });
  } catch (error) {
    console.error('Connection error', error);
  }
}
start();
