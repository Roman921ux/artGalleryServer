import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
//
import authRoute from './routes/auth.js'

const app = express();
dotenv.config()
const PORT = process.env.PORT || 5001
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_NAME

// Настройка CORS
app.use(cors());

// Middleware для парсинга JSON
app.use(express.json());

// Endpoi
app.get('/', (req, res) => {
  res.json({ message: 'Hi, Roma!' })
})

app.use('/api/auth', authRoute)
// app.use('/api/art', artRoute)


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