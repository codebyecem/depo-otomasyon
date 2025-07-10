const fs = require('fs');
const mysql = require('mysql');
const csv = require('csv-parser');

// MySQL bağlantısı
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'depo'
});

db.connect(err => {
  if (err) {
    console.error("❌ MySQL'e bağlanırken hata:", err);
    return;
  }
  console.log("✅ MySQL'e bağlandı!");

  // CSV dosyasını oku
  fs.createReadStream('stoklar.csv', { encoding: 'utf8' })
    .pipe(csv({ separator: ',' }))
    .on('data', (row) => {
      const { id, kalite, marka, en, mevcut_stok } = row;

      // Hatalı veya eksik veri varsa pas geç
      if (!id || !kalite || !marka || !en || !mevcut_stok) {
        console.warn('⚠️ Eksik veri atlandı:', row);
        return;
      }

      const query = 'INSERT INTO stoklar (id, kalite, marka, en, mevcut_stok) VALUES (?, ?, ?, ?, ?)';

      db.query(query, [id, kalite, marka, en, mevcut_stok], (err) => {
        if (err) {
          console.error('🛑 Veri ekleme hatası:', err, 'Veri:', row);
        }
      });
    })
    .on('end', () => {
      console.log("✅ CSV'den veri başarıyla aktarıldı.");
      db.end();
    });
});
