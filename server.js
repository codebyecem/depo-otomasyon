const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Bağlantı Havuzu
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'depo',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Veritabanı bağlantısını test et
db.getConnection()
  .then(connection => {
    console.log('✅ MySQL bağlantısı başarılı!');
    connection.release();
  })
  .catch(err => {
    console.error('MySQL bağlantı hatası:', err);
    process.exit(1);
  });

// Tüm stokları getir
app.get('/stoklar', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM stoklar');
    res.json(results);
  } catch (err) {
    console.error('🛑 Veritabanı sorgu hatası:', err);
    res.status(500).json({ hata: "Veritabanı hatası" });
  }
});

// Stok güncelleme
app.patch('/stoklar/:id', async (req, res) => {
  const { id } = req.params;
  const { mevcut_stok } = req.body;

  console.log(`Stok güncelleme isteği alındı: ID=${id}, Yeni Stok=${mevcut_stok}`); // Loglama eklendi

  if (mevcut_stok === undefined) {
    return res.status(400).json({ hata: 'Mevcut stok bilgisi eksik.' });
  }

  try {
    const [result] = await db.query('UPDATE stoklar SET mevcut_stok = ? WHERE id = ?', [mevcut_stok, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ hata: 'Güncellenecek ürün bulunamadı.' });
    }
    res.json({ mesaj: 'Stok başarıyla güncellendi.' });
  } catch (err) {
    console.error('🛑 Veritabanı güncelleme hatası:', err);
    res.status(500).json({ hata: 'Veritabanı güncellenirken bir hata oluştu.' });
  }
});

// Depo stokları getir
app.get('/depo_stoklar', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM depo_stoklar');
    res.json(results);
  } catch (err) {
    console.error('🛑 Depo veritabanı sorgu hatası:', err);
    res.status(500).json({ hata: "Depo veritabanı hatası" });
  }
});

// Depo stok güncelleme
app.patch('/depo_stoklar/:id', async (req, res) => {
  const { id } = req.params;
  const { mevcut_stok } = req.body;

  if (mevcut_stok === undefined) {
    return res.status(400).json({ hata: 'Mevcut stok bilgisi eksik.' });
  }

  try {
    const [result] = await db.query('UPDATE depo_stoklar SET mevcut_stok = ? WHERE id = ?', [mevcut_stok, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ hata: 'Güncellenecek depo ürünü bulunamadı.' });
    }
    res.json({ mesaj: 'Depo stoku başarıyla güncellendi.' });
  } catch (err) {
    console.error('🛑 Depo veritabanı güncelleme hatası:', err);
    res.status(500).json({ hata: 'Depo veritabanı güncellenirken bir hata oluştu.' });
  }
});

// Sunucuyu başlat
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`🚀 Sunucu ${PORT} portunda çalışıyor.`);
});


