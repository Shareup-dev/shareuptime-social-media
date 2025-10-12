import express from 'express';
import dotenv from 'dotenv';

// Ortam değişkenlerini yükle
dotenv.config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('ShareUpTime Backend API Çalışıyor!');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`ShareUpTime Backend API ${PORT} portunda çalışıyor.`);
});
