document.addEventListener('DOMContentLoaded', function () {
    const urunBilgisiSpan = document.getElementById('urunBilgisi');
    const uretmeMiktarInput = document.getElementById('uretmeMiktar');
    const uretmeVerBtn = document.getElementById('uretmeVerBtn');
    const eklemeMiktarInput = document.getElementById('eklemeMiktar');
    const stokaEkleBtn = document.getElementById('stokaEkleBtn');
    const mevcutStokSpan = document.getElementById('mevcutStok');
    const geriDonBtn = document.getElementById('geriDonBtn');

    let currentStok = 0;
    let secilenUrunId = null;

    // Veritabanı PATCH isteği
    function guncelleStokVeritabani(yeniStok, miktar, islemTipi) {
        if (!secilenUrunId) return;

        fetch(`http://localhost:8000/stoklar/${secilenUrunId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ mevcut_stok: yeniStok })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Stok güncellenemedi!");
            }
            return res.json();
        })
        .then(data => {
            currentStok = yeniStok;
            mevcutStokSpan.textContent = `${currentStok} mt`;
            hesaplaToplamAlan(); // stok değiştiğinde metrekareyi tekrar hesapla

            if (islemTipi === 'azalt') {
                uretmeMiktarInput.value = '';
                alert(`${miktar} mt üretime verildi. Yeni stok: ${currentStok}`);
            } else {
                eklemeMiktarInput.value = '';
                alert(`${miktar} mt stoka eklendi. Yeni stok: ${currentStok}`);
            }
        })
        .catch(err => {
            console.error("Veritabanı güncelleme hatası:", err);
            alert("Stok güncellenirken bir hata oluştu. Lütfen tekrar deneyin.");
        });
    }

    // URL'den ürün bilgilerini al
    const urlParams = new URLSearchParams(window.location.search);
    const kalite = urlParams.get('kalite');
    const marka = urlParams.get('marka');
    const en = urlParams.get('en');

    if (!kalite || !marka || !en) {
        urunBilgisiSpan.textContent = "Ürün Bilgisi Bulunamadı";
        alert("Ürün bilgileri eksik. Lütfen Depo İşlemleri sayfasından seçim yapınız.");
        geriDonBtn.addEventListener('click', () => {
            window.location.href = 'depo.html';
        });
        return;
    }

    urunBilgisiSpan.textContent = `${kalite} - ${marka} - ${en}`;

    // Ürünü veritabanından çek
    fetch('http://localhost:8000/stoklar')
        .then(res => res.json())
        .then(data => {
            const urun = data.find(item =>
                item.kalite === kalite &&
                item.marka === marka &&
                item.en.toString() === en.toString()
            );

            if (!urun) {
                alert("Ürün veritabanında bulunamadı!");
                mevcutStokSpan.textContent = "Yok";
                return;
            }

            secilenUrunId = urun.id;
            currentStok = parseInt(urun.mevcut_stok);
            mevcutStokSpan.textContent = `${currentStok} mt`;

            hesaplaToplamAlan(); // stok verisi geldiğinde metrekareyi hesapla
        })
        .catch(err => {
            console.error("Veri çekme hatası:", err);
            mevcutStokSpan.textContent = "Hata!";
        });

    // Üretime Ver butonu
    uretmeVerBtn.addEventListener('click', () => {
        const miktar = parseInt(uretmeMiktarInput.value);
        if (isNaN(miktar) || miktar <= 0) {
            alert('Lütfen geçerli bir miktar giriniz.');
            return;
        }
        if (currentStok < miktar) {
            alert('Mevcut stok yetersiz!');
            return;
        }
        guncelleStokVeritabani(currentStok - miktar, miktar, 'azalt');
    });

    // Stoka Ekle butonu
    stokaEkleBtn.addEventListener('click', () => {
        const miktar = parseInt(eklemeMiktarInput.value);
        if (isNaN(miktar) || miktar <= 0) {
            alert('Lütfen geçerli bir miktar giriniz.');
            return;
        }
        guncelleStokVeritabani(currentStok + miktar, miktar, 'ekle');
    });

    // Geri Dön butonu
    geriDonBtn.addEventListener('click', () => {
        window.location.href = 'depo.html';
    });

    // ✅ Toplam Alan Hesaplama Fonksiyonu
    function hesaplaToplamAlan() {
        const toplamAlanSpan = document.getElementById('toplamAlan');
        const enSayisi = Number(en);
        const stokMt = currentStok;

        if (!isNaN(enSayisi) && !isNaN(stokMt)) {
            const alan = (enSayisi / 1000) * stokMt;
            toplamAlanSpan.textContent = alan.toLocaleString('tr-TR', { maximumFractionDigits: 2 });
        } else {
            toplamAlanSpan.textContent = "Hesaplanamadı";
        }
    }
});

