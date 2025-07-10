const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Bağlantısı
// GÜVENLİK NOTU: Bu ayarlar sadece yerel geliştirme (XAMPP) içindir.
// Canlı (production) ortamda kesinlikle bu şekilde kullanılmamalıdır.
// Bunun yerine, kimlik bilgileri ortam değişkenleri (environment variables) veya
// bir sır yönetim sistemi (secrets management system) üzerinden güvenli bir şekilde sağlanmalıdır.
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // XAMPP için genellikle boş
  database: 'depo'
});

// MySQL'e bağlan
db.connect(err => {
  if (err) {
    console.error('MySQL bağlantı hatası:', err);
    process.exit(1); // kritik hata varsa çık
  } else {
    console.log('✅ MySQL bağlantısı başarılı!');
  }
});

// Tüm stokları getir
app.get('/stoklar', (req, res) => {
  const sorgu = 'SELECT * FROM stoklar';
  db.query(sorgu, (err, results) => {
    if (err) {
      console.error('🛑 Veritabanı sorgu hatası:', err);
      return res.status(500).json({ hata: "Veritabanı hatası" });
    }
    res.json(results);
  });
});

//Stok güncelleme
app.patch('/stoklar/:id', (req, res) => {
  const { id } = req.params;
  const { mevcut_stok } = req.body;

  if (mevcut_stok === undefined) {
    return res.status(400).json({ hata: 'Mevcut stok bilgisi eksik.' });
  }

  const sorgu = 'UPDATE stoklar SET mevcut_stok = ? WHERE id = ?';
  db.query(sorgu, [mevcut_stok, id], (err, result) => {
    if (err) {
      console.error('🛑 Veritabanı güncelleme hatası:', err);
      return res.status(500).json({ hata: 'Veritabanı güncellenirken bir hata oluştu.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ hata: 'Güncellenecek ürün bulunamadı.' });
    }
    res.json({ mesaj: 'Stok başarıyla güncellendi.' });
  });
});

// Sunucuyu başlat
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`🚀 Sunucu ${PORT} portunda çalışıyor.`);
});
""
